"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Activity, Globe, TrendingUp, Trophy, Layers } from "lucide-react";

interface AnalyticsData {
  online: number;
  visitors24h: number;
  totalViews: number;
  channels: Array<{ channel: string; count: number; pct: number }>;
  countries: Array<{ country: string; count: number; pct: number }>;
  stats: { listings: number; total_cents: number; clicks: number };
}

interface BoardItem {
  slug: string;
  name?: string;
  title?: string;
  domain?: string;
  category?: string;
  total_cents?: number;
}

export default function StatsPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [data, setData] = useState<AnalyticsData>({
    online: 1,
    visitors24h: 1,
    totalViews: 1,
    channels: [],
    countries: [],
    stats: { listings: 0, total_cents: 0, clicks: 0 },
  });
  const [topBids, setTopBids] = useState<BoardItem[]>([]);
  const [categorySpend, setCategorySpend] = useState<Array<{ category: string; count: number; usd: number; pct: number }>>([]);

  useEffect(() => {
    const load = () => {
      fetch("/api/analytics")
        .then((r) => r.json())
        .then((d) => { if (d?.ok) setData(d); })
        .catch(() => {});

      fetch("/api/board")
        .then((r) => r.json())
        .then((d) => {
          const rows: BoardItem[] = Array.isArray(d) ? d : (d?.listings ?? d?.items ?? d?.top ?? []);
          if (!Array.isArray(rows) || rows.length === 0) return;
          setTopBids(rows.slice(0, 5));

          const map = new Map<string, { count: number; cents: number }>();
          let totalCents = 0;
          for (const item of rows) {
            const cat = item.category || "Other";
            const cents = Number(item.total_cents ?? 0);
            totalCents += cents;
            const prev = map.get(cat) || { count: 0, cents: 0 };
            map.set(cat, { count: prev.count + 1, cents: prev.cents + cents });
          }
          const summary = Array.from(map.entries())
            .map(([category, v]) => ({
              category,
              count: v.count,
              usd: Math.round(v.cents / 100),
              pct: totalCents > 0 ? Math.round((v.cents / totalCents) * 100) : 0,
            }))
            .sort((a, b) => b.usd - a.usd);
          setCategorySpend(summary);
        })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="border-b border-neutral-900 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Database Telemetry</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">Live Platform Analytics</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Real-time visitors, paid volume, top bids, and category spend queried directly from Supabase.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500 flex items-center justify-between">
              <span>Live Visitors</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="font-mono text-2xl font-black text-white mt-2">{data.online} Online</div>
            <div className="text-[11px] text-emerald-400 mt-1">Active last 3 mins</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500">24h Unique Visitors</div>
            <div className="font-mono text-2xl font-black text-white mt-2">{data.visitors24h.toLocaleString()}</div>
            <div className="text-[11px] text-neutral-400 mt-1">{data.totalViews} total page views</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500">Verified Paid Volume</div>
            <div className="font-mono text-2xl font-black text-emerald-400 mt-2">${Math.round(data.stats.total_cents / 100).toLocaleString()}</div>
            <div className="text-[11px] text-neutral-400 mt-1">{data.stats.listings} listed products</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
            <div className="text-xs text-neutral-500">Outbound Clicks</div>
            <div className="font-mono text-2xl font-black text-white mt-2">{data.stats.clicks.toLocaleString()}</div>
            <div className="text-[11px] text-neutral-400 mt-1">Tracked via /go/[slug]</div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <h2 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Top Ranked Bids</span>
            </h2>
            <div className="space-y-3">
              {topBids.length === 0 ? (
                <p className="text-xs text-neutral-500">Loading leaderboard data...</p>
              ) : (
                topBids.map((item, idx) => (
                  <div key={item.slug} className="flex items-center justify-between text-xs py-2 border-b border-neutral-900">
                    <Link href={`/product/${item.slug}`} className="text-neutral-200 hover:text-emerald-400 font-medium truncate pr-3">
                      #{idx + 1} {item.name || item.title || item.domain || item.slug}
                    </Link>
                    <span className="font-mono font-bold text-emerald-400 shrink-0">
                      ${Math.round(Number(item.total_cents ?? 0) / 100).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <h2 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Category-Wise Spend Breakdown</span>
            </h2>
            <div className="space-y-3">
              {categorySpend.length === 0 ? (
                <p className="text-xs text-neutral-500">Loading category spend...</p>
              ) : (
                categorySpend.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-xs py-2 border-b border-neutral-900">
                    <span className="text-neutral-300 font-medium">{item.category} ({item.count})</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-300">${item.usd.toLocaleString()}</span>
                      <span className="font-mono font-bold text-emerald-400 w-10 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <h2 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Traffic Acquisition Channels (24h)</span>
            </h2>
            <div className="space-y-3">
              {data.channels.length === 0 ? (
                <p className="text-xs text-neutral-500">Waiting for visitor data...</p>
              ) : (
                data.channels.map((item) => (
                  <div key={item.channel} className="flex items-center justify-between text-xs py-2 border-b border-neutral-900">
                    <span className="text-neutral-300 font-medium">{item.channel}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-400">{item.count} visitors</span>
                      <span className="font-mono font-bold text-emerald-400 w-10 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-6">
            <h2 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Visitor Geography (24h)</span>
            </h2>
            <div className="space-y-3">
              {data.countries.length === 0 ? (
                <p className="text-xs text-neutral-500">Waiting for visitor data...</p>
              ) : (
                data.countries.map((item) => (
                  <div key={item.country} className="flex items-center justify-between text-xs py-2 border-b border-neutral-900">
                    <span className="text-neutral-300 font-medium">{item.country}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-400">{item.count} users</span>
                      <span className="font-mono font-bold text-emerald-400 w-10 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}