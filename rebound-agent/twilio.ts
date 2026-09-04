import twilio from "twilio";
import * as dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function makeReassuranceCall(toPhoneNumber: string, audioFilename: string) {
  try {
    console.log(`[TWILIO] Initiating call to ${toPhoneNumber}...`);
    
    // Fallback base URL if not set
    const baseUrl = process.env.SERVER_BASE_URL || "http://localhost:3000";
    const twimlUrl = `${baseUrl}/twiml/play?file=${encodeURIComponent(audioFilename)}`;
    
    // Twilio trial accounts require the 'url' parameter instead of inline 'twiml'
    const call = await client.calls.create({
      url: twimlUrl,
      to: toPhoneNumber,
      from: fromNumber
    });
    console.log(`[TWILIO] Call successfully dispatched! Call SID: ${call.sid}`);
    return call.sid;
  } catch (error) {
    console.error("[TWILIO] Failed to place Twilio call:", error);
    // Don't throw so it doesn't crash the whole pipeline during testing
    return "mock_call_sid"; 
  }
}

export async function sendSmsLink(toPhoneNumber: string, link: string) {
  try {
    console.log(`[TWILIO] Sending SMS to ${toPhoneNumber}...`);
    const message = await client.messages.create({
      body: `FikrNot: Your cart is reserved for 15 mins. Complete payment securely here: ${link}`,
      to: toPhoneNumber,
      from: fromNumber
    });
    console.log(`[TWILIO] SMS successfully dispatched! Message SID: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error("[TWILIO] Failed to send SMS:", error);
    return "mock_sms_sid";
  }
}
