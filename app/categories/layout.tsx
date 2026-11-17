import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Startup Categories | CLOUTIVO",
  description: "Explore startups, AI agents, SaaS apps, developer tools, and marketing platforms across 13 categories on CLOUTIVO.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Browse Startup Categories | CLOUTIVO",
    description: "Explore startups, AI agents, SaaS apps, developer tools, and marketing platforms across 13 categories on CLOUTIVO.",
    url: "/categories",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}