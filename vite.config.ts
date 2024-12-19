import { lingui } from '@lingui/vite-plugin';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import dynamicImport from 'vite-plugin-dynamic-import';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

installGlobals();

export default defineConfig({
  define: {
    'process.env': {},
  },

  plugins: [
    wasm(),
    dynamicImport({}),
    topLevelAwait(),
    lingui(),
    macrosPlugin(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      manifest: true,
      ignoredRouteFiles: ['**/*.module.css'],
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'stringke',
      project: 'ioio',
    }),
  ],

  ssr: {
    noExternal: ['react-use'],
  },

  optimizeDeps: {
    include: [
      '@lingui/core',
      '@lingui/react',
      'react-use',

      // transform adapter 都需要添加到此处
      'js-yaml',
      'jsonc-parser',
      'java-parser',
      'smol-toml',
      'json5/lib/parse.js',
      'json5/lib/stringify.js',
      'typescript',
      'generate-schema',
      'json-ts',
      'json-to-go',
      'gofmt.js',
      '@walmartlabs/json-to-simple-graphql-schema/lib',
      'transform-json-types',
      'json_typegen_wasm',
      'json-to-zod',
      'query-string',

      // prettier worker
      'prettier',
    ],
  },

  build: {
    sourcemap: true,
  },
});
