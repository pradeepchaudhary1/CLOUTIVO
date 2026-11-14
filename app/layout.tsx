import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AIChatbot from "@/components/ui/AIChatbot";
import { SITE } from "@/lib/config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "CLOUTIVO — Claim a Rank on the Public Leaderboard",
    template: "%s · CLOUTIVO",
  },
  description:
    "Pay-to-rank public leaderboard and deals board for startups, SaaS, apps and services. Rank is total verified spend, with UPI and card checkout.",
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: "CLOUTIVO — Public Pay-to-Rank Leaderboard",
    description: "Pay to stand above everyone else. Verified spend decides rank.",
    url: SITE.url,
    siteName: "CLOUTIVO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOUTIVO — Claim #1 on the Public Leaderboard",
    description: "The public pay-to-rank leaderboard for websites, deals, and founders.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CLOUTIVO",
    url: SITE.url,
    description: "Public pay-to-rank leaderboard and startup deals board.",
  };

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#000000] text-neutral-100 antialiased">
        {children}
        <AIChatbot />
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "zd506vhhn5");`}
        </Script>
      </body>
    </html>
  );
}