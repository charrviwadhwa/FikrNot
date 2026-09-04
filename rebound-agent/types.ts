// types.ts
export interface DropEvent {
  transactionId: string;
  orderId: string;
  amount: number; // in paise
  customer: {
    name: string;
    phone: string;
  };
  errorCode: string;
  errorDescription: string;
  isDebitedRisk: boolean;
  createdAt: string;
}

export interface FikrNotDecision {
  transactionId: string;
  action: "SILENT_RECOVERY" | "VOICE_ESCALATION" | "STOP";
  panicLevel: "LOW" | "MODERATE" | "CRITICAL";
  reasoning: string;
  hinglishScript?: string;
  fallbackRail: "NETBANKING" | "CARDS" | "DYNAMIC_QR";
  audioFilename?: string;
  fallbackLink?: string;
  callSid?: string;
  smsSid?: string;
  audit: {
    stoppingRuleApplied?: string;
    preVerificationPassed: boolean;
    timestamp: string;
  };
}
