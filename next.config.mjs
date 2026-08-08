/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  // Avoid slow/hung `next build` on some Windows setups when ESLint runs during build
  eslint: {
    ignoreDuringBuilds: true
  },
  // Windows: corrupted `.next/cache/webpack/*.pack` can make `next build` hang at
  // "Creating an optimized production build". By default we keep filesystem cache
  // (much faster repeat builds). If that happens, run: `set DISABLE_WEBPACK_CACHE=1`
  // (PowerShell: `$env:DISABLE_WEBPACK_CACHE='1'`) then `npm run build`, or use
  // `npm run build:fresh`.
  webpack: (config, { dev }) => {
    if (!dev && process.env.DISABLE_WEBPACK_CACHE === "1") {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;

