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
})
