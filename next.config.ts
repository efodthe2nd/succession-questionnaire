/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  // Empty turbopack config to use Turbopack without webpack
  turbopack: {},
}

module.exports = nextConfig
