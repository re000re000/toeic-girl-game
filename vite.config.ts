import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/toeic-girl-game/',
  build: {
    rollupOptions: {
      output: {
        // ファイル名に「NEW-VERSION」という文字と現在の時間を刻印して、古いキャッシュを粉砕します
        entryFileNames: `assets/[name]-NEW-VERSION-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
})
