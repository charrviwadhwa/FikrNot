"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || "order_high_val_991";

  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRail, setSelectedRail] = useState("upi");
  const [secs, setSecs] = useState(14 * 60 + 59);

  const isSneha = orderId.includes("778");
  const isAmit = orderId.includes("442");
  const isPriya = orderId.includes("321");

  let customerName = "Rahul Sharma";
  let amountStr = "14,999.00";

  if (isSneha) {
    customerName = "Sneha Gupta";
    amountStr = "899.00";
  } else if (isAmit) {
    customerName = "Amit Patel";
    amountStr = "4,500.00";
  } else if (isPriya) {
    customerName = "Priya Verma";
    amountStr = "299.00";
  }

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerPressOneDemo = () => {
    setShowPushBanner(true);
    setTimeout(() => {
      setSheetOpen(true);
    }, 1200);
  };

  const handleFinishPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSheetOpen(false);
      setShowPushBanner(false);
      setPaymentDone(true);
    }, 1000);
  };

  const formatTimer = () => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      
      {/* Top Badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-slate-800 border border-slate-700 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
          📱 Customer Mobile SMS Simulator
        </span>
        {!isSneha && !isAmit && !isPriya && (
          <button
            onClick={triggerPressOneDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3.5 py-1 rounded-full transition shadow flex items-center gap-1"
          >
            <span>⚡ Test "Press 1 to Pay" Flow</span>
          </button>
        )}
      </div>

      {/* Phone Container */}
      <div className="w-[390px] h-[760px] bg-white rounded-[48px] shadow-2xl border-4 border-slate-900 flex flex-col overflow-hidden relative">
        
        {/* Dynamic Island */}
        <div className="w-[110px] h-[24px] bg-black rounded-full absolute top-[10px] left-1/2 -translate-x-1/2 z-50" />

        {/* Incoming Push Banner */}
        <div
          onClick={() => setSheetOpen(true)}
          className={`absolute left-3 right-3 bg-slate-900/95 backdrop-blur text-white rounded-2xl p-3 flex items-center gap-3 shadow-xl border border-white/20 z-50 cursor-pointer transition-all duration-300 ${
            showPushBanner ? "top-3.5 opacity-100" : "-top-24 opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg font-black shrink-0 text-blue-600">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>Google Pay • UPI Request</span>
              <span className="text-[10px] text-emerald-400 font-bold">NOW</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Razorpay requesting <strong>₹{amountStr}</strong> (Tap to approve)
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-11 px-6 flex justify-between items-center text-xs font-bold text-slate-900 bg-slate-50 shrink-0">
          <span>9:41</span>
          <span>5G 📶 100%</span>
        </div>

        {/* Messenger Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => router.push("/")} className="text-blue-600 font-black text-lg">
            ‹
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
            FN
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
              <span>VK-FIKRNT</span>
              <span className="text-blue-600">✓</span>
            </h3>
            <span className="text-[10px] text-slate-500">Razorpay Recovery Agent</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 bg-slate-100 overflow-y-auto space-y-3">
          <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider my-1">
            Today 10:02 AM
          </div>

          {/* SNEHA GUPTA VIEW */}
          {isSneha ? (
            <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-200 text-xs text-slate-800 leading-relaxed">
              <strong>FikrNot:</strong> Good News <strong>Sneha Gupta</strong> ji! 🎉
              <br /><br />
              Aapka <strong>₹899.00</strong> ka payment bank se successfully <strong>CAPTURE</strong> ho gaya hai.
              <br /><br />
              🛡️ Pre-verification confirmed: Aapka order confirm ho chuka hai — <strong>koi extra payment karne ki zaroorat nahi hai</strong>.

              <div
                onClick={() => setSheetOpen(true)}
                className="mt-3 bg-emerald-50 border border-emerald-300 rounded-xl overflow-hidden cursor-pointer hover:bg-emerald-100 transition"
              >
                <div className="bg-emerald-600 text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
                  <span>✅ ORDER CONFIRMED</span>
                  <span>₹899.00</span>
                </div>
                <div className="p-2.5">
                  <div className="font-extrabold text-xs text-emerald-950">Payment Verified by Razorpay</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Your order is processing. Zero risk of double charges.</div>
                  <div className="text-emerald-700 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                    <span>Tap to view order confirmation receipt →</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isAmit ? (
            /* AMIT PATEL VIEW */
            <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-200 text-xs text-slate-800 leading-relaxed">
              <strong>FikrNot:</strong> Namaste <strong>Amit Patel</strong> ji,
              <br /><br />
              Humne dekha aapne checkout cancel kiya tha. Agar aapka mind change ho, toh aapka cart <strong>₹4,500.00</strong> ke liye save hai:

              <div
                onClick={() => setSheetOpen(true)}
                className="mt-3 bg-slate-50 border border-slate-300 rounded-xl overflow-hidden cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="bg-slate-700 text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
                  <span>🛒 SAVED CART</span>
                  <span>₹4,500.00</span>
                </div>
                <div className="p-2.5">
                  <div className="font-extrabold text-xs text-slate-900">Resume Your Order When Ready</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Dynamic UPI QR • Credit / Debit Cards • NetBanking</div>
                  <div className="text-blue-600 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                    <span>Tap to complete payment securely →</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isPriya ? (
            /* PRIYA VERMA VIEW */
            <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-200 text-xs text-slate-800 leading-relaxed">
              <strong>FikrNot:</strong> Namaste <strong>Priya Verma</strong> ji,
              <br /><br />
              Checkout par minor network glitch hua tha. Aapka <strong>₹299.00</strong> ka cart 15 min ke liye reserved hai. 1-click mein complete karein:

              <div
                onClick={() => setSheetOpen(true)}
                className="mt-3 bg-emerald-50 border border-emerald-300 rounded-xl overflow-hidden cursor-pointer hover:bg-emerald-100 transition"
              >
                <div className="bg-emerald-600 text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
                  <span>🛒 CART RESERVED (15m)</span>
                  <span>₹299.00</span>
                </div>
                <div className="p-2.5">
                  <div className="font-extrabold text-xs text-slate-900">Razorpay 1-Click Fallback Checkout</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Dynamic UPI QR • Credit / Debit Cards • NetBanking</div>
                  <div className="text-emerald-700 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                    <span>Tap to complete payment securely →</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* RAHUL SHARMA (HIGH VALUE / VOICE CALL) VIEW */
            <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-200 text-xs text-slate-800 leading-relaxed">
              <strong>FikrNot:</strong> Namaste <strong>Rahul Sharma</strong> ji, humne dekha aapka UPI session time out ho gaya.
              <br /><br />
              🛡️ Fikr mat kijiye, agar paise kate hain toh <strong>bank auto-reversal</strong> ho jayega.
              <br /><br />
              Aapka cart <strong>15 minute ke liye reserved</strong> hai. 1-click mein complete karne ke liye tap karein:

              <div
                onClick={() => setSheetOpen(true)}
                className="mt-3 bg-blue-50 border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:bg-blue-100 transition"
              >
                <div className="bg-blue-600 text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
                  <span>🛒 CART RESERVED (15m)</span>
                  <span>₹14,999.00</span>
                </div>
                <div className="p-2.5">
                  <div className="font-extrabold text-xs text-slate-900">Razorpay 1-Click Fallback Checkout</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Dynamic UPI QR • Credit / Debit Cards • NetBanking</div>
                  <div className="text-blue-600 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                    <span>Tap to complete payment securely →</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT COMPLETED SMS BUBBLE */}
          {paymentDone && (
            <div className="bg-emerald-50 rounded-2xl rounded-bl-sm p-4 shadow-sm border border-emerald-300 text-xs text-emerald-950 leading-relaxed border-l-4 border-l-emerald-600 animate-fade-in">
              <strong>FikrNot:</strong> 🎉 <strong>Payment Received Successfully!</strong>
              <br /><br />
              Aapka <strong>₹{amountStr}</strong> ka payment safely receive ho gaya hai via Razorpay.
              <br /><br />
              Order <strong>#{orderId}</strong> confirm ho chuka hai. Cart reservation release ho gayi hai.
              <br /><br />
              📦 <strong>Delivery Status:</strong> Shipping in 24 hours.
            </div>
          )}
        </div>

        {/* Slide-Up Checkout Modal */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-4 transition-transform duration-300 z-50 max-h-[85%] overflow-y-auto ${
            sheetOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Handle */}
          <div
            onClick={() => setSheetOpen(false)}
            className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 cursor-pointer"
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-black text-slate-900">
              {isSneha ? "Order Confirmation Receipt" : isAmit ? "Saved Cart Checkout" : "1-Click Fallback Checkout"}
            </h4>
            {!isSneha && (
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                ⏱️ {formatTimer()}
              </span>
            )}
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
            <div className="text-[10px] text-slate-500 font-semibold">
              Order Reference: <strong className="text-slate-900">{orderId}</strong>
            </div>
            <div className="text-lg font-black text-blue-600 mt-0.5">₹{amountStr}</div>
            {isSneha && (
              <div className="text-xs font-extrabold text-emerald-600 mt-1">✅ PAID & CAPTURED</div>
            )}
          </div>

          {/* SNEHA RECEIPT VIEW */}
          {isSneha ? (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <div className="text-2xl">✅</div>
                <div className="font-extrabold text-xs text-emerald-900 mt-1">Payment Already Successful</div>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  Razorpay verified this payment was captured by your bank. No further payment required.
                </p>
              </div>

              <div className="text-xs space-y-2 border-t border-dashed border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <strong className="text-emerald-600">CAPTURED</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <strong className="text-slate-900">₹899.00</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <strong className="text-slate-900">Tomorrow by 6:00 PM</strong>
                </div>
              </div>

              <button
                onClick={() => setSheetOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                View Delivery Status ✓
              </button>
            </div>
          ) : (
            /* PAYMENT OPTIONS (Rahul, Priya, Amit) */
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Payment Method
              </div>

              {/* Rails */}
              <div className="space-y-2 mb-3">
                {/* UPI Apps */}
                <div
                  onClick={() => setSelectedRail("upi")}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedRail === "upi" ? "border-blue-600 bg-blue-50/60" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Instant UPI Apps</div>
                      <div className="text-[10px] text-slate-500">Google Pay • PhonePe • Paytm • CRED</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedRail === "upi"} readOnly className="accent-blue-600" />
                </div>

                {/* Dynamic QR */}
                <div
                  onClick={() => setSelectedRail("qr")}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedRail === "qr" ? "border-blue-600 bg-blue-50/60" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📷</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Dynamic UPI QR Code</div>
                      <div className="text-[10px] text-slate-500">Scan with any UPI app (Zero timeout risk)</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedRail === "qr"} readOnly className="accent-blue-600" />
                </div>

                {/* Cards */}
                <div
                  onClick={() => setSelectedRail("cards")}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedRail === "cards" ? "border-blue-600 bg-blue-50/60" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">💳</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cards (Credit / Debit)</div>
                      <div className="text-[10px] text-slate-500">HDFC, SBI, ICICI, Axis • Visa, RuPay</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedRail === "cards"} readOnly className="accent-blue-600" />
                </div>
              </div>

              <button
                onClick={handleFinishPayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs transition shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                {isProcessing ? "Processing via Razorpay..." : `Pay ₹${amountStr} via Razorpay Secure →`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
