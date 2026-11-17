import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Lets e2e/build runs use their own output dir without touching a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
  // Hide the Next.js "N" development badge (bottom-left); it never shows in production anyway.
  devIndicators: false,
  // Dev only: lets a phone on the same Wi-Fi load the dev server (comma-separated hosts in DEV_ORIGINS).
  allowedDevOrigins: (process.env.DEV_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/regador' },
        ],
      },
    ];
  },
  serverExternalPackages: ['argon2', 'pdfkit', 'bwip-js'],
};

export default nextConfig;
