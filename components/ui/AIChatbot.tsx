"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Flame, ShieldCheck } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey! I am Cloutivo AI. How can I help you today? Ask me about taking #1 rank, SEO backlinks, or finding active discount deals!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Smart Instant AI Knowledge Engine
    setTimeout(() => {
      let reply = "I can help with that! You can claim any rank by clicking 'Claim rank'. Pay only the difference when outbidding.";
      const q = query.toLowerCase();

      if (q.includes("backlink") || q.includes("seo") || q.includes("dofollow")) {
        reply = "Every listing on CLOUTIVO gets a permanent, clean DoFollow backlink with high domain authority, helping your product rank higher on Google.";
      } else if (q.includes("how much") || q.includes("price") || q.includes("cost") || q.includes("#1")) {
        reply = "Taking #1 requires just $5 (or ₹425) above the current leader. All other ranks require just $1 above the target position.";
      } else if (q.includes("upi") || q.includes("payment") || q.includes("card")) {
        reply = "We support instant 1-click UPI (Google Pay, PhonePe, Paytm, QR Code) and all major Credit/Debit cards via secure Razorpay checkout.";
      } else if (q.includes("deal") || q.includes("discount") || q.includes("coupon")) {
        reply = "Switch to the 'Black Friday Deals' tab on the homepage to find verified startup tools with up to 50% discount coupons!";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 p-3.5 text-black font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 border border-emerald-300/40"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs hidden sm:inline">Ask Cloutivo AI</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-96 rounded-2xl border border-neutral-800 bg-[#0c0c0c] shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Cloutivo AI Concierge</span>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400">Online · Powered by AI</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Questions Pills */}
          <div className="flex gap-1.5 p-2.5 overflow-x-auto no-scrollbar border-b border-neutral-900 bg-neutral-950/40 text-[11px]">
            <button
              onClick={() => handleSend("How much to take #1?")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            >
              How much for #1?
            </button>
            <button
              onClick={() => handleSend("Do I get a DoFollow backlink?")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            >
              SEO & Backlink?
            </button>
            <button
              onClick={() => handleSend("Can I pay via UPI?")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            >
              UPI Accepted?
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-500 text-black font-medium rounded-br-none"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about ranking or deals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}