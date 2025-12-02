/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force webpack instead of turbopack for now
  experimental: {
    forceSwcTransforms: true,
  },
}

module.exports = nextConfig