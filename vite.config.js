import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths for assets
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Make sure this matches your backend port
        changeOrigin: true
      }
    }
  }
})
