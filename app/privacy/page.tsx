"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency="USD" setCurrency={() => {}} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-3xl px-4 py-12 text-neutral-300 text-sm leading-relaxed space-y-6">
        <div className="border-b border-neutral-900 pb-6">
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-neutral-500 mt-1">Effective Date: November 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            We keep data collection minimal. We only process the submitted public website URL, product title, category, and payment confirmation IDs. Sensitive card details are processed directly by our payment processor (Razorpay) and never stored on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Public Information</h2>
          <p>
            Information submitted for ranking (product name, website link, discount coupon, and bid amount) is publicly displayed on the leaderboard for visitors and search engines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Cookies & Analytics</h2>
          <p>
            We use minimal, privacy-compliant cookies strictly necessary to maintain live ranking integrity, prevent click manipulation, and observe aggregate traffic.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}