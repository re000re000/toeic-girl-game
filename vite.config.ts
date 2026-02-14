import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // ここを空文字にします。これで「今いる場所」を基準にします
})
