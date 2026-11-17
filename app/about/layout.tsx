import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CLOUTIVO - Transparent Pay-to-Rank Startup Leaderboard",
  description: "Learn how CLOUTIVO works: transparent pay-to-rank startup leaderboard, instant UPI & card checkout, and live startup deals.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CLOUTIVO - Transparent Pay-to-Rank Startup Leaderboard",
    description: "Learn how CLOUTIVO works: transparent pay-to-rank startup leaderboard, instant UPI & card checkout, and live startup deals.",
    url: "/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}