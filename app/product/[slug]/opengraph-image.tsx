import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";
import { getListing } from "@/lib/db";
import { usd, num } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Leaderboard rank";
export const revalidate = 300;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await getListing(decodeURIComponent(slug));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000000", color: "#f5f5f5", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>{SITE.name}</div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 260, fontWeight: 800, color: "#10b981", letterSpacing: -10, lineHeight: 1, marginRight: 48 }}>{l ? `#${l.rank}` : "#?"}</div>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 24 }}>
            <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>{(l?.title ?? "Listing").slice(0, 38)}</div>
            <div style={{ display: "flex", fontSize: 30, color: "#a3a3a3", marginTop: 12 }}>
              {l ? `${usd(l.total_cents)} paid · ${num(l.click_count)} clicks` : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a3a3a3" }}>{l?.host ?? ""}</div>
      </div>
    ),
    size,
  );
}
