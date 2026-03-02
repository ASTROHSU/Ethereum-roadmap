import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Vercel 依然需要根目錄 '/'，否則用相對路徑 './' 來兼容 Github Pages 與 IPFS
  base: process.env.VERCEL ? '/' : './',
  plugins: [react()],
})
