"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Copy, Check, MousePointerClick, ShieldCheck } from "lucide-react";
import { DealItem } from "@/lib/mock-data";

interface DealCardProps {
  deal: DealItem;
  currency: "USD" | "INR";
  onClaim: (deal: DealItem) => void;
}

export default function DealCard({ deal, currency, onClaim }: DealCardProps) {
  const [copied, setCopied] = useState(false);
  const symbol = currency === "INR" ? "₹" : "$";
  const multiplier = currency === "INR" ? 85 : 1;

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(deal.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Favicon API for real brand icons
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${deal.displayUrl}&sz=128`;

  return (
    <div className="group relative rounded-xl border border-neutral-800/80 bg-[#0a0a0a] p-4 sm:p-5 transition-all hover:border-neutral-700 hover:bg-[#0e0e0e] hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Favicon + Rank + Info */}
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Brand Favicon / Logo */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-inner">
            <img
              src={faviconUrl}
              alt={deal.title}
              className="h-6 w-6 object-contain"
              onError={(e) => {
                // Fallback letter if icon fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="absolute bottom-0 right-0 rounded-tl bg-neutral-800 px-1 font-mono text-[9px] font-bold text-neutral-300">
              #{deal.rank}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={deal.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="font-semibold text-neutral-100 hover:text-white transition flex items-center gap-1.5 truncate"
              >
                <span>{deal.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              </a>
              <span className="inline-flex items-center gap-1 rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified
              </span>
            </div>

            <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2">
              {deal.description}
            </p>

            {/* Badges: Discount, Coupon, Clicks */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {deal.discount && (
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  {deal.discount}
                </span>
              )}

              {deal.couponCode && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-800 transition"
                >
                  <span>Code: <strong>{deal.couponCode}</strong></span>
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-500" />}
                </button>
              )}

              <span className="text-neutral-500 text-[11px]">· {deal.timeAgo}</span>
              <span className="text-neutral-400 font-mono text-[11px]">· {deal.displayUrl}</span>
              <span className="flex items-center gap-1 text-neutral-500 text-[11px]">
                · <MousePointerClick className="w-3 h-3" /> {deal.clicks} clicks
              </span>
            </div>
          </div>
        </div>

        {/* Right: Paid Amount & Action CTA */}
        <div className="flex flex-col items-end shrink-0 gap-2">
          <div className="font-mono text-base sm:text-lg font-black text-emerald-400">
            {symbol}{(deal.totalPaid * multiplier).toLocaleString()}
          </div>
          <button
            onClick={() => onClaim(deal)}
            className="rounded-lg bg-neutral-100 hover:bg-white px-3 py-1.5 text-xs font-bold text-neutral-950 transition active:scale-95 shadow-sm"
          >
            Claim rank for {symbol}{(deal.nextBidPrice * multiplier).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}