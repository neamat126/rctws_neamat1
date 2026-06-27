import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rctws_neamat1/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('react-router')) return 'router';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react-vendor';
        }
      }
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://apps.mwri.gov.eg',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/hr2/api')
      }
    }
  }
})
