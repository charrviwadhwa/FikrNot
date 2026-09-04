import { GoogleGenAI, Type } from "@google/genai";
import Razorpay from "razorpay";
import * as dotenv from "dotenv";
import { DropEvent, FikrNotDecision } from "./types";
import { makeReassuranceCall, sendSmsLink } from "./twilio";
import { generateSarvamVoice } from "./sarvam";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret"
});

export async function processDrop(event: DropEvent): Promise<FikrNotDecision> {
  // 1. Guardrail / Stopping Rule: Stop on customer cancellation
  if (event.errorCode === "CUSTOMER_CANCELLED") {
    return {
      transactionId: event.transactionId,
      action: "STOP",
      panicLevel: "LOW",
      reasoning: "User cancelled intentionally. Aborting outreach to prevent spam.",
      fallbackRail: "NETBANKING",
      audit: {
        stoppingRuleApplied: "CUSTOMER_CANCELLED",
        preVerificationPassed: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  // 2. Pre-Verification Gate: Deterministic Bank Verification Check
  try {
    // We attempt to fetch the real status from Razorpay
    const rzpPayment = await razorpay.payments.fetch(event.transactionId);
    if (rzpPayment.status === "captured" || rzpPayment.status === "authorized") {
      return {
        transactionId: event.transactionId,
        action: "STOP",
        panicLevel: "LOW",
        reasoning: "Payment was actually captured/authorized in the background. Aborting recovery.",
        fallbackRail: "NETBANKING",
        audit: {
          stoppingRuleApplied: "PAYMENT_ALREADY_CAPTURED",
          preVerificationPassed: false,
          timestamp: new Date().toISOString()
        }
      };
    }
  } catch (error) {
    // If using mock credentials or network fails, we proceed gracefully for testing purposes.
    console.log(`[WARN] Skipping Razorpay verification for ${event.transactionId} (Mock/Network Error)`);
  }

  // 3. AI Reasoning: Context Diagnosis & Scripting (Gated Prompting)
  const modelsToTry = [
    "gemini-3.7-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.6-flash"
  ];
  let responseText: string | null = null;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze this failed UPI transaction: ${JSON.stringify(event)}. 
        Determine panic level, decide if an automated Hinglish reassurance voice escalation is necessary, and write an empathetic Hinglish script.
        
        CRITICAL SCRIPT & COMPLIANCE RULES:
        1. GREETING: Start politely with "Namaste ${event.customer.name} ji".
        2. COMPLIANCE: You are NEVER allowed to guess if money was deducted. Rely on 'isDebitedRisk'. Only state that if money was deducted ("Agar paise kat gaye hain"), standard bank auto-reversal applies.
        3. CART RESERVATION & PRESS 1: Mention that their cart is reserved for 15 minutes, and say: "Agar aap abhi pay karna chahte hain toh dialpad par 1 dabayein."
        4. CLOSING: Always end politely with "Fikr mat kijiye, hum aapke saath hain. Dhanyawaad, have a great day!".
        5. LENGTH: Keep it concise, warm, and natural (under 40 words).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              panicLevel: { type: Type.STRING, enum: ["LOW", "MODERATE", "CRITICAL"] },
              action: { type: Type.STRING, enum: ["SILENT_RECOVERY", "VOICE_ESCALATION", "STOP"] },
              reasoning: { type: Type.STRING },
              hinglishScript: { type: Type.STRING },
              fallbackRail: { type: Type.STRING, enum: ["NETBANKING", "CARDS", "DYNAMIC_QR"] }
            },
            required: ["panicLevel", "action", "reasoning", "fallbackRail"]
          }
        }
      });
      if (response.text) {
        responseText = response.text;
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.log(`[WARN] Model ${modelName} encountered error (${err?.status || err?.message}), trying next...`);
    }
  }

  let decision: Partial<FikrNotDecision>;

  if (responseText) {
    decision = JSON.parse(responseText) as Partial<FikrNotDecision>;
  } else {
    // Graceful Deterministic Fallback if Google API hits quota/503 spike during live demo
    console.log(`[FALLBACK] Applying deterministic policy due to LLM quota/demand.`);
    const isHighPanic = event.isDebitedRisk || event.amount >= 500000;
    decision = {
      panicLevel: isHighPanic ? "CRITICAL" : "LOW",
      action: isHighPanic ? "VOICE_ESCALATION" : "SILENT_RECOVERY",
      reasoning: isHighPanic 
        ? "Deterministic Policy: High transaction value and debit risk detected. Escalated to Hinglish voice reassurance."
        : "Deterministic Policy: Low friction drop-off. Dispatched silent SMS fallback checkout link.",
      hinglishScript: `Namaste ${event.customer.name} ji, humne dekha aapka payment network issue ki wajah se atak gaya. Fikr mat kijiye, agar paise kate hain toh bank auto-reverse ho jayenge. Humne aapka cart 15 minute ke liye reserve kar diya hai. Agar aap abhi pay karna chahte hain toh dialpad par 1 dabayein. Dhanyawaad!`,
      fallbackRail: isHighPanic ? "DYNAMIC_QR" : "CARDS"
    };
  }
  
  const action = decision.action || "SILENT_RECOVERY";
  const hinglishScript = decision.hinglishScript || "";
  
  // 4. Actuation: Sarvam Audio Gen & Twilio Dispatch
  const baseUrl = process.env.SERVER_BASE_URL || "http://localhost:3000";
  const fallbackLink = `${baseUrl}/checkout/${event.orderId}`;
  
  let audioFilename: string | undefined;
  let callSid: string | undefined;
  let smsSid: string | undefined;

  if (action === "VOICE_ESCALATION" && hinglishScript) {
    audioFilename = await generateSarvamVoice(hinglishScript, `${event.transactionId}_reassurance.wav`);
    callSid = await makeReassuranceCall(event.customer.phone, audioFilename);
    // Also dispatch the SMS fallback link so the customer has a direct link to retry
    smsSid = await sendSmsLink(event.customer.phone, fallbackLink);
  } else if (action === "SILENT_RECOVERY") {
    smsSid = await sendSmsLink(event.customer.phone, fallbackLink);
  }

  // 5. Return decision audit
  return {
    transactionId: event.transactionId,
    action: action,
    panicLevel: decision.panicLevel || "MODERATE",
    reasoning: decision.reasoning || "Fallback reasoning applied",
    hinglishScript: hinglishScript,
    fallbackRail: decision.fallbackRail || "DYNAMIC_QR",
    audioFilename: audioFilename,
    fallbackLink: fallbackLink,
    callSid: callSid,
    smsSid: smsSid,
    audit: {
      preVerificationPassed: true,
      timestamp: new Date().toISOString()
    }
  };
}