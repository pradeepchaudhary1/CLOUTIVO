export interface DealItem {
  id: string;
  rank: number;
  title: string;
  description: string;
  url: string;
  displayUrl: string;
  totalPaid: number;
  nextBidPrice: number;
  category: string;
  discount: string;
  couponCode: string;
  clicks: number;
  timeAgo: string;
  isSample?: boolean;
}

export const INITIAL_DEALS: DealItem[] = [
  {
    id: "sample-1",
    rank: 1,
    title: "Acme Agents — Sample AI Workflow Listing",
    description: "Clearly labelled sample preview listing. Disappears automatically once 5 real paid listings arrive.",
    url: "#claim",
    displayUrl: "sample-listing.example",
    totalPaid: 0,
    nextBidPrice: 10,
    category: "AI Agents & Tech",
    discount: "Sample Deal",
    couponCode: "SAMPLE",
    clicks: 0,
    timeAgo: "Sample",
    isSample: true,
  },
  {
    id: "sample-2",
    rank: 2,
    title: "Globex Forms — Sample SaaS Form Builder",
    description: "Clearly labelled sample preview listing. Claim a rank to appear here with your real product.",
    url: "#claim",
    displayUrl: "sample-saas.example",
    totalPaid: 0,
    nextBidPrice: 10,
    category: "SaaS & Web Apps",
    discount: "",
    couponCode: "",
    clicks: 0,
    timeAgo: "Sample",
    isSample: true,
  },
];

export const CATEGORIES = [
  "All",
  "AI Agents & Tech",
  "SaaS & Web Apps",
  "Developer Tools",
  "Marketing & SEO",
  "Agencies & Services",
  "Productivity & Tools",
];