import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";
import { getStats, getTop } from "@/lib/db";
import { priceForFirst } from "@/lib/pricing";
import { usd } from "@/lib/format";

export const alt = `${SITE.name}: the public leaderboard where rank is what you pay`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image() {
  const [top, stats] = await Promise.all([getTop({ limit: 1 }), getStats()]);
  const price = usd(priceForFirst(top[0]?.total_cents ?? null));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000000", color: "#f5f5f5", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{SITE.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 36, color: "#a3a3a3" }}>Right now, #1 costs</div>
          <div style={{ display: "flex", fontSize: 220, fontWeight: 800, color: "#10b981", letterSpacing: -8, lineHeight: 1 }}>{price}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a3a3a3" }}>
          {`${stats.listings} products · every click counted in public`}
        </div>
      </div>
    ),
    size,
  );
}
