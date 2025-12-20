import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ---------------------------------
     🚫 DISABLE TURBOPACK (CRITICAL)
  ---------------------------------- */
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react"],
    optimizeCss: true,
    scrollRestoration: true,
  },

  /* ---------------------------------
     🖼 IMAGE OPTIMIZATION
  ---------------------------------- */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rtuhyoiiezensxfdswhx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  /* ---------------------------------
     🧹 BUILD & RUNTIME OPTIMIZATION
  ---------------------------------- */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  trailingSlash: false,

  /* ---------------------------------
     🔐 SECURITY HEADERS
  ---------------------------------- */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
    ];
  },

  /* ---------------------------------
     🔀 REDIRECTS
  ---------------------------------- */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/collection",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
