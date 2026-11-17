import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Deals & Promo Codes | CLOUTIVO",
  description: "Browse verified startup deals, founder promo codes, and exclusive SaaS & AI tool discounts on CLOUTIVO.",
  alternates: { canonical: "/deals" },
  openGraph: {
    title: "Startup Deals & Promo Codes | CLOUTIVO",
    description: "Browse verified startup deals, founder promo codes, and exclusive SaaS & AI tool discounts on CLOUTIVO.",
    url: "/deals",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}