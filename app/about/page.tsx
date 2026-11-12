"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { ShieldCheck, Zap, Globe, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const stats = [
    { label: "Total Page Views", value: "1,420,890", note: "Across 180+ countries" },
    { label: "Total Paid Volume", value: "$48,950", note: "Verified transactions" },
    { label: "Listed Products", value: "320+", note: "Founders & startups" },
    { label: "Average Outbound CTR", value: "14.8%", note: "Direct to websites" },
  ];

  const testimonials = [
    {
      name: "Aman Sharma",
      handle: "@amansharma_dev",
      role: "Founder, FormsAI",
      text: "Paid $45 to claim #1 on CLOUTIVO and generated 68 paying customers in 48 hours. The ROI on this is completely unmatched compared to Google or Meta Ads.",
      gain: "68 customers in 2 days",
    },
    {
      name: "Marcus Vance",
      handle: "@marcus_vance",
      role: "Creator, Woday Planner",
      text: "Permanent DoFollow backlink with high domain rating plus instant founder traffic. Cleanest pay-to-rank platform ever built.",
      gain: "Domain Rating +8 boost",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center max-w-2xl mx-auto border-b border-neutral-900 pb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Rank is what you pay. Nothing else.
          </h1>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            CLOUTIVO is the transparent, viral attention market for products, startups, agencies, and profiles. No hidden ad algorithms, no bidding auctions that drain your wallet, and no middlemen.
          </p>
        </div>

        {/* Live Transparency Grid */}
        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold text-center mb-6">
            Live Platform Transparency Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5 text-center">
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">{s.value}</div>
                <div className="text-xs font-semibold text-neutral-300 mt-1">{s.label}</div>
                <div className="text-[11px] text-neutral-500 mt-1">{s.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Core Value Pillars */}
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <Zap className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white">Instant #1 Visibility</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Skip weeks of SEO waiting. Your product sits right at the top of the homepage the exact second your bid completes.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white">Clean DoFollow Backlink</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              We never mask your link behind tracking redirects. Clean, search-engine-indexed links that give your domain permanent authority.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <Globe className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white">Incremental Outbidding</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Got outranked? Never pay from scratch. Simply pay the difference amount to reclaim your throne instantly.
            </p>
          </div>
        </section>

        {/* Founder Testimonial Wall */}
        <section className="mt-16 border-t border-neutral-900 pt-12">
          <h2 className="text-2xl font-bold text-white text-center">Real Founder Proof</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-6 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-neutral-300 leading-relaxed italic">"{t.text}"</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.gain}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-neutral-500">{t.role}</div>
                  </div>
                  <span className="font-mono text-neutral-400">{t.handle}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}