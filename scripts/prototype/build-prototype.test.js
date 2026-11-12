// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { clone, newVersion } from './clone.mjs'
import { buildPrototype, checkVersion, MANIFEST_SCHEMA } from './template/scripts/build-prototype.mjs'

const quiet = () => {}

// A filled-in brief, as /prototype leaves it.
function writeBrief(versionDir, builtFrom) {
  fs.writeFileSync(path.join(versionDir, 'brief.md'), [
    '# Brief: Session notes search',
    '',
    '**Intent:** IN0012',
    `**Version:** ${path.basename(versionDir)}`,
    `**Built from:** ${builtFrom}`,
    '**Previous version:** none',
    '',
    '## What was heard',
    '',
    "- A coach looks for last season's notes by athlete. Said by the head coach, in the session on 10 November 2026.",
    '',
    '## The solution wanted',
    '',
    'Search session notes by athlete and date.',
    '',
  ].join('\n'))
}

describe('build-prototype manifest', () => {
  let root
  let prototypeDir
  let v1
  let v2
  let manifest

  beforeAll(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-build-'))
    prototypeDir = path.join(root, 'IN0012-session-notes-search/design/prototype')
    v1 = path.join(prototypeDir, 'v1')
    v2 = path.join(prototypeDir, 'v2')
    clone({ target: v1, intent: 'IN0012', title: 'Session notes search', install: false, log: quiet })

    // What a worked-on first version holds: a page, its route, a note and a placeholder.
    fs.writeFileSync(path.join(v1, 'src/prototype/pages/Search.jsx'), [
      "import { PageFrame, PageHeader, RecordLayout } from '../../floorplans'",
      "import { DataGridPremium } from '../../playbook-components'",
      "import { placeholder } from '../placeholders'",
      "// import { DataGrid } from '../../playbook-components'",
      // Components imported by their own paths count too; shared code doesn't.
      "import AvailabilityLabel from '../../playbook-components/AvailabilityLabel'",
      "import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker/index.jsx'",
      "import PageState from '../../floorplans/PageState'",
      "import colors from '../../playbook-components/common/src/variables/colors'",
      'export default function Search() { return placeholder("MAX_RESULTS") && PageFrame && PageHeader && RecordLayout && DataGridPremium }',
      '',
    ].join('\n'))
    fs.writeFileSync(path.join(v1, 'src/prototype/pages/index.js'), "import Search from './Search'\n\nexport default { Search }\n")
    fs.writeFileSync(path.join(v1, 'src/prototype/routes.js'), [
      'export const routes = [',
      "  { path: '/notes/search', page: 'Search', title: 'Session notes: search', floorplan: 'Collection', baseline: 'session-notes', scenarios: ['search_session_notes'] },",
      "  { path: '/notes/search/no-results', page: 'Search', title: 'Session notes: no results', floorplan: 'Collection', baseline: null, scenarios: ['search_finds_nothing'] },",
      ']',
      '',
    ].join('\n'))
    fs.writeFileSync(path.join(v1, 'src/prototype/notes.js'),
      "export const notes = [{ id: 'n1', type: 'assumption', route: '/notes/search', text: 'I have assumed search covers the last season only.' }]\n")
    fs.writeFileSync(path.join(v1, 'src/prototype/placeholders.js'),
      "export const placeholders = [{ name: 'MAX_RESULTS', value: 50, unit: 'notes', routes: ['/notes/search'] }]\nexport function placeholder() { return 50 }\n")
    const meta = JSON.parse(fs.readFileSync(path.join(v1, 'prototype.json'), 'utf8'))
    fs.writeFileSync(path.join(v1, 'prototype.json'), JSON.stringify({ ...meta, built: '2026-11-20' }, null, 2))

    newVersion({ target: v2, from: v1, install: false, log: quiet })
    writeBrief(v1, 'a summary from the product manager on 12 November 2026, since IN0012 has no specification')
    writeBrief(v2, 'the specification at commit 3f2c1a9')
    // A page nothing imports any more still names components, which the manifest mustn't count.
    fs.writeFileSync(path.join(v2, 'src/prototype/pages/Old.jsx'), "import { WizardLayout } from '../../floorplans'\nexport default WizardLayout\n")
    ;({ manifest } = await buildPrototype(v2, { build: false, log: quiet }))
  })

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('writes the manifest and README beside the versions', () => {
    expect(JSON.parse(fs.readFileSync(path.join(prototypeDir, 'manifest.json'), 'utf8'))).toEqual(manifest)
    const readme = fs.readFileSync(path.join(prototypeDir, 'README.md'), 'utf8')
    expect(readme).toContain('# Prototype: IN0012')
    expect(readme).toContain('`#/v2/notes/search`')
  })

  // Prose under design/prototype/ gets every rule in product-intents' guard (scripts/guard.py), so
  // a word the kit writes into PROTOTYPE.md or the README warns on every prototype commit. This is
  // the guard's ATHLETE_HEALTH pattern; it reads inline code too. This fixture's own text is clean.
  it("leaves nothing in the prose it records that product-intents' guard warns on", () => {
    const athleteHealth = /\b(injur\w*|rehab\w*|diagnos(?:is|es|ed|ing)|treatment|concussion|hamstring|calf|acl|mcl|physio\w*|clinician|medical|return\s+to\s+play|rtp|symptom\w*|soreness|strain|sprain)\b/i
    const prose = fs.readdirSync(prototypeDir, { recursive: true }).filter((rel) => /\.(md|markdown|txt)$/i.test(rel))
    expect(prose).toContain('v1/PROTOTYPE.md')
    const hits = prose.flatMap((rel) => fs.readFileSync(path.join(prototypeDir, rel), 'utf8').split('\n')
      .map((line, i) => [`${rel}:${i + 1}`, line.match(athleteHealth)?.[0]])
      .filter(([, word]) => word))
    expect(hits).toEqual([])
  })

  it('carries the fields Accelerate reads, in the shape it reads them', () => {
    expect(manifest.schema).toBe(MANIFEST_SCHEMA)
    expect(manifest.intent).toBe('IN0012')
    for (const route of manifest.routes) {
      expect(route.route).toMatch(new RegExp(`^#/${route.version}/`))
      expect(Array.isArray(route.scenarios)).toBe(true)
    }
    expect(manifest.routes.map((r) => r.route)).toEqual([
      '#/v1/notes/search', '#/v1/notes/search/no-results',
      '#/v2/notes/search', '#/v2/notes/search/no-results',
    ])
    expect(manifest.routes[0].scenarios).toEqual(['search_session_notes'])
    expect(Array.isArray(manifest.components.notInIp)).toBe(true)
  })

  it('describes each version: when it was built, what from, and what it replaces', () => {
    expect(manifest.versions).toEqual([
      expect.objectContaining({ id: 'v1', built: '2026-11-20', supersedes: null, builtFrom: expect.objectContaining({ kind: 'brief', brief: 'v1/brief.md' }) }),
      expect.objectContaining({ id: 'v2', built: null, supersedes: 'v1' }),
    ])
  })

  it('counts a version as built from the specification only when brief.md names its commit', () => {
    expect(manifest.versions[0].builtFrom).toEqual({
      kind: 'brief',
      ref: 'a summary from the product manager on 12 November 2026, since IN0012 has no specification',
      brief: 'v1/brief.md',
    })
    expect(manifest.versions[1].builtFrom).toEqual({ kind: 'specification', ref: 'the specification at commit 3f2c1a9', brief: 'v2/brief.md' })
  })

  it('prefixes notes and placeholders with their version', () => {
    expect(manifest.notes).toContainEqual({ id: 'n1', version: 'v1', type: 'assumption', route: '#/v1/notes/search', text: 'I have assumed search covers the last season only.' })
    expect(manifest.placeholders).toContainEqual({ name: 'MAX_RESULTS', value: 50, unit: 'notes', version: 'v2', routesHint: ['#/v2/notes/search'] })
  })

  it('lists the floorplans and Playbook components the prototype imports', () => {
    expect(manifest.components.floorplans).toEqual(expect.arrayContaining(['PageFrame', 'PageHeader', 'RecordLayout']))
    expect(manifest.components.playbook).toContain('DataGridPremium')
  })

  it('counts components imported by their own paths, not only through the barrels', () => {
    expect(manifest.components.playbook).toEqual(expect.arrayContaining(['AvailabilityLabel', 'CustomDateRangePicker']))
    expect(manifest.components.floorplans).toContain('PageState')
    expect(manifest.components.playbook).not.toContain('common')
  })

  it('leaves out components named only in comments or in files nothing imports', () => {
    expect(manifest.components.playbook).not.toContain('DataGrid')
    expect(manifest.components.floorplans).not.toContain('WizardLayout')
  })

  it('says how the data was made', () => {
    expect(manifest.data.provenance).toBe('generated')
    expect(manifest.data.generator).toMatch(/@faker-js\/faker [\d.]+, seed \d+/)
  })

  it('refuses source files over 2 MB, which the guard would skip', async () => {
    const big = path.join(v2, 'src/prototype/data/big.json')
    fs.writeFileSync(big, 'x'.repeat(2 * 1024 * 1024 + 1))
    await expect(buildPrototype(v2, { build: false, log: quiet })).rejects.toThrow(/over 2 MB/)
    fs.rmSync(big)
  })
})

describe('build-prototype checks before recording a version', () => {
  let root
  let v1
  const write = (rel, text) => fs.writeFileSync(path.join(v1, rel), text)

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-check-'))
    v1 = path.join(root, 'IN0012-session-notes-search/design/prototype/v1')
    clone({ target: v1, intent: 'IN0012', title: 'Session notes search', install: false, log: quiet })
  })

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('stops a fresh clone until it has a route and its brief is filled in', async () => {
    expect(await checkVersion(v1)).toEqual([
      'routes.js lists no routes yet. Add a route for each page (PROTOTYPE.md, "Routes").',
      expect.stringMatching(/^brief\.md still holds the template's placeholders: <sha>, <role>, <date>, /),
    ])
    await expect(buildPrototype(v1, { build: false, log: quiet })).rejects.toThrow(/can't be recorded yet/)
    expect(fs.existsSync(path.join(v1, '../manifest.json'))).toBe(false)
  })

  it('lists every route, note and placeholder the manifest would record wrongly', async () => {
    writeBrief(v1, 'a summary from the product manager on 12 November 2026')
    write('src/prototype/pages/Start.jsx', 'export default function Start() { return null }\n')
    write('src/prototype/pages/index.js', "import Start from './Start'\n\nexport default { Start }\n")
    write('src/prototype/routes.js', [
      'export const routes = [',
      "  { path: '/', page: 'Start', title: 'Start', scenarios: [] },",
      '  { path: "/double", page: \'Start\', title: \'Double quotes\' },',
      "  { path: '/athletes/:id', page: 'Missing', title: 'Athlete' },",
      "  { path: '/', page: 'Start', title: 'Again' },",
      ']',
      '',
    ].join('\n'))
    write('src/prototype/notes.js', "export const notes = [{ id: 'n1', type: 'idea', route: '/nowhere', text: 'I have assumed one squad.' }, { id: 'n1', type: 'question', text: '' }]\n")
    write('src/prototype/placeholders.js', "export const placeholders = [{ name: 'MAX', routes: ['/nowhere'] }]\n")
    expect(await checkVersion(v1)).toEqual([
      "routes.js: write /double as path: '/double', in single quotes, because Accelerate reads the file as text.",
      'routes.js: /athletes/:id should be a literal path, with no parameter, wildcard, query string or #.',
      "routes.js: /athletes/:id shows the page Missing, which pages/index.js doesn't export.",
      'routes.js: / is listed twice.',
      'notes.js: n1 has the type "idea"; use assumption, question or deferral.',
      "notes.js: n1 is about /nowhere, which routes.js doesn't list.",
      'notes.js: the id n1 is used twice.',
      'notes.js: n1 has no text.',
      'placeholders.js: MAX has no value.',
      "placeholders.js: MAX names /nowhere, which routes.js doesn't list.",
    ])
  })

  it('says plainly when a data file has imports', async () => {
    write('src/prototype/routes.js', "import { paths } from './data'\nexport const routes = [{ path: paths.home, page: 'Start', title: 'Start' }]\n")
    await expect(checkVersion(v1)).rejects.toThrow(/routes\.js couldn't be read as plain data\. Keep it free of imports and JSX\./)
  })
})
