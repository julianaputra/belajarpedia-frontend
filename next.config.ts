import type { NextConfig } from "next";
import withBundleAnalyzerImport from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : undefined;

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [{ protocol: "https" as const, hostname: r2Hostname, pathname: "/**" }]
        : []),
      // Allow Unsplash for mock data preview. Remove once backend hosts real images.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withBundleAnalyzer = withBundleAnalyzerImport({
  enabled: process.env.ANALYZE === "true",
});

// Sentry source-map upload only fires when org/project/auth-token are all set
// (i.e. only inside the deploy workflow). Local builds skip it silently.
const sentryEnabled =
  !!process.env.SENTRY_AUTH_TOKEN &&
  !!process.env.SENTRY_ORG &&
  !!process.env.SENTRY_PROJECT;

export default sentryEnabled
  ? withSentryConfig(withBundleAnalyzer(nextConfig), {
      org: process.env.SENTRY_ORG!,
      project: process.env.SENTRY_PROJECT!,
      silent: !process.env.CI,
      // Tunnel route bypasses ad-blockers in production.
      tunnelRoute: "/monitoring",
      // Upload source maps to Sentry, then delete from public bundle.
      sourcemaps: { deleteSourcemapsAfterUpload: true },
      automaticVercelMonitors: false,
    })
  : withBundleAnalyzer(nextConfig);
