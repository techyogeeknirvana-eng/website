/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/drive', destination: '/notes', permanent: false },
      { source: '/jobs', destination: '/opportunities', permanent: false },
      { source: '/channels', destination: '/community', permanent: false },
      { source: '/collab', destination: '/collab-finder', permanent: false },
      { source: '/competitions', destination: '/events', permanent: false },
      { source: '/resume', destination: '/resume-lab', permanent: false },
      { source: '/interview', destination: '/ai-interview', permanent: false },
      { source: '/code-explainer', destination: '/ai-code', permanent: false },
      { source: '/settings', destination: '/profile', permanent: false },
    ];
  },
};

export default nextConfig;
