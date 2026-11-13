"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [stats, setStats] = useState({ listings: 0, total_cents: 0, clicks: 0 });

  useEffect(() => {
    fetch("/api/board?board=all-time")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.stats) setStats(d.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center max-w-2xl mx-auto border-b border-neutral-900 pb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Rank is what you pay. Nothing else.
          </h1>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            CLOUTIVO is a transparent pay-to-rank public leaderboard and deals board for startups, SaaS, apps, and services — with UPI and card checkout.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold text-center mb-6">
            Verified Database Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5 text-center">
              <div className="font-mono text-3xl font-black text-white">{stats.listings}</div>
              <div className="text-xs font-semibold text-neutral-300 mt-1">Listed Products</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5 text-center">
              <div className="font-mono text-3xl font-black text-emerald-400">${Math.round(stats.total_cents / 100).toLocaleString()}</div>
              <div className="text-xs font-semibold text-neutral-300 mt-1">Total Verified Volume</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5 text-center">
              <div className="font-mono text-3xl font-black text-white">{stats.clicks.toLocaleString()}</div>
              <div className="text-xs font-semibold text-neutral-300 mt-1">Outbound Clicks Counted</div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <Zap className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white">Instant Placement</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Your product appears on the leaderboard immediately after verified UPI or card payment.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white">Transparent Rules</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Paid links are marked sponsored. Every listing gets its own product page and public click count.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <Globe className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white">Pay Only Difference</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Got outranked? Submit the same URL again and pay only the difference to climb back up.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}