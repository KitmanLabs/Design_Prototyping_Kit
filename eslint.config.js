const globals = require('globals')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const designSystem = require('./eslint-plugin-design-system')

module.exports = [
  {
    ignores: [
      // Components ported from the iP Playbook keep their upstream styling; not held to app lint rules
      'src/playbook-components/**',
      'src/playbook-components-build/**',
      // Storybook demo files intentionally use varied styles for documentation purposes
      'src/stories/**',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'design-system': designSystem,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'design-system/no-hardcoded-colors': 'error',
      'design-system/button-variant-compliance': 'error',
      'design-system/icon-type-compliance': 'error',
      'design-system/text-casing-compliance': 'warn',
      'no-restricted-imports': ['error', {
        paths: [
          { name: '@mui/material', importNames: ['Button'], message: "Import Button from 'playbook-components'." },
          { name: '@mui/material/Button', message: "Import Button from 'playbook-components'." },
        ],
      }],
    },
  },
  {
    // Mock data files and form/game pages contain proper nouns (names, teams, venues,
    // form template titles, abbreviations like UTC/SMS) that are correctly Title Case
    files: [
      'src/data/**/*',
      'src/data.js',
      'src/pages/forms/**/*',
      'src/components/forms/**/*',
      'src/components/AddGameDrawer.jsx',
    ],
    rules: { 'design-system/text-casing-compliance': 'off' },
  },
]
