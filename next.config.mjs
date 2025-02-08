import createMDX from '@next/mdx';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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

export default withVanillaExtract(withMDX(nextConfig));
