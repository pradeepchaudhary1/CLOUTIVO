import { NextResponse } from "next/server";
import { createPendingOrder, parseClaim, prepareClaim } from "@/lib/orders";
import { fulfilOrder } from "@/lib/fulfil";

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "ADMIN_SECRET is not set in .env.local" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || String(body.adminSecret ?? "") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized: Wrong Admin Secret" }, { status: 401 });
  }

  const parsed = parseClaim(body);
  if (!parsed.ok) return NextResponse.json(parsed, { status: 400 });

  try {
    const prep = await prepareClaim(parsed.data);
    if (!prep.ok) return NextResponse.json(prep, { status: 400 });

    const { orderId, providerAmount } = await createPendingOrder(prep.p, "razorpay");
    const fakePayId = `admin_grant_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const res = await fulfilOrder(orderId, "razorpay", fakePayId, providerAmount);

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Failed to rank (${res.reason})` }, { status: 409 });
    }
    return NextResponse.json({ ok: true, slug: res.slug });
  } catch (e) {
    console.error("[admin/rank]", e);
    return NextResponse.json({ ok: false, error: "Server error while ranking." }, { status: 500 });
  }
}