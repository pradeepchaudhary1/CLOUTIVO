"use client";

import { useState } from "react";
import { ArrowRight, Flame, Layers } from "lucide-react";

const ALL_CATEGORIES_AND_SERVICES = [
  "SaaS & Web Apps",
  "AI Agents & Tech",
  "Developer Tools",
  "Marketing & SEO",
  "Agencies & Services",
  "E-Commerce & Retail",
  "Design & Creative",
  "Productivity & Tools",
  "Finance & Crypto",
  "Health & Lifestyle",
  "Directories & Portals",
  "Other Services",
];

interface HeroClaimBarProps {
  currency: "USD" | "INR";
  topBidPrice: number;
  onInstantClaim: (url: string, category: string, amount: number) => void;
}

export default function HeroClaimBar({ currency, topBidPrice, onInstantClaim }: HeroClaimBarProps) {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  const symbol = currency === "INR" ? "₹" : "$";
  const displayAmount = currency === "INR" ? topBidPrice * 85 : topBidPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onInstantClaim(url, category || "SaaS & Web Apps", displayAmount);
  };

  return (
    <div className="mx-auto max-w-3xl text-center pt-6 pb-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-4 shadow-sm">
        <Flame className="w-3.5 h-3.5 text-emerald-400" />
        <span>Pay to stand above everyone else · Live Public Board</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
        Claim #1 for{" "}
        <span className="font-mono text-emerald-400 bg-emerald-950/40 px-3 py-0.5 rounded-xl border border-emerald-500/20 shadow-inner">
          {symbol}{displayAmount.toLocaleString()}
        </span>
      </h1>
      <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
        List your website, app, or service. Gain permanent DoFollow backlinks, high-intent founder traffic, and verified rank.
      </p>

      {/* Action Bar */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-2 shadow-2xl transition-all focus-within:border-neutral-700"
      >
        <input
          type="text"
          placeholder="Website URL or X @handle"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full flex-1 rounded-xl bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none"
        />

        <div className="flex w-full sm:w-auto items-center gap-2">
          {/* Category & Service Dropdown with Icon */}
          <div className="relative w-full sm:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs font-medium text-neutral-200 focus:border-neutral-600 focus:outline-none cursor-pointer pr-8"
            >
              <option value="" disabled>Select Category / Service ▾</option>
              {ALL_CATEGORIES_AND_SERVICES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold transition active:scale-95 shadow-md"
          >
            <span>Claim rank</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}