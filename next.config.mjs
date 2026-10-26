/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // `next dev` and `next build` both write to distDir and corrupt each other if
  // they run at once. IDEs commonly keep a dev server alive, so give dev its own
  // directory and leave the production build on the conventional `.next`.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
