import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard Rules & Bid Increments | CLOUTIVO",
  description: "Read CLOUTIVO's transparent ranking rules:  minimum listing, + to claim #1, + to pass any rank, and upgrade pricing.",
  alternates: { canonical: "/rules" },
  openGraph: {
    title: "Leaderboard Rules & Bid Increments | CLOUTIVO",
    description: "Read CLOUTIVO's transparent ranking rules:  minimum listing, + to claim #1, + to pass any rank, and upgrade pricing.",
    url: "/rules",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}