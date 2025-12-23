import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // Autorise tous les hôtes (Railway, etc.)
    host: true,
    port: 1337,
  },
  preview: {
    allowedHosts: true, // Crucial pour le mode "preview" sur Railway
    host: true,
    port: 1337,
  }
})
