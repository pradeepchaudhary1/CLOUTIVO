import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Today's Top Ranked Startups & Bids | CLOUTIVO",
  description: "See today's active leaderboard rankings, live bid movements, and featured tools on CLOUTIVO.",
  alternates: { canonical: "/today" },
  openGraph: {
    title: "Today's Top Ranked Startups & Bids | CLOUTIVO",
    description: "See today's active leaderboard rankings, live bid movements, and featured tools on CLOUTIVO.",
    url: "/today",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}