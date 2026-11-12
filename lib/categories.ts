export type Category = { slug: string; name: string; blurb: string };

// Answer-first blurbs: each one is written to be quoted by search and AI answers as-is.
export const CATEGORIES: Category[] = [
  { slug: "ai-agents", name: "AI Agents & Tech", blurb: "AI assistants, autonomous agents, copilots and automation tools that do work for you." },
  { slug: "saas-web-apps", name: "SaaS & Web Apps", blurb: "Software-as-a-service products and web applications for teams and individuals." },
  { slug: "developer-tools", name: "Developer Tools", blurb: "APIs, SDKs, hosting, infrastructure and tooling that help developers ship faster." },
  { slug: "marketing-seo", name: "Marketing & SEO", blurb: "Tools and services for search visibility, content, advertising, outreach and growth." },
  { slug: "agencies-services", name: "Agencies & Services", blurb: "Agencies, studios and consultants offering done-for-you services." },
  { slug: "productivity", name: "Productivity & Tools", blurb: "Apps for notes, tasks, calendars, focus and personal or team organisation." },
  { slug: "ecommerce", name: "E-Commerce & Retail", blurb: "Stores, marketplaces and tools for selling products online." },
  { slug: "design-creative", name: "Design & Creative", blurb: "Design software, templates, UI kits, media tools and creative resources." },
  { slug: "business-finance", name: "Business & Finance", blurb: "Accounting, invoicing, payments, legal and business-operations software." },
  { slug: "health-lifestyle", name: "Health & Lifestyle", blurb: "Fitness, wellness, travel and lifestyle apps." },
  { slug: "directories-portals", name: "Directories & Portals", blurb: "Startup directories, launch platforms, listings and discovery portals." },
  { slug: "india-startups", name: "India Startups", blurb: "Products built in India or for Indian users, including UPI-first and vernacular-language apps." },
  { slug: "other", name: "Other Services", blurb: "Anything that does not fit the other categories." },
];

export const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryName = (slug: string) => categoryBySlug(slug)?.name ?? "Other";
