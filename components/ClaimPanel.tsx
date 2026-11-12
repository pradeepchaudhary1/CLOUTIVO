"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { priceForFirst } from "@/lib/pricing";
import { inr, usd } from "@/lib/format";
import type { Methods } from "@/lib/payments";

type Quote =
  | {
      ok: true;
      slug: string;
      isNew: boolean;
      title: string | null;
      currentCents: number | null;
      chargeCents: number;
      inrPaise: number;
      rank: number;
      categoryRank: number;
      firstPriceCents: number;
      categoryFirstPriceCents: number;
    }
  | { ok: false; error: string };

type RzpHandlerResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RzpCtor = new (o: Record<string, unknown>) => { open(): void; on(e: string, cb: (r: { error?: { description?: string } }) => void): void };

type Props = {
  topCents: number | null;
  methods: Methods;
  defaultCategory?: string;
  /** Raise mode: the URL is fixed and only the amount changes. */
  fixed?: { url: string; title: string; currentCents: number; category: string };
};

function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`) && (window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ClaimPanel({ topCents, methods, defaultCategory = "other", fixed }: Props) {
  const router = useRouter();
  const initialAmount = fixed ? Math.ceil(fixed.currentCents / 100) + 5 : Math.ceil(priceForFirst(topCents) / 100);
  const [url, setUrl] = useState(fixed?.url ?? "");
  const [title, setTitle] = useState(fixed?.title ?? "");
  const [tagline, setTagline] = useState("");
  const [discount, setDiscount] = useState("");
  const [coupon, setCoupon] = useState("");
  const [category, setCategory] = useState(fixed?.category ?? defaultCategory);
  const [amount, setAmount] = useState(String(initialAmount));
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [busy, setBusy] = useState<"upi" | "card" | null>(null);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const targetCents = Math.round(Number(amount) * 100);

  function refresh(next: { url: string; amount: string; category: string; title: string }) {
    if (timer.current) clearTimeout(timer.current);
    const cents = Math.round(Number(next.amount) * 100);
    if (!next.url.trim() || !Number.isFinite(cents) || cents <= 0) {
      seq.current++;
      setQuote(null);
      setQuoting(false);
      return;
    }
    setQuoting(true);
    const mine = ++seq.current;
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: next.url, targetCents: cents, category: next.category, title: next.title }),
        });
        const j = (await r.json()) as Quote;
        if (mine === seq.current) setQuote(j);
      } catch {
        if (mine === seq.current) setQuote({ ok: false, error: "Could not reach the server. Check your connection." });
      } finally {
        if (mine === seq.current) setQuoting(false);
      }
    }, 350);
  }

  // Pre-fill from links like /#bid-1700600 (the "Outrank for $X" buttons).
  useEffect(() => {
    const apply = () => {
      const m = /^#bid-(\d+)$/.exec(window.location.hash);
      if (!m) return;
      const dollars = String(Math.ceil(Number(m[1]) / 100));
      setAmount(dollars);
      document.getElementById("claim")?.scrollIntoView({ behavior: "auto", block: "start" });
      document.getElementById("claim-url")?.focus({ preventScroll: true });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const body = () => JSON.stringify({ url, title, tagline, category, targetCents, discount, couponCode: coupon });
  const ready = quote?.ok === true && !(quote.isNew && title.trim().length < 2);

  async function payCard() {
    setBusy("card");
    setError("");
    try {
      const r = await fetch("/api/checkout/stripe", { method: "POST", headers: { "Content-Type": "application/json" }, body: body() });
      const j = await r.json();
      if (j.ok && j.url) window.location.assign(j.url);
      else setError(j.error ?? "Could not start card checkout.");
    } catch {
      setError("Network error. Nothing was charged.");
    } finally {
      setBusy(null);
    }
  }

  async function payUpi() {
    setBusy("upi");
    setError("");
    try {
      const r = await fetch("/api/checkout/upi", { method: "POST", headers: { "Content-Type": "application/json" }, body: body() });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error ?? "Could not start UPI checkout.");
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const Razorpay = (window as unknown as { Razorpay?: RzpCtor }).Razorpay;
      if (!loaded || !Razorpay) throw new Error("Could not load the payment window. Check your connection.");

      const rzp = new Razorpay({
        key: j.keyId,
        order_id: j.rzpOrderId,
        amount: j.amount,
        currency: j.currency,
        name: j.name,
        description: j.description,
        theme: { color: "#10b981" },
        handler: async (resp: RzpHandlerResponse) => {
          try {
            const v = await fetch("/api/checkout/upi/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: j.orderId, ...resp }),
            });
            const vj = await v.json();
            router.push(`/product/${encodeURIComponent(vj.slug ?? j.slug)}?paid=1`);
            router.refresh();
          } catch {
            router.push(`/product/${encodeURIComponent(j.slug)}?paid=1`);
          }
        },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.on("payment.failed", (e) => {
        setError(e.error?.description ?? "The payment failed. Nothing was charged.");
        setBusy(null);
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start UPI checkout.");
      setBusy(null);
    }
  }

  const q = quote?.ok ? quote : null;
  const setAndQuote = (patch: Partial<{ url: string; amount: string; category: string; title: string }>) => {
    const next = { url, amount, category, title, ...patch };
    refresh(next);
  };

  return (
    <section className="panel" id="claim" aria-labelledby="claim-h" tabIndex={-1}>
      <h2 id="claim-h" className="panel-h">{fixed ? `Raise the rank of ${fixed.title}` : "Claim your spot"}</h2>
      <div className="fields">
        <div className="field">
          <label htmlFor="claim-url">{fixed ? "Listing address" : "Website URL or X handle"}</label>
          <input
            id="claim-url"
            value={url}
            readOnly={Boolean(fixed)}
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="yourproduct.com or @yourhandle"
            onChange={(e) => { setUrl(e.target.value); setAndQuote({ url: e.target.value }); }}
          />
        </div>
        {!fixed && (
          <>
            <div className="field">
              <label htmlFor="claim-title">Product name</label>
              <input id="claim-title" value={title} maxLength={70} placeholder="Acme AI" onChange={(e) => { setTitle(e.target.value); }} />
            </div>
            <div className="field">
              <label htmlFor="claim-tag">Tagline <span className="muted">(optional)</span></label>
              <input id="claim-tag" value={tagline} maxLength={140} placeholder="Turn ideas into working apps" onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="claim-cat">Category</label>
              <select id="claim-cat" value={category} onChange={(e) => { setCategory(e.target.value); setAndQuote({ category: e.target.value }); }}>
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="claim-discount">Deal for visitors <span className="muted">(optional)</span></label>
              <input id="claim-discount" value={discount} maxLength={40} placeholder="30% off the first project" onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="claim-coupon">Coupon code <span className="muted">(must really work)</span></label>
              <input id="claim-coupon" value={coupon} maxLength={32} autoCapitalize="characters" placeholder="CLOUT30" onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="claim-amount">{fixed ? `New total for this listing (now ${usd(fixed.currentCents)})` : "Amount in US dollars"}</label>
          <div className="money-input">
            <span aria-hidden="true">$</span>
            <input
              id="claim-amount"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setAndQuote({ amount: e.target.value }); }}
            />
          </div>
          <div className="quick">
            {q && (
              <>
                <button type="button" className="chip" onClick={() => { const v = String(Math.ceil(q.firstPriceCents / 100)); setAmount(v); setAndQuote({ amount: v }); }}>
                  Overall #1 · {usd(q.firstPriceCents)}
                </button>
                <button type="button" className="chip" onClick={() => { const v = String(Math.ceil(q.categoryFirstPriceCents / 100)); setAmount(v); setAndQuote({ amount: v }); }}>
                  Category #1 · {usd(q.categoryFirstPriceCents)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="quote" aria-live="polite" aria-busy={quoting}>
        {!quote && !quoting && <p className="muted">Enter your address and an amount to see the exact price and the rank it buys.</p>}
        {quoting && <p className="muted">Calculating…</p>}
        {!quoting && quote && !quote.ok && <p className="err">{quote.error}</p>}
        {!quoting && q && (
          <>
            <p className="quote-main">
              You pay <strong>{usd(q.chargeCents)}</strong> <span className="muted">({inr(q.inrPaise)} by UPI)</span>
            </p>
            <p>
              That puts {q.isNew ? "your new listing" : <strong>{q.title}</strong>} at <strong>#{q.rank}</strong> overall and <strong>#{q.categoryRank}</strong> in its category.
              {!q.isNew && q.currentCents !== null && <> It already holds {usd(q.currentCents)}; you only pay the difference.</>}
            </p>
            {q.isNew && title.trim().length < 2 && <p className="err">Add a product name to continue.</p>}
          </>
        )}
      </div>

      {error && <p className="err" role="alert">{error}</p>}

      {!methods.upi && !methods.card ? (
        <p className="note">Payments are being activated. Check back shortly.</p>
      ) : (
        <div className="pay">
          {methods.upi && (
            <button type="button" className="btn btn-ink" disabled={!ready || busy !== null} aria-busy={busy === "upi"} onClick={payUpi}>
              {busy === "upi" ? "Opening UPI…" : q ? `Pay ${inr(q.inrPaise)} with UPI` : "Pay with UPI"}
            </button>
          )}
          {methods.card && (
            <button type="button" className="btn btn-accent" disabled={!ready || busy !== null} aria-busy={busy === "card"} onClick={payCard}>
              {busy === "card" ? "Opening checkout…" : q ? `Pay ${usd(q.chargeCents)} by card` : "Pay by card"}
            </button>
          )}
        </div>
      )}
      <p className="fine">Payments are final. Your link is public and marked sponsored. Adult content, chat invites and link shorteners are not allowed.</p>
    </section>
  );
}
