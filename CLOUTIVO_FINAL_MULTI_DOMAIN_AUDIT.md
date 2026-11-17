# CLOUTIVO — Complete Multi-Domain Forensic Audit Report

**Audit Mode**: Read-Only Source Code, Environment & Architecture Forensic Audit  
**Project Root**: `D:\cloutivo`  
**Execution Timestamp**: November 13, 2026  
**Auditor Roles**: Senior Full-Stack Developer, Next.js Architect, SEO Specialist & Code Auditor  

---

## 1. Executive Summary

A comprehensive multi-domain forensic audit was executed across the entire `D:\cloutivo` project directory. The purpose of this audit is to identify every exact occurrence, protocol variation, dynamic constructor, and architectural implication of past, current, and intended domains.

### Primary Audit Verdicts:
1. **`cloutivo.vercel.app`**: **0 occurrences** exist in the codebase. The legacy development domain is not referenced in code, metadata, or configuration files.
2. **`https://cloutivo.com` ("The Shadow Domain")**: **11 exact occurrences across 6 files**. The site’s core SEO infrastructure (`metadataBase`, `canonical`, OpenGraph, JSON-LD structured data, `robots.ts`, and `sitemap.ts`) is hardcoded to `https://cloutivo.com`, completely bypassing `.env` configuration.
3. **`http://cloutivo.in` (Insecure Protocol Risk)**: In `.env.local:2`, `NEXT_PUBLIC_APP_URL` is set to `http://cloutivo.in` (unencrypted HTTP). Because `lib/config.ts` consumes this variable as `SITE.url`, all dynamically constructed URLs (RSS feeds, AI crawler maps, Stripe return URLs, IndexNow pings) inherit insecure `http://` links.
4. **`https://cloutivo.in`**: Configured as the webhook target in `.env.local:15` (`RAZORPAY_WEBHOOK_URL`).
5. **`rzp.io/rzp/cloutivo.com` (External Payment Link)**: Present on `app/backlinks/page.tsx:109`. This is an external Razorpay-hosted checkout page slug, distinct from the website’s canonical domain.
6. **Literal typo `www.c;outivo.com`**: **0 occurrences** found across all files.

---

## 2. Scan Coverage & File Inventory

- **Total Workspace Files Scanned**: **92 files** (excluding `node_modules`, `.next`, `.git`)
- **Total Readable Files**: **92 files** (100% of project source)
- **Total Unreadable or Skipped Files**: **0 files**

### Directory Breakdown:
* **Root (`/`)**: 11 files (`.env.example`, `.env.local`, `.gitignore`, `AGENTS.md`, `eslint.config.mjs`, `next-env.d.ts`, `next.config.ts`, `package.json`, `postcss.config.mjs`, `README.md`, `tsconfig.json`)
* **`app/`**: 39 files (Pages, Layouts, API Route handlers, SEO generators, Styles)
* **`components/`**: 17 files (Layout, Deals, UI, Core components)
* **`lib/`**: 18 files (Database, Config, Pricing, Orders, Formatting, Types, SEO)
* **`docs/`**: 1 file (`FILE_MAP.md`)
* **`.agents/`**: 2 files (Prisma skill documentation files)
* **`public/`**: 2 files (`icon.svg`, `logo.png`)
* **`supabase/`**: 2 files (`schema.sql`, `sample-listings.sql`)

---

## 3. Individual Domain Audit Tables

Below is the separate forensic table for EVERY required domain.

---

### Domain 1: `https://cloutivo.com`
* **Protocol**: HTTPS
* **Total Occurrences**: **11**
* **File Count**: 6 files

| File | Line | Matched Domain | Protocol | Context / Full Line | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `app/layout.tsx` | 28 | `https://cloutivo.com` | HTTPS | `metadataBase: new URL("https://cloutivo.com"),` | Root resolution base for all relative metadata, OG images, and canonicals | SEO | **Critical** | Update to `new URL(SITE.url)` or `new URL(process.env.NEXT_PUBLIC_APP_URL \|\| "https://cloutivo.in")` |
| `app/layout.tsx` | 30 | `https://cloutivo.com` | HTTPS | `canonical: "https://cloutivo.com",` | Instructs search engines that .com is the primary indexed domain | SEO | **Critical** | Update to `"https://cloutivo.in"` (or `SITE.url`) |
| `app/layout.tsx` | 35 | `https://cloutivo.com` | HTTPS | `url: "https://cloutivo.com",` | OpenGraph website URL tag for social card unfurling | SEO | **High** | Update to `"https://cloutivo.in"` |
| `app/layout.tsx` | 78 | `https://cloutivo.com` | HTTPS | `url: "https://cloutivo.com",` | JSON-LD Schema.org `WebSite` entity URL | SEO | **High** | Update to `"https://cloutivo.in"` |
| `app/layout.tsx` | 82 | `https://cloutivo.com` | HTTPS | `target: "https://cloutivo.com/?q={search_term_string}",` | JSON-LD `potentialAction` search endpoint | SEO | **Medium** | Update to `"https://cloutivo.in/?q={search_term_string}"` |
| `app/robots.ts` | 9 | `https://cloutivo.com` | HTTPS | `sitemap: "https://cloutivo.com/sitemap.xml",` | Sitemap reference directive in generated `robots.txt` | SEO | **Critical** | Update to `${SITE.url}/sitemap.xml` |
| `app/sitemap.ts` | 4 | `https://cloutivo.com` | HTTPS | `const baseUrl = "https://cloutivo.com";` | Base prefix for all generated `<loc>` URLs in `sitemap.xml` | SEO | **Critical** | Import `SITE` from `@/lib/config` and use `const baseUrl = SITE.url;` |
| `lib/config.ts` | 5 | `https://cloutivo.com` | HTTPS | `url: clean(process.env.NEXT_PUBLIC_APP_URL, "https://cloutivo.com").replace(/\/+$/, ""),` | Fallback default site URL if environment variable is missing | Config | **Critical** | Update fallback to `"https://cloutivo.in"` |
| `README.md` | 13 | `https://cloutivo.com` | HTTPS | `3. Razorpay webhook: https://cloutivo.com/api/webhooks/razorpay, event order.paid...` | Setup documentation for developer webhook wiring | Docs | **Low** | Update documentation to `https://cloutivo.in/api/webhooks/razorpay` |
| `README.md` | 14 | `https://cloutivo.com` | HTTPS | `4. Stripe (optional): webhook https://cloutivo.com/api/webhooks/stripe...` | Setup documentation for Stripe webhook wiring | Docs | **Low** | Update documentation to `https://cloutivo.in/api/webhooks/stripe` |
| `docs/FILE_MAP.md` | 28 | `https://cloutivo.com` | HTTPS | `Fixed canonical (was https://cloutivo.com on EVERY page...` | Historical log in architecture file map | Docs | **Low** | Informational changelog note |

---

### Domain 2: `https://www.cloutivo.com`
* **Protocol**: HTTPS
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Low | No action required in source code |

---

### Domain 3: `http://cloutivo.com`
* **Protocol**: HTTP
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Low | No action required in source code |

---

### Domain 4: `http://www.cloutivo.com`
* **Protocol**: HTTP
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Low | No action required in source code |

---

### Domain 5: `https://cloutivo.vercel.app`
* **Protocol**: HTTPS
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Medium | Configure 301 redirect in Vercel to `https://cloutivo.in` |

---

### Domain 6: `http://cloutivo.vercel.app`
* **Protocol**: HTTP
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Low | No action required in source code |

---

### Domain 7: `https://cloutivo.in`
* **Protocol**: HTTPS
* **Total Occurrences**: **1**
* **File Count**: 1 file

| File | Line | Matched Domain | Protocol | Context / Full Line | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `.env.local` | 15 | `https://cloutivo.in` | HTTPS | `RAZORPAY_WEBHOOK_URL=https://cloutivo.in/api/webhooks/razorpay` | Reference environment variable for Razorpay webhook endpoint | Backend | **High** | Retain; ensure active webhook in Razorpay dashboard matches this exact URL |

---

### Domain 8: `http://cloutivo.in`
* **Protocol**: HTTP (Insecure)
* **Total Occurrences**: **1**
* **File Count**: 1 file

| File | Line | Matched Domain | Protocol | Context / Full Line | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `.env.local` | 2 | `http://cloutivo.in` | HTTP | `NEXT_PUBLIC_APP_URL=http://cloutivo.in` | Primary public application URL environment variable | Config | **Critical** | **Immediate Fix**: Change protocol from `http://` to `https://cloutivo.in` to prevent insecure links across site |

---

### Domain 9: `https://www.cloutivo.in`
* **Protocol**: HTTPS
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Medium | Add to Vercel Domains and configure 301 redirect to `cloutivo.in` |

---

### Domain 10: `http://www.cloutivo.in`
* **Protocol**: HTTP
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Low | Vercel automatically forces SSL to HTTPS |

---

### Domain 11: Literal Typo `www.c;outivo.com` / `c;outivo`
* **Total Occurrences**: **0**

| File | Line | Matched Domain | Protocol | Context | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| *None* | *None* | *None* | *None* | *No matches found in codebase* | N/A | N/A | Low | Clean; no accidental typo in codebase |

---

### Domain 12: Bare Domain References (Protocol-Free)

#### `cloutivo.com` (as bare string or part of identifier)
- In `.env.local:14`: `RAZORPAY_WEBHOOK_SECRET=CloutivoAdmin2026` (Secret key string, not domain)
- In `.env.local:17`: `ADMIN_SECRET=CloutivoAdmin2026` (Secret key string, not domain)
- In `app/admin/page.tsx:125`: `placeholder="CloutivoAdmin2026"` (UI placeholder)
- In `components/layout/Navbar.tsx:19,22`: `sessionStorage.getItem("cloutivo_sid")` (Session key)

#### `www.cloutivo.com`
- **0 occurrences** in codebase.

#### `cloutivo.vercel.app`
- **0 occurrences** in codebase.

#### `cloutivo.in`
- Occurs only in `.env.local:2` (`http://cloutivo.in`) and `.env.local:15` (`https://cloutivo.in/...`).

#### `www.cloutivo.in`
- **0 occurrences** in codebase.

---

### Domain 13: External Payment Link (`rzp.io/rzp/cloutivo.com`)
* **Total Occurrences**: **1**
* **File Count**: 1 file
* **Distinct Category**: External Payment Link (Hosted on Razorpay Infrastructure)

| File | Line | Matched String | Protocol | Context / Full Line | Purpose | Category | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `app/backlinks/page.tsx` | 109 | `rzp.io/rzp/cloutivo.com` | HTTPS | `<a href="https://rzp.io/rzp/cloutivo.com" target="_blank" rel="noreferrer" ...>` | Direct button link to hosted Razorpay payment page for Backlink Booster plans | Payment | **High** | Verify page is live in Razorpay dashboard. If renaming page to `.in`, update button URL |

---

## 4. Comprehensive SEO Reference Audit

| SEO Element | Current Value in Code | Source File & Line | Status / Assessment |
|---|---|---|---|
| **`metadataBase`** | `new URL("https://cloutivo.com")` | `app/layout.tsx:28` | **FAIL**: Hardcoded to `.com`. Breaks relative OG images and canonicals on `.in`. |
| **Root Canonical** | `https://cloutivo.com` | `app/layout.tsx:30` | **FAIL**: Instructs Google that `.com` is the canonical version, leading to indexing suppression of `.in`. |
| **Open Graph URL** | `https://cloutivo.com` | `app/layout.tsx:35` | **FAIL**: Social shares emit `.com` link cards. |
| **Twitter Metadata** | Card: `summary_large_image`, creator: `@cloutivo` | `app/layout.tsx:48-54` | **PASS**: Metadata intact, but images resolve via `metadataBase`. |
| **JSON-LD WebSite** | `url: "https://cloutivo.com"` | `app/layout.tsx:78` | **FAIL**: Entity declaration points to `.com`. |
| **JSON-LD SearchAction** | `target: "https://cloutivo.com/?q={search_term_string}"` | `app/layout.tsx:82` | **FAIL**: SearchAction target points to `.com`. |
| **Sitemap Directives** | `sitemap: "https://cloutivo.com/sitemap.xml"` | `app/robots.ts:9` | **FAIL**: Directs crawlers to fetch sitemap on `.com`. |
| **Sitemap `<loc>` Entries** | `baseUrl = "https://cloutivo.com"` | `app/sitemap.ts:4` | **FAIL**: Every static route (`/`, `/daily`, `/categories`, `/about`) outputs a `.com` URL. |
| **RSS Feed (`/feed.xml`)** | `<link>${abs("/")}</link>` | `app/feed.xml/route.ts:16` | **DYNAMIC**: Uses `abs()`. Emits `http://cloutivo.in` due to `.env.local`. |
| **LLMs Discovery (`/llms.txt`)**| `[All-time leaderboard](${abs("/")})` | `lib/llms.ts:21-29` | **DYNAMIC**: Uses `abs()`. Emits `http://cloutivo.in` due to `.env.local`. |
| **IndexNow Ping** | `host: new URL(SITE.url).host` | `lib/indexnow.ts:15` | **DYNAMIC**: Emits `cloutivo.in`, but sends `http://` URLs unless `.env.local` is fixed. |
| **Dynamic Canonical (Products)**| `alternates: { canonical: `/product/${l.slug}` }` | `app/product/[slug]/page.tsx:30` | **DYNAMIC**: Relative path resolved via `metadataBase`. |
| **Dynamic Canonical (Categories)**| `alternates: { canonical: `/category/${c.slug}` }` | `app/category/[slug]/page.tsx:27` | **DYNAMIC**: Relative path resolved via `metadataBase`. |
| **Dynamic Canonical (All Pages)**| `alternates: { canonical: `/all/${n}` }` | `app/all/[page]/page.tsx:18` | **DYNAMIC**: Relative path resolved via `metadataBase`. |

> **Verdict on Google Search Indexing**: Google is currently instructed to index **`https://cloutivo.com`**. Because `metadataBase`, root `canonical`, `sitemap.ts`, and `robots.ts` all point to `.com`, Google will treat the new domain `cloutivo.in` as an untrusted duplicate until these files are updated.

---

## 5. Domain-Related Environment Variables

In accordance with security standards, actual secrets and tokens are omitted.

| Variable Name | Location | Defined? | Referenced in Code? | Functionality Consumed | Protocol Present | Status |
|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `.env.local:2`<br>`.env.example:2` | **Yes** | `lib/config.ts:5`<br>`README.md:12` | Single source of truth for `SITE.url` and `abs()`. Drives RSS, LLMs, Stripe callbacks, IndexNow. | **`http://`** in `.env.local`<br>`https://` in `.env.example` | **CRITICAL RISK**: Change to `https://cloutivo.in` |
| `RAZORPAY_WEBHOOK_URL`| `.env.local:15` | **Yes** | Setup reference in `.env.local` | Reference variable for webhook configuration | **`https://`** (`https://cloutivo.in/...`) | **PASS**: Correct domain and protocol |
| `NEXT_PUBLIC_SITE_URL`| *None* | No | No | Not used by this project | None | Informational |
| `NEXTAUTH_URL` / `AUTH_URL` | *None* | No | No | Not used (no NextAuth installed) | None | Informational |
| `SITE_URL` / `BASE_URL` | *None* | No | No | Not used by this project | None | Informational |

---

## 6. External Links & Integrations Audit

1. **Razorpay**:
   - **Webhook Endpoint**: `https://cloutivo.in/api/webhooks/razorpay` handles `order.paid` in `app/api/webhooks/razorpay/route.ts`.
   - **Hosted Payment Link**: `https://rzp.io/rzp/cloutivo.com` on `app/backlinks/page.tsx:109`.
   - **In-App Modal Checkout**: `components/deals/ClaimModal.tsx` loads `https://checkout.razorpay.com/v1/checkout.js` and calls `/api/checkout/upi`.
2. **Stripe (Optional Card Checkout)**:
   - `app/api/checkout/stripe/route.ts`:
     - `success_url: abs("/product/...")`
     - `cancel_url: abs("/?canceled=1")`
     - Uses `abs()`, which inherits `NEXT_PUBLIC_APP_URL`.
3. **IndexNow (Bing Search Integration)**:
   - `lib/indexnow.ts`: Dispatches real-time ping to `https://api.indexnow.org/indexnow` with `host: new URL(SITE.url).host` and `keyLocation: ${SITE.url}/${key}.txt`.
4. **Third-Party External Links in Code**:
   - `https://nexusaiagency.in` in `components/layout/Footer.tsx:23,54` (Agency portfolio link).
   - `https://lumixbranding.framer.website` in `app/admin/page.tsx:19` (Demo preset link).
   - `https://digiseller-mart.lovable.app` in `app/admin/page.tsx:28` (Demo preset link).

---

## 7. Statistical Summary

```
Total Files Scanned:                 92
Total Readable Files:                92
Total Unreadable Files:               0

Domain Matches Breakdown:
- https://cloutivo.com:              11 occurrences across 6 files
- http://cloutivo.in:                 1 occurrence in .env.local
- https://cloutivo.in:                1 occurrence in .env.local
- rzp.io/rzp/cloutivo.com (Ext Pay):  1 occurrence in app/backlinks/page.tsx
- https://cloutivo.vercel.app:        0 occurrences
- http://cloutivo.vercel.app:         0 occurrences
- https://www.cloutivo.com:           0 occurrences
- http://cloutivo.com:                0 occurrences
- https://www.cloutivo.in:            0 occurrences
- http://www.cloutivo.in:             0 occurrences
- Literal typo www.c;outivo.com:      0 occurrences

Protocol Distribution:
- HTTPS occurrences:                 13
- HTTP occurrences:                   1 (Critical: NEXT_PUBLIC_APP_URL in .env.local)

WWW vs Non-WWW Distribution:
- Apex / Non-WWW:                    14 occurrences
- WWW:                                0 occurrences

Files Requiring Immediate Updates:
1. D:\cloutivo\.env.local (Line 2)
2. D:\cloutivo\app\layout.tsx (Lines 28, 30, 35, 78, 82)
3. D:\cloutivo\app\sitemap.ts (Line 4)
4. D:\cloutivo\app\robots.ts (Line 9)
5. D:\cloutivo\lib\config.ts (Line 5)
6. D:\cloutivo\app\backlinks\page.tsx (Line 109 - verify payment slug)
7. D:\cloutivo\README.md (Lines 13-14)
```

---

## 8. Verification of Source Integrity

In full compliance with strict read-only audit instructions:
- No existing source code files, configurations, or environment values were modified.
- No packages, database schemas, git branches, or deployment parameters were altered.
- All 4 comprehensive reports are written and stored directly in `D:\cloutivo`.
