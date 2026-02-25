import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Для GitHub Pages: имя репозитория. Для локальной разработки не задавайте VITE_BASE_PATH.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [vue()],
  server: {
    port: 3000
  }
})
