"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { Grid, ArrowRight } from "lucide-react";

interface CatStat {
  category: string;
  count: number;
  top_cents: number | null;
}

export default function CategoriesPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [stats, setStats] = useState<CatStat[]>([]);
  const symbol = currency === "INR" ? "₹" : "$";
  const mult = currency === "INR" ? 88 : 1;

  useEffect(() => {
    fetch("/api/board?board=categories")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.categories)) setStats(d.categories);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency={currency} setCurrency={setCurrency} onOpenClaim={() => {}} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="border-b border-neutral-900 pb-6 mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300 mb-3">
            <Grid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Niche Marketplaces</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Categories &amp; Services</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Every category has its own independent ranking. Being #1 in a category costs only $5 more than the top listing in that category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const st = stats.find((s) => s.category === cat.slug);
            const firstUsd = st?.top_cents ? Math.round(st.top_cents / 100) + 5 : 10;
            return (
              <div key={cat.slug} className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] p-5 flex flex-col justify-between hover:border-neutral-700 transition">
                <div>
                  <h3 className="font-bold text-base text-white">{cat.name}</h3>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">{cat.blurb}</p>
                  <div className="mt-4 flex items-center justify-between text-xs border-t border-neutral-900 pt-3">
                    <span className="text-neutral-500">{st?.count ?? 0} listed</span>
                    <span className="font-mono font-bold text-emerald-400">#1 costs {symbol}{(firstUsd * mult).toLocaleString()}</span>
                  </div>
                </div>
                <Link href={`/category/${cat.slug}`} className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 py-2.5 text-xs font-bold text-white transition">
                  <span>View Category</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}