#!/usr/bin/env node
// Clone the kit's primitives into a new prototype version: a complete app that runs and builds
// without the kit. Nothing is ever built in the kit itself.
//
//   node scripts/prototype/clone.mjs <target> [--intent IN0015] [--version v1] [--title "..."] [--no-install]
//   node scripts/prototype/clone.mjs <target> --from <previous version folder> [--title "..."] [--no-install]
//
// With --from, it makes the next version instead: a copy of the previous one (see newVersion).
//
// <target> must not exist or must be empty. In an intent it's design/prototype/v1/; anywhere
// else it's throwaway work. The version defaults to the target's folder name when that is v1,
// v2 and so on.
//
// What goes in: whole folders for the Playbook components, floorplans, styles and utils; from
// the rest of src/, only the files the app components' barrel, the shared data module and the
// template reach through their imports; the lint rules; public assets; the template in
// scripts/prototype/template. What never goes in: pages, stories, tests, Figma Code Connect
// files, the AI dev server, .env files and .claude/.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { playbookAliases } from '../../vite.aliases.mjs'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const TEMPLATE = path.join(KIT, 'scripts/prototype/template')
const KIT_REPO = 'KitmanLabs/Design_Prototyping_Kit'

// Copied whole (less the excluded files below).
const WHOLE_DIRS = ['src/playbook-components', 'src/floorplans', 'src/styles', 'src/utils']
// Where the import walk starts, besides the whole folders and the template's own src/.
const ROOTS = ['src/components/index.js', 'src/data.js', 'src/i18n.js', 'src/babelHelpersPolyfill.js']
// Copied as they are.
const EXTRA_DIRS = ['eslint-plugin-design-system', 'stylelint-plugin-design-system', 'public']
const EXTRA_FILES = ['vite.aliases.mjs', 'package-lock.json']

// Never copied, wherever they are, and an error if an import reaches them.
const EXCLUDED = [
  /(^|\/)\.env(\.|$)/,
  /(^|\/)\.claude(\/|$)/,
  /(^|\/)node_modules(\/|$)/,
  /\.(test|spec)\.[cm]?[jt]sx?$/,
  /\.stories\.[cm]?[jt]sx?$/,
  /\.figma\.[cm]?[jt]sx?$/,
  /^src\/(pages|stories|test)(\/|$)/,
  /^server(\/|$)/,
  // Component docs stay in the kit: a clone carries code. Their prose also draws warnings from the
  // personal data guard. The HeaderNew readme stays, because PageHeader points to it for its props.
  /^src\/playbook-components\/(?!HeaderNew\/readme\.md$).*\.md$/i,
  // Ported from iP but unused in the kit: both call iP's services (@kitman/services), which the
  // kit doesn't have, so they can't build.
  /^src\/playbook-components\/OpenIssues(\/|$)/,
  /^src\/playbook-components\/wrappers\/AthleteSelector\/dataSources(\/|$)/,
]

// Never walked into: installed packages, Git internals and build output.
const SKIPPED_DIRS = new Set(['node_modules', '.git', 'dist'])

const RESOLVE_EXTENSIONS = ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.css']
const SCANNED = /\.(m?js|jsx|ts|tsx|css)$/

// Packages the clone always needs as development dependencies, at the kit's versions.
const DEV_DEPENDENCIES = [
  'vite',
  '@vitejs/plugin-react',
  'eslint',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'eslint-plugin-design-system',
  'globals',
  'stylelint',
  'stylelint-config-standard',
  'stylelint-plugin-design-system',
]
// Imported by the build or the runtime without an import in src/.
const ALWAYS_DEPENDENCIES = ['react', 'react-dom', 'react-router-dom', '@mui/x-license']

export function isExcluded(rel) {
  return EXCLUDED.some((re) => re.test(rel.split(path.sep).join('/')))
}

// The import specifiers in a source file, with comments taken out first so the usage
// examples written in comments don't count.
export function importsOf(source, file) {
  const code = file.endsWith('.css')
    ? source.replace(/\/\*[\s\S]*?\*\//g, '')
    : source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const found = new Set()
  const patterns = file.endsWith('.css')
    ? [/@import\s+(?:url\()?\s*['"]([^'"]+)['"]/g]
    : [
        /\b(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,$]+?\s+from\s+)?['"]([^'"]+)['"]/g,
        /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
        /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
      ]
  for (const re of patterns) {
    for (const match of code.matchAll(re)) found.add(match[1])
  }
  return [...found]
}

function resolveFile(base) {
  const candidates = [base, ...RESOLVE_EXTENSIONS.map((ext) => base + ext)]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  }
  if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
    for (const ext of RESOLVE_EXTENSIONS) {
      const index = path.join(base, 'index' + ext)
      if (fs.existsSync(index)) return index
    }
  }
  return null
}

function applyAlias(specifier, aliases) {
  for (const { find, replacement } of aliases) {
    if (find instanceof RegExp) {
      if (find.test(specifier)) return specifier.replace(find, replacement)
    } else if (specifier === find || specifier.startsWith(find + '/')) {
      return replacement + specifier.slice(find.length)
    }
  }
  return null
}

export function packageName(specifier) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

// Resolve one specifier from a file under root: { file } for a local file, { pkg } for a
// package, { missing } when a local or aliased path doesn't exist, or {} for a URL.
export function resolveImport(specifier, fromFile, root, aliases) {
  const clean = specifier.split('?')[0]
  if (/^(https?:|data:|#)/.test(clean)) return {}
  if (clean.startsWith('/')) {
    // Root-relative URLs point into public/.
    const file = path.join(root, 'public', clean)
    return fs.existsSync(file) ? { file } : { missing: specifier }
  }
  if (clean.startsWith('.')) {
    const file = resolveFile(path.resolve(path.dirname(fromFile), clean))
    return file ? { file } : { missing: specifier }
  }
  const aliased = applyAlias(clean, aliases)
  if (aliased) {
    const file = resolveFile(aliased)
    return file ? { file } : { missing: specifier }
  }
  return { pkg: packageName(clean) }
}

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && SKIPPED_DIRS.has(entry.name)) continue
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

// Follow imports from the start files. Returns the local files reached, the packages imported
// and anything that couldn't be resolved or must not be copied.
export function collect(startFiles, root, aliases) {
  const files = new Set()
  const packages = new Set()
  const problems = []
  const queue = [...startFiles]
  while (queue.length) {
    const file = queue.pop()
    if (files.has(file)) continue
    files.add(file)
    if (!SCANNED.test(file)) continue
    for (const specifier of importsOf(fs.readFileSync(file, 'utf8'), file)) {
      const result = resolveImport(specifier, file, root, aliases)
      const from = path.relative(root, file)
      if (result.missing) problems.push(`${from}: can't resolve '${result.missing}'`)
      else if (result.pkg) packages.add(result.pkg)
      else if (result.file) {
        const rel = path.relative(root, result.file)
        if (rel.startsWith('..')) problems.push(`${from}: '${specifier}' points outside the folder`)
        else if (isExcluded(rel)) problems.push(`${from}: '${specifier}' reaches ${rel}, which is never cloned`)
        else queue.push(result.file)
      }
    }
  }
  return { files, packages, problems }
}

function parseArgs(argv) {
  const args = { install: true }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--intent') args.intent = argv[++i]
    else if (arg === '--version') args.version = argv[++i]
    else if (arg === '--title') args.title = argv[++i]
    else if (arg === '--no-install') args.install = false
    else if (arg === '--from') args.from = argv[++i]
    else if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}`)
    else rest.push(arg)
  }
  if (rest.length !== 1) throw new Error('Give one target folder, for example design/prototype/v1')
  args.target = path.resolve(rest[0])
  return args
}

function kitCommit() {
  try {
    const commit = execFileSync('git', ['-C', KIT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    const status = execFileSync('git', ['-C', KIT, 'status', '--porcelain'], { encoding: 'utf8' }).trim()
    return { commit, dirty: status.length > 0 }
  } catch {
    return { commit: null, dirty: null }
  }
}

const today = () => new Date().toISOString().slice(0, 10)

function fill(text, values) {
  return text.replace(/\{\{(\w+)\}\}/g, (whole, key) => (key in values ? values[key] : whole))
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}

// Add the peer dependencies the kit declares for each package, read from the kit's lockfile, so
// packages nothing imports by name (Emotion's styled for MUI, filepond for react-filepond) come too.
export function withPeers(packages, kitPkg, lock) {
  const declared = { ...kitPkg.devDependencies, ...kitPkg.dependencies }
  const out = new Set(packages)
  const queue = [...out]
  while (queue.length) {
    const pkg = queue.pop()
    const peers = lock.packages?.[`node_modules/${pkg}`]?.peerDependencies || {}
    for (const peer of Object.keys(peers)) {
      if (declared[peer] && !out.has(peer)) {
        out.add(peer)
        queue.push(peer)
      }
    }
  }
  return out
}

// The clone's package.json: the kit's versions of exactly the packages the clone needs.
function packageJson(kitPkg, packages, name) {
  const pick = (names, ...sources) => {
    const out = {}
    const unknown = []
    for (const pkg of [...names].sort()) {
      const version = sources.map((s) => s?.[pkg]).find(Boolean)
      if (version) out[pkg] = version
      else unknown.push(pkg)
    }
    return { out, unknown }
  }
  const runtime = pick(
    new Set([...packages, ...ALWAYS_DEPENDENCIES].filter((p) => !DEV_DEPENDENCIES.includes(p))),
    kitPkg.dependencies,
    kitPkg.devDependencies,
  )
  const dev = pick(DEV_DEPENDENCIES, kitPkg.devDependencies, kitPkg.dependencies)
  return {
    pkg: {
      name,
      version: '0.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        lint: 'eslint src',
        'lint:css': "stylelint 'src/**/*.css' --allow-empty-input",
        'build-prototype': 'node scripts/build-prototype.mjs',
      },
      dependencies: runtime.out,
      devDependencies: dev.out,
      overrides: kitPkg.overrides,
    },
    unknown: [...runtime.unknown, ...dev.unknown],
  }
}

export function clone({ target, intent = null, version, title, install = true, log = console.log }) {
  if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
    throw new Error(`${target} isn't empty. Clone into a new folder.`)
  }
  version = version || (/^v\d+$/.test(path.basename(target)) ? path.basename(target) : null)
  if (!version || !/^v\d+$/.test(version)) {
    throw new Error('Give the version as v1, v2 and so on, with --version or as the folder name.')
  }
  if (intent && !/^IN\d{4}$/.test(intent)) throw new Error(`The intent id should look like IN0015, not ${intent}.`)
  title = title || [intent, version].filter(Boolean).join(' ')

  const aliases = playbookAliases(KIT)
  const templateSrc = walk(path.join(TEMPLATE, 'src')).filter((f) => !isExcluded(path.relative(TEMPLATE, f)))

  // Start the walk from the kit's copy of each template import, by mapping template/src onto src.
  const starts = [
    ...WHOLE_DIRS.flatMap((dir) => walk(path.join(KIT, dir))),
    ...ROOTS.map((rel) => path.join(KIT, rel)),
  ].filter((file) => !isExcluded(path.relative(KIT, file)))
  // A template import the template itself provides (App, src/prototype/) isn't taken from the kit.
  for (const file of templateSrc) {
    const asIfInKit = path.join(KIT, 'src', path.relative(path.join(TEMPLATE, 'src'), file))
    for (const specifier of importsOf(fs.readFileSync(file, 'utf8'), file)) {
      if (!specifier.startsWith('.')) continue
      if (resolveFile(path.resolve(path.dirname(file), specifier))) continue
      const resolved = resolveFile(path.resolve(path.dirname(asIfInKit), specifier))
      if (resolved) starts.push(resolved)
    }
  }
  const { files, packages, problems } = collect(starts, KIT, aliases)
  for (const file of templateSrc) {
    for (const specifier of importsOf(fs.readFileSync(file, 'utf8'), file)) {
      if (!specifier.startsWith('.')) packages.add(packageName(specifier))
    }
  }
  if (problems.length) {
    throw new Error(`The kit's primitives don't resolve cleanly:\n  ${problems.join('\n  ')}`)
  }

  fs.mkdirSync(target, { recursive: true })
  for (const file of files) copyFile(file, path.join(target, path.relative(KIT, file)))
  for (const dir of EXTRA_DIRS) {
    for (const file of walk(path.join(KIT, dir))) {
      const rel = path.relative(KIT, file)
      if (!isExcluded(rel)) copyFile(file, path.join(target, rel))
    }
  }
  for (const rel of EXTRA_FILES) copyFile(path.join(KIT, rel), path.join(target, rel))

  const kit = kitCommit()
  const values = { INTENT: intent || 'none', VERSION: version, TITLE: title }
  const renames = { gitignore: '.gitignore', 'stylelintrc.json': '.stylelintrc.json' }
  for (const file of walk(TEMPLATE)) {
    const rel = path.relative(TEMPLATE, file)
    const out = path.join(target, renames[rel] || rel)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    if (/\.(md|html)$/.test(rel)) fs.writeFileSync(out, fill(fs.readFileSync(file, 'utf8'), values))
    else fs.copyFileSync(file, out)
  }

  const meta = {
    schema: 'kitman-prototype-version/1',
    intent,
    version,
    title,
    cloned: today(),
    created: today(),
    from: null,
    kit: { repo: KIT_REPO, ...kit },
  }
  fs.writeFileSync(path.join(target, 'prototype.json'), JSON.stringify(meta, null, 2) + '\n')

  const kitPkg = JSON.parse(fs.readFileSync(path.join(KIT, 'package.json'), 'utf8'))
  const name = ['prototype', intent, version].filter(Boolean).join('-').toLowerCase()
  const lock = JSON.parse(fs.readFileSync(path.join(KIT, 'package-lock.json'), 'utf8'))
  const needed = withPeers(new Set([...packages, ...ALWAYS_DEPENDENCIES]), kitPkg, lock)
  const { pkg, unknown } = packageJson(kitPkg, needed, name)
  fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

  const check = checkClone(target)
  if (check.length) throw new Error(`The clone in ${target} doesn't resolve:\n  ${check.join('\n  ')}`)

  if (unknown.length) {
    log(`Warning: imported but not declared in the kit's package.json, so left out: ${unknown.join(', ')}`)
  }
  if (kit.dirty) log('Warning: the kit had uncommitted changes, so prototype.json records "dirty": true.')
  if (install) {
    log('Installing dependencies (npm install)...')
    execFileSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: target, stdio: 'inherit' })
  }
  log(`Cloned ${files.size} primitive files into ${target} (${version}${intent ? `, ${intent}` : ''}).`)
  log(install ? 'Run it with: npm run dev' : 'Run npm install, then npm run dev.')
  return { files: files.size, packages: Object.keys(pkg.dependencies), meta }
}

// Make the next version: a copy of the previous version, with the files that carry the version
// rewritten (prototype.json, package.json's name, brief.md's Version and Previous version lines,
// index.html's title). The primitives stay the previous version's snapshot, and prototype.json
// keeps its kit commit and clone date, so the only change between versions is the one asked for.
// node_modules, dist/ and .env files aren't copied: the new version installs and builds its own.
export function newVersion({ target, from, version, title, intent, install = true, log = console.log }) {
  const source = path.resolve(from)
  const metaPath = path.join(source, 'prototype.json')
  if (!fs.existsSync(metaPath)) throw new Error(`${source} has no prototype.json, so it isn't a prototype version.`)
  if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
    throw new Error(`${target} isn't empty. Make the new version in a new folder.`)
  }
  const previous = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  version = version || (/^v\d+$/.test(path.basename(target)) ? path.basename(target) : null)
  if (!version || !/^v\d+$/.test(version)) {
    throw new Error('Give the new version as v2, v3 and so on, with --version or as the folder name.')
  }
  if (version === previous.version) throw new Error(`${source} is already ${version}.`)
  if (intent && intent !== previous.intent) throw new Error(`${source} belongs to ${previous.intent}, not ${intent}.`)

  for (const file of walk(source)) {
    const rel = path.relative(source, file)
    if (!isExcluded(rel)) copyFile(file, path.join(target, rel))
  }

  const defaultTitle = (v) => [previous.intent, v].filter(Boolean).join(' ')
  const nextTitle = title || (previous.title === defaultTitle(previous.version) ? defaultTitle(version) : previous.title)
  // A new version hasn't been built yet, whatever the previous one says.
  const { built: _built, ...carried } = previous
  const meta = { ...carried, version, title: nextTitle, created: today(), from: previous.version }
  fs.writeFileSync(path.join(target, 'prototype.json'), JSON.stringify(meta, null, 2) + '\n')

  const pkgPath = path.join(target, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.name = ['prototype', previous.intent, version].filter(Boolean).join('-').toLowerCase()
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  const rewrite = (rel, change) => {
    const file = path.join(target, rel)
    if (fs.existsSync(file)) fs.writeFileSync(file, change(fs.readFileSync(file, 'utf8')))
  }
  rewrite('brief.md', (text) => text
    .replace(/^# Brief: .*$/m, `# Brief: ${nextTitle}`)
    .replace(/^\*\*Version:\*\* .*$/m, `**Version:** ${version}`)
    .replace(/^\*\*Previous version:\*\* .*$/m, `**Previous version:** ${previous.version}`))
  rewrite('index.html', (text) => text.replace(/<title>.*<\/title>/, `<title>${nextTitle}</title>`))

  const check = checkClone(target)
  if (check.length) throw new Error(`The new version in ${target} doesn't resolve:\n  ${check.join('\n  ')}`)
  if (install) {
    log('Installing dependencies (npm install)...')
    execFileSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: target, stdio: 'inherit' })
  }
  log(`Made ${version} in ${target} from ${previous.version}. Add the change asked for to brief.md.`)
  return { meta }
}

// Every import in the clone's src/ resolves inside the clone, and nothing excluded is there.
export function checkClone(root) {
  const aliases = playbookAliases(root)
  const problems = []
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const declared = new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})])
  for (const file of walk(root)) {
    const rel = path.relative(root, file)
    if (isExcluded(rel)) problems.push(`${rel} must never be cloned`)
  }
  for (const file of walk(path.join(root, 'src')).filter((f) => SCANNED.test(f))) {
    for (const specifier of importsOf(fs.readFileSync(file, 'utf8'), file)) {
      const result = resolveImport(specifier, file, root, aliases)
      const from = path.relative(root, file)
      if (result.missing) problems.push(`${from}: can't resolve '${result.missing}'`)
      else if (result.file && path.relative(root, result.file).startsWith('..')) {
        problems.push(`${from}: '${specifier}' points outside the clone`)
      } else if (result.pkg && !declared.has(result.pkg)) {
        problems.push(`${from}: imports ${result.pkg}, which package.json doesn't declare`)
      }
    }
  }
  return problems
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2))
    if (args.from) newVersion(args)
    else clone(args)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
