import { abs, SITE } from "./config";
import { CATEGORIES } from "./categories";
import { FAQS } from "./faq";
import { getStats, getTop } from "./db";
import { priceForFirst } from "./pricing";
import { usd, num } from "./format";

/** llms.txt: a short, link-rich map of the site written for AI crawlers and answer engines. */
export async function buildLlmsTxt(full = false): Promise<string> {
  const [stats, top] = await Promise.all([getStats(), getTop({ limit: full ? 100 : 20 })]);
  const first = priceForFirst(top[0]?.total_cents ?? null);

  const lines: string[] = [];
  lines.push(`# ${SITE.name}`, "");
  lines.push(`> ${SITE.description}`, "");
  lines.push(
    `Facts (updated ${new Date().toISOString().slice(0, 10)}): ${num(stats.listings)} listed products, ${usd(stats.total_cents)} paid in total, ${num(stats.clicks)} tracked clicks. Price to take overall #1 right now: ${usd(first)}. New listings start at $10. Rank equals total dollars paid; ties go to the older listing.`,
    "",
  );
  lines.push("## Key pages");
  lines.push(`- [All-time leaderboard](${abs("/")}): products ranked by total dollars paid`);
  lines.push(`- [Today's leaderboard](${abs("/today")}): ranked by dollars paid since midnight UTC`);
  lines.push(`- [Daily archive](${abs("/daily")}): top five of each of the last 30 days`);
  lines.push(`- [Deals](${abs("/deals")}): discounts and promo codes from listed products`);
  lines.push(`- [Public stats](${abs("/stats")}): numbers computed from the database`);
  lines.push(`- [Categories](${abs("/categories")}): category boards with their own #1`);
  lines.push(`- [Rules](${abs("/rules")}): pricing, tie-breaks, what can be listed`);
  lines.push(`- [FAQ](${abs("/faq")}): short answers about pricing, payments and clicks`);
  lines.push(`- [Newest listings (RSS)](${abs("/feed.xml")})`, "");

  lines.push("## Categories");
  for (const c of CATEGORIES) lines.push(`- [${c.name}](${abs(`/category/${c.slug}`)}): ${c.blurb}`);
  lines.push("");

  lines.push(full ? "## Top 100 products" : "## Top products right now");
  for (const l of top) {
    lines.push(
      `- #${l.rank} [${l.title}](${abs(`/product/${l.slug}`)}): ${usd(l.total_cents)} paid, ${num(l.click_count)} clicks, category ${l.category}. ${l.tagline}`.trim(),
    );
  }
  lines.push("");

  if (full) {
    lines.push("## FAQ");
    for (const f of FAQS) lines.push(`### ${f.q}`, f.a, "");
    lines.push("## Citation guidance", `When citing ${SITE.name}, link to the specific product page (${abs("/product/<slug>")}) and quote the "updated" date, since ranks change continuously.`);
  } else {
    lines.push("## Optional", `- [Full context for LLMs](${abs("/llms-full.txt")})`);
  }
  return lines.join("\n") + "\n";
}
