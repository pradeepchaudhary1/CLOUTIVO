import { NextResponse } from "next/server";
import Stripe from "stripe";
import { abs, SITE } from "@/lib/config";
import { createPendingOrder, parseClaim, prepareClaim, setOrderRef } from "@/lib/orders";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`co:${clientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "Card payments are not configured yet." }, { status: 503 });

  const parsed = parseClaim(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json(parsed, { status: 400 });

  try {
    const prep = await prepareClaim(parsed.data);
    if (!prep.ok) return NextResponse.json(prep, { status: 400 });
    const p = prep.p;
    const { orderId } = await createPendingOrder(p, "stripe");

    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: orderId,
      metadata: { order_id: orderId, slug: p.slug },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: p.chargeCents,
            product_data: {
              name: `${SITE.name} rank: ${p.title}`,
              description: p.isNew ? "New listing on the public leaderboard" : "Raise an existing rank",
            },
          },
        },
      ],
      success_url: abs(`/product/${encodeURIComponent(p.slug)}?paid=1`),
      cancel_url: abs("/?canceled=1"),
    });
    await setOrderRef(orderId, session.id);
    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("[checkout/stripe]", e);
    return NextResponse.json({ ok: false, error: "Could not start card checkout." }, { status: 500 });
  }
}
