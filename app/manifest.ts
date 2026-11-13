import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CLOUTIVO — Public Leaderboard",
    short_name: "CLOUTIVO",
    description: "Pay-to-rank public leaderboard and deals board for startups, SaaS, and services.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#10b981",
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}