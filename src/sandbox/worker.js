const { parentPort } = require('worker_threads');
const esbuild = require('esbuild');
const memfs = require('memfs');
const { createFsFromVolume, Volume } = require('memfs');
const actualFs = require('fs');
const path = require('path');

function writeFileSyncEnsureDir(fs, filePath, content, options) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true }); // Ensure the directory exists
  fs.writeFileSync(filePath, content, options);
}

parentPort.on(
  'message',
  async ({ fsJson, componentPath, allowedDependencies }) => {
    try {
      // Reconstruct the filesystem from the serialized data
      const fs = createFsFromVolume(Volume.fromJSON(fsJson));
      // Convert the allowed dependencies Map back from its serialized form
      const allowedDeps = new Map(allowedDependencies);

      const result = await esbuild.build({
        entryPoints: [componentPath],
        bundle: true,
        format: 'esm',
        write: false,
        outfile: '/dist/bundle.js',
        loader: {
          '.js': 'jsx',
          '.jsx': 'jsx',
        },
        jsx: 'transform',
        jsxFactory: 'React.createElement', // Default for React
        jsxFragment: 'React.Fragment', // Default for React
        plugins: [
          {
            name: 'memfs',
            setup(build) {
              // Intercept file resolution
              build.onResolve({ filter: /.*/ }, (args) => {
                if (args.path.startsWith('/')) {
                  return { path: args.path, namespace: 'memfs' };
                }
                // return { path: args.path };
              });

              // Intercept file loading
              build.onLoad({ filter: /.*/, namespace: 'memfs' }, (args) => {
                try {
                  const contents = fs.readFileSync(args.path, 'utf8');
                  return { contents, loader: 'jsx' };
                } catch (error) {
                  return { errors: [{ text: error.message }] };
                }
              });
            },
          },
          // {
          //   name: 'dependency-validator',
          //   setup(build) {
          //     build.onResolve({ filter: /.*/ }, (args) => {
          //       // Whitelist the component path
          //       // if (args.path === componentPath) {
          //       //   return { path: args.path };
          //       // }

          //       // Check if the dependency is allowed
          //       const pkgName = args.path.split('/')[0];
          //       // if (!allowedDeps.has(pkgName) && !args.path === componentPath) {
          //       //   console.log('args.path error: ', args.path);
          //       //   return {
          //       //     errors: [
          //       //       {
          //       //         text: `Package "${pkgName}" is not allowed. Allowed packages are: ${[...allowedDeps.keys()].join(', ')}`,
          //       //       },
          //       //     ],
          //       //   };
          //       // }

          //       // Verify dependency version if needed
          //       const allowedVersion = allowedDeps.get(pkgName);
          //       // You could add version validation here if needed

          //       // return { path: args.path };
          //     });
          //   },
          // },
        ],
        define: {
          'process.env.NODE_ENV': '"production"',
        },
      });

      // Write the output files to the virtual filesystem
      result.outputFiles.forEach((file) => {
        writeFileSyncEnsureDir(fs, file.path, file.contents, 'utf8');
      });

      const bundleContent = fs.readFileSync('/dist/bundle.js', 'utf8');
      parentPort.postMessage({
        success: true,
        result: bundleContent,
      });
    } catch (error) {
      parentPort.postMessage({
        success: false,
        error: error.message,
      });
    }
  },
);
