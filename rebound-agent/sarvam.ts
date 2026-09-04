import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export async function generateSarvamVoice(text: string, filename: string = "fikrnot_reassurance.wav"): Promise<string> {
  const publicDir = path.join(__dirname, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  const outputPath = path.join(publicDir, filename);
  
  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY!
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: "hi-IN",
      speaker: "shubh", // Conversational, natural tone
      model: "bulbul:v3",
      enable_preprocessing: true
    })
  });

  const data = await response.json();
  if (!data.audios || !data.audios[0]) {
    throw new Error(`Sarvam TTS error: ${JSON.stringify(data)}`);
  }

  // Sarvam returns base64 audio string
  const audioBuffer = Buffer.from(data.audios[0], "base64");
  fs.writeFileSync(outputPath, audioBuffer);
  
  return filename;
}
