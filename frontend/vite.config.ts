import { defineConfig } from 'vite';
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        GlobalsPolyfills({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      https: 'agent-base',
    },
  },
});
