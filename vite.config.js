import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import { CONVERSATION_EXAMPLE, CHATS_EXAMPLE, USER_EXAMPLE } from "./context";

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  root: __dirname,
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, "index.html"),
        signin: resolve(__dirname, "src/html/signin.html"),
        chat: resolve(__dirname, "src/html/chat.html"),
        profile: resolve(__dirname, "src/html/profile.html"),
        editProfile: resolve(__dirname, "src/html/edit-profile.html"),
        editPassword: resolve(__dirname, "src/html/edit-password.html"),
        notFound: resolve(__dirname, "src/html/404.html"),
        appError: resolve(__dirname, "src/html/500.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "colors" as *; @use "fonts" as *; @use "mixins" as *;`,
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
      context: {
        chats: CHATS_EXAMPLE,
        conversation: CONVERSATION_EXAMPLE,
        user: USER_EXAMPLE,
      },
    }),
  ],
});
