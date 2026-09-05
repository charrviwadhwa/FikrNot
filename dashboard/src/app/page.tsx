"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  X,
  Zap,
  TrendingUp,
  Volume2,
  Clock,
  Sparkles
} from "lucide-react";

interface RecoveryItem {
  id: string;
  customerName: string;
  phone: string;
  amount: number;
  problem: string;
  whatAgentDid: string;
  statusType: "VOICE" | "SMS" | "STOP";
  hinglishScript?: string;
  audioFilename?: string;
  orderId: string;
  reason: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://fikrnot.onrender.com";

export default function SimpleCleanDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RecoveryItem | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [callingState, setCallingState] = useState(false);
  const [callSuccessMessage, setCallSuccessMessage] = useState("");

  // 4 Crystal Clear Scenarios
  const [items, setItems] = useState<RecoveryItem[]>([
    {
      id: "demo_1",
      customerName: "Rahul Sharma",
      phone: "+91 98765 43210",
      amount: 14999,
      problem: "UPI App-Switch Timed Out (Customer Panicked)",
      whatAgentDid: "📞 Placed Hinglish Voice Call + 15m Cart Reserve",
      statusType: "VOICE",
      hinglishScript: "Namaste Rahul Sharma ji, humne dekha aapka UPI session time out ho gaya. Fikr mat kijiye, agar paise kate hain toh bank auto-reverse ho jayenge. Aapka cart 15 minute ke liye reserve hai. Agar aap abhi pay karna chahte hain toh dialpad par 1 dabayein. Dhanyawaad!",
      audioFilename: "pay_test_live_reassurance.wav",
      orderId: "order_high_val_991",
      reason: "High-value smartphone purchase failed during app switch. Customer had debit anxiety, so the agent called immediately with reassurance and locked the cart for 15 minutes."
    },
    {
      id: "demo_2",
      customerName: "Priya Verma",
      phone: "+91 98112 34567",
      amount: 299,
      problem: "Minor Network Glitch at Checkout",
      whatAgentDid: "✉️ Sent 1-Click SMS Fallback Link",
      statusType: "SMS",
      orderId: "order_321",
      reason: "Low amount and no bank debit risk. The agent avoided an intrusive phone call and sent a fast 1-click fallback link via SMS."
    },
    {
      id: "demo_3",
      customerName: "Amit Patel",
      phone: "+91 99234 56789",
      amount: 4500,
      problem: "Customer Clicked 'Cancel' Button",
      whatAgentDid: "🛑 Stopped Outreach (Zero Spam)",
      statusType: "STOP",
      orderId: "order_442",
      reason: "Customer intentionally cancelled at checkout. The agent's stopping rule kicked in to prevent spamming the buyer."
    },
    {
      id: "demo_4",
      customerName: "Sneha Gupta",
      phone: "+91 97890 12345",
      amount: 899,
      problem: "Bank Captured Payment in Background",
      whatAgentDid: "🛡️ Aborted Call (Prevent Double Charge)",
      statusType: "STOP",
      orderId: "order_778",
      reason: "Gateway timed out, but Razorpay API verified the bank already captured the money. Agent aborted outreach to prevent asking for money twice."
    }
  ]);

  const [ivrBanner, setIvrBanner] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ivr-status`);
        if (res.ok) {
          const data = await res.json();
          if (data.latestIvrEvent?.message) {
            setIvrBanner(data.latestIvrEvent.message);
          }
        }
      } catch (e) { }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const triggerLivePhoneCall = async () => {
    setCallingState(true);
    setCallSuccessMessage("");
    setIvrBanner(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: `pay_demo_${Date.now()}`,
          orderId: "order_high_val_991",
          amount: 1499900,
          customer: { name: "Rahul Sharma", phone: "+91 98765 43210" },
          errorCode: "BAD_REQUEST_PAYMENT_TIMED_OUT",
          errorDescription: "UPI session timed out during app switch",
          isDebitedRisk: true,
          createdAt: new Date().toISOString()
        })
      });

      if (res.ok) {
        setCallSuccessMessage("📞 Phone call dispatched! Your phone is ringing now. Press 1 on your dialpad when asked.");
      } else {
        setCallSuccessMessage("⚠️ Backend check: Server on port 3000.");
      }
    } catch (e: any) {
      setCallSuccessMessage("Error: " + e.message);
    } finally {
      setCallingState(false);
    }
  };

  const toggleAudio = (filename: string) => {
    const audioUrl = `${BACKEND_URL}/${filename}`;
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlayingAudio(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 sm:p-8 flex justify-center items-start">
      <div className="w-full max-w-[1240px] bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden p-6 sm:p-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                FN
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">FikrNot</h1>
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Razorpay Buildathon • Track 03
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Autonomous AI agent that detects failed UPI checkout drops and recovers lost revenue.
            </p>
          </div>

          {/* BIG LIVE ACTION BUTTON FOR DEMO VIDEO */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerLivePhoneCall}
              disabled={callingState}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {callingState ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dialing Your Phone...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>⚡ Test Live Voice Call</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CALL STATUS BANNER */}
        {callSuccessMessage && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{callSuccessMessage}</span>
            </div>
            <button onClick={() => setCallSuccessMessage("")} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* LIVE IVR DTMF KEYPRESS BANNER */}
        {ivrBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-600 text-white text-sm font-bold flex items-center justify-between shadow-lg shadow-indigo-600/30 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-black text-xs">
                IVR
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-indigo-200 font-extrabold">Live Telephony Event</div>
                <div className="text-sm font-black">{ivrBanner}</div>
              </div>
            </div>
            <button onClick={() => setIvrBanner(null)} className="text-indigo-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= 3 SIMPLE SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Recovered Revenue
              </span>
              <div className="text-3xl font-black text-white tracking-tight">₹ 3,48,122</div>
              <div className="text-xs text-emerald-400 font-bold mt-1">
                +82% of abandoned carts saved
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
              ₹
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Hinglish Voice Calls
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">14 Calls</div>
              <div className="text-xs text-indigo-600 font-bold mt-1">
                Sarvam AI + Gemini Voice
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                1-Click SMS Fallbacks
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">32 Carts</div>
              <div className="text-xs text-emerald-600 font-bold mt-1">
                15-Min Cart Reservation
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ================= VISUAL FLOW: PRESS 1 TO PAY ARCHITECTURE ================= */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-800">Visual End-to-End Recovery Flow</span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-0.5">What Happens When a Customer Drops & Presses '1'</h3>
            </div>
            <a
              href={`${BACKEND_URL}/checkout/order_high_val_991`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1"
            >
              <span>Open Mobile Simulator 📱</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="absolute -top-2.5 left-4 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                STEP 1
              </span>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <span className="text-lg">📞</span>
                <h4 className="text-xs font-black text-slate-900">AI Reassurance Call</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Gemini & Sarvam AI call in Hinglish, comforting debit anxiety: <em>"Fikr mat kijiye, agar paise kate hain toh bank auto-reverse ho jayega."</em>
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm relative">
              <span className="absolute -top-2.5 left-4 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                STEP 2
              </span>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <span className="text-lg">🔢</span>
                <h4 className="text-xs font-black text-slate-900">Press '1' on Dialpad</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Customer presses <strong>1</strong> on their phone keypad. Twilio DTMF captures consent securely without asking for UPI PIN or passwords.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm relative">
              <span className="absolute -top-2.5 left-4 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                STEP 3
              </span>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <span className="text-lg">⚡</span>
                <h4 className="text-xs font-black text-slate-900">GPay Push + 15m Cart Lock</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Instant UPI Push Collect Request drops on phone + 1-Click Fallback link unlocks with 15-min inventory protection.
              </p>
            </div>
          </div>
        </div>

        {/* ================= 4 CLEAR RECOVERY SCENARIOS ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">How the Agent Recovers Failed Payments</h2>
              <p className="text-xs text-slate-500">4 distinct real-world situations handled autonomously by FikrNot</p>
            </div>
            <span className="text-xs font-bold text-slate-400">Click any row to test & listen</span>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              let badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
              let actionTitle = "📞 Voice Call Escalation";

              if (item.statusType === "SMS") {
                badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                actionTitle = "✉️ 1-Click SMS Fallback";
              } else if (item.statusType === "STOP") {
                badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                actionTitle = "🛑 Bounded Stop (No Spam)";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Customer & Problem */}
                  <div className="flex items-start sm:items-center gap-3 min-w-[280px]">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {item.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{item.customerName}</span>
                        <span className="text-xs font-black text-blue-600">₹{item.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{item.problem}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: What the Agent Did */}
                  <div className="flex-1">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl border ${badgeColor}`}>
                      <span>{item.whatAgentDid}</span>
                    </span>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    {item.audioFilename && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudio(item.audioFilename!);
                        }}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm"
                      >
                        {playingAudio === `${BACKEND_URL}/${item.audioFilename}` ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause Call</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>▶ Listen Call</span>
                          </>
                        )}
                      </button>
                    )}

                    <a
                      href={`${BACKEND_URL}/checkout/${item.orderId}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition"
                    >
                      <span>View Checkout</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedItem.customerName} (₹{selectedItem.amount.toLocaleString("en-IN")})
                </h3>
                <span className="text-xs font-semibold text-rose-600">{selectedItem.problem}</span>
              </div>
            </div>

            {/* Why Agent Did This */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                🧠 Why the AI Agent Took Action
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {selectedItem.reason}
              </p>
            </div>

            {/* If Voice Call: Spoken Hindi Words + Audio Player */}
            {selectedItem.hinglishScript && (
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Exact Hinglish Spoken on Call</span>
                  </span>
                  {selectedItem.audioFilename && (
                    <button
                      onClick={() => toggleAudio(selectedItem.audioFilename!)}
                      className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition shadow"
                    >
                      {playingAudio === `${BACKEND_URL}/${selectedItem.audioFilename}` ? "Pause" : "▶ Play Audio"}
                    </button>
                  )}
                </div>

                <p className="p-3 bg-white rounded-xl text-xs font-serif italic text-slate-800 leading-relaxed border border-indigo-100">
                  "{selectedItem.hinglishScript}"
                </p>

                {selectedItem.audioFilename && (
                  <audio
                    controls
                    className="w-full h-8 rounded-lg"
                    src={`${BACKEND_URL}/${selectedItem.audioFilename}`}
                  />
                )}
              </div>
            )}

            {/* 1-Click Fallback Checkout Link */}
            <a
              href={`${BACKEND_URL}/checkout/${selectedItem.orderId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition"
            >
              <span>🛒 Open Customer SMS & 1-Click Checkout Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
