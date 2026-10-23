// Backend the vendored chat window resolves uploaded media against (see
// vendor/one-ai-ui/lib/config.ts). Override with NEXT_PUBLIC_API_URL.
const apiUrlRaw = process.env.NEXT_PUBLIC_API_URL ?? 'https://one-ai-api-dev.aiimone.com'
const apiUrl = new URL(apiUrlRaw)

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_API_URL: apiUrlRaw },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/media/**',
        search: '',
      },
    ],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
  // Test site only -- never index it.
  headers: async () => [
    { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ],
}

export default nextConfig
