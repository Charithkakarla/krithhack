import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    // Avoid filesystem PostCSS discovery issues by using inline config.
    postcss: {
      plugins: []
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  }
})
