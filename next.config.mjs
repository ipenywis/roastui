/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.co',
      },
      {
        hostname: 'picsum.photos',
      },
      {
        hostname: 'roast-ui.islemmaboud.com',
      },
      {
        hostname: 'cdn.roastui.design',
      },
      {
        hostname: 'roastui.design',
      },
    ],
  },
};

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract(nextConfig);
