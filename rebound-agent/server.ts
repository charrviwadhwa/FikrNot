import express from "express";
import path from "path";
import { processDrop } from "./agent";
import { DropEvent, FikrNotDecision } from "./types";
import scenariosData from "./transaction.json";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CORS support for Next.js dashboard
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// In-memory audit log for real-time dashboard display
interface RecoveryRecord {
  id: string;
  dropEvent: DropEvent;
  decision: FikrNotDecision;
  timestamp: string;
}

const recoveryHistory: RecoveryRecord[] = [];

// TwiML endpoint for Twilio Voice Calls with DTMF "Press 1 to Pay" IVR
app.all("/twiml/play", (req, res) => {
  const file = req.query.file || req.body?.file;
  const baseUrl = process.env.SERVER_BASE_URL || `http://localhost:${port}`;
  const audioUrl = `${baseUrl}/${file}`;

  console.log(`[TWIML] Serving audio URL: ${audioUrl}`);

  res.type("text/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/twiml/handle-key" method="POST" timeout="6">
    <Play>${audioUrl}</Play>
  </Gather>
  <Say language="hi-IN">Dhanyawaad, Fikr mat kijiye. Humne aapke number par link bhej diya hai.</Say>
</Response>`);
});

let latestIvrEvent: { digit: string; timestamp: string; message: string } | null = null;

// Endpoint triggered when customer presses 1 on their phone dialpad during the call
app.post("/twiml/handle-key", (req, res) => {
  const digits = req.body?.Digits || req.query?.Digits;
  console.log(`\n[TWILIO DTMF] Customer pressed key: ${digits}`);

  latestIvrEvent = {
    digit: String(digits),
    timestamp: new Date().toISOString(),
    message: digits === "1"
      ? "⚡ Customer pressed '1' on dialpad: Instant UPI Collect & 1-Click Fallback Session Dispatched!"
      : `Customer pressed key '${digits}'`
  };

  res.type("text/xml");
  if (digits === "1") {
    console.log(`[TWILIO IVR] Customer pressed '1' - Instant Recovery Activated!`);
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">Dhanyawaad! Aapka 1-click fallback session activate ho gaya hai. Humne aapke number par instant checkout link aur UPI notification bhej diya hai. Have a great day!</Say>
</Response>`);
  } else {
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">Dhanyawaad! Fikr mat kijiye, hum aapke saath hain.</Say>
</Response>`);
  }
});

// GET /api/ivr-status - poll latest DTMF keypress from phone call
app.get("/api/ivr-status", (req, res) => {
  res.json({ latestIvrEvent });
});

// GET /api/scenarios - returns pre-configured drop scenarios for UI demo
app.get("/api/scenarios", (req, res) => {
  res.json(scenariosData);
});

// GET /api/history - returns recent recovery logs and dashboard statistics
app.get("/api/history", (req, res) => {
  const totalRevenueAtRisk = recoveryHistory.reduce((acc, curr) => acc + curr.dropEvent.amount, 0);
  const recoveredRecords = recoveryHistory.filter(r => r.decision.action !== "STOP");
  const estimatedRecovered = recoveredRecords.reduce((acc, curr) => acc + (curr.dropEvent.amount * 0.82), 0); // 82% benchmark recovery

  const stats = {
    totalEvents: recoveryHistory.length,
    voiceEscalations: recoveryHistory.filter(r => r.decision.action === "VOICE_ESCALATION").length,
    silentRecoveries: recoveryHistory.filter(r => r.decision.action === "SILENT_RECOVERY").length,
    stoppedSafely: recoveryHistory.filter(r => r.decision.action === "STOP").length,
    revenueAtRiskPaise: totalRevenueAtRisk,
    estimatedRecoveredPaise: Math.round(estimatedRecovered)
  };

  res.json({
    stats,
    history: recoveryHistory.slice().reverse()
  });
});

// POST /api/trigger - live trigger endpoint from UI simulation or webhooks
app.post("/api/trigger", async (req, res) => {
  try {
    const dropEvent: DropEvent = req.body;

    if (!dropEvent.transactionId || !dropEvent.errorCode) {
      return res.status(400).json({ error: "Invalid DropEvent payload" });
    }

    latestIvrEvent = null;
    console.log(`\n[TRIGGER] Initiating FikrNot recovery workflow for: ${dropEvent.transactionId} (₹${(dropEvent.amount / 100).toFixed(2)})`);

    const decision = await processDrop(dropEvent);

    const record: RecoveryRecord = {
      id: `rec_${Date.now()}`,
      dropEvent,
      decision,
      timestamp: new Date().toISOString()
    };

    recoveryHistory.push(record);

    res.json({ success: true, record });
  } catch (error: any) {
    console.error("[ERROR] Failed to process drop event:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Webhook listener for UPI drop events
app.post("/webhook/drop", async (req, res) => {
  try {
    const dropEvent: DropEvent = req.body;

    if (!dropEvent.transactionId || !dropEvent.errorCode) {
      return res.status(400).json({ error: "Invalid DropEvent payload" });
    }

    console.log(`\n[WEBHOOK] Received drop event for transaction: ${dropEvent.transactionId}`);
    const result = await processDrop(dropEvent);

    recoveryHistory.push({
      id: `rec_${Date.now()}`,
      dropEvent,
      decision: result,
      timestamp: new Date().toISOString()
    });

    res.json(result);
  } catch (error: any) {
    console.error("[ERROR] Failed to process drop event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 1-Click Fallback Checkout page (served when buyer clicks SMS recovery link)
app.get("/checkout/:orderId", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

// API to get order details for the fallback checkout
app.get("/api/checkout-order/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const historyMatch = recoveryHistory.find(r => r.dropEvent.orderId === orderId || r.dropEvent.transactionId === orderId);
  if (historyMatch) {
    return res.json(historyMatch.dropEvent);
  }

  const scenarioMatch = (scenariosData as DropEvent[]).find(s => s.orderId === orderId || s.transactionId === orderId);
  if (scenarioMatch) {
    return res.json(scenarioMatch);
  }

  // Pre-configured mock mappings if demo or random orderId is passed
  if (orderId.includes("321") || orderId.includes("low")) {
    return res.json({
      orderId: orderId,
      transactionId: "pay_low_val_002",
      amount: 29900,
      customer: { name: "Priya Verma", phone: "+917982957206" },
      errorDescription: "Network Glitch",
      isDebitedRisk: false
    });
  } else if (orderId.includes("442") || orderId.includes("abandon")) {
    return res.json({
      orderId: orderId,
      transactionId: "pay_user_cancelled_003",
      amount: 450000,
      customer: { name: "Amit Patel", phone: "+917982957206" },
      errorDescription: "Customer Cancelled",
      isDebitedRisk: false
    });
  } else if (orderId.includes("778") || orderId.includes("settled")) {
    return res.json({
      orderId: orderId,
      transactionId: "pay_captured_already_004",
      amount: 89900,
      customer: { name: "Sneha Gupta", phone: "+917982957206" },
      errorDescription: "Gateway Timeout",
      isDebitedRisk: true
    });
  }

  // Default high-value order
  res.json({
    orderId: orderId,
    transactionId: `pay_${orderId}`,
    amount: 1499900,
    customer: { name: "Rahul Sharma", phone: "+917982957206" },
    errorDescription: "UPI Timeout",
    isDebitedRisk: true
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "FikrNot Rebound Agent" });
});

app.listen(port, () => {
  console.log(`FikrNot Rebound Agent is running on http://localhost:${port}`);
  console.log(`Dashboard available at: http://localhost:${port}`);
  console.log(`Listening for Webhooks at POST http://localhost:${port}/webhook/drop`);
});
