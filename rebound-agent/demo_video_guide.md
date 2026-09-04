# 🎬 FikrNot 5-Minute Pitch & Demo Video Guide
### Razorpay Buildathon — Track 03: AI Revenue Recovery

---

## ⏱️ Video Structure & Timed Script (5:00 Total)

```
[0:00 - 1:00] 🎯 Hook & The $30B Problem in Indian E-Commerce
[1:00 - 2:30] 🚀 Live Demo 1: High-Panic UPI Timeout ➔ Hinglish Voice Escalation
[2:30 - 3:30] 🛡️ Live Demo 2 & 3: Bounded Guardrails & Stopping Rules (Zero Spam)
[3:30 - 4:15] 🛒 Live Demo 4: 1-Click Fallback Checkout & Cart Reservation
[4:15 - 5:00] 💡 Architecture, Tech Stack & Merchant ROI Summary
```

---

## 🎙️ Exact Spoken Script & Screen Actions

### 1. The Hook & The Problem (0:00 – 1:00)
**On Screen**: Show the Razorpay Checkout & FikrNot Dashboard (`http://localhost:3000`).

> *"Hi everyone! In India, UPI powers billions of transactions, but UPI session timeouts and app-switch drops cause massive revenue loss. When a payment fails, the customer faces extreme panic: **'Did my money get deducted? Did my order go through?'**
> 
> When customers panic, they abandon the cart or spam customer support. Existing recovery systems either do nothing or send a generic cold SMS 30 minutes too late.
> 
> Meet **FikrNot** — an autonomous, bounded AI revenue recovery agent built specifically for Indian commerce on Razorpay."*

---

### 2. Live Demo: High-Panic UPI Timeout (1:00 – 2:30)
**On Screen**: Select **Scenario 1 (Rahul Sharma - ₹14,999)** on the dashboard. Click **"Run Autonomous Recovery Agent"**.

> *"Let's trigger our first scenario: Rahul Sharma is buying a ₹15,000 smartphone. His UPI times out, and the bank flags a potential debit risk.
> 
> Watch what FikrNot does in under 5 seconds:
> 1. **Pre-verification Gate**: It calls the Razorpay API to verify the real status.
> 2. **AI Reasoning (Gemini)**: Diagnoses high panic and generates an empathetic Hinglish script.
> 3. **Sarvam AI TTS**: Synthesizes a natural, reassuring voice note.
> 4. **Twilio Telephony**: Automatically dials Rahul's phone."*

*(Play the generated audio clip directly on the dashboard or hold up your phone on speaker):*
> *"Listen to the generated call: 'Namaste Rahul ji, humne dekha aapka payment network issue ki wajah se atak gaya. Fikr mat kijiye, agar paise kate hain toh bank auto-reverse ho jayenge. Humne aapka cart 15 minute ke liye reserve kar diya hai. Agar aap abhi pay karna chahte hain toh dialpad par 1 dabayein. Dhanyawaad!'
> 
> When Rahul presses 1 on his phone dialpad, our server captures the DTMF input live and activates the instant fallback recovery session!"*

---

### 3. Live Demo: Bounded Workflows & Zero-Spam Guardrails (2:30 – 3:30)
**On Screen**: Click **Scenario 3 (Customer Cancelled)**, then click **Run Autonomous Recovery Agent**.

> *"What makes an agent truly production-ready are its **stopping rules**.
> 
> If a customer intentionally clicks 'Cancel' at checkout, FikrNot evaluates its strict guardrails and triggers a **STOP action**. It aborts outreach to avoid spamming the customer.
> 
> Similarly, in **Scenario 4**, if the bank captured the payment in the background, our deterministic pre-check detects it and halts recovery — preventing embarrassing double charges."*

---

### 4. Live Demo: 1-Click Fallback Checkout (3:30 – 4:15)
**On Screen**: Click the **"View Fallback Checkout Experience →"** link on the dashboard card.

> *"Along with the voice reassurance, FikrNot sends an instant SMS with a 1-click fallback link.
> 
> When Rahul opens the link, he lands on our high-converting fallback checkout:
> - His cart is locked with a **15-minute reservation timer**.
> - He is given alternative, high-success fallback rails: **Dynamic UPI QR** (which eliminates app-switch timeouts), Cards, or NetBanking.
> - One click, and the lost revenue is won back!"*

---

### 5. Tech Stack & Business ROI (4:15 – 5:00)
**On Screen**: Show the Dashboard KPI stats summary (Revenue at Risk, Recovered %, Voice vs SMS).

> *"Under the hood, FikrNot combines:
> - **Google Gemini 2.5 Flash** for deterministic diagnosis and Hinglish prompting.
> - **Sarvam AI** for natural Indic speech synthesis.
> - **Twilio Voice & SMS APIs** for sub-15-second outreach.
> - **Razorpay Orders & Payments APIs** for real-time verification.
> 
> For a merchant doing ₹1 Crore a month, FikrNot wins back up to **₹8.2 Lakhs of lost revenue** while turning customer panic into brand loyalty.
> 
> With FikrNot — *Payment Atka? Fikr Not!* Thank you!"*

---

## 💡 Quick Tips for Recording
1. **Resolution**: Record at 1080p (Full HD) using OBS or Loom.
2. **Audio**: Play the audio clip on the dashboard so your screen recording captures crystal-clear audio from Sarvam.
3. **Pacing**: Keep your voice energetic and confident.
