"use client";

import { useEffect, useState } from "react";
import { Activity, Flame, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  slug: string;
  title: string;
  amount_cents: number;
  created_at: string;
}

export default function LiveActivitySidebar() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetch("/api/board?board=all-time")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.activity)) setItems(d.activity);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-neutral-800/80 bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-tight text-white uppercase">Live Activity</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">Verified</span>
        </div>

        <div className="mt-3 divide-y divide-neutral-900">
          {items.length === 0 ? (
            <p className="py-4 text-xs text-neutral-500 text-center">
              No verified bids yet. Claim #1 to appear here first!
            </p>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.slug}-${idx}`} className="py-2.5 flex items-center justify-between text-xs">
                <Link href={`/product/${encodeURIComponent(item.slug)}`} className="font-semibold text-neutral-200 hover:text-white truncate pr-2">
                  {item.title}
                </Link>
                <span className="font-mono font-bold text-emerald-400 shrink-0">
                  ${Math.round(item.amount_cents / 100)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Why List on CLOUTIVO?</span>
        </div>
        <ul className="mt-2 space-y-1.5 text-xs text-neutral-400">
          <li>✓ Instant UPI & Card checkout</li>
          <li>✓ Dedicated product page & click tracking</li>
          <li>✓ Pay only the difference when outbidding</li>
        </ul>
        <Link href="/about" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline">
          <span>See how CLOUTIVO works</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}