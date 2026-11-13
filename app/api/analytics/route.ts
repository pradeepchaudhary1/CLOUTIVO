import { NextResponse } from "next/server";
import { adminClient, hasDb } from "@/lib/supabase";
import { getStats } from "@/lib/db";

export const dynamic = "force-dynamic";

function detectChannel(ref: string): string {
  const r = ref.toLowerCase();
  if (!r) return "Direct";
  if (r.includes("google.") || r.includes("bing.") || r.includes("duckduckgo.")) return "Organic Search";
  if (r.includes("t.co") || r.includes("twitter.") || r.includes("x.com") || r.includes("linkedin.") || r.includes("instagram.")) return "Organic Social";
  return "Referral";
}

export async function POST(req: Request) {
  if (!hasDb) return NextResponse.json({ ok: true, online: 1 });
  try {
    const body = (await req.json().catch(() => null)) as { sessionId?: string; path?: string; referrer?: string } | null;
    const sessionId = String(body?.sessionId ?? "").slice(0, 64);
    if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

    const country = req.headers.get("x-vercel-ip-country") || "Local / Direct";
    const channel = detectChannel(String(body?.referrer ?? ""));
    const db = adminClient();

    const { data: existing } = await db.from("page_visits").select("views").eq("session_id", sessionId).maybeSingle();
    await db.from("page_visits").upsert({
      session_id: sessionId,
      path: String(body?.path ?? "/").slice(0, 120),
      country,
      channel,
      views: (existing?.views ?? 0) + 1,
      last_seen_at: new Date().toISOString(),
    });

    const threeMinAgo = new Date(Date.now() - 3 * 60_000).toISOString();
    const { count } = await db.from("page_visits").select("*", { count: "exact", head: true }).gte("last_seen_at", threeMinAgo);
    return NextResponse.json({ ok: true, online: Math.max(1, count ?? 1) });
  } catch {
    return NextResponse.json({ ok: true, online: 1 });
  }
}

export async function GET() {
  if (!hasDb) {
    return NextResponse.json({
      ok: true, online: 0, visitors24h: 0, totalViews: 0,
      channels: [], countries: [], stats: { listings: 0, total_cents: 0, clicks: 0 },
    });
  }
  try {
    const db = adminClient();
    const threeMinAgo = new Date(Date.now() - 3 * 60_000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();

    const [{ count: online }, { data: recent }, stats] = await Promise.all([
      db.from("page_visits").select("*", { count: "exact", head: true }).gte("last_seen_at", threeMinAgo),
      db.from("page_visits").select("country, channel, views").gte("last_seen_at", dayAgo),
      getStats(),
    ]);

    const rows = recent ?? [];
    const totalViews = rows.reduce((s, r) => s + Number(r.views ?? 1), 0);
    const chMap: Record<string, number> = {};
    const coMap: Record<string, number> = {};
    for (const r of rows) {
      chMap[r.channel] = (chMap[r.channel] ?? 0) + 1;
      coMap[r.country] = (coMap[r.country] ?? 0) + 1;
    }

    const channels = Object.entries(chMap).map(([channel, count]) => ({
      channel,
      count,
      pct: rows.length ? Math.round((count / rows.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    const countries = Object.entries(coMap).map(([country, count]) => ({
      country,
      count,
      pct: rows.length ? Math.round((count / rows.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      ok: true,
      online: online ?? 0,
      visitors24h: rows.length,
      totalViews,
      channels,
      countries,
      stats,
    });
  } catch (e) {
    console.error("[analytics]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}