module.exports = {
  env: { browser: true, es2022: true, node: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['react', 'react-hooks', 'design-system'],
  extends: ['plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    'design-system/no-hardcoded-colors': 'error',
    'design-system/button-variant-compliance': 'error',
    'design-system/icon-type-compliance': 'error',
    'design-system/text-casing-compliance': 'warn',
  },
  overrides: [
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
  ],
};
