import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { SITE } from "@/lib/config";
import { createPendingOrder, parseClaim, prepareClaim, setOrderRef } from "@/lib/orders";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`co:${clientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ ok: false, error: "UPI payments are not configured yet." }, { status: 503 });

  const parsed = parseClaim(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json(parsed, { status: 400 });

  try {
    const prep = await prepareClaim(parsed.data);
    if (!prep.ok) return NextResponse.json(prep, { status: 400 });
    const p = prep.p;
    const { orderId, providerAmount } = await createPendingOrder(p, "razorpay");

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: providerAmount, // paise, calculated on the server
      currency: "INR",
      receipt: orderId,
      notes: { order_id: orderId, slug: p.slug },
    });
    await setOrderRef(orderId, order.id);
    return NextResponse.json({
      ok: true,
      orderId,
      rzpOrderId: order.id,
      amount: providerAmount,
      currency: "INR",
      keyId, // publishable by design
      name: SITE.name,
      description: `Rank: ${p.title}`,
      slug: p.slug,
    });
  } catch (e) {
    console.error("[checkout/upi]", e);
    return NextResponse.json({ ok: false, error: "Could not start UPI checkout." }, { status: 500 });
  }
}
