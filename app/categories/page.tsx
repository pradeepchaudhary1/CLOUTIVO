"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Grid, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function CategoriesPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const symbol = currency === "INR" ? "₹" : "$";
  const multiplier = currency === "INR" ? 85 : 1;

  const categoryGrids = [
    {
      name: "AI Agents & Tech",
      icon: "🤖",
      topListings: [
        { rank: 1, title: "FormsAI — AI Form Builder", bid: 45 },
        { rank: 2, title: "SteerCamp — AI Ops Workspace", bid: 28 },
        { rank: 3, title: "ClipUGC — Influencer AI Videos", bid: 15 },
      ],
    },
    {
      name: "SaaS & Productivity",
      icon: "⚡",
      topListings: [
        { rank: 1, title: "Woday — Mac Daily Planner", bid: 22 },
        { rank: 2, title: "SolidInvoice — Invoicing Software", bid: 18 },
        { rank: 3, title: "NoteClearly — Voice Notes App", bid: 10 },
      ],
    },
    {
      name: "Developer Tools",
      icon: "🛠️",
      topListings: [
        { rank: 1, title: "Liveterminal — Cloud Linux Machine", bid: 26 },
        { rank: 2, title: "PrivateByte — High Speed VPS", bid: 20 },
        { rank: 3, title: "DeployPulse — Webhook Watcher", bid: 12 },
      ],
    },
    {
      name: "Marketing & SEO",
      icon: "📈",
      topListings: [
        { rank: 1, title: "AdSpends — Meta Ads Intelligence", bid: 35 },
        { rank: 2, title: "Realific — Revenue-aware Analytics", bid: 21 },
        { rank: 3, title: "Vemetric — Product Journeys", bid: 14 },
      ],
    },
    {
      name: "Agencies & Services",
      icon: "🤝",
      topListings: [
        { rank: 1, title: "BuildToLaunch — Custom 50 Page Sites", bid: 32 },
        { rank: 2, title: "Limestone Digital — AI Dev Studio", bid: 24 },
        { rank: 3, title: "GrowthCraft — Cold Email Infrastructure", bid: 16 },
      ],
    },
    {
      name: "E-Commerce & Retail",
      icon: "🛒",
      topListings: [
        { rank: 1, title: "Pumo — Amazon Review Optimizer", bid: 28 },
        { rank: 2, title: "SecretPass — Discount Voucher Vault", bid: 22 },
        { rank: 3, title: "FeedFuel — Real Customer Feedback", bid: 14 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300 mb-3">
            <Grid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Niche Marketplaces</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Categories & Services</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Every category has its own independent ranking. Compete within your exact industry to attract hyper-targeted buyers.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryGrids.map((cat) => (
            <div
              key={cat.name}
              className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-5 flex flex-col justify-between transition-all hover:border-neutral-700 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-bold text-base text-white">{cat.name}</h3>
                </div>

                {/* Top 3 items */}
                <div className="mt-4 space-y-2.5">
                  {cat.topListings.map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-950 border border-neutral-900"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold text-neutral-400">#{item.rank}</span>
                        <span className="font-medium text-neutral-200 truncate">{item.title}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 shrink-0">
                        {symbol}{(item.bid * multiplier).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 py-2.5 text-xs font-bold text-white transition active:scale-95">
                <span>Claim #1 in this Category</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}