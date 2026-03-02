import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages 部署在 /Ethereum-roadmap/，需在 CI 設 BASE_PATH；Vercel/本機為 /
const basePath = (globalThis as unknown as { process?: { env?: { BASE_PATH?: string } } }).process?.env?.BASE_PATH
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: basePath || '/',
}) 