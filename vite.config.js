import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const playbookBuild = path.resolve(__dirname, 'src/playbook-components-build')
const playbookSrc = path.resolve(__dirname, 'src/playbook-components')

function playbookBuildPlugin() {
  return {
    name: 'playbook-build',
    resolveId(id, importer) {
      const buildNorm = playbookBuild.replace(/\\/g, '/')
      const srcNorm = playbookSrc.replace(/\\/g, '/')
      if (importer && importer.replace(/\\/g, '/').startsWith(buildNorm) && id.startsWith('.')) {
        let resolved = path.resolve(path.dirname(importer), id)
        try {
          if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
            const idxJsx = path.join(resolved, 'index.jsx')
            const idxJs = path.join(resolved, 'index.js')
            resolved = fs.existsSync(idxJsx) ? idxJsx : idxJs
          } else if (!path.extname(resolved)) {
            const withJsx = resolved + '.jsx'
            const withJs = resolved + '.js'
            if (fs.existsSync(withJsx)) resolved = withJsx
            else if (fs.existsSync(withJs)) resolved = withJs
          }
        } catch {}
        return resolved
      }
      if (!id.includes('playbook-components') || id.includes('playbook-components-build')) return null
      if (id.startsWith('@kitman/')) {
        if (id === '@kitman/playbook' || id === '@kitman/playbook/' ||
            id === '@kitman/playbook/components' || id === '@kitman/playbook/components/') {
          return path.join(playbookBuild, 'index.js')
        }
        if (id.startsWith('@kitman/playbook/components/')) {
          const sub = id.slice('@kitman/playbook/components/'.length)
          return path.join(playbookBuild, sub)
        }
        return null
      }
      const match = id.match(/playbook-components\/?(.*)/)
      if (match) {
        let sub = match[1] || 'index.js'
        let resolved = path.join(playbookBuild, sub)
        try {
          if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
            const idxJsx = path.join(resolved, 'index.jsx')
            const idxJs = path.join(resolved, 'index.js')
            resolved = fs.existsSync(idxJsx) ? idxJsx : idxJs
          }
        } catch {}
        return resolved
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    playbookBuildPlugin(),
    react({ include: [/\.(jsx|js|tsx|ts)$/, /playbook-components-build\/.*\.(js|jsx)$/] }),
  ],
  resolve: {
    alias: [
      { find: /^@kitman\/playbook\/components\/(.+)$/, replacement: playbookBuild.replace(/\\/g, '/') + '/$1' },
      { find: '@kitman/playbook/components', replacement: path.join(playbookBuild, 'index.js') },
      { find: 'playbook-components', replacement: playbookBuild },
      { find: playbookSrc, replacement: playbookBuild },
      { find: '@mui/x-data-grid-premium', replacement: path.resolve(__dirname, 'node_modules/@mui/x-data-grid-pro') },
      { find: '@kitman/playbook/themes', replacement: path.resolve(playbookBuild, 'themes.js') },
      { find: '@kitman/playbook/icons', replacement: path.resolve(playbookBuild, 'icons.jsx') },
      { find: '@kitman/playbook/hooks', replacement: path.resolve(playbookBuild, 'hooks.js') },
      { find: '@kitman/playbook/providers', replacement: path.resolve(playbookBuild, 'providers.js') },
      { find: '@kitman/playbook/utils', replacement: path.resolve(playbookBuild, 'utils') },
      { find: '@kitman/playbook', replacement: playbookBuild },
      { find: '@kitman/common', replacement: path.resolve(__dirname, 'src/playbook-components/common') },
      { find: '@kitman/modules', replacement: path.resolve(__dirname, 'src/playbook-components/modules') },
      { find: '@kitman/components', replacement: path.resolve(playbookBuild, 'kitman-components-stub') },
    ]
  },
  server: {
    port: 3001
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
})