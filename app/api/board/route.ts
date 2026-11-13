import { NextResponse } from "next/server";
import { getActivity, getCategoryStats, getDailyArchive, getDeals, getSamples, getStats, getToday, getTop, PAGE_SIZE, SAMPLE_THRESHOLD } from "@/lib/db";
import { priceForFirst } from "@/lib/pricing";
import { hasDb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const board = searchParams.get("board") || "all-time";
  const category = searchParams.get("category") || "";

  if (!hasDb) {
    return NextResponse.json({
      ok: true, dbConnected: false, listings: [], samples: [], activity: [],
      daily: [], categories: [], stats: { listings: 0, total_cents: 0, clicks: 0 }, firstPriceCents: 1000,
    });
  }

  try {
    const [allTop, todayTop, dealsTop, stats, activity, daily, categories] = await Promise.all([
      getTop({ limit: PAGE_SIZE, category: category && category !== "All" ? category : undefined }),
      board === "today" ? getToday(PAGE_SIZE) : Promise.resolve([]),
      board === "deals" ? getDeals(PAGE_SIZE) : Promise.resolve([]),
      getStats(),
      getActivity(8),
      board === "daily" ? getDailyArchive(30) : Promise.resolve([]),
      board === "categories" ? getCategoryStats() : Promise.resolve([]),
    ]);

    const samples = stats.listings < SAMPLE_THRESHOLD ? await getSamples() : [];
    const activeList = board === "today" ? todayTop : board === "deals" ? dealsTop : allTop;
    const topCents = allTop[0]?.total_cents ?? null;

    return NextResponse.json({
      ok: true, dbConnected: true, listings: activeList, samples, activity, daily, categories, stats,
      firstPriceCents: priceForFirst(topCents),
    });
  } catch (e) {
    console.error("[api/board]", e);
    return NextResponse.json({ ok: false, dbConnected: false, error: "Database query failed" }, { status: 500 });
  }
}