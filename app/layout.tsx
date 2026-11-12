import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AIChatbot from "@/components/ui/AIChatbot";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CLOUTIVO — Claim a Rank on the Public Leaderboard | Pay to Rank #1",
  description:
    "The transparent viral attention marketplace for startups, SaaS, apps, and services. Claim #1 rank, gain high-authority DoFollow backlinks, and drive high-converting founder traffic. Zero ad middlemen.",
  keywords: [
    "pay to rank leaderboard",
    "startup directory",
    "black friday software deals",
    "dofollow backlink marketplace",
    "saas marketing",
    "outbid clone",
    "indie hacker launch",
    "attention market",
  ],
  authors: [{ name: "CLOUTIVO Team" }],
  creator: "CLOUTIVO",
  metadataBase: new URL("https://cloutivo.com"),
  alternates: {
    canonical: "https://cloutivo.com",
  },
  openGraph: {
    title: "CLOUTIVO — Public Pay-to-Rank Leaderboard",
    description: "Pay to stand above everyone else. Rank is what you pay. Live startup & deals attention market.",
    url: "https://cloutivo.com",
    siteName: "CLOUTIVO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CLOUTIVO Public Leaderboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOUTIVO — Claim #1 on the Public Leaderboard",
    description: "The viral public leaderboard for websites and tech founders.",
    creator: "@cloutivo",
    images: ["/og-image.png"],
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
  // AEO / GEO Schema (ChatGPT, Perplexity & Googlebot structured knowledge)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CLOUTIVO",
    url: "https://cloutivo.com",
    description: "Public pay-to-rank leaderboard and software deals marketplace.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://cloutivo.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Structured Data for Search & Generative AI Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Microsoft Clarity / Free Heatmaps Script Placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
            `,
          }}
        />
      </head>
      <body className="font-sans bg-[#000000] text-neutral-100 antialiased">
        {children}
        {/* Global Floating AI Chatbot */}
        <AIChatbot />
      </body>
    </html>
  );
}