import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { fulfilOrder } from "@/lib/fulfil";

type RzpEvent = {
  event: string;
  payload?: {
    order?: { entity?: { id?: string; receipt?: string; amount_paid?: number } };
    payment?: { entity?: { id?: string } };
  };
};

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  let evt: RzpEvent;
  try {
    evt = JSON.parse(raw) as RzpEvent;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (evt.event === "order.paid") {
    const order = evt.payload?.order?.entity;
    const paymentId = evt.payload?.payment?.entity?.id;
    if (order?.receipt && paymentId) {
      try {
        const res = await fulfilOrder(order.receipt, "razorpay", paymentId, Number(order.amount_paid ?? 0));
        if (!res.ok) console.error("[razorpay webhook] not fulfilled:", res.reason, order.receipt);
      } catch (e) {
        console.error("[razorpay webhook]", e);
        return NextResponse.json({ error: "temporary failure" }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ received: true });
}
