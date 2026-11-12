import { abs, SITE } from "./config";
import type { Faq } from "./types";

type Json = Record<string, unknown>;

export const orgLd = (): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": abs("/#org"),
  name: SITE.name,
  url: SITE.url,
  logo: abs("/icon.svg"),
  description: SITE.description,
  ...(SITE.twitter ? { sameAs: [`https://x.com/${SITE.twitter}`] } : {}),
});

export const websiteLd = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en",
  publisher: { "@id": abs("/#org") },
});

export const itemListLd = (name: string, path: string, items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  url: abs(path),
  itemListOrder: "https://schema.org/ItemListOrderDescending",
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    url: abs(it.path),
  })),
});

export const faqLd = (faqs: Faq[]): Json => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbLd = (crumbs: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: abs(c.path),
  })),
});

export const webPageLd = (o: {
  name: string;
  path: string;
  description: string;
  modified?: string;
  published?: string;
  about?: { name: string; url: string };
}): Json => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": abs(o.path),
  name: o.name,
  url: abs(o.path),
  description: o.description,
  inLanguage: "en",
  isPartOf: { "@id": abs("/#website") },
  ...(o.published ? { datePublished: o.published } : {}),
  ...(o.modified ? { dateModified: o.modified } : {}),
  ...(o.about ? { about: { "@type": "Thing", name: o.about.name, url: o.about.url } } : {}),
});
