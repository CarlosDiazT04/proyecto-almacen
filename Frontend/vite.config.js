import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/auth-service': 'http://localhost:8080',
      '/catalog-service': 'http://localhost:8080',
      '/inventory-service': 'http://localhost:8080',
      '/movement-service': 'http://localhost:8080',
      '/alert-service': 'http://localhost:8080',
      '/actuator': 'http://localhost:8080'
    }
  }
})
