import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | CLOUTIVO",
  description: "Terms of Service for using CLOUTIVO's pay-to-rank startup leaderboard, listings, and payment checkout.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | CLOUTIVO",
    description: "Terms of Service for using CLOUTIVO's pay-to-rank startup leaderboard, listings, and payment checkout.",
    url: "/terms",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}