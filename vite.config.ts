import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// 使用相對 base，同一 build 在 Vercel (/) 與 GitHub Pages (/Ethereum-roadmap/) 皆可正確載入資源
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
}) 