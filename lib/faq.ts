import type { Faq } from "./types";
import { SITE } from "./config";

// Visible on /faq and the homepage, and mirrored in FAQPage JSON-LD.
// Keep each answer under ~60 words and lead with the direct answer: this is what answer engines quote.
export const FAQS: Faq[] = [
  {
    q: `What is ${SITE.name}?`,
    a: `${SITE.name} is a public pay-to-rank leaderboard and deals board for startups, SaaS, apps and services. A product's rank equals the total US dollars paid for it. There are no ads, no accounts and no hidden algorithm, so anyone can see exactly why a product sits where it does.`,
  },
  {
    q: "How does ranking work?",
    a: "Rank is the total amount paid for a listing, highest first. If two listings have the same amount, the older one stays higher. You can raise your own rank at any time by submitting the same URL or @handle again, and you only pay the difference.",
  },
  {
    q: "How much does it cost to take #1?",
    a: "Taking #1 costs at least $5 more than the current #1. New listings start at $10, and any other rank needs $1 more than the listing you want to pass. The live price is shown at the top of the homepage, and every category board has its own, usually much lower, #1 price.",
  },
  {
    q: "Can I pay with UPI?",
    a: "Yes. Indian buyers can pay with UPI or QR through Razorpay, priced in rupees at the day's rate. Card payments in US dollars are available when enabled. Either way the rank is credited in dollars and shown in both currencies.",
  },
  {
    q: "How are clicks counted?",
    a: "Every outbound link goes through a counter that records one click per visitor per listing per hour and ignores known bots. The total is shown on each listing so buyers can judge what a rank is worth.",
  },
  {
    q: "Do I get a dofollow SEO backlink?",
    a: "No, and no paid placement honestly can. Search guidelines require paid links to be marked sponsored or nofollow, so every outbound link here is. You are buying visibility, referral traffic and a public proof of rank, not backlink authority.",
  },
  {
    q: "How do deals and coupon codes work?",
    a: "When you claim a spot you can add a discount and a coupon code, and your listing also appears on the Deals board. The code must really work. A deal is labelled \"Code tested by us\" only after we have used it; until then it is labelled as not yet tested.",
  },
  {
    q: "Are payments refundable?",
    a: "No. A completed payment claims the rank immediately and is not refundable, except when a technical error charged you twice or we remove a compliant listing without cause. Contact us with your order details.",
  },
  {
    q: "What can I not list?",
    a: "Chat and invite links, link shorteners, adult content, and anything illegal or deceptive. Only a product website or an X profile can be listed. Tracking parameters are stripped from every link.",
  },
  {
    q: "What is the difference between All-time, Today and category boards?",
    a: "All-time ranks by every dollar ever paid and never expires. Today ranks by dollars paid since midnight UTC and resets daily; past days are kept in the Daily archive. Category boards rank the same all-time totals inside one category, so category #1 is far cheaper than overall #1.",
  },
];
