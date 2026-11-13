"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, Trophy } from "lucide-react";

interface DailyEntry {
  day: string;
  day_rank?: number;
  rank?: number;
  slug: string;
  title: string;
  host: string;
  category: string;
  day_cents: number;
  clicks?: number;
}

export default function DailyPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [rows, setRows] = useState<DailyEntry[]>([]);
  const symbol = currency === "INR" ? "₹" : "$";
  const mult = currency === "INR" ? 88 : 1;

  useEffect(() => {
    fetch("/api/board?board=daily")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.daily)) setRows(d.daily);
      })
      .catch(() => {});
  }, []);

  const grouped = rows.reduce<Record<string, DailyEntry[]>>((acc, r) => {
    acc[r.day] = acc[r.day] || [];
    acc[r.day].push(r);
    return acc;
  }, {});

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>24-Hour Daily UTC Leaderboard</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black text-white">Daily Archives &amp; Live Board</h1>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl">
            Each UTC calendar day gets its own board. Today stays live until midnight UTC, then freezes as an archive.
          </p>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-10 text-center text-sm text-neutral-400">
            No paid days recorded in Supabase yet.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([day, items]) => {
              const isLive = day === todayStr;
              const winner = items[0];
              return (
                <div key={day} className={`rounded-2xl border ${isLive ? "border-emerald-500/40 bg-[#0a0a0a]" : "border-neutral-800/80 bg-[#0a0a0a]"}`}>
                  <div className="flex flex-wrap items-center justify-between p-5 border-b border-neutral-800/60 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-base text-white">{day}</div>
                      {isLive ? (
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">Live Now</span>
                      ) : (
                        <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs text-neutral-400 font-mono">Archived</span>
                      )}
                    </div>
                    {winner && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>#1 {winner.title} ({symbol}{Math.round((winner.day_cents / 100) * mult).toLocaleString()})</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 divide-y divide-neutral-900">
                    {items.map((item, idx) => (
                      <div key={`${day}-${item.slug}`} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 font-mono text-xs font-bold text-neutral-300">
                            #{item.day_rank ?? item.rank ?? idx + 1}
                          </span>
                          <div>
                            <Link href={`/product/${encodeURIComponent(item.slug)}`} className="font-semibold text-sm text-neutral-100 hover:underline">
                              {item.title}
                            </Link>
                            <div className="text-xs text-neutral-500">
                              {item.host} · {item.category}{typeof item.clicks === "number" ? ` · ${item.clicks} clicks` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-emerald-400 text-sm">
                          {symbol}{Math.round((item.day_cents / 100) * mult).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}