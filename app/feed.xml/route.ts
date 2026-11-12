import { abs, SITE } from "@/lib/config";
import { getNewest } from "@/lib/db";
import { usd } from "@/lib/format";

export const revalidate = 300;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const items = await getNewest(50);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(SITE.name)}: newest listings</title>
<link>${abs("/")}</link>
<description>${esc(SITE.description)}</description>
<language>en</language>
<atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items
  .map(
    (l) => `<item>
<title>${esc(l.title)}</title>
<link>${abs(`/product/${l.slug}`)}</link>
<guid isPermaLink="true">${abs(`/product/${l.slug}`)}</guid>
<pubDate>${new Date(l.created_at).toUTCString()}</pubDate>
<description>${esc(`${l.tagline} Ranked #${l.rank} with ${usd(l.total_cents)} paid.`)}</description>
</item>`,
  )
  .join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
