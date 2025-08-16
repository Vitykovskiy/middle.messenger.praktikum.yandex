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
      input: {
        login: 'index.html',
        signin: 'src/html/signin/index.html',
        chat: 'src/html/chat/index.html',
        profile: 'src/html/profile/index.html',
        editProfile: 'src/html/edit-profile/index.html',
        editPassword: 'src/html/edit-password/index.html',
        notFound: 'src/html/404/index.html',
        appError: 'src/html/500/index.html'
      }
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
