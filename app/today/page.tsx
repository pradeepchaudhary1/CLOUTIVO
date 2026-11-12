"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DealCard from "@/components/deals/DealCard";
import ClaimModal from "@/components/deals/ClaimModal";
import { INITIAL_DEALS } from "@/lib/mock-data";
import { Clock, Flame } from "lucide-react";

export default function TodayPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => setIsModalOpen(true)} />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Resets Tonight at 00:00 UTC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Today's Leaderboard</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Whoever spent the most since midnight UTC holds #1 today. The board resets every 24 hours.
          </p>
        </div>

        <div className="space-y-3">
          {INITIAL_DEALS.slice(0, 5).map((deal) => (
            <DealCard key={deal.id} deal={deal} currency={currency} onClaim={() => setIsModalOpen(true)} />
          ))}
        </div>
      </main>

      <Footer />
      <ClaimModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} targetDeal={INITIAL_DEALS[0]} />
    </div>
  );
}