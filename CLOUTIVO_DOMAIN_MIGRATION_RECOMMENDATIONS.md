# CLOUTIVO Domain Migration & Harmonization Recommendations

**Target Domain Architecture**:
- **Primary Domain (Canonical)**: `https://cloutivo.in`
- **Secondary Domain (Edge 301 Redirect)**: `https://www.cloutivo.in` $\to$ `https://cloutivo.in`
- **Legacy Vercel Domain (Edge 301 Redirect)**: `https://cloutivo.vercel.app` $\to$ `https://cloutivo.in`

---

## 1. Codebase Alignment Recommendations

To resolve all domain conflicts and eliminate hardcoded references, the following changes must be applied once authorization to edit code is granted:

### 1. Fix Protocol in `.env.local`
* **File**: `D:\cloutivo\.env.local`
* **Line**: 2
* **Current**:
  ```env
  NEXT_PUBLIC_APP_URL=http://cloutivo.in
  ```
* **Recommended Change**:
  ```env
  NEXT_PUBLIC_APP_URL=https://cloutivo.in
  ```

---

### 2. Update Metadata Base & Canonical in `app/layout.tsx`
* **File**: `D:\cloutivo\app\layout.tsx`
* **Lines**: 28, 30, 35, 78, 82
* **Current**:
  ```typescript
  // Line 28:
  metadataBase: new URL("https://cloutivo.com"),
  alternates: {
    canonical: "https://cloutivo.com",
  },
  openGraph: {
    // ...
    url: "https://cloutivo.com",
  },
  // Line 78:
  url: "https://cloutivo.com",
  // Line 82:
  target: "https://cloutivo.com/?q={search_term_string}",
  ```
* **Recommended Change**:
  Import `SITE` from `@/lib/config` and use it dynamically:
  ```typescript
  import { SITE } from "@/lib/config";

  // In metadata:
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    // ...
    url: SITE.url,
  },

  // In JSON-LD schema:
  url: SITE.url,
  target: `${SITE.url}/?q={search_term_string}`,
  ```

---

### 3. Connect `app/sitemap.ts` to Dynamic Config
* **File**: `D:\cloutivo\app\sitemap.ts`
* **Line**: 4
* **Current**:
  ```typescript
  export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://cloutivo.com";
  ```
* **Recommended Change**:
  ```typescript
  import { SITE } from "@/lib/config";

  export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE.url;
  ```

---

### 4. Connect `app/robots.ts` to Dynamic Config
* **File**: `D:\cloutivo\app\robots.ts`
* **Line**: 9
* **Current**:
  ```typescript
  sitemap: "https://cloutivo.com/sitemap.xml",
  ```
* **Recommended Change**:
  ```typescript
  import { SITE } from "@/lib/config";

  export default function robots(): MetadataRoute.Robots {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${SITE.url}/sitemap.xml`,
    };
  }
  ```

---

### 5. Update Fallback URL in `lib/config.ts`
* **File**: `D:\cloutivo\lib\config.ts`
* **Line**: 5
* **Current**:
  ```typescript
  url: clean(process.env.NEXT_PUBLIC_APP_URL, "https://cloutivo.com").replace(/\/+$/, ""),
  ```
* **Recommended Change**:
  ```typescript
  url: clean(process.env.NEXT_PUBLIC_APP_URL, "https://cloutivo.in").replace(/\/+$/, ""),
  ```

---

### 6. Update Documentation Files
* **Files**: `README.md` (Lines 13-14), `docs/FILE_MAP.md` (Line 28)
* **Action**: Replace `https://cloutivo.com/api/webhooks/...` references with `https://cloutivo.in/api/webhooks/...`.

---

## 2. Vercel & DNS Architecture

### Vercel Dashboard Steps:
1. Navigate to **Project Settings > Domains**.
2. Add Domain: `cloutivo.in`
   - Set as **Production Domain** and **Primary Domain**.
3. Add Domain: `www.cloutivo.in`
   - Select option: **Redirect to cloutivo.in**.
   - Status Code: **301 Moved Permanently**.
4. Legacy Subdomain:
   - Check `cloutivo.vercel.app` in the domains list. Ensure it is set to **Redirect to cloutivo.in**.

### DNS Provider (Namecheap / GoDaddy / Cloudflare) Records:
* **Apex Record (`@`)**:
  - Type: `A`
  - Name: `@`
  - IP: `76.76.21.21` (Vercel Anycast IP)
  - TTL: `Auto` or `3600`
* **WWW Record (`www`)**:
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`
  - TTL: `Auto` or `3600`

---

## 3. External Dashboards & Webhooks Checklist

### Razorpay Dashboard (`dashboard.razorpay.com`):
* [ ] Navigate to **Settings > Webhooks**.
* [ ] Update or create webhook endpoint: `https://cloutivo.in/api/webhooks/razorpay`.
* [ ] Verify Secret matches `RAZORPAY_WEBHOOK_SECRET` in `.env.local` / Vercel.
* [ ] Selected Events: Check `order.paid`.
* [ ] (Optional) Payment Pages: Check if the slug `cloutivo.com` on `rzp.io/rzp/cloutivo.com` can be renamed to `cloutivo.in` or `cloutivo` to avoid user confusion.

### Stripe Dashboard (`dashboard.stripe.com`):
* [ ] Navigate to **Developers > Webhooks**.
* [ ] Add endpoint: `https://cloutivo.in/api/webhooks/stripe`.
* [ ] Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`.
* [ ] Copy Signing Secret into Vercel production environment variable `STRIPE_WEBHOOK_SECRET`.

### Google Search Console:
* [ ] Add property: `https://cloutivo.in` (or Domain property `cloutivo.in`).
* [ ] Verify domain ownership via DNS TXT record.
* [ ] Submit sitemap: `https://cloutivo.in/sitemap.xml`.
* [ ] Use URL Inspection on `https://cloutivo.in/` to confirm:
  - Canonical declared: `https://cloutivo.in/`
  - Robots.txt is fetched and valid.

### Bing Webmaster Tools & IndexNow:
* [ ] Import or add `https://cloutivo.in`.
* [ ] Submit `https://cloutivo.in/sitemap.xml`.
* [ ] Configure `INDEXNOW_KEY` in Vercel environment so instant indexing pings work on rank updates.

---

## 4. Post-Migration Terminal Verification Commands

After applying the changes and deploying, execute these verification tests:

```bash
# 1. Verify Primary Domain Returns 200 OK and correct canonical tag:
curl -sI https://cloutivo.in/ | grep -E "(HTTP/|location)"
curl -s https://cloutivo.in/ | grep -i 'rel="canonical"'
# Expected: <link rel="canonical" href="https://cloutivo.in"/>

# 2. Verify WWW redirects to Apex with 301:
curl -sI https://www.cloutivo.in/ | grep -E "(HTTP/|location)"
# Expected: HTTP/2 301, location: https://cloutivo.in/

# 3. Verify Robots.txt points to .in sitemap:
curl -s https://cloutivo.in/robots.txt
# Expected: Sitemap: https://cloutivo.in/sitemap.xml

# 4. Verify Sitemap.xml contains .in URLs:
curl -s https://cloutivo.in/sitemap.xml | head -n 15
# Expected: <loc>https://cloutivo.in/</loc>

# 5. Verify RSS Feed links:
curl -s https://cloutivo.in/feed.xml | grep '<atom:link'
# Expected: href="https://cloutivo.in/feed.xml"

# 6. Verify LLMs discovery file:
curl -s https://cloutivo.in/llms.txt | head -n 10
# Expected: [All-time leaderboard](https://cloutivo.in/): ...
```
