# Complete CLOUTIVO Project Domain Audit (Read-Only)

**Date**: November 13, 2026  
**Auditor Role**: Senior Next.js Architect, Full-Stack Developer, SEO Engineer & Security Auditor  
**Project Root**: `D:\cloutivo`  
**Old Production Domain Under Investigation**: `https://cloutivo.vercel.app`  
**New Intended Target Domains**:
- Primary Canonical Domain: `https://cloutivo.in`
- WWW Domain: `https://www.cloutivo.in`

---

## 1. Executive Summary

A comprehensive, read-only audit of the entire `D:\cloutivo` repository was conducted to inspect all domain references, URL configurations, SEO parameters, environment variables, and third-party integrations.

### Key Audit Findings:
1. **Old Domain `cloutivo.vercel.app` Status**:
   - **0 instances** of `cloutivo.vercel.app` or `http://cloutivo.vercel.app` exist in any workspace file.
   - Vercel-related references are strictly limited to technical infrastructure: `.vercel` in `.gitignore:10`, comment about `Vercel WAF` in `lib/ratelimit.ts:2`, and the request header `x-vercel-ip-country` in `app/api/analytics/route.ts:22`.
   - **Conclusion**: The codebase does not harbor hardcoded `cloutivo.vercel.app` URLs. However, any existing traffic pointing to `cloutivo.vercel.app` must be redirected to `https://cloutivo.in` at the Vercel DNS/Edge routing level.

2. **The "Shadow Domain" Problem (`cloutivo.com`)**:
   - Although `cloutivo.vercel.app` was absent, the audit uncovered **multiple hardcoded references to `https://cloutivo.com`** across core SEO and configuration files:
     - `app/layout.tsx`: `metadataBase`, `alternates.canonical`, `openGraph.url`, and JSON-LD structured data.
     - `app/robots.ts`: `sitemap: "https://cloutivo.com/sitemap.xml"`.
     - `app/sitemap.ts`: `const baseUrl = "https://cloutivo.com";`.
     - `lib/config.ts`: Fallback default when `NEXT_PUBLIC_APP_URL` is empty.
     - `app/backlinks/page.tsx`: Razorpay payment link (`https://rzp.io/rzp/cloutivo.com`).
     - `README.md`: Setup instructions listing webhooks on `cloutivo.com`.

3. **Insecure Protocol in `.env.local` (`http://` vs `https://`)**:
   - Line 2 of `.env.local` contains `NEXT_PUBLIC_APP_URL=http://cloutivo.in`.
   - **Critical SEO / Security Risk**: Because `lib/config.ts` uses `process.env.NEXT_PUBLIC_APP_URL` as `SITE.url`, all dynamically constructed URLs (RSS feed, LLMs discovery, Stripe redirects, and IndexNow pings) currently generate with the insecure `http://` protocol.

4. **Safety & Zero Code Modifications**:
   - In accordance with read-only audit instructions, **zero source code files, environment files, git configurations, or assets were modified or deleted**.
   - Only audit reports were written to the root directory.

---

## 2. Scan Statistics

- **Total Files in Workspace (excluding `node_modules`, `.next`, `.git`)**: 92 files
- **Total Readable Files Scanned**: 92 files
- **Total Unreadable or Skipped Files**: 0 files
- **Total Exact Matches for `cloutivo.vercel.app`**: 0
- **Total Exact Matches for `vercel.app`**: 0 (excluding 1 external test link to a 3rd party site `digiseller-mart.lovable.app`)
- **Total References to `cloutivo.com`**: 11 occurrences across 6 files
- **Total References to `cloutivo.in`**: 2 occurrences in `.env.local`
- **Total Indirect Domain Consumers (`SITE.url` / `abs()` / `NEXT_PUBLIC_APP_URL`)**: 12 files

---

## 3. Comprehensive Master Findings Table

The table below catalogs every hardcoded URL reference, domain fallback, and protocol issue discovered:

| File Path | Line | Old Reference | Category | Risk Level | Code Context | Recommendation | Replacement |
|---|---|---|---|---|---|---|---|
| `app/layout.tsx` | 28 | `https://cloutivo.com` | SEO | **Critical** | `metadataBase: new URL("https://cloutivo.com")` | Change hardcoded URL to dynamic config or intended primary domain | `new URL(process.env.NEXT_PUBLIC_APP_URL \|\| "https://cloutivo.in")` |
| `app/layout.tsx` | 30 | `https://cloutivo.com` | SEO | **Critical** | `alternates: { canonical: "https://cloutivo.com" }` | Prevent Google from indexing the wrong root domain | `"https://cloutivo.in"` |
| `app/layout.tsx` | 35 | `https://cloutivo.com` | SEO | **High** | `openGraph: { url: "https://cloutivo.com" }` | Fix social media card canonical sharing URL | `"https://cloutivo.in"` |
| `app/layout.tsx` | 78 | `https://cloutivo.com` | SEO | **High** | JSON-LD schema: `url: "https://cloutivo.com"` | Update structured knowledge for AI / Googlebot | `"https://cloutivo.in"` |
| `app/layout.tsx` | 82 | `https://cloutivo.com/?q={search_term_string}` | SEO | **Medium** | JSON-LD `potentialAction` target URL | Update SearchAction schema target URL | `"https://cloutivo.in/?q={search_term_string}"` |
| `app/robots.ts` | 9 | `https://cloutivo.com/sitemap.xml` | SEO | **Critical** | `sitemap: "https://cloutivo.com/sitemap.xml"` | Fix robots.txt sitemap pointer for search crawlers | `${SITE.url}/sitemap.xml` |
| `app/sitemap.ts` | 4 | `https://cloutivo.com` | SEO | **Critical** | `const baseUrl = "https://cloutivo.com";` | Import `SITE` from `lib/config` so sitemap entries adapt to the primary domain | `const baseUrl = SITE.url;` |
| `lib/config.ts` | 5 | `https://cloutivo.com` | Config | **Critical** | `clean(process.env.NEXT_PUBLIC_APP_URL, "https://cloutivo.com")` | Update default fallback if environment variable is missing | `"https://cloutivo.in"` |
| `.env.local` | 2 | `http://cloutivo.in` | Config | **Critical** | `NEXT_PUBLIC_APP_URL=http://cloutivo.in` | Insecure HTTP scheme causes mixed-content, breaks SSL, and hurts SEO | `NEXT_PUBLIC_APP_URL=https://cloutivo.in` |
| `.env.local` | 15 | `https://cloutivo.in/api/webhooks/razorpay` | Backend | **High** | `RAZORPAY_WEBHOOK_URL=https://cloutivo.in/...` | Correct domain, but ensure Razorpay dashboard matches exactly | Retain `https://cloutivo.in/api/webhooks/razorpay` |
| `app/backlinks/page.tsx` | 109 | `https://rzp.io/rzp/cloutivo.com` | Payments | **High** | `<a href="https://rzp.io/rzp/cloutivo.com" ...>` | Razorpay hosted payment page slug contains `.com` | Verify page exists in Razorpay Dashboard or update if renamed |
| `.env.example` | 2 | `https://yourdomain.com` | Config | **Low** | `NEXT_PUBLIC_APP_URL=https://yourdomain.com` | Placeholder in example file | `https://cloutivo.in` |
| `README.md` | 13 | `https://cloutivo.com/api/webhooks/razorpay` | Docs | **Low** | Documentation setup guide | Update setup instructions to intended domain | `https://cloutivo.in/api/webhooks/razorpay` |
| `README.md` | 14 | `https://cloutivo.com/api/webhooks/stripe` | Docs | **Low** | Documentation setup guide | Update setup instructions to intended domain | `https://cloutivo.in/api/webhooks/stripe` |
| `docs/FILE_MAP.md` | 28 | `https://cloutivo.com` | Docs | **Low** | Historical changelog comment | Retain as historical record or update note | `https://cloutivo.in` |
| `next.config.ts` | 28 | `https://yourdomain.com/<INDEXNOW_KEY>.txt` | Config | **Low** | Code comment explaining rewrite rule | Update documentation comment | `// https://cloutivo.in/<INDEXNOW_KEY>.txt` |

---

## 4. Architectural Area Breakdown

### A. SEO & Discovery
- **`metadataBase` & Canonical URLs**:
  - `app/layout.tsx:28` currently sets `metadataBase: new URL("https://cloutivo.com")`.
  - Next.js uses `metadataBase` to resolve all relative OpenGraph image URLs and canonical tags across all pages (`/daily`, `/categories`, `/deals`, `/product/[slug]`).
  - Because `metadataBase` is set to `cloutivo.com`, all social sharing cards currently generate absolute URLs pointing to the wrong domain.
- **`robots.ts` & `sitemap.ts`**:
  - `app/robots.ts` generates `/robots.txt`. It hardcodes `Sitemap: https://cloutivo.com/sitemap.xml`.
  - `app/sitemap.ts` generates `/sitemap.xml`. It hardcodes `const baseUrl = "https://cloutivo.com";`.
  - **Impact**: Search engines reading `cloutivo.in/robots.txt` are redirected to index `cloutivo.com` URLs instead of `cloutivo.in`.
- **JSON-LD Structured Data**:
  - `lib/seo.ts` correctly uses `abs()` and `SITE.url` (dynamic).
  - However, `app/layout.tsx:78` hardcodes `url: "https://cloutivo.com"` in its inline `WebSite` schema.

### B. Next.js Configuration (`next.config.ts`)
- **Headers & Security**:
  - Comprehensive security headers (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, `Strict-Transport-Security`).
  - Edge caching headers configured for `/llms.txt`, `/llms-full.txt`, and `/feed.xml`.
- **Rewrites & Redirects**:
  - IndexNow rewrite: `/:key([A-Za-z0-9]{16,64}).txt` -> `/api/indexnow-key?key=:key`.
  - No domain redirects are currently declared in `next.config.ts`.
  - **Recommendation**: Domain canonicalization (`www` to non-`www` and `.vercel.app` to `cloutivo.in`) is best handled at the Vercel DNS/Edge routing level to avoid serverless function invocation overhead.

### C. Authentication & Session Management
- **Zero Third-Party OAuth Redirects**:
  - The application has no NextAuth, Auth0, Clerk, or Supabase OAuth redirect URIs.
  - User and admin authentication is session-free or token-authenticated:
    - Admin access uses an `adminSecret` header / payload verified against `process.env.ADMIN_SECRET` in `app/api/admin/rank/route.ts`.
    - Public visitors generate a local `sessionStorage` token (`cloutivo_sid`) in `components/layout/Navbar.tsx` for anonymous telemetry.
  - **No external OAuth redirect URLs need updating in third-party dashboards.**

### D. Frontend Components
- **Internal Links**:
  - All navigation in `Navbar.tsx`, `Footer.tsx`, `Board.tsx`, `DealCard.tsx`, and `LiveActivitySidebar.tsx` uses Next.js relative paths (`/`, `/today`, `/daily`, `/deals`, `/categories`, `/about`, `/rules`, `/faq`, `/terms`, `/privacy`). None are hardcoded to any absolute domain.
- **Outbound Click Tracker**:
  - `app/go/[slug]/route.ts` records human clicks and redirects to target products. If a listing is invalid, it falls back to `new URL("/", SITE.url)`.

### E. Backend & Payment Integrations
- **Razorpay**:
  - `app/api/checkout/upi/route.ts`: Creates server-side order with `currency: "INR"`. Does not hardcode redirect URLs.
  - `app/api/checkout/upi/verify/route.ts`: Verifies HMAC SHA-256 signature and fulfills rank in Supabase.
  - `app/api/webhooks/razorpay/route.ts`: Processes `order.paid` webhooks.
  - `app/backlinks/page.tsx:109`: Direct link to Razorpay Payment Page `https://rzp.io/rzp/cloutivo.com`.
- **Stripe**:
  - `app/api/checkout/stripe/route.ts`:
    - `success_url: abs(`/product/${encodeURIComponent(p.slug)}?paid=1`)`
    - `cancel_url: abs("/?canceled=1")`
    - Relies directly on `abs()`, which inherits `NEXT_PUBLIC_APP_URL`. When `.env.local` is corrected to `https://cloutivo.in`, Stripe redirects automatically point to `https://cloutivo.in`.
- **IndexNow Search Engine Ping**:
  - `lib/indexnow.ts`: Submits updated URLs to Bing via `https://api.indexnow.org/indexnow`.
  - Uses `new URL(SITE.url).host` and `${SITE.url}/${key}.txt`.

### F. Deployment & Vercel
- No `vercel.json` exists in the repository.
- Vercel's edge request header `x-vercel-ip-country` is leveraged in `app/api/analytics/route.ts:22` to detect visitor geography without external IP-lookup APIs.

---

## 5. Confirmed Findings vs. Possible Issues

### Confirmed Findings (Facts Verified from Code):
1. No instances of `cloutivo.vercel.app` exist in workspace files.
2. `.env.local` specifies `http://cloutivo.in` (insecure HTTP protocol).
3. `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts` have hardcoded `https://cloutivo.com` references that bypass `NEXT_PUBLIC_APP_URL`.
4. `NEXT_PUBLIC_APP_URL` is the sole base-URL variable used by the application; `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` are not consumed.

### Possible Issues Requiring External Verification:
1. **Vercel Project Dashboard**: Verify that `cloutivo.in` is designated as the primary domain, and that `www.cloutivo.in` and `cloutivo.vercel.app` are configured to redirect (301) to `cloutivo.in`.
2. **Razorpay Dashboard**: Confirm that the webhook URL registered under **Settings > Webhooks** is set to `https://cloutivo.in/api/webhooks/razorpay`.
3. **Razorpay Hosted Page**: Confirm whether the hosted payment page `https://rzp.io/rzp/cloutivo.com` remains active or has an updated slug.
4. **Stripe Dashboard**: If active, ensure the webhook endpoint is set to `https://cloutivo.in/api/webhooks/stripe`.
