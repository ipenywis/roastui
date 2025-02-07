/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      {
        hostname: '**.roastui.design',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'placehold.co',
      },
      {
        hostname: 'picsum.photos',
      },
    ],
  },
};

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract(nextConfig);
