import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { playbookAliases } from './vite.aliases.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// One prototype version: a static build with relative paths and hash routes, so dist/ can be
// served from any folder. See PROTOTYPE.md.
export default defineConfig({
  base: './',
  plugins: [react({ include: /\.(jsx|js|tsx|ts)$/ })],
  resolve: {
    // iP monorepo package names mapped onto src/playbook-components, as in the kit.
    alias: playbookAliases(__dirname),
  },
  server: {
    port: 3001,
  },
  build: {
    // Keep the build's output to what someone can act on. A prototype is served from a folder,
    // never fetched over a slow link, so a large bundle is expected.
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      onwarn(warning, warn) {
        // The Data Grid's Excel export ships a minified library that calls eval: nothing to fix here.
        if (warning.code === 'EVAL' && /exceljs/.test(warning.id || '')) return
        warn(warning)
      },
    },
  },
})
