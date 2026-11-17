import type { Metadata } from "next";

const title = "FAQ - How CLOUTIVO Ranking, Pricing & Payments Work";
const description = "Answers to common questions about CLOUTIVO pricing rules, #1 spot increments, instant Razorpay UPI checkout, and listing updates.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: { title, description, url: "/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CLOUTIVO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CLOUTIVO is a public pay-to-rank leaderboard for software, startups, agencies, and creator profiles where rank is determined transparently by verified spend.",
      },
    },
    {
      "@type": "Question",
      name: "How does ranking and taking #1 work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "New listings start at $10. Taking first place (#1) requires paying at least $5 more than the current #1 listing, while passing any other rank requires $1 above that listing.",
      },
    },
    {
      "@type": "Question",
      name: "Can I raise my rank later without paying from scratch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Submit the same website URL or handle and you only pay the difference between your current total and the new target rank.",
      },
    },
    {
      "@type": "Question",
      name: "How do links and product pages work on CLOUTIVO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every listing gets a dedicated indexable product page at cloutivo.in/product/[slug] along with tracked outbound visits via /go/[slug].",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}