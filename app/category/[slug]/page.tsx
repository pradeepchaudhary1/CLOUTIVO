import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Board from "@/components/Board";
import ClaimPanel from "@/components/ClaimPanel";
import { paymentMethods } from "@/lib/payments";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import { getTop } from "@/lib/db";
import { usd } from "@/lib/format";
import { priceForFirst } from "@/lib/pricing";
import { toRows } from "@/lib/rows";
import { breadcrumbLd, itemListLd, webPageLd } from "@/lib/seo";

export const revalidate = 60;

type P = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return {};
  return {
    title: `Top ${c.name} ranked by dollars paid`,
    description: `${c.blurb} See who ranks #1 in ${c.name} and what it costs to take the spot.`,
    alternates: { canonical: `/category/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: P) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();
  const list = await getTop({ category: c.slug, limit: 50 });
  const top = list[0];
  const price = priceForFirst(top?.total_cents ?? null);
  const updated = new Date().toISOString();

  return (
    <>
      <h1>{c.name}</h1>
      <p className="lede">
        {c.blurb} {top ? `The current #1 is ${top.title} with ${usd(top.total_cents)} paid.` : "No one is listed yet, so #1 is open."}{" "}
        Taking #1 in this category costs {usd(price)}.
      </p>
      <div className="two">
        <div>
          <Board rows={toRows(list, "category")} label={`${c.name} ranking`} emptyHint={`Be the first ${c.name} product on the board for $10.`} />
        </div>
        <ClaimPanel topCents={top?.total_cents ?? null} methods={paymentMethods()} defaultCategory={c.slug} />
      </div>
      <JsonLd
        data={[
          webPageLd({ name: `${c.name} leaderboard`, path: `/category/${c.slug}`, description: c.blurb, modified: updated }),
          itemListLd(`${c.name} leaderboard`, `/category/${c.slug}`, list.map((l) => ({ name: l.title, path: `/product/${l.slug}` }))),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Categories", path: "/categories" }, { name: c.name, path: `/category/${c.slug}` }]),
        ]}
      />
    </>
  );
}
