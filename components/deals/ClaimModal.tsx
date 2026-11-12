"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { DealItem } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/categories";

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDeal: DealItem | null;
  initialUrl?: string;
  initialCategory?: string;
  initialAmount?: number;
  currency?: "USD" | "INR";
}

function toCategorySlug(input?: string): string {
  if (!input) return "saas-web-apps";
  const lower = input.toLowerCase();
  const match = CATEGORIES.find(
    (c) => c.slug === lower || c.name.toLowerCase() === lower || c.name.toLowerCase().includes(lower)
  );
  return match ? match.slug : "other";
}

export default function ClaimModal({
  isOpen,
  onClose,
  targetDeal,
  initialUrl = "",
  initialCategory = "SaaS & Web Apps",
  initialAmount,
  currency = "INR",
}: ClaimModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("saas-web-apps");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState("");
  const [bidDollars, setBidDollars] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [quoteInfo, setQuoteInfo] = useState<{ rank?: number; inrPaise?: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl || "");
      setCategory(toCategorySlug(initialCategory));
      const baseUsd = initialAmount && initialAmount < 500 ? initialAmount : targetDeal ? targetDeal.nextBidPrice : 10;
      setBidDollars(Math.max(10, Math.round(baseUsd)));
      setErrorMsg("");
      setQuoteInfo(null);
    }
  }, [isOpen, initialUrl, initialCategory, initialAmount, targetDeal]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !url.trim() || bidDollars < 10) return;
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url.trim(),
            title: title.trim() || "Preview",
            tagline: tagline.trim(),
            category,
            targetCents: bidDollars * 100,
            discount: discount.trim(),
            couponCode: coupon.trim(),
          }),
        });
        const data = await res.json();
        if (data.ok) setQuoteInfo({ rank: data.rank, inrPaise: data.inrPaise });
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [isOpen, url, title, tagline, category, bidDollars, discount, coupon]);

  if (!isOpen) return null;

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePayUPI = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!url.trim() || !title.trim()) {
      setErrorMsg("Please enter both your Website URL (or @handle) and Product Title.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim(),
          tagline: tagline.trim(),
          category,
          targetCents: Math.round(bidDollars * 100),
          discount: discount.trim(),
          couponCode: coupon.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Could not start UPI checkout.");
        setLoading(false);
        return;
      }
      if (!(await loadRazorpay())) {
        setErrorMsg("Razorpay failed to load. Check internet.");
        setLoading(false);
        return;
      }
      const rzp = new (window as unknown as { Razorpay: new (o: Record<string, unknown>) => { open: () => void } }).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.rzpOrderId,
        theme: { color: "#10b981" },
        handler: async (resp: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const vRes = await fetch("/api/checkout/upi/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, ...resp }),
          });
          const vData = await vRes.json();
          if (vData.ok) {
            onClose();
            window.location.href = `/product/${encodeURIComponent(vData.slug)}?paid=1`;
          } else {
            setErrorMsg(vData.error || "Verification failed.");
          }
        },
      });
      rzp.open();
    } catch {
      setErrorMsg("Network error while starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  const inrEstimate = quoteInfo?.inrPaise ? Math.round(quoteInfo.inrPaise / 100) : bidDollars * 88;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-neutral-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">{targetDeal ? `Outbid #${targetDeal.rank} on CLOUTIVO` : "Claim a Rank on CLOUTIVO"}</h2>
        <p className="mt-1 text-xs text-neutral-400">Rank updates automatically right after verified UPI/Card payment.</p>

        <form onSubmit={handlePayUPI} className="mt-5 space-y-3">
          <div>
            <label htmlFor="c-url" className="text-xs font-medium text-neutral-300">Website URL or X @handle *</label>
            <input id="c-url" type="text" placeholder="https://yourstartup.com" value={url} onChange={(e) => setUrl(e.target.value)} required className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="c-title" className="text-xs font-medium text-neutral-300">Product / Service Title *</label>
            <input id="c-title" type="text" placeholder="MyProduct — Fast workflow..." value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={70} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="c-cat" className="text-xs font-medium text-neutral-300">Category</label>
            <select id="c-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="c-tag" className="text-xs font-medium text-neutral-300">Short Tagline</label>
            <input id="c-tag" type="text" placeholder="One sentence description" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={140} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="c-disc" className="text-xs font-medium text-neutral-300">Deal Discount</label>
              <input id="c-disc" type="text" placeholder="50% off" value={discount} onChange={(e) => setDiscount(e.target.value)} maxLength={40} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="c-code" className="text-xs font-medium text-neutral-300">Coupon Code</label>
              <input id="c-code" type="text" placeholder="CLOUT50" value={coupon} onChange={(e) => setCoupon(e.target.value)} maxLength={32} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="c-amt" className="text-xs font-medium text-neutral-300">Bid Amount (USD) — {currency === "INR" ? `≈ ₹${inrEstimate.toLocaleString()}` : `$${bidDollars}`}</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-400">$</span>
              <input id="c-amt" type="number" min={10} max={999999} value={bidDollars} onChange={(e) => setBidDollars(Number(e.target.value))} className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 font-mono text-base font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>

          {quoteInfo?.rank && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">Live Quote: Rank #{quoteInfo.rank} (Pay ₹{inrEstimate.toLocaleString()}).</div>}
          {errorMsg && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-300">{errorMsg}</div>}

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-2.5 text-xs text-neutral-400">
            <div className="flex items-center gap-2 text-emerald-400 font-medium"><ShieldCheck className="w-4 h-4" /><span>Verified Rank Placement</span></div>
          </div>

          <button type="submit" disabled={loading} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 font-bold text-black transition active:scale-95 shadow-md disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Pay ₹{inrEstimate.toLocaleString()} (${bidDollars}) via UPI / Card</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}