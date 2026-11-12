export type Listing = {
  id: string;
  slug: string;
  url: string;
  host: string;
  title: string;
  tagline: string;
  category: string;
  discount: string | null;
  coupon_code: string | null;
  deal_verified: boolean;
  total_cents: number;
  click_count: number;
  created_at: string;
  updated_at: string;
  rank: number;
  category_rank: number;
};

export type TodayListing = {
  id: string;
  slug: string;
  url: string;
  host: string;
  title: string;
  tagline: string;
  category: string;
  discount: string | null;
  coupon_code: string | null;
  deal_verified: boolean;
  total_cents: number;
  click_count: number;
  created_at: string;
  day_cents: number;
  day_rank: number;
};

export type Stats = { listings: number; total_cents: number; clicks: number };
export type CategoryStat = { category: string; listings: number; top_cents: number; clicks: number };

export type Faq = { q: string; a: string };

export type DailyArchiveRow = { day: string; slug: string; title: string; host: string; category: string; day_cents: number; pos: number; listings_that_day: number };
export type Activity = { slug: string; title: string; amount_cents: number; created_at: string };
export type PaidDay = { day: string; cents: number; listings: number };
export type Sample = { slug: string; title: string; tagline: string; category: string; host: string };
