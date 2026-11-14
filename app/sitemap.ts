import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { CATEGORIES } from "@/lib/categories";
import { getTop } from "@/lib/db";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticPaths = ["", "/today", "/daily", "/deals", "/categories", "/about", "/stats", "/rules", "/faq", "/terms", "/privacy", "/backlinks"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: now,
    changeFrequency: p === "" || p === "/today" || p === "/deals" ? "hourly" : "weekly",
    priority: p === "" ? 1.0 : 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const listings = await getTop({ limit: 500 }).catch(() => []);
  const productEntries: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${base}/product/${encodeURIComponent(l.slug)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}