"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 selection:bg-neutral-800">
      <Navbar currency="USD" setCurrency={() => {}} onOpenClaim={() => {}} />

      <main className="mx-auto max-w-3xl px-4 py-12 text-neutral-300 text-sm leading-relaxed space-y-6">
        <div className="border-b border-neutral-900 pb-6">
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-xs text-neutral-500 mt-1">Effective Date: November 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Nature of Service</h2>
          <p>
            CLOUTIVO operates an attention marketplace and public product ranking board. Rankings are paid advertisements and not editorial certifications or guarantees of traffic volume. A payment secures placement according to verified spend at the time of transaction.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. No Refunds</h2>
          <p>
            All purchases are final, instant digital deliveries. Because ranking visibility, search engine indexing, and database assignment happen immediately upon payment completion, payments are strictly non-refundable under all circumstances.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Authorized Submissions</h2>
          <p>
            You warrant that you own or are authorized to represent the destination URL or profile submitted. Impersonation of other brands or deceptive submissions are subject to immediate removal without refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Removal Rights</h2>
          <p>
            CLOUTIVO reserves the right to remove any listing that breaches our prohibited content rules (such as NSFW, fraud, malware, or chat group invite links) without reimbursement.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}