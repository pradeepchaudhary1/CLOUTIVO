"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency="USD" setCurrency={() => {}} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="border-b border-neutral-900 pb-8">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Transparent Attention Market
          </span>
          <h1 className="mt-2 text-4xl font-black text-white">The Rules of CLOUTIVO</h1>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            CLOUTIVO is a public product and service leaderboard. There are no advertising algorithms, no hidden revenue shares, and no review queues. Rank is what you pay — nothing else.
          </p>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-neutral-300">
          {/* Section 1: The Boards */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">01.</span> The Boards & Time Windows
            </h2>
            <p>One payment ranks you across all boards that include your spend:</p>
            <ul className="space-y-2 list-disc pl-5 text-neutral-400">
              <li><strong className="text-white">All-time Board:</strong> The main permanent board. Your rank is the cumulative amount you have ever paid. It never expires.</li>
              <li><strong className="text-white">Today Board:</strong> Current UTC calendar day (00:00 to 23:59 UTC). Resets every day at midnight UTC.</li>
              <li><strong className="text-white">Daily Archives:</strong> Every past day freezes into an immutable public archive with its #1 winner awarded.</li>
              <li><strong className="text-white">Deals Board:</strong> Dedicated to software, apps, and services offering discounts and promo codes.</li>
            </ul>
          </section>

          {/* Section 2: How Ranking Works */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">02.</span> How Ranking & Outbidding Works
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-neutral-400">
              <li><strong className="text-white">Minimum Bid:</strong> New listings start at $10 (₹850) with maximum bids up to $999,999.</li>
              <li><strong className="text-white">Taking #1 Spot:</strong> You must bid at least <span className="text-emerald-400 font-bold">$5 (₹425) more</span> than the current #1 leader.</li>
              <li><strong className="text-white">Taking Other Ranks:</strong> Any position below #1 requires just $1 (₹85) more than the target listing.</li>
              <li><strong className="text-white">Pay Only the Difference:</strong> If you get outranked, simply enter the same URL or @handle again. You only pay the difference amount to reclaim your position!</li>
              <li><strong className="text-white">Tie-Breaker Rule:</strong> If two listings have identical amounts, the older listing (first to pay) keeps the higher rank.</li>
            </ul>
          </section>

          {/* Section 3: Allowed vs Prohibited Content */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">03.</span> What You Can List
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/10 p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Allowed Listings</span>
                </div>
                <ul className="space-y-1 text-xs text-neutral-400">
                  <li>• SaaS & Web Applications</li>
                  <li>• AI Agents & Developer Tools</li>
                  <li>• Digital Agencies & Consultancies</li>
                  <li>• E-commerce, Apps, and Creators</li>
                  <li>• Verified X (@handle) profiles</li>
                </ul>
              </div>

              <div className="rounded-xl border border-red-950/60 bg-red-950/10 p-4">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Strictly Prohibited</span>
                </div>
                <ul className="space-y-1 text-xs text-neutral-400">
                  <li>• Adult/NSFW or illegal content</li>
                  <li>• Chat invite links (Telegram, WhatsApp)</li>
                  <li>• Affiliate/Tracking redirect cloaks</li>
                  <li>• Malicious phishing or scam links</li>
                  <li>• Fake company representations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Refund Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">04.</span> Payments & No-Refund Policy
            </h2>
            <p className="text-neutral-400">
              Ranking placement is an immediate digital advertising delivery. All payments are final and non-refundable. Getting outranked later, drops on the Today board at midnight UTC, or subjective click outcomes do not qualify for refunds.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-black transition hover:bg-neutral-200"
          >
            <span>Back to Live Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}