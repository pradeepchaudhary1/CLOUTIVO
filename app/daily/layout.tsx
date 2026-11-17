import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Leaderboard Archive & Rank History | CLOUTIVO",
  description: "Explore CLOUTIVO's daily archive of top-ranked startups, historical #1 winners, and past leaderboard snapshots.",
  alternates: { canonical: "/daily" },
  openGraph: {
    title: "Daily Leaderboard Archive & Rank History | CLOUTIVO",
    description: "Explore CLOUTIVO's daily archive of top-ranked startups, historical #1 winners, and past leaderboard snapshots.",
    url: "/daily",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}