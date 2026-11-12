"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CountdownTimer from "@/components/deals/CountdownTimer";
import DealCard from "@/components/deals/DealCard";
import ClaimModal from "@/components/deals/ClaimModal";
import { INITIAL_DEALS } from "@/lib/mock-data";
import { Tag } from "lucide-react";

export default function DealsPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sirf active discounts wale products
  const activeDeals = INITIAL_DEALS.filter((d) => Boolean(d.discount));

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => setIsModalOpen(true)} />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Black Friday & Cyber Deals Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Startup Deals & Promo Codes</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Exclusive discounts and lifetime deals ranked by verified seller spend. All deals must provide a working promo code.
          </p>
        </div>

        <CountdownTimer />

        <div className="mt-6 space-y-3">
          {activeDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} currency={currency} onClaim={() => setIsModalOpen(true)} />
          ))}
        </div>
      </main>

      <Footer />
      <ClaimModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} targetDeal={activeDeals[0]} />
    </div>
  );
}