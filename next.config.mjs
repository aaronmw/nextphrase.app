import { networkInterfaces } from 'node:os'

const lanDevOrigins = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address }) => address)

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['nextphrase-dot-app.localhost', ...lanDevOrigins],
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
