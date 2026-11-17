# CLOUTIVO Domain Conflicts & Architectural Inconsistency Report

**Audit Type**: Forensic Domain & Configuration Audit  
**Target Repository**: `D:\cloutivo`  
**Date**: November 13, 2026  
**Auditor**: Senior Next.js Architect & SEO Specialist  

---

## 1. Conflict Overview Matrix

| Conflict Type | Severity | Component 1 | Component 2 | Nature of Conflict |
|---|---|---|---|---|
| **Domain Identity Conflict** | **Critical** | `app/layout.tsx`<br>`app/robots.ts`<br>`app/sitemap.ts`<br>`lib/config.ts` (`cloutivo.com`) | `.env.local`<br>Intended Primary Domain (`cloutivo.in`) | Source code hardcodes `.com` for SEO and fallbacks, while `.env.local` targets `.in`. |
| **Protocol Security Mismatch** | **Critical** | `.env.local:2`<br>(`http://cloutivo.in`) | `.env.local:15`<br>`lib/config.ts`<br>(`https://`) | The base URL in `.env.local` is specified as insecure `http://`. All downstream consumers (`abs()`, `SITE.url`) inherit `http://`, violating SSL standards. |
| **Canonical vs Indexing Instruction** | **Critical** | Search Engine Directives (`canonical: https://cloutivo.com`) | Production Hosting Reality (`https://cloutivo.in`) | Google is explicitly instructed to ignore `cloutivo.in` and index `cloutivo.com`. |
| **Sitemap vs Site URL Decoupling** | **Critical** | `app/sitemap.ts:4`<br>(`const baseUrl = "https://cloutivo.com"`) | `lib/config.ts:5`<br>(`process.env.NEXT_PUBLIC_APP_URL`) | The sitemap generator completely ignores the central configuration and environment variables. |
| **Robots.txt Decoupling** | **Critical** | `app/robots.ts:9`<br>(`sitemap: "https://cloutivo.com/sitemap.xml"`) | Generated Sitemap on `.in` | Crawlers visiting `cloutivo.in/robots.txt` are instructed to fetch the sitemap on `cloutivo.com`. |
| **Payment Link Brand Confusion** | **Medium** | `app/backlinks/page.tsx:109`<br>(`rzp.io/rzp/cloutivo.com`) | Target Brand Identity (`cloutivo.in`) | Hosted Razorpay link slug contains `.com`, creating visual domain dissonance for users. |
| **Vercel Legacy Subdomain Gap** | **High** | Legacy URL (`cloutivo.vercel.app`) | Primary URL (`cloutivo.in`) | No hardcoded code references, but missing an explicit edge 301 redirect configuration in source/Vercel settings. |

---

## 2. In-Depth Conflict Analysis

### Conflict 1: Hardcoded `.com` Overriding Environment Configuration (`.in`)
* **Location 1**: `app/layout.tsx` (Lines 28, 30, 35, 78, 82)
* **Location 2**: `app/robots.ts` (Line 9)
* **Location 3**: `app/sitemap.ts` (Line 4)
* **Location 4**: `lib/config.ts` (Line 5 fallback)
* **Against**: `.env.local` (Line 2: `http://cloutivo.in`), Intended Domain (`https://cloutivo.in`)

#### Analysis:
The application was originally scaffolded or coded with `https://cloutivo.com` as its primary domain. Even though `.env.local` was updated to `cloutivo.in`, the Next.js metadata generators were hardcoded with string literals instead of referencing `SITE.url` or `process.env.NEXT_PUBLIC_APP_URL`. 

#### Impact on Search Engines (Google, Bing, Yandex):
* **Canonical Contradiction**: When Google crawls `https://cloutivo.in/`, it parses:
  ```html
  <link rel="canonical" href="https://cloutivo.com"/>
  ```
  This tells Google: *"Do not index this page on cloutivo.in. The master copy is at cloutivo.com."* If `cloutivo.com` is not owned or not hosted, Google will de-index the site, drop rankings, and flag canonical mismatch errors in Google Search Console.
* **Sitemap Dead-End**: `cloutivo.in/robots.txt` points crawlers to `https://cloutivo.com/sitemap.xml`. If `cloutivo.com` does not resolve, search engines cannot discover your subpages (`/daily`, `/categories`, `/deals`, `/product/[slug]`).

---

### Conflict 2: Insecure `http://` Protocol in `.env.local`
* **File**: `.env.local`, Line 2
* **Current Value**: `NEXT_PUBLIC_APP_URL=http://cloutivo.in`
* **Intended Value**: `NEXT_PUBLIC_APP_URL=https://cloutivo.in`

#### Analysis:
In `.env.local`, the protocol is set to unencrypted `http://`.
In `lib/config.ts`:
```typescript
export const SITE = {
  url: clean(process.env.NEXT_PUBLIC_APP_URL, "https://cloutivo.com").replace(/\/+$/, ""),
  // ...
};
export const abs = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
```
Because `NEXT_PUBLIC_APP_URL` is defined, `SITE.url` resolves to `http://cloutivo.in`.
This causes:
1. `app/feed.xml/route.ts`: `<link>http://cloutivo.in/</link>` and `<atom:link href="http://cloutivo.in/feed.xml" .../>` (Insecure feed URLs).
2. `app/llms.txt/route.ts` & `lib/llms.ts`: All markdown links for AI crawlers use `http://cloutivo.in/...`.
3. `app/api/checkout/stripe/route.ts`:
   - `success_url: abs("/product/...")` $\to$ Redirects user to insecure `http://cloutivo.in/...`.
   - `cancel_url: abs("/?canceled=1")` $\to$ Redirects user to insecure `http://cloutivo.in/?canceled=1`.
4. `lib/indexnow.ts`: Submits `http://cloutivo.in` URLs to Bing API, which rejects or forces additional redirect hops.

---

### Conflict 3: OpenGraph & Social Sharing Mismatch
* **File**: `app/layout.tsx`, Lines 28, 35, 38-44
* **Current Config**:
  ```typescript
  metadataBase: new URL("https://cloutivo.com"),
  openGraph: {
    url: "https://cloutivo.com",
    images: [{ url: "/og-image.png" }],
  }
  ```
#### Analysis:
When a link to `https://cloutivo.in/daily` is shared on Twitter/X, LinkedIn, WhatsApp, or Facebook:
1. The OpenGraph URL is emitted as `https://cloutivo.com`.
2. The image `/og-image.png` is resolved against `metadataBase` to `https://cloutivo.com/og-image.png`.
3. The card preview fails to display images or shows a broken preview if `cloutivo.com` is unreachable.

---

### Conflict 4: WWW vs. Non-WWW Resolution
* **Intended Architecture**:
  - Apex / Primary: `https://cloutivo.in`
  - Secondary: `https://www.cloutivo.in` (301 redirect to apex)
* **Code State**:
  - The codebase currently has **zero** occurrences of `www.cloutivo.in`.
  - While clean, this means there is no framework-level middleware redirecting `www` to non-`www`.
* **Resolution**: Ensure Vercel Edge configuration or DNS records handle the `www` $\to$ non-`www` redirect so Google does not index duplicate versions of the site.

---

### Conflict 5: External Razorpay Payment Link Slug
* **File**: `app/backlinks/page.tsx`, Line 109
* **Current Link**: `https://rzp.io/rzp/cloutivo.com`
* **Analysis**:
  - This is an external Razorpay Hosted Payment Page.
  - Razorpay allows users to name payment pages when creating them. The page was named `cloutivo.com`.
  - While functional, buyers paying via this button will see `rzp.io/rzp/cloutivo.com` in their browser bar while purchasing from `cloutivo.in`.
  - This is not a technical runtime bug, but a brand consistency issue.

---

## 3. Google Indexing Instruction Verdict

> **Current Verdict**: Google is currently being instructed to index **`https://cloutivo.com`**, NOT `cloutivo.in` or `cloutivo.vercel.app`.

### Proof Points from Code:
1. `app/layout.tsx:30`: Explicit `<link rel="canonical" href="https://cloutivo.com" />`.
2. `app/robots.ts:9`: `Sitemap: https://cloutivo.com/sitemap.xml`.
3. `app/sitemap.ts:4`: Every single `<loc>` entry in `sitemap.xml` outputs `https://cloutivo.com/...`.
4. `app/layout.tsx:78`: Schema.org WebSite `@id` and `url` declare the site entity as `https://cloutivo.com`.

Until `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, and `.env.local` are updated, search engines will penalize the `cloutivo.in` deployment as duplicate content.
