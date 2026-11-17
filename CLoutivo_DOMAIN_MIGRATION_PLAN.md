# CLOUTIVO Domain Migration & Safe Rollout Plan

**Target Domains**:
- Primary Canonical Domain: `https://cloutivo.in`
- Secondary Redirect Domain: `https://www.cloutivo.in`
- Legacy Vercel Subdomain: `https://cloutivo.vercel.app` (to redirect to primary)

---

## 1. Domain Architecture & Canonical Strategy

```
                                  DNS & Edge Level
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
  cloutivo.vercel.app              www.cloutivo.in                   cloutivo.in
        │                                │                                │
   (301 Redirect)                   (301 Redirect)                   (Canonical)
        │                                │                                │
        └───────────────────────────────►├────────────────────────────────┘
                                         │
                                         ▼
                            Vercel Production Deployment
                             (HTTPS / SSL Enforced)
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
            App Router Runtime                         Static Edge / ISR
             - metadataBase: cloutivo.in                - /sitemap.xml
             - canonical: cloutivo.in                   - /robots.txt
             - JSON-LD Schema: cloutivo.in              - /feed.xml
             - OpenGraph: cloutivo.in                   - /llms.txt
```

### Architecture Rules:
1. **Canonical Domain**: `https://cloutivo.in` must be the sole canonical origin. All search engine indexing, OpenGraph URLs, JSON-LD schemas, sitemaps, and RSS items must point to this origin.
2. **WWW Handling**: `www.cloutivo.in` must issue an HTTP `301 Moved Permanently` redirect to `https://cloutivo.in`.
3. **Vercel Default Subdomain**: `cloutivo.vercel.app` must issue an HTTP `301 Moved Permanently` redirect to `https://cloutivo.in`.
4. **Protocol**: All traffic must enforce HTTPS. Never use plain `http://`.

---

## 2. Ordered Migration Steps

### Phase 1: Local Environment & Source Code Alignment (Read-Only Audit Phase Completed)
*(Note: Per audit safety guidelines, no source code changes were made during this audit. The exact lines to modify are cataloged below for when deployment execution begins).*

1. **Environment File Update (`.env.local`)**:
   - Change `NEXT_PUBLIC_APP_URL=http://cloutivo.in` to `NEXT_PUBLIC_APP_URL=https://cloutivo.in`.
2. **Centralize `app/layout.tsx` to `SITE.url`**:
   - Line 28: Update `metadataBase` to `new URL(SITE.url)` or `new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cloutivo.in")`.
   - Line 30: Update `alternates.canonical` to `SITE.url`.
   - Line 35: Update `openGraph.url` to `SITE.url`.
   - Lines 78, 82: Update JSON-LD `WebSite` and `SearchAction` URLs to `${SITE.url}`.
3. **Centralize `app/sitemap.ts` to `SITE.url`**:
   - Line 4: Change `const baseUrl = "https://cloutivo.com";` to `const baseUrl = SITE.url;` (import `SITE` from `@/lib/config`).
4. **Centralize `app/robots.ts` to `SITE.url`**:
   - Line 9: Change `sitemap: "https://cloutivo.com/sitemap.xml"` to `sitemap: `${SITE.url}/sitemap.xml`` (import `SITE` from `@/lib/config`).
5. **Update Fallback in `lib/config.ts`**:
   - Line 5: Change fallback from `"https://cloutivo.com"` to `"https://cloutivo.in"`.
6. **Documentation and Webhook URLs**:
   - Update `README.md` lines 13-14 to reflect `https://cloutivo.in`.

---

### Phase 2: Vercel Platform & DNS Configuration

1. **Vercel Project Settings > Domains**:
   - Add domain: `cloutivo.in` (Select **Production** environment, make it the **Primary Domain**).
   - Add domain: `www.cloutivo.in` (Select **Redirect to cloutivo.in** with status code **301**).
2. **DNS Records Configuration (At Domain Registrar / DNS Provider)**:
   - **Apex / Root (`cloutivo.in`)**:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **WWW Subdomain (`www.cloutivo.in`)**:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
3. **SSL/TLS Provisioning**:
   - Allow Vercel to automatically issue Let's Encrypt certificates for both `cloutivo.in` and `www.cloutivo.in`.
4. **Vercel Project Settings > Environment Variables**:
   - Add/Verify `NEXT_PUBLIC_APP_URL` = `https://cloutivo.in` for Production, Preview, and Development.
   - Re-deploy the latest commit to ensure all static pages and ISR caches rebuild with the new domain.

---

### Phase 3: External Payment Gateways & Webhooks

1. **Razorpay Dashboard Configuration**:
   - Log into [Razorpay Dashboard](https://dashboard.razorpay.com).
   - Navigate to **Settings > Webhooks**.
   - Create or edit the active webhook:
     - **Webhook URL**: `https://cloutivo.in/api/webhooks/razorpay`
     - **Secret**: Must match `RAZORPAY_WEBHOOK_SECRET` in `.env.local` / Vercel.
     - **Active Events**: Check `order.paid`.
   - Update Payment Page branding/redirects if custom domains are configured.
2. **Stripe Dashboard Configuration (If Card Checkout is Enabled)**:
   - Log into [Stripe Dashboard](https://dashboard.stripe.com).
   - Navigate to **Developers > Webhooks**.
   - Add endpoint:
     - **Endpoint URL**: `https://cloutivo.in/api/webhooks/stripe`
     - **Events to listen to**: `checkout.session.completed`, `checkout.session.async_payment_succeeded`.
   - Copy Signing Secret into `STRIPE_WEBHOOK_SECRET`.

---

### Phase 4: Search Engine & SEO Setup

1. **Google Search Console (GSC)**:
   - Add a new **Domain Property**: `cloutivo.in` (via DNS TXT verification).
   - Submit the sitemap: `https://cloutivo.in/sitemap.xml`.
   - Perform a URL Inspection on `https://cloutivo.in/` to confirm:
     - Google can fetch and render the page.
     - User-declared canonical is `https://cloutivo.in/`.
     - Google-selected canonical matches `https://cloutivo.in/`.
2. **Bing Webmaster Tools & IndexNow**:
   - Add `https://cloutivo.in/` to Bing Webmaster Tools.
   - Submit `https://cloutivo.in/sitemap.xml`.
   - Ensure `INDEXNOW_KEY` is configured in production environment variables so automatic pings on rank updates succeed.

---

## 3. Post-Migration Verification Checklist

| Checkpoint | Target URL / Item | Expected Result | Verified (Y/N) |
|---|---|---|---|
| **Root Canonical** | `curl -I https://cloutivo.in/` | `HTTP/2 200`, `<link rel="canonical" href="https://cloutivo.in"/>` in HTML | [ ] |
| **WWW Redirect** | `curl -I https://www.cloutivo.in/` | `HTTP/2 301 Moved Permanently`, `Location: https://cloutivo.in/` | [ ] |
| **Vercel App Redirect** | `curl -I https://cloutivo.vercel.app/` | `HTTP/2 301 Moved Permanently`, `Location: https://cloutivo.in/` | [ ] |
| **Robots.txt** | `https://cloutivo.in/robots.txt` | Contains `Sitemap: https://cloutivo.in/sitemap.xml` | [ ] |
| **Sitemap.xml** | `https://cloutivo.in/sitemap.xml` | All `<loc>` tags begin with `https://cloutivo.in/` | [ ] |
| **RSS Feed** | `https://cloutivo.in/feed.xml` | `<atom:link>`, `<link>`, `<guid>` use `https://cloutivo.in/` | [ ] |
| **LLMs Discovery** | `https://cloutivo.in/llms.txt` | All internal markdown links use `https://cloutivo.in/` | [ ] |
| **Open Graph Preview** | `https://cloutivo.in/opengraph-image` | Renders dynamic image with status `200 OK` | [ ] |
| **Razorpay Checkout** | Modal UPI Payment | Signature verification succeeds at `/api/checkout/upi/verify` | [ ] |
| **Razorpay Webhook** | Post-payment test | Webhook delivers `order.paid` to `https://cloutivo.in/api/webhooks/razorpay` with `200 OK` | [ ] |
| **IndexNow Key Route** | `https://cloutivo.in/<KEY>.txt` | Serves verification key with `200 OK` | [ ] |
