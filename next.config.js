/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'randomuser.me', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
