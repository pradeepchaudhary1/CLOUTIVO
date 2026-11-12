"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroClaimBar from "@/components/deals/HeroClaimBar";
import CountdownTimer from "@/components/deals/CountdownTimer";
import DealCard from "@/components/deals/DealCard";
import LiveActivitySidebar from "@/components/deals/LiveActivitySidebar";
import ClaimModal from "@/components/deals/ClaimModal";
import Footer from "@/components/layout/Footer";
import { INITIAL_DEALS, CATEGORIES, DealItem } from "@/lib/mock-data";

export default function Home() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [activeBoard, setActiveBoard] = useState<"all-time" | "rising" | "deals" | "today">("all-time");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS);
  const [isLiveDb, setIsLiveDb] = useState(true);
  const [liveStats, setLiveStats] = useState({ listings: 0, totalUsd: 0, clicks: 0 });
  const [topBidUsd, setTopBidUsd] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [targetDeal, setTargetDeal] = useState<DealItem | null>(null);
  const [prefilledData, setPrefilledData] = useState<{ url?: string; category?: string; amount?: number }>({});

  useEffect(() => {
    let cancelled = false;
    const boardParam = activeBoard === "today" ? "today" : activeBoard === "deals" ? "deals" : "all-time";
    fetch(`/api/board?board=${boardParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.ok) return;
        setIsLiveDb(Boolean(data.dbConnected));
        if (data.firstPriceCents) setTopBidUsd(Math.round(data.firstPriceCents / 100));
        if (data.stats) {
          setLiveStats({
            listings: data.stats.listings ?? 0,
            totalUsd: Math.round((data.stats.total_cents ?? 0) / 100),
            clicks: data.stats.clicks ?? 0,
          });
        }
        if (Array.isArray(data.listings) && data.listings.length > 0) {
          setDeals(
            data.listings.map((item: Record<string, unknown>, idx: number) => {
              const totalUsd = Math.round(Number(item.total_cents ?? 0) / 100);
              const rank = Number(item.rank ?? item.day_rank ?? idx + 1);
              return {
                id: String(item.slug ?? item.id ?? idx + 1),
                rank,
                title: String(item.title ?? ""),
                description: String(item.tagline ?? ""),
                url: `/go/${encodeURIComponent(String(item.slug ?? ""))}`,
                displayUrl: String(item.host ?? ""),
                totalPaid: totalUsd,
                nextBidPrice: rank === 1 ? Math.max(10, totalUsd + 5) : totalUsd + 1,
                category: String(item.category ?? "Other"),
                discount: String(item.discount ?? ""),
                couponCode: String(item.coupon_code ?? ""),
                clicks: Number(item.clicks ?? 0),
                timeAgo: "Verified",
              };
            })
          );
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [activeBoard]);

  const filteredDeals = deals.filter((d) => {
    if (selectedCategory !== "All" && !d.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    if (activeBoard === "deals") return Boolean(d.discount);
    return true;
  });

  const handleClaim = (deal?: DealItem) => {
    setTargetDeal(deal || null);
    setPrefilledData({ url: "", category: deal ? deal.category : "SaaS & Web Apps", amount: deal ? deal.nextBidPrice : topBidUsd });
    setIsModalOpen(true);
  };

  const handleInstantClaim = (url: string, category: string, amount: number) => {
    setTargetDeal(null);
    setPrefilledData({ url, category, amount: currency === "INR" ? Math.round(amount / 88) : amount });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 antialiased selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => handleClaim()} />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <HeroClaimBar currency={currency} topBidPrice={deals[0]?.nextBidPrice || topBidUsd} onInstantClaim={handleInstantClaim} />

        {!isLiveDb && (
          <div className="mt-4 mx-auto max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-300">
            DEMO PREVIEW · Showing sample listings until Supabase keys are connected in .env.local.
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-neutral-800 bg-[#0c0c0c] p-1 text-xs flex-wrap justify-center">
            {[
              { id: "all-time", label: "All-time" },
              { id: "rising", label: "Rising Stars" },
              { id: "deals", label: "Black Friday Deals" },
              { id: "today", label: "Today (UTC)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveBoard(tab.id as "all-time" | "rising" | "deals" | "today")}
                className={`rounded-full px-3.5 py-1.5 font-medium transition ${
                  activeBoard === tab.id ? "bg-white text-black font-bold shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeBoard === "deals" && <CountdownTimer />}

        <div className="mt-6 flex items-center gap-2 overflow-x-auto py-2 border-b border-neutral-900 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat ? "bg-neutral-800 text-white font-semibold" : "bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 space-y-3">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} currency={currency} onClaim={handleClaim} />
            ))}
          </section>
          <aside className="lg:col-span-4 lg:sticky lg:top-20 h-fit space-y-4">
            <LiveActivitySidebar />
          </aside>
        </div>

        <section className="mt-16 border-t border-neutral-900 pt-10 pb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
            {isLiveDb ? "Verified Live Platform Stats" : "Sample Preview Stats"}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-4">
              <div className="font-mono text-2xl font-black text-white">{isLiveDb ? liveStats.clicks.toLocaleString() : 0}</div>
              <div className="text-[11px] text-neutral-500 mt-1">Outbound Clicks</div>
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-4">
              <div className="font-mono text-2xl font-black text-emerald-400">${isLiveDb ? liveStats.totalUsd.toLocaleString() : 0}</div>
              <div className="text-[11px] text-neutral-500 mt-1">Total Paid Volume</div>
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-4">
              <div className="font-mono text-2xl font-black text-white">{isLiveDb ? liveStats.listings : 0}</div>
              <div className="text-[11px] text-neutral-500 mt-1">Listed Products</div>
            </div>
          </div>
        </section>
      </main>

      <ClaimModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetDeal={targetDeal}
        initialUrl={prefilledData.url}
        initialCategory={prefilledData.category}
        initialAmount={prefilledData.amount}
        currency={currency}
      />
      <Footer />
    </div>
  );
}