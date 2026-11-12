import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { publicClient, adminClient } from "@/lib/supabase";
import { SITE } from "@/lib/config";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse|curl|wget|python|axios|go-http|java\/|httpclient|monitor|uptime/i;

/** Outbound click: counts one human click per visitor per hour, then redirects. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const db = publicClient();
  const { data } = db
    ? await db.from("listings").select("url").eq("slug", slug).eq("is_active", true).maybeSingle()
    : { data: null };
  if (!data?.url) return NextResponse.redirect(new URL("/", SITE.url), 307);

  const ua = req.headers.get("user-agent") ?? "";
  if (ua && !BOT.test(ua)) {
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim();
    const hash = createHash("sha256").update(`${ip}|${ua}|${process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-8) ?? ""}`).digest("hex").slice(0, 32);
    after(async () => {
      try {
        await adminClient().rpc("register_click", { p_slug: slug, p_hash: hash });
      } catch (e) {
        console.error("[go]", e instanceof Error ? e.message : e);
      }
    });
  }

  const target = new URL(data.url);
  target.searchParams.set("utm_source", SITE.name.toLowerCase());
  target.searchParams.set("utm_medium", "leaderboard");
  const res = NextResponse.redirect(target, 307);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
