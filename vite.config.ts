import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  root: __dirname,
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "colors" as *; @use "fonts" as *; @use "mixins" as *;'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
