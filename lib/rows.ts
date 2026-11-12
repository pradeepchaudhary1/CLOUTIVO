import type { BoardRow } from "@/components/Board";
import { TAKE_FIRST_MARGIN_CENTS, MIN_RAISE_CENTS } from "./pricing";
import type { Listing, TodayListing } from "./types";

const beat = (rank: number, amount: number) => amount + (rank === 1 ? TAKE_FIRST_MARGIN_CENTS : MIN_RAISE_CENTS);

export const toRows = (list: Listing[], by: "overall" | "category" = "overall"): BoardRow[] =>
  list.map((l) => {
    const rank = by === "category" ? l.category_rank : l.rank;
    return {
      rank,
      slug: l.slug,
      title: l.title,
      tagline: l.tagline,
      category: l.category,
      host: l.host,
      clicks: l.click_count,
      amountCents: l.total_cents,
      createdAt: l.created_at,
      discount: l.discount,
      coupon: l.coupon_code,
      verified: l.deal_verified,
      beatCents: beat(rank, l.total_cents),
      sub: by === "category" ? `#${l.rank} overall` : undefined,
    };
  });

export const toTodayRows = (list: TodayListing[]): BoardRow[] =>
  list.map((l) => ({
    rank: l.day_rank,
    slug: l.slug,
    title: l.title,
    tagline: l.tagline,
    category: l.category,
    host: l.host,
    clicks: l.click_count,
    amountCents: l.day_cents,
    createdAt: l.created_at,
    discount: l.discount,
    coupon: l.coupon_code,
    verified: l.deal_verified,
    beatCents: beat(l.day_rank, l.day_cents),
  }));
