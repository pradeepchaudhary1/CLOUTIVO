"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, ShieldCheck, Zap, ArrowRight, Sparkles } from "lucide-react";

export default function BacklinksPage() {
  const plans = [
    {
      name: "Starter Booster",
      directories: "25 Hand-Submitted Directories",
      price: "₹2,499",
      usd: "$29",
      features: [
        "25 Vetted high-authority directories",
        "100% Manual submission with live proof",
        "DR 30 to DR 75+ authority domains",
        "Completed within 7-10 days",
        "Full Excel report with live URLs",
      ],
      popular: false,
    },
    {
      name: "Growth Booster",
      directories: "50 Hand-Submitted Directories",
      price: "₹4,999",
      usd: "$59",
      features: [
        "50 Vetted high-authority directories",
        "100% Manual submission with live proof",
        "DR 40 to DR 85+ authority domains",
        "Completed within 5-7 days",
        "Full Excel report with live URLs",
        "AI Search indexing optimization (ChatGPT & Perplexity)",
      ],
      popular: true,
    },
    {
      name: "Scale Authority",
      directories: "100 Hand-Submitted Directories",
      price: "₹8,999",
      usd: "$99",
      features: [
        "100 Premium SaaS & Startup directories",
        "Top tier platforms (SourceForge, BetaList, Uneed)",
        "DR up to 92+ maximum authority",
        "Express 3-5 days delivery",
        "Dedicated verification report with screenshots",
        "Priority founder email support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency="USD" setCurrency={() => {}} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center max-w-2xl mx-auto border-b border-neutral-900 pb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High Domain Authority Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Get Submitted to 100+ Top Directories. Hand-Done with Proof.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
            Skip 60+ hours of tedious account creations and forms. We manually submit your startup to 100 vetted directories (up to DR 92+) to establish permanent Google authority.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                p.popular
                  ? "border-emerald-500 bg-gradient-to-b from-[#0f1f14] to-[#0a0a0a] shadow-2xl shadow-emerald-950/40 relative scale-105"
                  : "border-neutral-800/80 bg-[#0a0a0a] hover:border-neutral-700"
              }`}
            >
              <div>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[11px] font-bold text-black uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-lg text-white">{p.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{p.directories}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-neutral-500">/ {p.usd} one-time</span>
                </div>

                <div className="mt-6 space-y-2.5 border-t border-neutral-900 pt-6">
                  {p.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://rzp.io/rzp/cloutivo.com"
                target="_blank"
                rel="noreferrer"
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition active:scale-95 ${
                  p.popular
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800"
                }`}
              >
                <span>Submit My Business</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}