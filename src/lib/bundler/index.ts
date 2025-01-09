'use client';

import { fetchPlugin } from '@/lib/bundler/plugins/fetchPlugin';
import { unpkgPathPlugin } from '@/lib/bundler/plugins/unpkgLoaderPlugin';
import * as esbuild from 'esbuild-wasm';

export interface BundledResult {
  output: string;
  error: string;
}

let loaded = false;
let isLoading = false;

export const loadEsbuild = async () => {
  if (loaded) {
    return;
  }

  if (isLoading) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isLoading) {
          clearInterval(interval);
          resolve('');
        }
      }, 100);
    });
  }

  isLoading = true;

  try {
    // eslint-disable-next-line no-console
    console.log('Initializing esbuild', esbuild.version);
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm',
    });
    loaded = true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  isLoading = false;
};

const esBundle = async (input: string): Promise<BundledResult> => {
  await loadEsbuild();
  try {
    const result = await esbuild.build({
      entryPoints: ['input.jsx'],
      bundle: true,
      minify: false,
      format: 'esm',
      platform: 'node',
      packages: 'bundle',
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        global: 'window',
        'process.env.NODE_ENV': '"production"',
        'process.env.NODE_DEBUG': '"false"',
      },
    });

    return {
      output: result.outputFiles[0].text,
      error: '',
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default esBundle;
