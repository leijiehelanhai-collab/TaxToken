import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 代理 BSCScan API 请求以解决 CORS 问题
      '/api/bscscan': {
        target: 'https://api-testnet.bscscan.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bscscan/, '/api'),
        secure: false
      },
      '/api/bscscan-mainnet': {
        target: 'https://api.bscscan.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bscscan-mainnet/, '/api'),
        secure: false
      }
    }
  }
})
