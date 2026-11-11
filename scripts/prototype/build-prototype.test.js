// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { clone, newVersion } from './clone.mjs'
import { buildPrototype, MANIFEST_SCHEMA } from './template/scripts/build-prototype.mjs'

const quiet = () => {}

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
      'export default function Search() { return placeholder("MAX_RESULTS") && PageFrame && PageHeader && RecordLayout && DataGridPremium }',
      '',
    ].join('\n'))
    fs.writeFileSync(path.join(v1, 'src/prototype/routes.js'), [
      'export const routes = [',
      "  { path: '/', page: 'Start', title: 'Start', floorplan: null, baseline: null, scenarios: [] },",
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

  it('carries the fields Accelerate reads, in the shape it reads them', () => {
    expect(manifest.schema).toBe(MANIFEST_SCHEMA)
    expect(manifest.intent).toBe('IN0012')
    for (const route of manifest.routes) {
      expect(route.route).toMatch(new RegExp(`^#/${route.version}/`))
      expect(Array.isArray(route.scenarios)).toBe(true)
    }
    expect(manifest.routes.map((r) => r.route)).toEqual([
      '#/v1/', '#/v1/notes/search', '#/v1/notes/search/no-results',
      '#/v2/', '#/v2/notes/search', '#/v2/notes/search/no-results',
    ])
    expect(manifest.routes[1].scenarios).toEqual(['search_session_notes'])
    expect(Array.isArray(manifest.components.notInIp)).toBe(true)
  })

  it('describes each version: when it was built, what from, and what it replaces', () => {
    expect(manifest.versions).toEqual([
      expect.objectContaining({ id: 'v1', built: '2026-11-20', supersedes: null, builtFrom: expect.objectContaining({ kind: 'brief', brief: 'v1/brief.md' }) }),
      expect.objectContaining({ id: 'v2', built: null, supersedes: 'v1' }),
    ])
  })

  it('prefixes notes and placeholders with their version', () => {
    expect(manifest.notes).toContainEqual({ id: 'n1', version: 'v1', type: 'assumption', route: '#/v1/notes/search', text: 'I have assumed search covers the last season only.' })
    expect(manifest.placeholders).toContainEqual({ name: 'MAX_RESULTS', value: 50, unit: 'notes', version: 'v2', routesHint: ['#/v2/notes/search'] })
  })

  it('lists the floorplans and Playbook components the prototype imports', () => {
    expect(manifest.components.floorplans).toEqual(expect.arrayContaining(['PageFrame', 'PageHeader', 'RecordLayout']))
    expect(manifest.components.playbook).toContain('DataGridPremium')
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
