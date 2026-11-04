import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const playbook = path.resolve(__dirname, 'src/playbook-components')

export default defineConfig({
  plugins: [
    react({ include: /\.(jsx|js|tsx|ts)$/ }),
  ],
  resolve: {
    // Playbook components were ported from the iP monorepo and still import through
    // its package names. These aliases map those names onto src/playbook-components.
    alias: [
      { find: /^@kitman\/playbook\/components\/(.+)$/, replacement: `${playbook}/$1` },
      { find: '@kitman/playbook/components', replacement: path.join(playbook, 'index.js') },
      { find: 'playbook-components', replacement: playbook },
      { find: '@kitman/playbook/themes', replacement: path.join(playbook, 'themes.js') },
      { find: '@kitman/playbook/icons', replacement: path.join(playbook, 'icons.jsx') },
      { find: '@kitman/playbook/hooks', replacement: path.join(playbook, 'hooks.js') },
      { find: '@kitman/playbook/providers', replacement: path.join(playbook, 'providers.js') },
      { find: '@kitman/playbook/utils', replacement: path.join(playbook, 'utils') },
      { find: '@kitman/playbook', replacement: playbook },
      { find: '@kitman/common', replacement: path.join(playbook, 'common') },
      { find: '@kitman/modules', replacement: path.join(playbook, 'modules') },
      { find: '@kitman/components', replacement: path.join(playbook, 'kitman-components-stub') },
    ],
  },
  server: {
    port: 3001,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    server: {
      deps: {
        // The Scheduler deep-imports @atlaskit/pragmatic-drag-and-drop by directory, which
        // Node's ESM loader rejects. Letting Vite transform these packages resolves it, as in the app.
        inline: [/@mui\/x-scheduler/, /@atlaskit\/pragmatic-drag-and-drop/],
      },
    },
  },
})
