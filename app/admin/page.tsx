"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const MY_SITES = [
  {
    url: "https://nexusaiagency.in",
    title: "Nexus AI Agency — AI Voice & Automation",
    tagline: "Custom AI voice calling agents, chatbots, and business workflow automation.",
    category: "ai-agents",
    dollars: 50,
    discount: "Free Audit",
    couponCode: "NEXUSAI",
  },
  {
    url: "https://lumixbranding.framer.website",
    title: "Lumix Branding — Logo & Web Identity Studio",
    tagline: "Visual branding, logo systems, business cards, and high-converting web design.",
    category: "design-creative",
    dollars: 35,
    discount: "20% off",
    couponCode: "LUMIX20",
  },
  {
    url: "https://digiseller-mart.lovable.app",
    title: "DigiSeller Mart — Digital Products Store",
    tagline: "Curated digital planners, templates, and creator tools ready to download.",
    category: "ecommerce",
    dollars: 25,
    discount: "Launch Offer",
    couponCode: "DIGI25",
  },
];

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [url, setUrl] = useState(MY_SITES[0].url);
  const [title, setTitle] = useState(MY_SITES[0].title);
  const [tagline, setTagline] = useState(MY_SITES[0].tagline);
  const [category, setCategory] = useState(MY_SITES[0].category);
  const [dollars, setDollars] = useState(MY_SITES[0].dollars);
  const [discount, setDiscount] = useState(MY_SITES[0].discount);
  const [couponCode, setCouponCode] = useState(MY_SITES[0].couponCode);
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPreset = (s: (typeof MY_SITES)[0]) => {
    setUrl(s.url);
    setTitle(s.title);
    setTagline(s.tagline);
    setCategory(s.category);
    setDollars(s.dollars);
    setDiscount(s.discount);
    setCouponCode(s.couponCode);
    setStatus(null);
  };

  const handleRank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminSecret,
          url,
          title,
          tagline,
          category,
          targetCents: Math.round(dollars * 100),
          discount,
          couponCode,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus({ type: "ok", msg: `Ranked! Live at /product/${data.slug}` });
      } else {
        setStatus({ type: "err", msg: data.error || "Failed" });
      }
    } catch {
      setStatus({ type: "err", msg: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-neutral-100 p-6">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Leaderboard
        </Link>

        <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" /> Secret Admin Control
          </div>
          <h1 className="text-2xl font-black text-white">Free Direct Rank Publisher</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Rank your own websites or partner products directly in Supabase without payment.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {MY_SITES.map((s) => (
              <button
                key={s.url}
                type="button"
                onClick={() => loadPreset(s)}
                className="rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200"
              >
                Load: {new URL(s.url).hostname}
              </button>
            ))}
          </div>

          <form onSubmit={handleRank} className="mt-5 space-y-3 text-xs">
            <div>
              <label className="text-neutral-300 font-medium">Admin Secret Password *</label>
              <input type="password" required value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} placeholder="CloutivoAdmin2026" className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-neutral-300 font-medium">Website URL *</label>
              <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-neutral-300 font-medium">Title *</label>
              <input type="text" required maxLength={70} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-neutral-300 font-medium">Tagline</label>
              <input type="text" maxLength={140} value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 font-medium">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white">
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-neutral-300 font-medium">Rank Amount (USD $)</label>
                <input type="number" min={10} value={dollars} onChange={(e) => setDollars(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-sm font-bold text-emerald-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 font-medium">Discount Label</label>
                <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-neutral-300 font-medium">Coupon Code</label>
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white" />
              </div>
            </div>

            {status && (
              <div className={`rounded-lg p-3 flex items-center gap-2 ${status.type === "ok" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{status.msg}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 font-bold text-black text-sm transition">
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Publishing..." : "Publish Rank Now (Free Admin)"}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}