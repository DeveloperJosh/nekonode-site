/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gogocdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
