"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Clock, Trophy, ExternalLink, Calendar, ChevronDown, ChevronUp } from "lucide-react";

export default function DailyPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [expandedDay, setExpandedDay] = useState<string | null>("nov10");

  const symbol = currency === "INR" ? "₹" : "$";
  const multiplier = currency === "INR" ? 85 : 1;

  const pastDays = [
    {
      id: "nov10",
      date: "November 10, 2026",
      isLive: true,
      timeLeft: "06:42:18 left",
      listingsCount: 4,
      items: [
        { rank: 1, title: "8gifs — Free AI GIF Maker", domain: "8gifs.com", category: "AI & Media", paid: 25, clicks: 18 },
        { rank: 2, title: "Tech Twitter Curated Signals", domain: "techtwitter.com", category: "News", paid: 18, clicks: 240 },
        { rank: 3, title: "PropOrbit — Find your next edge", domain: "proporbit.app", category: "SEO", paid: 15, clicks: 3 },
      ],
    },
    {
      id: "nov9",
      date: "November 9, 2026",
      isLive: false,
      timeLeft: "Closed",
      listingsCount: 8,
      winner: "BuildToLaunch — 50 Page custom website",
      winnerBid: 32,
      items: [
        { rank: 1, title: "BuildToLaunch — 50 Page website", domain: "buildtolaunch.com", category: "Agencies", paid: 32, clicks: 88 },
        { rank: 2, title: "PostOnce — Social Scheduler for Teams", domain: "postonce.app", category: "Social", paid: 20, clicks: 42 },
      ],
    },
    {
      id: "nov8",
      date: "November 8, 2026",
      isLive: false,
      timeLeft: "Closed",
      listingsCount: 11,
      winner: "FormsAI — One-Question Forms",
      winnerBid: 36,
      items: [
        { rank: 1, title: "FormsAI — One-Question Forms", domain: "formsai.dev", category: "SaaS", paid: 36, clicks: 120 },
        { rank: 2, title: "Vemetric Product Analytics", domain: "vemetric.com", category: "SaaS", paid: 31, clicks: 65 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>24-Hour Daily UTC Leaderboard</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black text-white">Daily Archives & Live Board</h1>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl">
            Each UTC calendar day (midnight to midnight) gets its own battleground. Rank is what you spent that day. Today stays live until midnight UTC, then freezes as an archive.
          </p>
        </div>

        <div className="space-y-6">
          {pastDays.map((day) => (
            <div
              key={day.id}
              className={`rounded-2xl border transition-all ${
                day.isLive
                  ? "border-emerald-500/40 bg-gradient-to-b from-[#0e1611] to-[#0a0a0a] shadow-lg shadow-emerald-950/20"
                  : "border-neutral-800/80 bg-[#0a0a0a]"
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-neutral-800/60 gap-3">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-base text-white">{day.date}</div>
                  {day.isLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Now
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs text-neutral-400 font-mono">
                      Archived
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                  {day.isLive ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {day.timeLeft}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-400">
                      <Trophy className="w-3.5 h-3.5" />
                      Winner: <strong>{day.winner}</strong> ({symbol}{day.winnerBid! * multiplier})
                    </span>
                  )}
                  <span>· {day.listingsCount} listings</span>
                </div>
              </div>

              {/* Day Listings */}
              <div className="p-4 divide-y divide-neutral-900">
                {day.items.map((item) => (
                  <div key={item.rank} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 font-mono text-xs font-bold text-neutral-300">
                        #{item.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-neutral-100">{item.title}</span>
                          <span className="text-neutral-500 text-xs font-mono">· {item.domain}</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {item.category} · {item.clicks} clicks
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      {symbol}{(item.paid * multiplier).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}