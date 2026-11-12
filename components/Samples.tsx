import Link from "next/link";
import { categoryName } from "@/lib/categories";
import type { Sample } from "@/lib/types";

/**
 * Honest placeholder content for a brand-new board. Sample rows have no rank, no price, no clicks and no
 * outbound link, and each one says "Sample". They never compete with real paid listings.
 */
export default function Samples({ items }: { items: Sample[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="sample-h">
      <h2 id="sample-h">Examples of how a listing looks</h2>
      <p className="sample-note">These are fictional sample listings, not real products and not ranked. Real listings appear above them as soon as someone pays.</p>
      <ul className="board samples" aria-label="Sample listings">
        {items.map((s) => (
          <li key={s.slug} className="row">
            <span className="rank" aria-hidden="true">·</span>
            <div className="row-main">
              <h3 className="row-title">{s.title}<span className="badge-sample">Sample</span></h3>
              <p className="row-tag">{s.tagline}</p>
              <p className="row-meta"><span>{categoryName(s.category)}</span></p>
            </div>
            <div className="row-money">
              <Link className="btn btn-accent btn-sm" href="/#claim">Your product here</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
