import { USD_INR_RATE } from "./config";

export const MIN_NEW_CENTS = 1000; // $10 to enter the board
export const MIN_RAISE_CENTS = 100; // raising an existing rank: at least +$1
export const TAKE_FIRST_MARGIN_CENTS = 500; // taking #1 costs at least +$5 over the current #1
export const MAX_TOTAL_CENTS = 99_999_900; // $999,999

export type ChargeResult =
  | { ok: true; chargeCents: number; isNew: boolean }
  | { ok: false; error: string };

/**
 * Server-side price calculation. `targetCents` is the total the listing should
 * hold after payment; the buyer is charged only the difference.
 * The browser never decides the price - it only proposes a target.
 */
export function computeCharge(currentCents: number | null, targetCents: number): ChargeResult {
  if (!Number.isInteger(targetCents) || targetCents <= 0) return { ok: false, error: "Enter a whole-dollar amount." };
  if (targetCents % 100 !== 0) return { ok: false, error: "Amounts are whole US dollars." };
  if (targetCents > MAX_TOTAL_CENTS) return { ok: false, error: "The maximum rank amount is $999,999." };
  if (currentCents === null) {
    if (targetCents < MIN_NEW_CENTS) return { ok: false, error: "New listings start at $10." };
    return { ok: true, chargeCents: targetCents, isNew: true };
  }
  if (targetCents < currentCents + MIN_RAISE_CENTS) {
    return { ok: false, error: `This listing already holds $${currentCents / 100}. Raise it by at least $1.` };
  }
  return { ok: true, chargeCents: targetCents - currentCents, isNew: false };
}

/** Price to take #1 given the current top total (null = empty board). */
export const priceForFirst = (topCents: number | null) =>
  topCents === null ? MIN_NEW_CENTS : topCents + TAKE_FIRST_MARGIN_CENTS;

/** USD cents -> INR paise, rounded up so we never under-collect. */
export const toPaise = (usdCents: number, rate = USD_INR_RATE) => Math.ceil(usdCents * rate);
