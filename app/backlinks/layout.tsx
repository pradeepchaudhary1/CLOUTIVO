import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Directory Listing & Link Transparency | CLOUTIVO",
  description: "Understand how CLOUTIVO product pages, /go/ redirects, and public directory profiles work for startups.",
  alternates: { canonical: "/backlinks" },
  openGraph: {
    title: "Startup Directory Listing & Link Transparency | CLOUTIVO",
    description: "Understand how CLOUTIVO product pages, /go/ redirects, and public directory profiles work for startups.",
    url: "/backlinks",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}