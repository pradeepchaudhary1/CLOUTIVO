import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { getStats, getTop, PAGE_SIZE } from "@/lib/db";
import { priceForFirst } from "@/lib/pricing";
import type { DealItem } from "@/lib/mock-data";

export const revalidate = 30;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [list, stats] = await Promise.all([getTop({ limit: PAGE_SIZE }), getStats()]);
  const initialDeals: DealItem[] = list.map((item, idx) => {
    const totalUsd = Math.round(Number(item.total_cents ?? 0) / 100);
    const rank = Number(item.rank ?? idx + 1);
    return {
      id: item.slug,
      rank,
      title: item.title,
      description: item.tagline ?? "",
      url: `/go/${encodeURIComponent(item.slug)}`,
      displayUrl: item.host,
      totalPaid: totalUsd,
      nextBidPrice: rank === 1 ? Math.max(10, totalUsd + 5) : totalUsd + 1,
      category: item.category,
      discount: item.discount ?? "",
      couponCode: item.coupon_code ?? "",
      clicks: Number((item as { clicks?: number }).clicks ?? 0),
      timeAgo: "Verified",
    };
  });

  const initialTopBidUsd = Math.round(priceForFirst(list[0]?.total_cents ?? null) / 100);
  const initialStats = {
    listings: stats.listings ?? 0,
    totalUsd: Math.round((stats.total_cents ?? 0) / 100),
    clicks: stats.clicks ?? 0,
  };

  return <HomeClient initialDeals={initialDeals} initialStats={initialStats} initialTopBidUsd={initialTopBidUsd} />;
}