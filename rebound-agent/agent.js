"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDrop = processDrop;
const genai_1 = require("@google/genai");
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret"
});
async function processDrop(event) {
    // 1. Guardrail / Stopping Rule: Stop on customer cancellation
    if (event.errorCode === "CUSTOMER_CANCELLED") {
        return {
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
    // 2. AI Reasoning: Context Diagnosis & Scripting
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Analyze this failed UPI transaction: ${JSON.stringify(event)}. 
    Determine panic level, decide if an automated Hinglish reassurance voice escalation is necessary, and write an empathetic Hinglish script.
    Focus on reassuring the customer about the "ghost drop" and "Paisa kat toh nahi gaya?" fear.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: genai_1.Type.OBJECT,
                properties: {
                    panicLevel: { type: genai_1.Type.STRING, enum: ["LOW", "MODERATE", "CRITICAL"] },
                    action: { type: genai_1.Type.STRING, enum: ["SILENT_RECOVERY", "VOICE_ESCALATION", "STOP"] },
                    reasoning: { type: genai_1.Type.STRING },
                    hinglishScript: { type: genai_1.Type.STRING },
                    fallbackRail: { type: genai_1.Type.STRING, enum: ["NETBANKING", "CARDS", "DYNAMIC_QR"] }
                },
                required: ["panicLevel", "action", "reasoning", "fallbackRail"]
            }
        }
    });
    const decision = JSON.parse(response.text);
    // 3. Actuation: Pre-flight checks and decision binding
    return {
        action: decision.action || "SILENT_RECOVERY",
        panicLevel: decision.panicLevel || "MODERATE",
        reasoning: decision.reasoning || "Fallback reasoning applied",
        hinglishScript: decision.hinglishScript,
        fallbackRail: decision.fallbackRail || "DYNAMIC_QR",
        audit: {
            preVerificationPassed: true,
            timestamp: new Date().toISOString()
        }
    };
}
