#!/usr/bin/env node
// Build this version for the record, then describe every version of the prototype.
//
//   npm run build-prototype            (inside a version folder, such as design/prototype/v2)
//
// 1. Builds dist/ in place with "today" pinned (VITE_PROTOTYPE_TODAY) to the build date, so the
//    version renders the same dates whenever it's opened, and with the MUI X licence key left out.
// 2. Records the build date in prototype.json.
// 3. For an intent's prototype, writes ../manifest.json (schema kitman-prototype/1) and ../README.md
//    from every version folder beside this one. Accelerate reads the manifest; nobody edits it.
//
// It refuses to start if this version's routes, notes, placeholders or brief would be recorded
// wrongly, and refuses to finish if the licence key, or any file over 2 MB in src/, would reach
// the record.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const MANIFEST_SCHEMA = 'kitman-prototype/1'
const MAX_SOURCE_BYTES = 2 * 1024 * 1024
const LICENCE_VARIABLE = 'VITE_MUI_X_LICENSE_KEY'

// What a prototype doesn't do unless prototype.json says otherwise.
const DOES_NOT_DO = ['saving anything: changes are lost when the page reloads', 'a server or real data', 'permissions: everyone sees everything']

// Packages a prototype can use that iP doesn't ship, and why. Anything imported from these is listed
// as notInIp, for the specification's author to decide on.
const NOT_IN_IP = {
  '@mui/x-scheduler': 'MUI X Scheduler: iP has no scheduler built on it',
  '@mui/x-scheduler-premium': 'MUI X Scheduler: iP has no scheduler built on it',
  '@mui/x-chat': 'MUI X Chat (alpha): not used in iP',
}

const NOTE_TYPES = ['assumption', 'question', 'deferral']
// What the template's brief.md holds until someone fills it in.
const BRIEF_PLACEHOLDERS = /<(?:sha|role|date|What someone|The solution this version|For a new version only)\b[^>\n]*>/g
// Where the prototype's own code starts: App.jsx reads routes.js and pages/index.js.
const ENTRY_POINTS = ['pages/index.js', 'routes.js', 'notes.js', 'placeholders.js']
const RESOLVE = ['', '.js', '.jsx', '.mjs', '/index.js', '/index.jsx']

const FLOORPLANS = /(^|\/)floorplans$/
const PLAYBOOK = /(^|\/)playbook-components$|^@kitman\/playbook\/components$/

const read = (file) => fs.readFileSync(file, 'utf8')
const readJson = (file) => JSON.parse(read(file))

// Load a module that is plain data (routes.js, notes.js, placeholders.js) without a bundler.
async function loadData(file, name, fallback) {
  if (!fs.existsSync(file)) return fallback
  const source = read(file)
  try {
    const mod = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`)
    return mod[name] ?? fallback
  } catch (error) {
    throw new Error(`${path.basename(file)} couldn't be read as plain data. Keep it free of imports and JSX. (${error.message})`)
  }
}

// The code without its comments, so commented-out imports and examples don't count. Strings stay.
export function stripComments(code) {
  return code.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (match, string) => string ?? '')
}

// The files in src/prototype that the app reaches, following relative imports from the entry
// points, so a page nothing imports any more (such as the template's Start.jsx) isn't counted.
function reachableFiles(prototypeSrc) {
  const seen = new Set()
  const queue = ENTRY_POINTS.map((f) => path.join(prototypeSrc, f)).filter((f) => fs.existsSync(f))
  while (queue.length) {
    const file = queue.shift()
    if (seen.has(file)) continue
    seen.add(file)
    for (const match of stripComments(read(file)).matchAll(/(?:\bfrom|\bimport)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const base = path.resolve(path.dirname(file), match[1])
      if (!base.startsWith(prototypeSrc + path.sep)) continue
      const found = RESOLVE.map((ext) => base + ext).find((f) => fs.existsSync(f) && fs.statSync(f).isFile())
      if (found && /\.(m?js|jsx)$/.test(found)) queue.push(found)
    }
  }
  return [...seen]
}

function walk(dir, skip = new Set(['node_modules', 'dist', '.git'])) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return skip.has(entry.name) ? [] : walk(full, skip)
    return [full]
  })
}

// Named imports from the floorplans and Playbook barrels, and packages iP doesn't ship.
export function componentsUsed(versionDir) {
  const floorplans = new Set()
  const playbook = new Set()
  const notInIp = new Map()
  for (const file of reachableFiles(path.join(versionDir, 'src/prototype'))) {
    const code = stripComments(read(file))
    for (const match of code.matchAll(/import\s*(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g)) {
      const names = match[1].split(',').map((n) => n.trim().split(/\s+as\s+/)[0]).filter(Boolean)
      if (FLOORPLANS.test(match[2])) names.forEach((n) => floorplans.add(n))
      if (PLAYBOOK.test(match[2])) names.forEach((n) => playbook.add(n))
    }
    for (const match of code.matchAll(/from\s*['"](@[^/'"]+\/[^/'"]+|[^./'"][^/'"]*)/g)) {
      if (NOT_IN_IP[match[1]]) notInIp.set(match[1], { name: match[1], why: NOT_IN_IP[match[1]] })
    }
  }
  return { floorplans: [...floorplans].sort(), playbook: [...playbook].sort(), notInIp: [...notInIp.values()] }
}

// What the version was built from, read from brief.md's "Built from" line. Only a line naming the
// specification's commit counts as built from it: "IN0012 has no specification" is a summary.
function builtFrom(versionDir, version) {
  const briefFile = path.join(versionDir, 'brief.md')
  const line = fs.existsSync(briefFile) ? (read(briefFile).match(/^\*\*Built from:\*\* (.*)$/m) || [])[1] : null
  const kind = line && /\bcommit\s+[0-9a-f]{7,40}\b/i.test(line) ? 'specification' : 'brief'
  // A line still holding the template's <placeholders> hasn't been filled in, so it isn't a reference.
  return { kind, ref: line && !/[<>]/.test(line) ? line : null, brief: `${version}/brief.md` }
}

// The page names pages/index.js exports as its default object, or null when it isn't written that way.
function pageExports(prototypeSrc) {
  const file = path.join(prototypeSrc, 'pages/index.js')
  if (!fs.existsSync(file)) return null
  const match = stripComments(read(file)).match(/export\s+default\s*\{([^}]*)\}/)
  if (!match) return null
  return new Set(match[1].split(',').map((entry) => entry.split(':')[0].trim()).filter(Boolean))
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Everything in this version that the manifest would record wrongly, or that Accelerate couldn't
// read, as one list of problems. Only this version: versions already recorded never change.
export async function checkVersion(versionDir) {
  const problems = []
  const prototypeSrc = path.join(versionDir, 'src/prototype')
  const routesFile = path.join(prototypeSrc, 'routes.js')
  const routesSource = fs.existsSync(routesFile) ? stripComments(read(routesFile)) : ''
  const routes = await loadData(routesFile, 'routes', [])
  const notes = await loadData(path.join(prototypeSrc, 'notes.js'), 'notes', [])
  const placeholders = await loadData(path.join(prototypeSrc, 'placeholders.js'), 'placeholders', [])
  const pages = pageExports(prototypeSrc)

  const paths = new Set()
  if (!routes.length) problems.push('routes.js lists no routes.')
  for (const route of routes) {
    const where = typeof route.path === 'string' ? route.path : JSON.stringify(route.path)
    if (typeof route.path !== 'string' || !route.path.startsWith('/')) {
      problems.push(`routes.js: the path ${where} should be a string starting with /.`)
      continue
    }
    if (/[:*?#]/.test(route.path)) problems.push(`routes.js: ${where} should be a literal path, with no parameter, wildcard, query string or #.`)
    if (paths.has(route.path)) problems.push(`routes.js: ${where} is listed twice.`)
    paths.add(route.path)
    if (!new RegExp(`\\bpath\\s*:\\s*'${escapeRegExp(route.path)}'`).test(routesSource)) {
      problems.push(`routes.js: write ${where} as path: '${route.path}', in single quotes, because Accelerate reads the file as text.`)
    }
    if (!route.title) problems.push(`routes.js: ${where} has no title.`)
    if (route.scenarios !== undefined && !Array.isArray(route.scenarios)) problems.push(`routes.js: ${where} has scenarios that aren't a list.`)
    if (pages && !pages.has(route.page)) problems.push(`routes.js: ${where} shows the page ${route.page}, which pages/index.js doesn't export.`)
  }

  const ids = new Set()
  for (const note of notes) {
    const id = note.id || '(a note with no id)'
    if (!note.id) problems.push('notes.js: a note has no id.')
    else if (ids.has(note.id)) problems.push(`notes.js: the id ${note.id} is used twice.`)
    ids.add(note.id)
    if (!NOTE_TYPES.includes(note.type)) problems.push(`notes.js: ${id} has the type ${JSON.stringify(note.type)}; use assumption, question or deferral.`)
    if (note.route && !paths.has(note.route)) problems.push(`notes.js: ${id} is about ${note.route}, which routes.js doesn't list.`)
    if (!note.text || !String(note.text).trim()) problems.push(`notes.js: ${id} has no text.`)
  }

  const names = new Set()
  for (const placeholder of placeholders) {
    const name = placeholder.name || '(a placeholder with no name)'
    if (!placeholder.name) problems.push('placeholders.js: a placeholder has no name.')
    else if (names.has(placeholder.name)) problems.push(`placeholders.js: ${placeholder.name} is listed twice.`)
    names.add(placeholder.name)
    if (placeholder.value === undefined) problems.push(`placeholders.js: ${name} has no value.`)
    for (const r of placeholder.routes || []) {
      if (!paths.has(r)) problems.push(`placeholders.js: ${name} names ${r}, which routes.js doesn't list.`)
    }
  }

  const briefFile = path.join(versionDir, 'brief.md')
  if (!fs.existsSync(briefFile)) {
    problems.push('brief.md is missing.')
  } else {
    const brief = read(briefFile)
    if (!/^\*\*Built from:\*\* \S/m.test(brief)) {
      problems.push('brief.md needs its "**Built from:**" line: "the specification at commit <sha>", or the summary it was built from.')
    }
    const left = [...new Set(brief.match(BRIEF_PLACEHOLDERS) || [])]
    if (left.length) problems.push(`brief.md still holds the template's placeholders: ${left.join(', ')}. Fill them in or delete those lines.`)
  }
  return problems
}

const routeString = (version, routePath) => `#/${version}${routePath === '/' ? '/' : routePath}`

// Describe every version folder in prototypeDir (design/prototype) as one manifest.
export async function buildManifest(prototypeDir) {
  const versionDirs = fs.readdirSync(prototypeDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^v\d+$/.test(e.name) && fs.existsSync(path.join(prototypeDir, e.name, 'prototype.json')))
    .map((e) => path.join(prototypeDir, e.name))
    .sort((a, b) => Number(path.basename(a).slice(1)) - Number(path.basename(b).slice(1)))
  if (!versionDirs.length) throw new Error(`No version folders with a prototype.json in ${prototypeDir}.`)

  const metas = versionDirs.map((dir) => readJson(path.join(dir, 'prototype.json')))
  const latest = metas[metas.length - 1]
  const latestDir = versionDirs[versionDirs.length - 1]
  const pkg = readJson(path.join(latestDir, 'package.json'))
  const major = (name) => (pkg.dependencies?.[name] || '').replace(/^[^\d]*/, '').split('.')[0]
  const fakeSource = fs.existsSync(path.join(latestDir, 'src/data/fake.js')) ? read(path.join(latestDir, 'src/data/fake.js')) : ''
  const seed = (fakeSource.match(/DATA_SEED\s*=\s*(\d+)/) || [])[1]
  const fakerVersion = (pkg.dependencies?.['@faker-js/faker'] || '').replace(/^[^\d]*/, '')

  const manifest = {
    schema: MANIFEST_SCHEMA,
    intent: latest.intent,
    kit: {
      repo: latest.kit?.repo,
      commit: latest.kit?.commit,
      stack: `MUI ${major('@mui/material')}, MUI X ${major('@mui/x-data-grid-premium') || major('@mui/x-data-grid')}`,
    },
    data: {
      provenance: 'generated',
      generator: `@faker-js/faker ${fakerVersion}, seed ${seed ?? 'unknown'}, against each version's pinned build date`,
      statement: 'Every name, squad, date and figure is generated. Nothing is copied from a customer, an export or a real person.',
    },
    doesNotDo: latest.doesNotDo || DOES_NOT_DO,
    versions: [],
    routes: [],
    placeholders: [],
    notes: [],
    components: { floorplans: [], playbook: [], notInIp: [] },
  }

  const floorplans = new Set()
  const playbook = new Set()
  const notInIp = new Map()
  for (const [index, dir] of versionDirs.entries()) {
    const meta = metas[index]
    const version = meta.version
    const routes = await loadData(path.join(dir, 'src/prototype/routes.js'), 'routes', [])
    const notes = await loadData(path.join(dir, 'src/prototype/notes.js'), 'notes', [])
    const placeholders = await loadData(path.join(dir, 'src/prototype/placeholders.js'), 'placeholders', [])
    manifest.versions.push({
      id: version,
      title: meta.title,
      built: meta.built || null,
      builtFrom: builtFrom(dir, version),
      supersedes: meta.from || null,
      kitCommit: meta.kit?.commit || null,
    })
    for (const r of routes) {
      manifest.routes.push({
        route: routeString(version, r.path),
        version,
        title: r.title,
        floorplan: r.floorplan ?? null,
        baseline: r.baseline ?? null,
        scenarios: r.scenarios || [],
      })
    }
    for (const p of placeholders) {
      manifest.placeholders.push({ name: p.name, value: p.value, unit: p.unit ?? null, version, routesHint: (p.routes || []).map((r) => routeString(version, r)) })
    }
    for (const n of notes) {
      manifest.notes.push({ id: n.id, version, type: n.type, route: n.route ? routeString(version, n.route) : null, text: n.text })
    }
    const used = componentsUsed(dir)
    used.floorplans.forEach((c) => floorplans.add(c))
    used.playbook.forEach((c) => playbook.add(c))
    used.notInIp.forEach((c) => notInIp.set(c.name, c))
  }
  manifest.components = { floorplans: [...floorplans].sort(), playbook: [...playbook].sort(), notInIp: [...notInIp.values()] }
  return manifest
}

export function readme(manifest) {
  const lines = [
    `# Prototype: ${manifest.intent}`,
    '',
    '<!-- Generated by npm run build-prototype from manifest.json. Don\'t edit by hand. -->',
    '',
    `Built with the Design Prototyping Kit (${manifest.kit.repo} at ${manifest.kit.commit ? manifest.kit.commit.slice(0, 12) : 'an unknown commit'}), ${manifest.kit.stack}.`,
    '',
    '## Data',
    '',
    manifest.data.statement,
    `Generated with ${manifest.data.generator}.`,
    '',
    '## What it doesn\'t do',
    '',
    ...manifest.doesNotDo.map((d) => `- ${d}`),
    '',
    '## Versions',
    '',
    '| Version | Title | Built | Built from | Supersedes |',
    '|---|---|---|---|---|',
    ...manifest.versions.map((v) => `| ${v.id} | ${v.title} | ${v.built || 'not built'} | ${v.builtFrom.kind} (${v.builtFrom.brief}) | ${v.supersedes || ''} |`),
    '',
    '## Routes',
    '',
    '| Route | Title | Scenarios |',
    '|---|---|---|',
    ...manifest.routes.map((r) => `| \`${r.route}\` | ${r.title} | ${r.scenarios.join(', ')} |`),
    '',
    '## How to open a version',
    '',
    'Serve its built folder and open the address it prints, for example:',
    '',
    '```',
    `python3 -m http.server 8765 --bind 127.0.0.1 --directory ${manifest.versions.length ? manifest.versions[manifest.versions.length - 1].id : 'v1'}/dist`,
    '```',
    '',
  ]
  return lines.join('\n')
}

// Values of the licence key this build could pick up: from the environment and from .env files.
function licenceKeys(versionDir) {
  const keys = new Set()
  if (process.env[LICENCE_VARIABLE]) keys.add(process.env[LICENCE_VARIABLE])
  for (const file of fs.readdirSync(versionDir).filter((f) => f.startsWith('.env'))) {
    const match = read(path.join(versionDir, file)).match(new RegExp(`^${LICENCE_VARIABLE}\\s*=\\s*["']?([^"'\\n]+)`, 'm'))
    if (match) keys.add(match[1].trim())
  }
  return [...keys].filter((k) => k.length > 8)
}

export async function buildPrototype(versionDir, { today = new Date().toISOString().slice(0, 10), log = console.log, build = true } = {}) {
  const metaFile = path.join(versionDir, 'prototype.json')
  if (!fs.existsSync(metaFile)) throw new Error(`${versionDir} has no prototype.json. Run this inside a prototype version.`)

  const problems = await checkVersion(versionDir)
  if (problems.length) {
    throw new Error(`This version can't be recorded yet:\n  - ${problems.join('\n  - ')}`)
  }

  const tooBig = walk(path.join(versionDir, 'src')).filter((f) => fs.statSync(f).size > MAX_SOURCE_BYTES)
  if (tooBig.length) {
    throw new Error(`These source files are over 2 MB, which the personal data guard skips without checking:\n  ${tooBig.map((f) => path.relative(versionDir, f)).join('\n  ')}`)
  }

  if (build) {
    const keys = licenceKeys(versionDir)
    log(`Building dist/ with today pinned to ${today} and no licence key...`)
    // A variable already in the environment wins over .env files, so an empty key here keeps one
    // in .env or .env.local out of the build.
    const env = { ...process.env, VITE_PROTOTYPE_TODAY: today, [LICENCE_VARIABLE]: '' }
    execFileSync(path.join(versionDir, 'node_modules/.bin/vite'), ['build', '--logLevel', 'warn'], { cwd: versionDir, env, stdio: 'inherit' })
    const leaked = walk(path.join(versionDir, 'dist'), new Set()).filter((f) => keys.some((k) => read(f).includes(k)))
    if (leaked.length) {
      fs.rmSync(path.join(versionDir, 'dist'), { recursive: true, force: true })
      throw new Error(`The licence key reached ${leaked.map((f) => path.relative(versionDir, f)).join(', ')}. dist/ was removed; nothing was recorded.`)
    }
    const meta = readJson(metaFile)
    meta.built = today
    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2) + '\n')
  }

  const meta = readJson(metaFile)
  const prototypeDir = path.dirname(versionDir)
  if (!meta.intent || path.basename(prototypeDir) !== 'prototype') {
    log('Built. This isn\'t an intent\'s prototype (no intent, or not in design/prototype), so no manifest was written.')
    return { manifest: null }
  }
  const manifest = await buildManifest(prototypeDir)
  fs.writeFileSync(path.join(prototypeDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  fs.writeFileSync(path.join(prototypeDir, 'README.md'), readme(manifest))
  log(`Built ${meta.version} and wrote manifest.json and README.md in ${prototypeDir}: ${manifest.versions.length} version(s), ${manifest.routes.length} route(s).`)
  return { manifest }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const versionDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  buildPrototype(versionDir).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
