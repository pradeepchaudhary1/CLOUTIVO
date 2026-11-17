import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Platform Stats, Traffic & Spend Analytics | CLOUTIVO",
  description: "Real-time CLOUTIVO leaderboard metrics, active listings, visitor analytics, and category spend distribution.",
  alternates: { canonical: "/stats" },
  openGraph: {
    title: "Live Platform Stats, Traffic & Spend Analytics | CLOUTIVO",
    description: "Real-time CLOUTIVO leaderboard metrics, active listings, visitor analytics, and category spend distribution.",
    url: "/stats",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}