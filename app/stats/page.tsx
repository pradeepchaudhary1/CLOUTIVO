"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Activity, Globe, MousePointer, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function StatsPage() {
  const channelBreakdown = [
    { channel: "Direct Traffic", percentage: "58%", visitors: "1,180" },
    { channel: "Organic Social (X / Twitter)", percentage: "24%", visitors: "490" },
    { channel: "Referral & Backlinks", percentage: "12%", visitors: "245" },
    { channel: "Organic Search (Google)", percentage: "6%", visitors: "122" },
  ];

  const topCountries = [
    { country: "India", code: "🇮🇳", share: "54%", count: "1,098" },
    { country: "United States", code: "🇺🇸", share: "28%", count: "570" },
    { country: "United Kingdom", code: "🇬🇧", share: "8%", count: "162" },
    { country: "Germany & EU", code: "🇪🇺", share: "6%", count: "122" },
    { country: "Others", code: "🌐", share: "4%", count: "81" },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency="USD" setCurrency={() => {}} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="border-b border-neutral-900 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Public Transparency Engine</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">Live Platform Analytics</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Real-time traffic, visitor breakdown, and conversion metrics powering the CLOUTIVO attention market.
          </p>
        </div>

        {/* 4 KPI Cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500 flex items-center justify-between">
              <span>Live Visitors</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="font-mono text-2xl font-black text-white mt-2">18 Online</div>
            <div className="text-[11px] text-emerald-400 mt-1">Real-time right now</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500">24h Unique Visitors</div>
            <div className="font-mono text-2xl font-black text-white mt-2">2,037</div>
            <div className="text-[11px] text-emerald-400 mt-1">+42% from yesterday</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500">Average Session Time</div>
            <div className="font-mono text-2xl font-black text-white mt-2">1m 24s</div>
            <div className="text-[11px] text-neutral-400 mt-1">High-intent founder dwell</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500">Outbound Click-Through</div>
            <div className="font-mono text-2xl font-black text-emerald-400 mt-2">16.4%</div>
            <div className="text-[11px] text-neutral-400 mt-1">Direct to listed websites</div>
          </div>
        </div>

        {/* Two Tables: Acquisition & Geography */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traffic Channels */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Traffic Acquisition Channels</span>
            </h3>
            <div className="space-y-3">
              {channelBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-neutral-900">
                  <span className="text-neutral-300 font-medium">{item.channel}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-400">{item.visitors} visits</span>
                    <span className="font-mono font-bold text-emerald-400 w-10 text-right">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Visitor Demographics (Geography)</span>
            </h3>
            <div className="space-y-3">
              {topCountries.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-neutral-900">
                  <span className="text-neutral-300 font-medium">
                    <span className="mr-2">{item.code}</span>
                    {item.country}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-400">{item.count} users</span>
                    <span className="font-mono font-bold text-emerald-400 w-10 text-right">{item.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}