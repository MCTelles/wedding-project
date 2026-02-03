/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['v5.airtableusercontent.com', 'maps.googleapis.com'],
  },
}

module.exports = nextConfig
