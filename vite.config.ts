import * as path from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  define: {
    __DEV__: isDev,
    __TEST__: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: isDev ? 3001 : 3000,
  },
})
