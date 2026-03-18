import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  // Для GitHub Pages: имя репозитория. Для локальной разработки не задавайте VITE_BASE_PATH.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    ViteImageOptimizer({
      logStats: true,
      jpeg: { quality: 82 },
      jpg: { quality: 82 },
      png: { quality: 85, compressionLevel: 9 },
      webp: { quality: 85 }
    })
  ],
  server: {
    port: 3000
  }
})
