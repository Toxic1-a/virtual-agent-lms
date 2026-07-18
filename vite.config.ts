import { copyFileSync, existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Cloudflare Pages SPA fallback: unknown routes serve 404.html (= index). */
function cloudflareSpaFallback() {
  return {
    name: 'cloudflare-spa-fallback',
    closeBundle() {
      if (existsSync('dist/index.html')) {
        copyFileSync('dist/index.html', 'dist/404.html')
      }
    },
  }
}

const pagesBase = process.env.GITHUB_PAGES === 'true' ? '/virtual-agent-lms/' : '/'

export default defineConfig({
  base: pagesBase,
  plugins: [react(), cloudflareSpaFallback()],
  server: {
    watch: {
      ignored: [
        '**/_content_extract/**',
        '**/node_modules/**',
        '**/*.riv',
        '**/public/rive/**',
        '**/src/assets/rive/**',
      ],
    },
  },
})
