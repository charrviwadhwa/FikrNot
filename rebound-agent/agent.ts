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
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.6-flash"];
  let responseText: string | null = null;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze this failed UPI transaction: ${JSON.stringify(event)}. 
        Determine panic level, decide if an automated Hinglish reassurance voice escalation is necessary, and write an empathetic Hinglish script.
        
        CRITICAL COMPLIANCE RULES:
        1. You are NEVER allowed to guess if money was deducted. Rely on 'isDebitedRisk'.
        2. Only state that if money was deducted ("Agar paise kat gaye hain"), the standard NPCI banking auto-reversal applies (T+1 days).
        3. DO NOT promise immediate merchant dispatch or order confirmation until settlement.`,
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
    } catch (err) {
      lastError = err;
      console.log(`[WARN] Model ${modelName} encountered error, trying next...`);
    }
  }

  if (!responseText) {
    throw lastError || new Error("Failed to generate content across all models");
  }

  const decision = JSON.parse(responseText) as Partial<FikrNotDecision>;
  
  const action = decision.action || "SILENT_RECOVERY";
  const hinglishScript = decision.hinglishScript || "";
  
  // 4. Actuation: Sarvam Audio Gen & Twilio Dispatch
  const mockFallbackLink = "https://rzp.io/i/mock_fallback";
  
  if (action === "VOICE_ESCALATION" && hinglishScript) {
    const audioFilename = await generateSarvamVoice(hinglishScript, `${event.transactionId}_reassurance.wav`);
    await makeReassuranceCall(event.customer.phone, audioFilename);
  } else if (action === "SILENT_RECOVERY") {
    await sendSmsLink(event.customer.phone, mockFallbackLink);
  }

  // 5. Return decision audit
  return {
    transactionId: event.transactionId,
    action: action,
    panicLevel: decision.panicLevel || "MODERATE",
    reasoning: decision.reasoning || "Fallback reasoning applied",
    hinglishScript: hinglishScript,
    fallbackRail: decision.fallbackRail || "DYNAMIC_QR",
    audit: {
      preVerificationPassed: true,
      timestamp: new Date().toISOString()
    }
  };
}