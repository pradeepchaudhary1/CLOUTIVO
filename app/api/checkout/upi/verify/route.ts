import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { fulfilOrder } from "@/lib/fulfil";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Called right after Razorpay Checkout succeeds in the browser. The signature proves the payment
 * belongs to our Razorpay order, so the rank updates instantly. The webhook is the backup path.
 */
export async function POST(req: Request) {
  if (!rateLimit(`verify:${clientIp(req)}`, 30, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const orderId = String(b?.orderId ?? "");
  const paymentId = String(b?.razorpay_payment_id ?? "");
  const rzpOrderId = String(b?.razorpay_order_id ?? "");
  const signature = String(b?.razorpay_signature ?? "");
  if (!UUID.test(orderId) || !paymentId || !rzpOrderId || !signature) {
    return NextResponse.json({ ok: false, error: "Invalid payment data." }, { status: 400 });
  }

  const expected = createHmac("sha256", secret).update(`${rzpOrderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const c = Buffer.from(signature);
  if (a.length !== c.length || !timingSafeEqual(a, c)) {
    return NextResponse.json({ ok: false, error: "Payment signature did not match." }, { status: 400 });
  }

  try {
    const { data: order, error } = await adminClient()
      .from("pending_orders")
      .select("provider_amount, provider_order_ref")
      .eq("id", orderId)
      .maybeSingle();
    if (error) throw error;
    if (!order || order.provider_order_ref !== rzpOrderId) {
      return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    }
    const res = await fulfilOrder(orderId, "razorpay", paymentId, Number(order.provider_amount));
    if (!res.ok) return NextResponse.json({ ok: false, error: `Order could not be completed (${res.reason}).` }, { status: 409 });
    return NextResponse.json({ ok: true, slug: res.slug });
  } catch (e) {
    console.error("[upi/verify]", e);
    return NextResponse.json({ ok: false, error: "Could not confirm the payment yet. It will update shortly." }, { status: 500 });
  }
}
