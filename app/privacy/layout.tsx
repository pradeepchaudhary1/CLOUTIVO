import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CLOUTIVO",
  description: "Privacy Policy explaining how CLOUTIVO handles listing details, payment verification, and privacy-first analytics.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | CLOUTIVO",
    description: "Privacy Policy explaining how CLOUTIVO handles listing details, payment verification, and privacy-first analytics.",
    url: "/privacy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}