/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators:
    process.env.NEXT_PUBLIC_SCREENSHOT_MODE === 'true'
      ? false
      : {
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
