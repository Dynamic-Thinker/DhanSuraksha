/** @type {import('next').NextConfig} */
const backendTarget = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API || "http://127.0.0.1:8000"

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendTarget}/:path*`,
      },
    ]
  },
}

export default nextConfig
