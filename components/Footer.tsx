import Link from "next/link";
import { SITE } from "@/lib/config";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <p className="foot-brand">{SITE.name}</p>
          <p className="muted">{SITE.tagline}. Paid ranking: listings are advertisements and links are marked sponsored.</p>
        </div>
        <nav aria-label="Categories" className="foot-col">
          <p className="foot-h">Categories</p>
          <ul>
            {CATEGORIES.slice(0, 7).map((c) => (
              <li key={c.slug}><Link href={`/category/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Site" className="foot-col">
          <p className="foot-h">Site</p>
          <ul>
            <li><Link href="/rules">Rules</Link></li>
            <li><Link href="/stats">Public stats</Link></li>
            <li><Link href="/backlinks">Backlink Booster</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><a href="/feed.xml">RSS</a></li>
            <li><a href="/llms.txt">llms.txt</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
