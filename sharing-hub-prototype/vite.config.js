import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone prototype — isolated from the design kit's own vite/vercel config.
export default defineConfig({
  plugins: [react()],
  server: { port: 3012 },
})
