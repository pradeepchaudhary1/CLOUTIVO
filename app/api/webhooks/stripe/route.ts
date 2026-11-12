import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfilOrder } from "@/lib/fulfil";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const raw = await req.text(); // raw body is required for signature verification
  let event: Stripe.Event;
  try {
    event = new Stripe(key).webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object as Stripe.Checkout.Session;
    const orderId = s.metadata?.order_id;
    if (orderId && s.payment_status === "paid") {
      try {
        const ref = typeof s.payment_intent === "string" ? s.payment_intent : s.id;
        const res = await fulfilOrder(orderId, "stripe", ref, s.amount_total ?? 0);
        if (!res.ok) console.error("[stripe webhook] not fulfilled:", res.reason, orderId);
      } catch (e) {
        console.error("[stripe webhook]", e);
        return NextResponse.json({ error: "temporary failure" }, { status: 500 }); // Stripe retries
      }
    }
  }
  return NextResponse.json({ received: true });
}
