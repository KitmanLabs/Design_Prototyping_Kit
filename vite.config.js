import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { gridPromptPlugin } from './server/gridPrompt.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const playbook = path.resolve(__dirname, 'src/playbook-components')

export default defineConfig(({ mode }) => {
  // All variables from .env, including ANTHROPIC_API_KEY. Only the grid AI route (server side)
  // reads the key; Vite exposes nothing to the browser unless it starts with VITE_.
  const env = loadEnv(mode, __dirname, '')
  return {
    plugins: [
      react({ include: /\.(jsx|js|tsx|ts)$/ }),
      // ANTHROPIC_API_KEY_REF is a 1Password secret reference (op://vault/item/field): the key
    // is read with the `op` CLI on the first AI Assistant prompt and kept only in memory.
    // ANTHROPIC_API_KEY_OP_ACCOUNT (optional) picks the 1Password account when several are signed in.
    gridPromptPlugin({
      apiKey: env.ANTHROPIC_API_KEY,
      apiKeyRef: env.ANTHROPIC_API_KEY_REF,
      opAccount: env.ANTHROPIC_API_KEY_OP_ACCOUNT,
    }),
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
  }
})
