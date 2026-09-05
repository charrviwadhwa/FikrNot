# 🛡️ FikrNot — Autonomous Indic Voice Recovery Agent for India
> **Track 03: Autonomous AI Revenue Recovery | Razorpay Buildathon**
> *"Payment Atka? Fikr Not!"* — Rescuing dropped checkouts and calming debit anxiety in under 10 seconds.

---

## 📌 Problem Statement: The $30B Panic Drop in Indian Commerce
In India, UPI powers billions of transactions monthly. However, **app-switch timeouts, transient bank outages, and connectivity drops** lead to massive checkout abandonment:
1. **Debit Anxiety**: When an order fails after UPI PIN entry, buyers panic: *"Did my money deduct? Did my order confirm?"*
2. **Delayed Outreach Failure**: Generic SMS notifications sent 30–45 minutes later fail to convert because buyers have already switched to competitors.
3. **Double Charges & Spam**: Naive automation leads to embarrassing outreach when payments actually captured in the background, or spams buyers who intentionally cancelled.

**FikrNot** solves this through an autonomous, bounded AI voice recovery agent that detects dropped transactions in real-time, calms debit anxiety in natural Hinglish within 10 seconds, and generates an instant 1-click fallback session.

---

## 🔄 End-to-End System Architecture & Flowcharts

### 1. Pre-Flight Verification & Decision Engine Pipeline
This phase ingests the Razorpay webhook, applies idempotency checks, verifies true settlement status via Razorpay APIs, and scores customer panic to select the optimal channel.

![Pre-Flight & Decision Pipeline](./assets/flowchart-decision-pipeline.png)

```mermaid
flowchart LR
    A([Customer at Checkout]) --> B[Payment Session Interrupted]
    B --> C[Razorpay Webhook<br>payment.failed]
    C --> D[Webhook Ingestion<br>Idempotency Buffer]
    D --> E{Pre-Flight Gate<br>Check Payment Status}
    
    E -- Captured / Authorized --> F[Settlement Confirmed<br>Send Order SMS]
    E -- Failed / Pending --> G{Rule Gate}
    
    G -- Customer Cancelled --> H[Hard Stop<br>Suppress Outreach]
    G -- Timeout / Gateway Error --> I[Diagnostic Engine<br>Panic Scoring]
    
    I -- "Low Panic (Ticket < ₹500)" --> J[Silent Fallback]
    I -- "High Panic (Ticket > ₹1,000)" --> K[Voice Escalation]

    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0f172a
    style B fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0f172a
    style C fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#0f172a
    style D fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#0f172a
    style E fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#0f172a
    style F fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
    style G fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#0f172a
    style H fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    style I fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#0f172a
    style J fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
    style K fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
```

---

### 2. Telephony Execution & 1-Click Fallback Pipeline
For high-panic failures, the autonomous voice agent initiates a conversational Hinglish call via Twilio + Sarvam AI. Keypress consent captures intent without asking for passwords, locking the customer's cart for 15 minutes.

![Telephony Execution & 1-Click Fallback](./assets/flowchart-telephony-execution.png)

```mermaid
flowchart LR
    K[Voice Escalation] --> L[Sarvam AI<br>Hinglish TTS]
    L --> M[Twilio Voice<br>Audio Dispatch]
    M --> N{Customer Intent<br>Press 1}
    
    N -- No Answer / Declined --> O[SMS Fallback<br>Payment Link]
    N -- User Consents (Press 1) --> P[Create Payment Link<br>15-Minute Cart Lock]
    
    J[Silent Fallback] --> P
    O --> Q[Send 1-Click Link<br>SMS / WhatsApp]
    P --> Q
    
    Q --> R[(Audit Trail<br>Metrics Store)]
    F[Settlement Confirmed] --> R
    H[Hard Stop] --> R

    style K fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#0f172a
    style L fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#0f172a
    style M fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#0f172a
    style N fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#0f172a
    style O fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
    style P fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
    style Q fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
    style F fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#0f172a
    style H fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    style R fill:#f1f5f9,stroke:#64748b,stroke-width:2px,color:#0f172a
```

---

## ⚡ Key Highlights & Core Capabilities

| Feature | Description |
| :--- | :--- |
| **Sub-10s Indic Voice Call** | Places an empathetic Hinglish reassurance call while the buyer is still holding their phone. |
| **Zero-Spam Stopping Rules** | Deterministically suppresses calls when a buyer intentionally clicks cancel or money is already captured. |
| **Interactive DTMF 'Press 1'** | Captures user recovery consent via keypad — 100% secure, zero PIN/password requests. |
| **15-Min Inventory Lock** | Reserves high-demand cart items for 15 minutes to guarantee checkout completion. |
| **Alternative Fallback Rails** | Provides Dynamic UPI QR, Card, and NetBanking on the fallback sheet to eliminate app-switch drops. |

---

## 🛠️ Technology Stack
- **AI Diagnosis & Scripting**: Google Gemini 2.5 Flash
- **Indic Speech Synthesis**: Sarvam AI (Bulbul / Indic TTS Models)
- **Telephony & IVR**: Twilio Voice API with DTMF Gather Webhooks
- **Frontend & Dashboard**: Next.js 14, Tailwind CSS, TypeScript, Lucide Icons
- **Backend Server**: Node.js, Express, TypeScript

---

## 🚀 Getting Started Locally

### 1. Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/charrviwadhwa/FikrNot.git
cd FikrNot

# Install Backend Dependencies
cd rebound-agent
npm install

# Install Frontend Dashboard Dependencies
cd ../dashboard
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in `rebound-agent/`:
```env
PORT=3000
SERVER_BASE_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
SARVAM_API_KEY=your_sarvam_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
DESTINATION_PHONE_NUMBER=+91XXXXXXXXXX
```

### 3. Run Applications
```bash
# Terminal 1: Run Backend Recovery Engine
cd rebound-agent
npm run dev

# Terminal 2: Run Next.js Landing & Operational Dashboard
cd dashboard
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) for the Landing Page and [http://localhost:3001/demo](http://localhost:3001/demo) for the Operational Console.
