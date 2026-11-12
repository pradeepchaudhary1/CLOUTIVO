import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Board from "@/components/Board";
import ClaimPanel from "@/components/ClaimPanel";
import { paymentMethods } from "@/lib/payments";
import JsonLd from "@/components/JsonLd";
import PaidBanner from "@/components/PaidBanner";
import { categoryName } from "@/lib/categories";
import { SITE } from "@/lib/config";
import { getListing, getTop } from "@/lib/db";
import { ago, isoDate, num, usd } from "@/lib/format";
import { toRows } from "@/lib/rows";
import { breadcrumbLd, webPageLd } from "@/lib/seo";

export const revalidate = 60;

type P = { params: Promise<{ slug: string }> };

const summary = (l: NonNullable<Awaited<ReturnType<typeof getListing>>>) =>
  `${l.title} (${l.host}) is listed on ${SITE.name} in ${categoryName(l.category)}. It currently ranks #${l.rank} overall and #${l.category_rank} in its category, with ${usd(l.total_cents)} paid and ${num(l.click_count)} tracked clicks.${l.tagline ? ` ${l.tagline}` : ""}`;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  const l = await getListing(slug);
  if (!l) return { title: "Listing not found", robots: { index: false } };
  return {
    title: `${l.title}: ranked #${l.rank} on ${SITE.name}`,
    description: summary(l).slice(0, 300),
    alternates: { canonical: `/product/${encodeURIComponent(l.slug)}` },
  };
}

export default async function Product({ params }: P) {
  const slug = decodeURIComponent((await params).slug);
  const l = await getListing(slug);
  if (!l) notFound();
  const related = (await getTop({ category: l.category, limit: 6 })).filter((r) => r.slug !== l.slug).slice(0, 5);
  const path = `/product/${encodeURIComponent(l.slug)}`;
  const beat = l.total_cents + (l.rank === 1 ? 500 : 100);

  return (
    <>
      <PaidBanner />
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link href="/">Home</Link>
        <Link href={`/category/${l.category}`}>{categoryName(l.category)}</Link>
        <span aria-current="page">{l.title}</span>
      </nav>

      <section className="product-head">
        <p className="rank-xl" aria-label={`Rank ${l.rank}`}>{l.rank}</p>
        <div>
          <h1>{l.title}</h1>
          {l.tagline && <p className="lede">{l.tagline}</p>}
          <p className="answer">{summary(l)}</p>
          <p className="actions">
            <a className="btn btn-ink" href={`/go/${encodeURIComponent(l.slug)}`} target="_blank" rel="sponsored nofollow noopener noreferrer">
              Visit {l.host}<span className="sr-only"> (sponsored, opens in a new tab)</span>
            </a>
            <Link className="btn btn-accent" href={`/#bid-${beat}`}>Outrank for {usd(beat)}</Link>
          </p>
        </div>
      </section>

      <dl className="stats stats-wide">
        <div><dt>Paid</dt><dd>{usd(l.total_cents)}</dd></div>
        <div><dt>Overall rank</dt><dd>#{l.rank}</dd></div>
        <div><dt>{categoryName(l.category)} rank</dt><dd>#{l.category_rank}</dd></div>
        <div><dt>Clicks counted</dt><dd>{num(l.click_count)}</dd></div>
        <div><dt>Listed</dt><dd><time dateTime={l.created_at}>{ago(l.created_at)}</time></dd></div>
      </dl>

      <ClaimPanel
        topCents={null}
        methods={paymentMethods()}
        fixed={{ url: l.url.replace(/^https:\/\//, ""), title: l.title, currentCents: l.total_cents, category: l.category }}
      />

      {related.length > 0 && (
        <section aria-labelledby="rel-h">
          <h2 id="rel-h">Also ranking in {categoryName(l.category)}</h2>
          <Board rows={toRows(related, "category")} label="Related listings" emptyHint="" />
        </section>
      )}

      <JsonLd
        data={[
          webPageLd({
            name: `${l.title} on ${SITE.name}`,
            path,
            description: summary(l),
            published: l.created_at,
            modified: l.updated_at,
            about: { name: l.title, url: l.url },
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: categoryName(l.category), path: `/category/${l.category}` },
            { name: l.title, path },
          ]),
        ]}
      />
      <p className="fine">Last paid <time dateTime={l.updated_at}>{isoDate(l.updated_at)}</time>. This listing is a paid placement.</p>
    </>
  );
}
