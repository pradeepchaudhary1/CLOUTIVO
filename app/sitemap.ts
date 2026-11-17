import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { CATEGORIES } from "@/lib/categories";
import { getTop } from "@/lib/db";

export const revalidate = 600;

const STATIC_LAST_MODIFIED = new Date("2026-11-17T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const listings = await getTop({ limit: 500 }).catch(() => []);

  const staticPaths = ["", "/today", "/daily", "/deals", "/categories", "/about", "/stats", "/rules", "/faq", "/terms", "/privacy", "/backlinks"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: p === "" || p === "/today" || p === "/deals" ? "hourly" : "weekly",
    priority: p === "" ? 1.0 : 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = listings.map((l) => {
    const row = l as { updated_at?: string; created_at?: string };
    const rawDate = row.updated_at || row.created_at;
    const parsed = rawDate ? new Date(rawDate) : STATIC_LAST_MODIFIED;
    const lastModified = Number.isNaN(parsed.getTime()) ? STATIC_LAST_MODIFIED : parsed;
    return {
      url: `${base}/product/${encodeURIComponent(l.slug)}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    };
  });

  return [...staticEntries, ...categoryEntries, ...productEntries];
}