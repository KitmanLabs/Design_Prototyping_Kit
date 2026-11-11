import path from 'node:path'

// Playbook components were ported from the iP monorepo and still import through its package
// names. These aliases map those names onto src/playbook-components. One list, shared by the
// kit's vite.config.js, every prototype clone's vite.config.js and the clone script, which
// resolves imports with it to work out what a clone needs.
export function playbookAliases(root) {
  const playbook = path.resolve(root, 'src/playbook-components')
  return [
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
  ]
}
