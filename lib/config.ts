const clean = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback);

export const SITE = {
  name: clean(process.env.NEXT_PUBLIC_SITE_NAME, "Cloutivo"),
  url: clean(process.env.NEXT_PUBLIC_APP_URL, "https://cloutivo.com").replace(/\/+$/, ""),
  twitter: clean(process.env.NEXT_PUBLIC_TWITTER, "cloutivo").replace(/^@/, ""),
  email: clean(process.env.CONTACT_EMAIL, "hello@example.com"),
  tagline: "Pay to stand above everyone else. Rank is what you pay.",
  description:
    "Cloutivo is a public pay-to-rank leaderboard and deals board for startups, SaaS, apps and services. Rank is the total dollars paid, clicks are counted in public, UPI and cards are supported, and every category has its own #1.",
  launched: "2026-11-11",
  locale: "en_US",
} as const;

export const abs = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

export const USD_INR_RATE = Number(process.env.USD_INR_RATE) > 0 ? Number(process.env.USD_INR_RATE) : 88;

// Black Friday / Cyber Monday deals window (UTC). The countdown on /deals is computed from this real date.
export const DEALS_END_ISO = clean(process.env.NEXT_PUBLIC_DEALS_END_ISO, "2026-12-01T00:00:00Z");
export const SERVICES_ENABLED = process.env.NEXT_PUBLIC_BACKLINK_SERVICE === "on";
