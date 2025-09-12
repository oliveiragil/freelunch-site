import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    qualities: [50, 75, 85, 90, 100],
    formats: ['image/webp', 'image/avif'],
  },
  /* config options here */
};

export default nextConfig;
