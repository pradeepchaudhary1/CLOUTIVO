import { adminClient } from "./supabase";
import { CATEGORY_SLUGS } from "./categories";
import { cleanText, normalizeListingUrl, UrlError } from "./url";
import { computeCharge, toPaise } from "./pricing";
import { currentTotal } from "./db";

export type ClaimInput = {
  url: string;
  title: string;
  tagline: string;
  category: string;
  targetCents: number;
  discount: string;
  couponCode: string;
};

export function parseClaim(body: unknown): { ok: true; data: ClaimInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  const b = body as Record<string, unknown>;
  const category = String(b.category ?? "other");
  if (!CATEGORY_SLUGS.has(category)) return { ok: false, error: "Choose a category." };
  const targetCents = Number(b.targetCents);
  if (!Number.isFinite(targetCents)) return { ok: false, error: "Enter an amount." };
  return {
    ok: true,
    data: {
      url: String(b.url ?? ""),
      title: cleanText(b.title, 70),
      tagline: cleanText(b.tagline, 140),
      category,
      targetCents: Math.round(targetCents),
      discount: cleanText(b.discount, 40),
      couponCode: String(b.couponCode ?? "").trim().toUpperCase().slice(0, 32),
    },
  };
}

export type Prepared = {
  slug: string;
  url: string;
  host: string;
  title: string;
  tagline: string;
  category: string;
  discount: string | null;
  couponCode: string | null;
  chargeCents: number;
  isNew: boolean;
  currentCents: number | null;
};

/** Validates everything and calculates the price from the database. Never trusts the browser. */
export async function prepareClaim(input: ClaimInput): Promise<{ ok: true; p: Prepared } | { ok: false; error: string }> {
  let n;
  try {
    n = normalizeListingUrl(input.url);
  } catch (e) {
    return { ok: false, error: e instanceof UrlError ? e.message : "Invalid URL." };
  }
  const existing = await currentTotal(n.slug);
  const charge = computeCharge(existing ? existing.total_cents : null, input.targetCents);
  if (!charge.ok) return charge;

  if (!existing && input.title.length < 2) return { ok: false, error: "Add a product name (2+ characters)." };
  if (input.couponCode && !/^[A-Z0-9_-]{2,32}$/.test(input.couponCode))
    return { ok: false, error: "Coupon codes use letters, numbers, - and _ only (2-32 characters)." };
  const hasDeal = !existing && Boolean(input.couponCode || input.discount);

  return {
    ok: true,
    p: {
      slug: n.slug,
      url: existing?.url ?? n.url,
      host: n.host,
      // Existing listings keep their title/tagline/category: nobody can deface a rank by paying for it.
      title: existing?.title ?? input.title,
      tagline: existing ? existing.tagline : input.tagline,
      category: existing?.category ?? input.category,
      discount: hasDeal ? input.discount || "Discount code" : null,
      couponCode: hasDeal && input.couponCode ? input.couponCode : null,
      chargeCents: charge.chargeCents,
      isNew: charge.isNew,
      currentCents: existing ? existing.total_cents : null,
    },
  };
}

export async function createPendingOrder(p: Prepared, provider: "stripe" | "razorpay") {
  const providerAmount = provider === "stripe" ? p.chargeCents : toPaise(p.chargeCents);
  const { data, error } = await adminClient()
    .from("pending_orders")
    .insert({
      slug: p.slug,
      url: p.url,
      host: p.host,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      discount: p.discount,
      coupon_code: p.couponCode,
      charge_cents: p.chargeCents,
      provider,
      provider_amount: providerAmount,
      provider_currency: provider === "stripe" ? "usd" : "inr",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { orderId: data.id as string, providerAmount };
}

export async function setOrderRef(orderId: string, ref: string) {
  const { error } = await adminClient().from("pending_orders").update({ provider_order_ref: ref }).eq("id", orderId);
  if (error) throw new Error(error.message);
}
