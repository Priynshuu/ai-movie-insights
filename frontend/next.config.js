/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'ia.media-imdb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.media-amazon.com',
      },
    ],
  },
}

module.exports = nextConfig
