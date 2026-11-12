import Link from "next/link";
import { SITE } from "@/lib/config";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="currentColor" />
            <path d="M20 46V24l12-8 12 8v22M32 46V32" fill="none" stroke="#10b981" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span>{SITE.name}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav">
            <li><Link href="/today">Today</Link></li>
            <li><Link href="/daily">Daily</Link></li>
            <li><Link href="/deals">Deals</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/#claim" className="btn btn-accent btn-sm">Claim #1</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
