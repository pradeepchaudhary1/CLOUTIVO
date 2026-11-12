import { NextResponse } from "next/server";
import { parseClaim, prepareClaim } from "@/lib/orders";
import { getTopTotal, rankIfPaid } from "@/lib/db";
import { priceForFirst, toPaise } from "@/lib/pricing";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`quote:${clientIp(req)}`, 60, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Wait a minute." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = parseClaim(body);
  if (!parsed.ok) return NextResponse.json(parsed, { status: 400 });

  try {
    const prep = await prepareClaim({ ...parsed.data, title: parsed.data.title || "Preview" });
    if (!prep.ok) return NextResponse.json(prep, { status: 200 });
    const p = prep.p;
    const target = (p.currentCents ?? 0) + p.chargeCents;
    const [top, catTop, rank, categoryRank] = await Promise.all([
      getTopTotal(),
      getTopTotal(p.category),
      rankIfPaid(target, { excludeSlug: p.slug }),
      rankIfPaid(target, { excludeSlug: p.slug, category: p.category }),
    ]);
    return NextResponse.json({
      ok: true,
      slug: p.slug,
      isNew: p.isNew,
      title: p.isNew ? null : p.title,
      currentCents: p.currentCents,
      chargeCents: p.chargeCents,
      inrPaise: toPaise(p.chargeCents),
      rank,
      categoryRank,
      firstPriceCents: priceForFirst(top),
      categoryFirstPriceCents: priceForFirst(catTop),
    });
  } catch (e) {
    console.error("[quote]", e);
    return NextResponse.json({ ok: false, error: "Could not calculate the price. Try again." }, { status: 500 });
  }
}
