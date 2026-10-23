/** @type {import('next').NextConfig} */
const nextConfig = {
  // Test site only -- never index it.
  headers: async () => [
    { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ],
}

export default nextConfig
