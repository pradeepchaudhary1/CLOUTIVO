"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DealCard from "@/components/deals/DealCard";
import ClaimModal from "@/components/deals/ClaimModal";
import { DealItem } from "@/lib/mock-data";
import { Clock } from "lucide-react";

export default function TodayPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDeal, setTargetDeal] = useState<DealItem | null>(null);

  useEffect(() => {
    fetch("/api/board?board=today")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.listings)) {
          setDeals(
            d.listings.map((item: Record<string, unknown>, idx: number) => {
              const totalUsd = Math.round(Number(item.total_cents ?? 0) / 100);
              const rank = Number(item.day_rank ?? idx + 1);
              return {
                id: String(item.slug ?? idx),
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
                timeAgo: "Today (UTC)",
              };
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => { setTargetDeal(null); setIsModalOpen(true); }} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Resets Tonight at 00:00 UTC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Today&apos;s Leaderboard</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Whoever spent the most since midnight UTC holds #1 today. Resets every 24 hours.
          </p>
        </div>

        {deals.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-10 text-center">
            <p className="text-sm text-neutral-300 font-semibold">No paid listings yet today (UTC).</p>
            <p className="text-xs text-neutral-500 mt-1">Pay $10 to claim today&apos;s #1 spot first!</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black">
              Claim Today&apos;s #1
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} currency={currency} onClaim={(d) => { setTargetDeal(d); setIsModalOpen(true); }} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ClaimModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} targetDeal={targetDeal} currency={currency} />
    </div>
  );
}