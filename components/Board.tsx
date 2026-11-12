import Link from "next/link";
import { categoryName } from "@/lib/categories";
import { ago, inr, num, usd } from "@/lib/format";
import { toPaise } from "@/lib/pricing";

export type BoardRow = {
  rank: number;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  host: string;
  clicks: number;
  amountCents: number;
  createdAt: string;
  discount?: string | null;
  coupon?: string | null;
  verified?: boolean;
  beatCents: number; // price to outrank this listing
  sub?: string; // e.g. "#12 overall"
};

export default function Board({ rows, label, emptyHint }: { rows: BoardRow[]; label: string; emptyHint: string }) {
  if (rows.length === 0) {
    return (
      <div className="empty">
        <p className="empty-h">No listings here yet.</p>
        <p>{emptyHint}</p>
        <Link href="/#claim" className="btn btn-accent">Claim the first spot</Link>
      </div>
    );
  }
  return (
    <ol className="board" aria-label={label}>
      {rows.map((r) => (
        <li key={r.slug} className={`row${r.rank === 1 ? " row-first" : ""}`}>
          <span className="rank" aria-label={`Rank ${r.rank}`}>{r.rank}</span>
          <div className="row-main">
            <h3 className="row-title"><Link href={`/product/${encodeURIComponent(r.slug)}`}>{r.title}</Link></h3>
            {r.tagline && <p className="row-tag">{r.tagline}</p>}
            {r.discount && (
              <p className="deal">
                <span className="tag">{r.discount}</span>
                {r.coupon && <code aria-label={`Coupon code ${r.coupon}`}>{r.coupon}</code>}
                {r.verified ? <span className="ok">Code tested by us</span> : <span className="muted">Code not yet tested</span>}
              </p>
            )}
            <p className="row-meta">
              <Link href={`/category/${r.category}`}>{categoryName(r.category)}</Link>
              <span>{r.host}</span>
              <span>{num(r.clicks)} clicks</span>
              <span>{ago(r.createdAt)}</span>
              {r.sub && <span>{r.sub}</span>}
            </p>
          </div>
          <div className="row-money">
            <span className="amount">{usd(r.amountCents)}<span className="inr">{inr(toPaise(r.amountCents))}</span></span>
            <div className="row-actions">
              <a className="btn btn-ghost btn-sm" href={`/go/${encodeURIComponent(r.slug)}`} target="_blank" rel="sponsored nofollow noopener noreferrer">
                Visit<span className="sr-only"> {r.title} (sponsored, opens in a new tab)</span>
              </a>
              <Link className="btn btn-accent btn-sm" href={`/#bid-${r.beatCents}`}>
                Outrank for {usd(r.beatCents)}<span className="sr-only"> {r.title}</span>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
