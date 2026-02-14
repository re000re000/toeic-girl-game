import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/toeic-girl-game/', // あなたのリポジトリ名をハッキリ指定します
})
