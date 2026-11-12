import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Machine-readable files: cacheable at the edge, fresh enough for crawlers.
        source: "/:file(llms.txt|llms-full.txt|feed.xml)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=3600" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // IndexNow ownership file: https://yourdomain.com/<INDEXNOW_KEY>.txt
      { source: "/:key([A-Za-z0-9]{16,64}).txt", destination: "/api/indexnow-key?key=:key" },
    ];
  },
};

export default nextConfig;
