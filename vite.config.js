import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cbioportal-vitessce-proxy/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: mode !== 'production' ? { vitessce: '@vitessce/dev' } : {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
}))
