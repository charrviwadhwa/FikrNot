"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  PhoneCall, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  MessageSquare, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Volume2,
  Activity
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("Home");

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Advantages", href: "#advantages" }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans selection:bg-blue-500/20 antialiased scroll-smooth">
      {/* Top Floating Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-blue-100/40 via-purple-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header & Navbar */}
      <header className="sticky top-0 z-50 bg-[#FBFBFC]/80 backdrop-blur-md transition-all">
        <nav className="max-w-[1240px] mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">FikrNot</span>
          </Link>

          {/* Centered Pill Navigation */}
          <div className="flex items-center bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-200/80 rounded-full p-1.5 gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-100/90 text-slate-900 font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Live Console Quick Link */}
          <div className="flex items-center">
            <Link
              href="/demo"
              className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50/80 transition-colors"
            >
              <span>Operational Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-[1240px] mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs md:text-sm font-medium mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Autonomous Indic Voice Recovery Agent for India</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12] mb-6">
          Never Lose a Customer to<br className="hidden sm:inline" /> Payment Failures Again
        </h1>
        
        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
          FikrNot detects dropped UPI and card transactions instantly, dials customers in their native language within 10 seconds, and rescues abandoned revenue with zero human intervention.
        </p>

        {/* Hero Canvas Banner with Centered Overlapping Button */}
        <div className="w-full max-w-[1080px] relative mt-4">
          {/* Action Button positioned right at the top center border */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#181B22] hover:bg-black text-white rounded-full font-semibold text-sm md:text-base transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ring-4 ring-white"
            >
              <span>Enter Operational Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>

          {/* Smooth Pastel Gradient Card */}
          <div className="w-full h-[320px] sm:h-[380px] md:h-[440px] rounded-[36px] md:rounded-[48px] overflow-hidden relative shadow-[0_20px_50px_rgba(150,184,246,0.2)] border border-white/60">
            {/* Smooth Multi-Stop Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#9BBDF7] via-[#D1C8F8] to-[#E5C1F8]" />
            
            {/* Subtle soft ambient light glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

            {/* Inner Dashboard Preview Glimpse */}
            <div className="absolute inset-x-8 md:inset-x-16 bottom-0 top-20 bg-white/40 backdrop-blur-xl rounded-t-[32px] border-t border-x border-white/60 p-6 md:p-8 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-900/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs font-semibold text-slate-700 ml-2">FikrNot Autonomous Dispatcher (Active)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  System Live &bull; Sub-10s Latency
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
                <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm text-left backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mb-1">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    <span>Webhook Ingestion</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">Sub-500ms</div>
                  <span className="text-[11px] text-slate-500 font-medium">Gateway Drop Catch</span>
                </div>

                <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm text-left backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-purple-600 font-bold mb-1">
                    <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                    <span>Indic Voice AI</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">12+ Dialects</div>
                  <span className="text-[11px] text-slate-500 font-medium">Hinglish & Regional</span>
                </div>

                <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm text-left backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mb-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span>1-Click Fallback</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">Instant Push</div>
                  <span className="text-[11px] text-slate-500 font-medium">15-Min Cart Reserve</span>
                </div>

                <div className="bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm text-left backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Zero Spam Filter</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">Bounded AI</div>
                  <span className="text-[11px] text-slate-500 font-medium">Safe Call Suppression</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-600 font-medium">
                Click the top black pill to explore the live interactive simulator with audio synthesis &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-[1240px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Intelligent intervention methods
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
            We provide the optimal recovery channel for every transaction scenario under full automated control.
          </p>
        </div>

        {/* Feature 1: The Phone Call UI (Voice AI) */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center bg-white rounded-[36px] p-8 md:p-14 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-12">
          {/* Phone Mockup Left */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-blue-500/15 blur-3xl rounded-full transform -rotate-6" />
            
            {/* Phone Chassis */}
            <div className="relative bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/18.5] w-[270px] sm:w-[290px] flex flex-col items-center ring-1 ring-white/10">
              <div className="absolute top-0 w-32 h-6 bg-slate-800 rounded-b-3xl z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
              
              <div className="relative z-10 w-full h-full flex flex-col p-6 text-white pt-14 justify-between">
                {/* Caller Info */}
                <div className="flex flex-col items-center">
                  <div className="w-[72px] h-[72px] bg-blue-500/20 rounded-full flex items-center justify-center mb-3 border border-blue-400/30">
                    <ShieldCheck className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold">FikrNot Indic Agent</h3>
                  <p className="text-emerald-400 font-medium text-xs flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    00:14 &bull; Active Call
                  </p>
                </div>

                {/* Subtitles / Real-time Hinglish Transcription */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md text-left">
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-medium mb-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Live Indic Transcription</span>
                  </div>
                  <p className="text-xs text-slate-100 leading-relaxed font-normal">
                    &ldquo;Namaste Rahul ji, humne dekha aapka ₹1,499 ka UPI payment fail ho gaya. Kya hum aapko naya 1-click payment link bhej dein?&rdquo;
                  </p>
                </div>
                
                {/* Audio Waveform */}
                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[24, 12, 32, 18, 28, 14, 30, 20, 26, 16].map((height, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-emerald-400 rounded-full animate-pulse" 
                      style={{ height: `${height}px`, animationDelay: `${i * 0.08}s` }} 
                    />
                  ))}
                </div>

                {/* Call End Button */}
                <div className="flex justify-center pb-2">
                  <div className="w-[52px] h-[52px] rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                    <PhoneCall className="w-5 h-5 text-white rotate-[135deg]" />
                  </div>
                </div>
                
                <div className="w-1/3 h-1 bg-white/20 rounded-full mx-auto" />
              </div>
            </div>
          </div>
          
          {/* Feature Text Right */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs mb-4">
              <PhoneCall className="w-3.5 h-3.5" /> High-Intent Voice Rescue
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-snug">
              Human-like Indic voice agents that call within 10 seconds.
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              When high-value orders fail due to bank server timeouts or UPI glitches, our autonomous agent initiates a polite voice call in the customer’s native regional dialect to resolve doubts and complete the transaction.
            </p>
            <ul className="space-y-3">
              {[
                "Zero manual support overhead",
                "Recognizes customer hesitations & objections in real-time",
                "Instant OTP/UPI fresh link generation during call"
              ].map((point, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 2: SMS / WhatsApp 1-Click Fallback */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center bg-white rounded-[36px] p-8 md:p-14 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          {/* Feature Text Left */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-xs mb-4">
              <Zap className="w-3.5 h-3.5" /> Bounded & Spam-Free Policy
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-snug">
              Zero spam policy. We know when to stay quiet.
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Not every dropped transaction requires a phone call. For micro-payments or transient gateway flickers, FikrNot smartly skips voice outreach and dispatches an instant 1-click direct checkout link.
            </p>
            <ul className="space-y-3">
              {[
                "Dynamic routing based on cart value & user history",
                "Auto-expires links when cart is recovered",
                "Whitelisted WhatsApp & SMS business headers"
              ].map((point, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SMS Phone Mockup Right */}
          <div className="order-1 md:order-2 flex justify-center relative">
            <div className="absolute inset-0 bg-amber-500/15 blur-3xl rounded-full transform rotate-6" />
            
            {/* Phone Chassis */}
            <div className="relative bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/18.5] w-[270px] sm:w-[290px] flex flex-col ring-1 ring-white/10 bg-slate-100">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>
              
              {/* Message Header */}
              <div className="bg-slate-100 pt-10 pb-3 px-4 border-b border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">FikrNot Updates</h4>
                  <p className="text-[10px] text-emerald-600 font-medium">Verified Merchant Channel</p>
                </div>
              </div>
              
              {/* Chat Thread */}
              <div className="p-4 flex flex-col gap-3 bg-white h-full justify-between">
                <div>
                  <div className="text-[10px] text-center text-slate-400 font-medium my-2">Today 14:32</div>
                  
                  {/* SMS Bubble */}
                  <div className="bg-slate-50 text-slate-800 p-3.5 rounded-2xl rounded-tl-sm text-xs shadow-sm border border-slate-200/80 leading-relaxed">
                    <p className="font-medium text-slate-900 mb-1">Hi Priya! 👋</p>
                    <p>We noticed your ₹299 transaction failed due to bank server latency. Your cart has been reserved for 15 mins:</p>
                    <div className="mt-2.5 p-2 bg-blue-50/80 rounded-lg border border-blue-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-600 truncate">fikrnot.vercel.app/pay/ord_9x</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Replying disabled for updates</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
              
              <div className="w-1/3 h-1 bg-slate-300 rounded-full mx-auto my-1.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="max-w-[1240px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Why Indian enterprises choose FikrNot
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
            Engineered specifically to solve high drop-offs in the Indian UPI and D2C checkout ecosystem.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Sub-10s Intervention",
              desc: "Immediate call engagement before the buyer leaves checkout to search for an alternative product.",
              icon: Clock,
              color: "text-blue-500",
              bg: "bg-blue-50"
            },
            {
              step: "02",
              title: "12+ Indic Accents",
              desc: "Native Hindi, Hinglish, Tamil, Telugu, and Marathi conversational fluency that builds instant consumer trust.",
              icon: Globe,
              color: "text-purple-500",
              bg: "bg-purple-50"
            },
            {
              step: "03",
              title: "40%+ Cart Resurrection",
              desc: "Turn abandoned payment errors directly into completed orders with autonomous AI follow-up.",
              icon: TrendingUp,
              color: "text-emerald-500",
              bg: "bg-emerald-50"
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-[28px] p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dark Footer with Glowing Watermark Text */}
      <footer className="bg-[#101014] pt-4 px-4 pb-6">
        <div className="max-w-[1240px] mx-auto bg-[#18181C] rounded-[36px] overflow-hidden relative border border-white/5">
          
          <div className="px-10 md:px-16 pt-16 pb-32 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            {/* Left Column */}
            <div className="md:col-span-6">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">FikrNot</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                Grow your business with the<br />best payment recovery solution
              </h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 max-w-sm">
                Autonomous Indic AI voice & WhatsApp agents rescuing dropped carts across India.
              </p>
              <p className="text-[#71717A] text-xs">
                Built with precision for Razorpay Buildathon &bull; Track 03
              </p>
            </div>
            
            {/* Middle Column */}
            <div className="md:col-span-3">
              <h4 className="text-white font-semibold text-sm mb-5">Navigation</h4>
              <ul className="space-y-3.5 text-sm text-[#A1A1AA]">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right Column */}
            <div className="md:col-span-3">
              <h4 className="text-white font-semibold text-sm mb-5">Console & Links</h4>
              <ul className="space-y-3.5 text-sm text-[#A1A1AA] mb-8">
                <li>
                  <Link href="/demo" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                    Operational Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
                <li><a href="#features" className="hover:text-white transition-colors">Voice Engine</a></li>
                <li><a href="#advantages" className="hover:text-white transition-colors">Indic Recovery</a></li>
              </ul>
            </div>
          </div>

          {/* Huge Glowing Text at Bottom */}
          <div className="absolute bottom-0 left-0 w-full h-[220px] overflow-hidden flex items-end justify-center z-0 pointer-events-none select-none">
            <div className="text-[130px] sm:text-[180px] md:text-[230px] font-black tracking-tighter text-white/[0.035] leading-none w-full text-center whitespace-nowrap translate-y-10 sm:translate-y-14">
              FIKRNOT
            </div>
            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-600/35 via-purple-600/15 to-transparent mix-blend-screen" />
            <div className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 w-[85%] h-[160px] bg-indigo-500/40 blur-[90px]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
