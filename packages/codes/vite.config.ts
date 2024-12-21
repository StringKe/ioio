import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: 'tsconfig.lib.json', entryRoot: 'src' }), visualizer()],
  build: {
    lib: {
      name: 'codes',
      entry: 'src/index.ts',
      formats: ['cjs', 'es'],
      fileName: 'index',
    },
    sourcemap: true,
  },
});
