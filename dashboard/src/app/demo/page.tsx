"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  PhoneCall,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  X,
  Zap,
  Volume2,
  Sparkles,
  ArrowLeft,
  Activity,
  Radio,
  Layers,
  ArrowUpRight
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

export default function OperationalDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RecoveryItem | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [callingState, setCallingState] = useState(false);
  const [callSuccessMessage, setCallSuccessMessage] = useState("");
  const [ivrBanner, setIvrBanner] = useState<string | null>(null);

  // 4 Crystal Clear Scenarios
  const [items] = useState<RecoveryItem[]>([
    {
      id: "demo_1",
      customerName: "Rahul Sharma",
      phone: "+91 98765 43210",
      amount: 14999,
      problem: "UPI App-Switch Timed Out (Debit Anxiety)",
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
      problem: "Customer Intentionally Clicked 'Cancel'",
      whatAgentDid: "🛑 Stopped Outreach (Zero Spam Policy)",
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

  const [lastCallTriggerTime, setLastCallTriggerTime] = useState<number | null>(null);
  const [dismissedEventTime, setDismissedEventTime] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(async () => {
      // Only poll for IVR event if a call was actually triggered in this session
      if (!lastCallTriggerTime) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/ivr-status`);
        if (res.ok) {
          const data = await res.json();
          const event = data.latestIvrEvent;
          if (event?.timestamp && event?.message) {
            const eventTime = new Date(event.timestamp).getTime();
            // Ensure event happened after this call was placed and hasn't been dismissed
            if (eventTime >= lastCallTriggerTime && event.timestamp !== dismissedEventTime) {
              setIvrBanner(event.message);
            }
          }
        }
      } catch (e) { }
    }, 2000);

    return () => clearInterval(interval);
  }, [lastCallTriggerTime, dismissedEventTime]);

  const triggerLivePhoneCall = async () => {
    const callTime = Date.now();
    setLastCallTriggerTime(callTime);
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
        setCallSuccessMessage("⚠️ Backend check: Ensure server is running on port 3000.");
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
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans selection:bg-blue-500/20 antialiased pb-16">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-blue-100/40 via-purple-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navbar Matching Main Page */}
      <header className="sticky top-0 z-40 bg-[#FBFBFC]/80 backdrop-blur-md border-b border-slate-200/60">
        <nav className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium pr-3 border-r border-slate-200">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/25">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">FikrNot</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Trial Sandbox Active</span>
            </div>

            <button
              onClick={triggerLivePhoneCall}
              disabled={callingState}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#181B22] hover:bg-black text-white text-xs md:text-sm font-semibold rounded-full shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {callingState ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dialing Phone...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>Test Live Call</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-[1240px] mx-auto px-6 pt-8">
        {/* Banner Alert for Dispatched Call */}
        {callSuccessMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs md:text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{callSuccessMessage}</span>
            </div>
            <button onClick={() => setCallSuccessMessage("")} className="text-emerald-700 hover:text-emerald-900 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live IVR DTMF Keypress Banner */}
        {ivrBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-[#181B22] text-white text-xs md:text-sm font-semibold flex items-center justify-between shadow-xl border border-white/10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                IVR
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-blue-300 font-bold">Live Keypress Event Received</div>
                <div className="text-xs md:text-sm font-medium text-slate-100">{ivrBanner}</div>
              </div>
            </div>
            <button 
              onClick={() => {
                setIvrBanner(null);
                setDismissedEventTime(new Date().toISOString());
              }} 
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Operational Sandbox Status Header */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Developer Sandbox &bull; Real-Time Telephony Simulation</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Autonomous Recovery Console
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">
                Observe how FikrNot receives dropped checkout webhooks, analyzes customer context, and triggers zero-latency voice or SMS interventions.
              </p>
            </div>

            {/* Trial Stage Status Indicators */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Webhook</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Connected</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <Radio className="w-3.5 h-3.5 text-blue-500" />
                  <span>Telephony</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600">Ready</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>Indic LLM</span>
                </div>
                <span className="text-[11px] font-semibold text-purple-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 3-Step Execution Architecture */}
        <div className="bg-gradient-to-r from-blue-50/70 via-purple-50/50 to-slate-50/70 rounded-[32px] p-6 md:p-8 border border-blue-100 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Autonomous Execution Architecture</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">What Happens When a Customer Drops Payment</h3>
            </div>
            
            <a
              href={`${BACKEND_URL}/checkout/order_high_val_991`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all self-start sm:self-auto"
            >
              <span>Open Mobile Checkout Sheet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">AI Reassurance Call</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Autonomous voice agent dials in natural Hinglish within 10s: <em>&ldquo;Fikr mat kijiye, agar paise kate hain toh bank auto-reverse ho jayega.&rdquo;</em>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Press '1' on Dialpad</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customer presses <strong>1</strong> on phone keypad. DTMF captures consent securely without requiring passwords or sensitive PINs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Instant 1-Click Fallback</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct UPI collect push or WhatsApp 1-click fallback link arrives with a 15-minute reserved inventory lock.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Clear Scenarios List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Interactive Recovery Scenarios</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any case below to inspect the decision reasoning and audio recordings</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">4 Sandbox Cases</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              let badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";

              if (item.statusType === "SMS") {
                badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
              } else if (item.statusType === "STOP") {
                badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Customer & Problem */}
                  <div className="flex items-start md:items-center gap-3.5 min-w-[300px]">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {item.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.customerName}</span>
                        <span className="text-xs font-extrabold text-blue-600">₹{item.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-rose-600 font-medium mt-0.5 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{item.problem}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Agent Action */}
                  <div className="flex-1">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${badgeStyle}`}>
                      <span>{item.whatAgentDid}</span>
                    </span>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {item.audioFilename && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudio(item.audioFilename!);
                        }}
                        className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition shadow-sm"
                      >
                        {playingAudio === `${BACKEND_URL}/${item.audioFilename}` ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause Call</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Listen Call</span>
                          </>
                        )}
                      </button>
                    )}

                    <a
                      href={`${BACKEND_URL}/checkout/${item.orderId}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-full transition"
                    >
                      <span>Checkout</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal for Details & Audio Transcription */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedItem.customerName} &bull; ₹{selectedItem.amount.toLocaleString("en-IN")}
                </h3>
                <span className="text-xs font-semibold text-rose-600">{selectedItem.problem}</span>
              </div>
            </div>

            {/* Decision Rationale */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Decision Reasoning
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {selectedItem.reason}
              </p>
            </div>

            {/* Voice Audio & Script if Applicable */}
            {selectedItem.hinglishScript && (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/60 mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Exact Spoken Dialogue</span>
                  </span>
                  {selectedItem.audioFilename && (
                    <button
                      onClick={() => toggleAudio(selectedItem.audioFilename!)}
                      className="text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full transition shadow-sm"
                    >
                      {playingAudio === `${BACKEND_URL}/${selectedItem.audioFilename}` ? "Pause" : "Play Audio"}
                    </button>
                  )}
                </div>

                <p className="p-3.5 bg-white rounded-xl text-xs italic text-slate-700 leading-relaxed border border-blue-100">
                  &ldquo;{selectedItem.hinglishScript}&rdquo;
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

            {/* 1-Click Fallback Checkout Sheet Link */}
            <a
              href={`${BACKEND_URL}/checkout/${selectedItem.orderId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#181B22] hover:bg-black text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs md:text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Open 1-Click Fallback Checkout Sheet</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
