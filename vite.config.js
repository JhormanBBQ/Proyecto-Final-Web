import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Configuración estándar compatible con Vercel
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
})
