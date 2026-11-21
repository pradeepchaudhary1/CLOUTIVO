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
    default: "CLOUTIVO — Startup Directory, AI Tools & SaaS Deals Leaderboard",
    template: "%s · CLOUTIVO",
  },
  description:
    "Discover startups, SaaS apps, AI tools, and exclusive deals on CLOUTIVO. Founders claim leaderboard spots with transparent verified spend via UPI and cards.",
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: "CLOUTIVO — Public Startup Leaderboard & Deals Board",
    description: "Discover ranked startups, AI tools, and deals. Claim a spot via UPI or card.",
    url: SITE.url,
    siteName: "CLOUTIVO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOUTIVO — Public Startup Leaderboard",
    description: "Pay-to-rank product discovery and deals board for startups and makers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CLOUTIVO",
      url: SITE.url,
      description: "Public pay-to-rank product discovery leaderboard and startup deals board.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CLOUTIVO",
      url: SITE.url,
      logo: `${SITE.url}/icon.png`,
      parentOrganization: {
        "@type": "Organization",
        name: "Nexus AI Agency",
        url: "https://nexusaiagency.in",
      },
    },
  ];

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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