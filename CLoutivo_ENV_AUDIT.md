# CLOUTIVO Environment Variables Audit

> **Confidentiality Notice:** In accordance with security audit protocols, no actual secrets, private tokens, passwords, or production keys are exposed in this document. Only variable names, file locations, consumption points, and migration recommendations are detailed.

---

## 1. Executive Summary: Environment Configuration

The CLOUTIVO codebase is configured to centralize domain, payment, database, and SEO settings via standard Next.js environment variables.

### Key Audit Findings:
1. **Critical Protocol Mismatch in `.env.local`**:
   - `NEXT_PUBLIC_APP_URL` is set to `http://cloutivo.in` (insecure HTTP).
   - In Next.js, this variable feeds `SITE.url` in `lib/config.ts`, which generates canonical URLs, OpenGraph URLs, RSS feeds, Stripe redirect URLs, and IndexNow pings.
   - **Risk**: Setting an HTTP protocol causes canonical tags to point to insecure URLs, creates mixed-content warnings, breaks SSL redirects, and weakens search ranking authority.
   - **Immediate Action Required**: Update to `https://cloutivo.in`.

2. **Standardization on `NEXT_PUBLIC_APP_URL`**:
   - The application exclusively uses `NEXT_PUBLIC_APP_URL` to determine the base URL.
   - Variables like `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `BASE_URL`, `APP_URL`, `API_URL`, and `NEXTAUTH_URL` are **not** consumed by any code in the project.

3. **Missing Production Deployment Environment File**:
   - Neither `.env.production` nor `.env` exists in the local project root.
   - Production environment variables must be configured directly within the Vercel Dashboard under **Project Settings > Environment Variables**.

---

## 2. Complete Environment Variable Inventory

| Variable Name | Defined In | Scope / Sensitivity | Where Consumed in Code | Current Status / Finding | Recommendation |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `.env.local:2`<br>`.env.example:2` | Public (Client & Server) | `lib/config.ts:5`<br>`README.md:12` | Defined as `http://cloutivo.in` in `.env.local`. Fallback in `lib/config.ts` is `https://cloutivo.com`. | **CRITICAL**: Change to `https://cloutivo.in` in `.env.local` and in Vercel Dashboard. Update fallback in `lib/config.ts`. |
| `NEXT_PUBLIC_SITE_NAME` | `.env.local:3`<br>`.env.example:3` | Public (Client & Server) | `lib/config.ts:4` | Set to `CLOUTIVO`. Fallback is `"Cloutivo"`. | Healthy. Retain as `CLOUTIVO`. |
| `NEXT_PUBLIC_TWITTER` | `.env.example:5` | Public (Client & Server) | `lib/config.ts:6` | Optional. Fallback in `lib/config.ts` is `"cloutivo"`. | Populate with the official X handle if active. |
| `CONTACT_EMAIL` | `.env.local:4`<br>`.env.example:6` | Server / Metadata | `lib/config.ts:7` | Set to agency contact email in `.env.local`. Fallback is `"hello@example.com"`. | Update to official domain email (e.g. `support@cloutivo.in`) once domain email is set up. |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local:7`<br>`.env.example:15` | Public (Client & Server) | `lib/supabase.ts:3` | Connected to active Supabase project. | Verify active and replicated across Vercel production settings. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local:8`<br>`.env.example:16` | Public (Client & Server) | `lib/supabase.ts:4` | Connected to active Supabase anon key. | Verify present in Vercel environment settings. |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local:9`<br>`.env.example:18` | **Secret (Server Only)** | `lib/supabase.ts:19`<br>`app/go/[slug]/route.ts:20` | Connected to active service role key for atomic DB transactions and click deduplication. | **Do NOT expose in client code.** Ensure set only in Vercel production secrets. |
| `RAZORPAY_KEY_ID` | `.env.local:12`<br>`.env.example:25` | Public / Publishable | `lib/payments.ts:4`<br>`app/api/checkout/upi/route.ts:11` | Currently configured with Test Key (`rzp_test_...`). | Switch to Live Key (`rzp_live_...`) when ready for live payments. |
| `RAZORPAY_KEY_SECRET` | `.env.local:13`<br>`.env.example:26` | **Secret (Server Only)** | `lib/payments.ts:4`<br>`app/api/checkout/upi/route.ts:12`<br>`app/api/checkout/upi/verify/route.ts:17` | Configured with Test Secret. | Switch to Live Secret upon production launch. |
| `RAZORPAY_WEBHOOK_SECRET` | `.env.local:14`<br>`.env.example:27` | **Secret (Server Only)** | `app/api/webhooks/razorpay/route.ts:14` | Configured for verifying incoming webhook signatures. | Ensure webhook secret in Razorpay Dashboard matches this value. |
| `RAZORPAY_WEBHOOK_URL` | `.env.local:15` | Configuration / Reference | Referenced in setup docs & `.env.local` | Set to `https://cloutivo.in/api/webhooks/razorpay`. | Ensure Razorpay Dashboard webhook endpoint points to this exact URL. |
| `USD_INR_RATE` | `.env.local:16`<br>`.env.example:29` | Configuration (Server) | `lib/config.ts:17` | Set to `88`. Fallback in code is `88`. | Update periodically if USD/INR exchange rate shifts significantly. |
| `ADMIN_SECRET` | `.env.local:17` | **Secret (Server Only)** | `app/api/admin/rank/route.ts:6` | Used to authenticate manual admin ranking operations at `/admin`. | Set a high-entropy secret in production Vercel environment. |
| `STRIPE_SECRET_KEY` | `.env.example:21` | **Secret (Server Only)** | `lib/payments.ts:5`<br>`app/api/checkout/stripe/route.ts:11`<br>`app/api/webhooks/stripe/route.ts:6` | Optional card checkout. Currently unset in `.env.local`. | Populate in Vercel if international USD card checkout via Stripe is enabled. |
| `STRIPE_WEBHOOK_SECRET` | `.env.example:22` | **Secret (Server Only)** | `app/api/webhooks/stripe/route.ts:7` | Optional. Currently unset in `.env.local`. | Populate if Stripe webhook is configured. |
| `GOOGLE_SITE_VERIFICATION` | `.env.example:9` | SEO Verification | Can be used in `app/layout.tsx` `verification.google` | Currently blank in `.env.example`. | Add Google Search Console verification token. |
| `BING_SITE_VERIFICATION` | `.env.example:10` | SEO Verification | Can be used in `app/layout.tsx` `verification.other` | Currently blank in `.env.example`. | Add Bing Webmaster Tools verification token. |
| `INDEXNOW_KEY` | `.env.example:12` | Search Engine Integration | `lib/indexnow.ts:8`<br>`app/api/indexnow-key/route.ts:4` | Dynamic rewrite served at `/:key.txt`. Unset in `.env.local`. | Generate a 16-64 alphanumeric string and set in production for instant Bing indexing. |
| `NEXT_PUBLIC_DEALS_END_ISO` | Unset in `.env*` | Public (Client & Server) | `lib/config.ts:20` | Fallback in code: `"2026-12-01T00:00:00Z"`. | Optional. Override if deals deadline is adjusted. |
| `NEXT_PUBLIC_BACKLINK_SERVICE`| Unset in `.env*` | Feature Flag | `lib/config.ts:21` | Defaults to false unless set to `"on"`. | Set to `"on"` if the manual directory submission service is actively offered. |

---

## 3. Dependency Graph of `NEXT_PUBLIC_APP_URL`

`NEXT_PUBLIC_APP_URL` is the single source of truth for all absolute URL generation across the entire platform. The diagram below illustrates how changing this variable propagates through the codebase:

```
NEXT_PUBLIC_APP_URL (in .env.local / Vercel Environment)
  │
  ▼
lib/config.ts: SITE.url
  │
  ├─► lib/config.ts: abs(path)
  │     ├─► app/feed.xml/route.ts (RSS Feed URLs: <link>, <guid>, <atom:link>)
  │     ├─► app/llms.txt/route.ts & lib/llms.ts (AI Agent crawler discovery links)
  │     ├─► app/api/checkout/stripe/route.ts (success_url & cancel_url)
  │     └─► lib/seo.ts (JSON-LD Organization, WebSite, Breadcrumbs, ItemList)
  │
  ├─► lib/indexnow.ts (Ping search engines: host, keyLocation, urlList)
  │
  └─► app/go/[slug]/route.ts (Fallback redirect target if listing not found)
```

### Files Bypassing `SITE.url` (Hardcoded Risk):
The following files currently do **not** use `SITE.url` or `process.env.NEXT_PUBLIC_APP_URL`, and therefore remain stuck on `https://cloutivo.com` even if `NEXT_PUBLIC_APP_URL` is changed:
1. `app/layout.tsx` (Lines 28, 30, 35, 78, 82)
2. `app/robots.ts` (Line 9)
3. `app/sitemap.ts` (Line 4)
4. `lib/config.ts` Fallback (Line 5)

---

## 4. Environment Migration Recommendations

1. **Fix `.env.local` immediately**:
   ```env
   # Update line 2:
   NEXT_PUBLIC_APP_URL=https://cloutivo.in
   ```
2. **Replicate to Vercel Production Environment**:
   - Navigate to Vercel Project Dashboard → **Settings** → **Environment Variables**.
   - Add/Verify `NEXT_PUBLIC_APP_URL` = `https://cloutivo.in` (Target: **Production, Preview, Development**).
   - Add/Verify all Supabase and Razorpay credentials.
3. **Harmonize Code Fallbacks**:
   - In `lib/config.ts`: change fallback from `"https://cloutivo.com"` to `"https://cloutivo.in"`.
   - In `app/sitemap.ts`: replace `const baseUrl = "https://cloutivo.com";` with `const baseUrl = SITE.url;`.
   - In `app/robots.ts`: replace hardcoded string with `${SITE.url}/sitemap.xml`.
   - In `app/layout.tsx`: reference `SITE.url` for `metadataBase`, `alternates.canonical`, and `openGraph.url`.
