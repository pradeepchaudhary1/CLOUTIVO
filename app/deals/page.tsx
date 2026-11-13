"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CountdownTimer from "@/components/deals/CountdownTimer";
import DealCard from "@/components/deals/DealCard";
import ClaimModal from "@/components/deals/ClaimModal";
import { DealItem } from "@/lib/mock-data";
import { Tag } from "lucide-react";

export default function DealsPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDeal, setTargetDeal] = useState<DealItem | null>(null);

  useEffect(() => {
    fetch("/api/board?board=deals")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.listings)) {
          setDeals(
            d.listings.map((item: Record<string, unknown>, idx: number) => {
              const totalUsd = Math.round(Number(item.total_cents ?? 0) / 100);
              const rank = Number(item.rank ?? idx + 1);
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
                timeAgo: "Verified Deal",
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
        <div className="border-b border-neutral-900 pb-6 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Black Friday &amp; Cyber Deals Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Startup Deals &amp; Promo Codes</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Active discounts and lifetime deals ranked by verified spend.
          </p>
        </div>

        <CountdownTimer />

        {deals.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-10 text-center">
            <p className="text-sm text-neutral-300 font-semibold">No deals listed yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black">
              Add First Deal
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
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