import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of user input
      build.onResolve({ filter: /(^input\.jsx$)/ }, () => {
        return { path: 'input.jsx', namespace: 'app' };
      });

      // //Add a special plugin that handle react and react-dom
      build.onResolve({ filter: /(^react$)/ }, () => {
        return {
          path: 'https://unpkg.com/react@18/cjs/react.production.min.js',
          namespace: 'app',
          external: false,
        };
      });

      build.onResolve({ filter: /^react-dom$/ }, () => {
        return {
          path: 'https://unpkg.com/react-dom@18/cjs/react-dom.production.min.js',
          namespace: 'app',
          external: false,
        };
      });

      //We have to hijack the lucide-react to use the cjs version
      //because the umd version is not working (maximum call stack error!)
      build.onResolve({ filter: /^lucide-react$/ }, () => {
        return {
          path: 'https://unpkg.com/lucide-react/dist/cjs/lucide-react.js',
          namespace: 'app',
          external: false,
        };
      });

      // handle relative imports inside a module
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return {
          path: new URL(args.path, args.importer + '/').href,
          namespace: 'app',
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        const isUrl =
          args.path.startsWith('https://') || args.path.startsWith('http://');
        return {
          path: isUrl ? args.path : `https://unpkg.com/${args.path}`,
          namespace: 'app',
        };
      });
    },
  };
};
