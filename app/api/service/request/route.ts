import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { cleanText, normalizeListingUrl, UrlError } from "@/lib/url";

const PLANS = new Set(["starter", "growth", "scale"]);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (!rateLimit(`svc:${clientIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again later." }, { status: 429 });
  }
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const plan = String(b?.plan ?? "");
  const email = String(b?.email ?? "").trim().toLowerCase();
  if (!PLANS.has(plan)) return NextResponse.json({ ok: false, error: "Choose a plan." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });

  let site: string;
  try {
    site = normalizeListingUrl(String(b?.site_url ?? "")).url;
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof UrlError ? e.message : "Invalid website." }, { status: 400 });
  }

  try {
    const { error } = await adminClient()
      .from("service_requests")
      .insert({ plan, email, site_url: site, note: cleanText(b?.note, 300) || null });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[service/request]", e);
    return NextResponse.json({ ok: false, error: "Could not save your request. Try again." }, { status: 500 });
  }
}
