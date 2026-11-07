import redirectsList from "./src/lib/redirects.json" with { type: "json" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return redirectsList;
  },
};

export default nextConfig;
