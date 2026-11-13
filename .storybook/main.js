import { mergeConfig } from 'vite';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/stories/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // The repo writes JSX in .js files. Storybook 10 parses story modules after
  // Vite's esbuild step, which only compiles JSX in .jsx/.tsx by default.
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      esbuild: {
        include: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'jsx',
      },
      optimizeDeps: {
        esbuildOptions: { loader: { '.js': 'jsx' } },
      },
    }),
};

export default config;
