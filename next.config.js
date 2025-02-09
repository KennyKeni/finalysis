/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true
    }
    return config
  },
  api: {
    bodyParser: false, // Disable the default body parser
  },
}

export default nextConfig 