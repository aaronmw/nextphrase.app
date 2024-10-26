/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.netlify.app',
        port: '',
      },
    ],
  },
}

export default nextConfig
