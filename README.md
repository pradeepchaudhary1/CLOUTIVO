# Cloutivo v2

Next.js 16 + Supabase + Razorpay (UPI, INR) + optional Stripe (cards, USD). Server-rendered, ISR-cached, almost no client JS. See `docs/FILE_MAP.md` for what happened to every file in your original zip.

## Verified vs not verified
- Verified in my sandbox: `tsc --noEmit` passes, `eslint` is clean, URL and pricing logic tests pass.
- NOT verified (no network there): `next build`, the SQL on a real Supabase project, and live Razorpay/Stripe payments. Run Step 0 first.

## Setup
0. `npm install && npm run typecheck && npm run build`
1. Supabase: SQL Editor → run `supabase/schema.sql`. Optional: run `supabase/sample-listings.sql` for clearly labelled fictional sample rows.
2. Copy `.env.example` to `.env.local` and fill it in (Razorpay test keys first). `NEXT_PUBLIC_APP_URL` must be your final domain.
3. Razorpay webhook: `https://cloutivo.com/api/webhooks/razorpay`, event `order.paid`, secret into `RAZORPAY_WEBHOOK_SECRET`.
4. Stripe (optional): webhook `https://cloutivo.com/api/webhooks/stripe`, events `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
5. Deploy to Vercel with the same env vars. Test one ₹ payment in Razorpay test mode end to end.
6. To mark a deal's code as tested: Supabase → Table editor → listings → set `deal_verified = true` (only after you used the code yourself).
7. Backlink Booster: set `NEXT_PUBLIC_BACKLINK_SERVICE=on` only when you can actually deliver. Requests land in the `service_requests` table.

## Going live honestly (replacing fake data)
- Day 0: do NOT paste fake listings, fake stats or fake testimonials. Use `sample-listings.sql` (labelled "Sample", unranked, no price/clicks/link). They vanish automatically once 5 real paid listings exist.
- Seed the board with real products: your own, partners who agree in writing, or free launch listings you clearly mark as such.
- When customers post results publicly, link the original post on /about. Never paraphrase into a quote you cannot link.
