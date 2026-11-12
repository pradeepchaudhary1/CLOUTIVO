"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is CLOUTIVO?",
      a: "CLOUTIVO is a public pay-to-rank leaderboard for software, startups, agencies, and creator profiles. There are no algorithms, review queues, or ad bidding auctions. Rank is strictly determined by verified spend.",
    },
    {
      q: "How does ranking and taking #1 work?",
      a: "New listings start at $10. Taking first place (#1) requires paying at least $5 more than whoever currently tops the board. Taking any other rank requires just $1 above that rank's amount.",
    },
    {
      q: "Can I raise my rank later without paying from scratch?",
      a: "Yes! If another founder outranks you, simply submit the exact same website URL or @handle. You only pay the difference amount between your current total and the new target rank.",
    },
    {
      q: "Do I get a real DoFollow SEO backlink?",
      a: "Yes. Unlike social networks or ad platforms that mask links behind redirects, CLOUTIVO gives your website a direct, permanent, high-authority DoFollow backlink indexed by search engines and generative AI agents.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support instant 1-click UPI (Google Pay, PhonePe, Paytm, BHIM, QR code) for Indian founders, as well as all major domestic and international Credit and Debit cards.",
    },
    {
      q: "Are payments refundable?",
      a: "No. All transactions are final and non-refundable because ranking placement and link indexing commence immediately upon verified checkout.",
    },
    {
      q: "What cannot be listed on CLOUTIVO?",
      a: "We strictly prohibit adult/NSFW content, Telegram/WhatsApp group chat invite links, deceptive affiliate redirect cloakers, malware, and unlicensed gambling.",
    },
    {
      q: "How do Categories work?",
      a: "Every listing is assigned to a category (e.g. AI Agents, SaaS, Dev Tools, Marketing, Agencies). Your listing competes simultaneously on the main All-time board and inside your specific Category directory.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency="USD" setCurrency={() => {}} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="border-b border-neutral-900 pb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Frequently Asked Questions</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Everything you need to know about CLOUTIVO rankings, DoFollow backlinks, and bidding rules.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800/80 bg-[#0a0a0a] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm text-neutral-100 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}