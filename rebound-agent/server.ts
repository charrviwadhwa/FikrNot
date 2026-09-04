import express from "express";
import { processDrop } from "./agent";
import { DropEvent } from "./types";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Webhook listener for UPI drop events
app.post("/webhook/drop", async (req, res) => {
  try {
    const dropEvent: DropEvent = req.body;

    // Validate minimal requirements for a DropEvent
    if (!dropEvent.transactionId || !dropEvent.errorCode) {
      return res.status(400).json({ error: "Invalid DropEvent payload" });
    }

    console.log(`\n[WEBHOOK] Received drop event for transaction: ${dropEvent.transactionId}`);
    
    const result = await processDrop(dropEvent);
    
    console.log(`[DECISION] Action: ${result.action}, Panic Level: ${result.panicLevel}`);
    
    res.json(result);
  } catch (error) {
    console.error("[ERROR] Failed to process drop event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "FikrNot Rebound Agent" });
});

app.listen(port, () => {
  console.log(`FikrNot Rebound Agent is running on http://localhost:${port}`);
  console.log(`Listening for Webhooks at POST http://localhost:${port}/webhook/drop`);
});
