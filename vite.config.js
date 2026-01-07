import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy /api requests to Google TTS in development
      '/api/tts': {
        target: 'https://translate.google.com',
        changeOrigin: true,
        headers: {
          'Referer': 'https://translate.google.com/',
        },
        rewrite: (path) => {
          const params = new URLSearchParams(path.split('?')[1] || '')
          const text = params.get('text') || ''
          return `/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=${encodeURIComponent(text)}`
        },
      },
    },
  },
});
