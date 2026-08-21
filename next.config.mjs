/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['nextphrase-dot-app.localhost'],
  devIndicators: {
    position: 'bottom-left',
  },
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
