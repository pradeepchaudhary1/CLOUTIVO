import { publicClient, adminClient } from "./supabase";
import type { Activity, CategoryStat, DailyArchiveRow, Listing, PaidDay, Sample, Stats, TodayListing } from "./types";

export const PAGE_SIZE = 50;
/** Sample listings are shown only while fewer than this many real listings exist. */
export const SAMPLE_THRESHOLD = 5;

async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[db]", e instanceof Error ? e.message : e);
    return fallback;
  }
}

export const getTop = (opts: { page?: number; category?: string; limit?: number } = {}) =>
  safe<Listing[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const limit = opts.limit ?? PAGE_SIZE;
    const from = ((opts.page ?? 1) - 1) * limit;
    let q = db.from("ranked_listings").select("*");
    if (opts.category) q = q.eq("category", opts.category);
    const { data, error } = await q.order("rank", { ascending: true }).range(from, from + limit - 1);
    if (error) throw error;
    return (data ?? []) as Listing[];
  });

export const getToday = (limit = PAGE_SIZE) =>
  safe<TodayListing[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("today_ranked").select("*").order("day_rank", { ascending: true }).limit(limit);
    if (error) throw error;
    return (data ?? []) as TodayListing[];
  });

export const getListing = (slug: string) =>
  safe<Listing | null>(null, async () => {
    const db = publicClient();
    if (!db) return null;
    const { data, error } = await db.from("ranked_listings").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return (data as Listing) ?? null;
  });

export const getNewest = (limit = 50) =>
  safe<Listing[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("ranked_listings").select("*").order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as Listing[];
  });

export const getStats = () =>
  safe<Stats>({ listings: 0, total_cents: 0, clicks: 0 }, async () => {
    const db = publicClient();
    if (!db) return { listings: 0, total_cents: 0, clicks: 0 };
    const { data, error } = await db.from("site_stats").select("*").maybeSingle();
    if (error) throw error;
    return (data as Stats) ?? { listings: 0, total_cents: 0, clicks: 0 };
  });

export const getCategoryStats = () =>
  safe<CategoryStat[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("category_stats").select("*");
    if (error) throw error;
    return (data ?? []) as CategoryStat[];
  });

export const getTopTotal = async (category?: string): Promise<number | null> => {
  const rows = await getTop({ limit: 1, category });
  return rows[0]?.total_cents ?? null;
};

export const getSlugs = (limit = 5000) =>
  safe<{ slug: string; updated_at: string }[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db
      .from("ranked_listings")
      .select("slug, updated_at")
      .order("rank", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as { slug: string; updated_at: string }[];
  });

/** How many other listings would sit at or above `cents` (ties: older keeps the higher rank). */
export async function rankIfPaid(cents: number, opts: { category?: string; excludeSlug?: string } = {}) {
  const db = publicClient();
  if (!db) return 1;
  let q = db.from("listings").select("id", { count: "exact", head: true }).eq("is_active", true).eq("is_demo", false).gte("total_cents", cents);
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.excludeSlug) q = q.neq("slug", opts.excludeSlug);
  const { count } = await q;
  return (count ?? 0) + 1;
}

/** Server-side: current total for a slug straight from the DB (not cached). */
export async function currentTotal(slug: string): Promise<{ total_cents: number; title: string; tagline: string; category: string; url: string } | null> {
  const { data, error } = await adminClient()
    .from("listings")
    .select("total_cents,title,tagline,category,url")
    .eq("is_demo", false)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const getDeals = (limit = 50) =>
  safe<Listing[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db
      .from("ranked_listings")
      .select("*")
      .not("discount", "is", null)
      .order("rank", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Listing[];
  });

export const getDailyArchive = () =>
  safe<DailyArchiveRow[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("daily_archive").select("*").order("day", { ascending: false }).order("pos", { ascending: true });
    if (error) throw error;
    return (data ?? []) as DailyArchiveRow[];
  });

export const getActivity = (limit = 8) =>
  safe<Activity[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("recent_activity").select("*").limit(limit);
    if (error) throw error;
    return (data ?? []) as Activity[];
  });

export const getPaidByDay = () =>
  safe<PaidDay[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("paid_by_day").select("*");
    if (error) throw error;
    return (data ?? []) as PaidDay[];
  });

export const getSamples = (limit = 5) =>
  safe<Sample[]>([], async () => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db.from("sample_listings").select("*").limit(limit);
    if (error) throw error;
    return (data ?? []) as Sample[];
  });
