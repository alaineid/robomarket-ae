import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qkfqyhipifcronawvjkl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Disable the new CSS minifier to avoid the lightningcss binary issues on Vercel
    optimizeCss: false,
  },
};

export default nextConfig;
