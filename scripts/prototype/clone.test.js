// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { clone, checkClone, importsOf, isExcluded } from './clone.mjs'

const KIT = path.resolve(__dirname, '../..')

function filesUnder(dir) {
  return fs.readdirSync(dir, { recursive: true }).filter((rel) => fs.statSync(path.join(dir, rel)).isFile())
}

describe('clone', () => {
  let parent
  let target

  beforeAll(() => {
    parent = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-clone-'))
    target = path.join(parent, 'v1')
    clone({ target, intent: 'IN0012', title: 'Session notes search', install: false, log: () => {} })
  })

  afterAll(() => {
    fs.rmSync(parent, { recursive: true, force: true })
  })

  it('records the intent, version and the kit commit it was cloned from', () => {
    const meta = JSON.parse(fs.readFileSync(path.join(target, 'prototype.json'), 'utf8'))
    expect(meta).toMatchObject({
      schema: 'kitman-prototype-version/1',
      intent: 'IN0012',
      version: 'v1',
      title: 'Session notes search',
      kit: { repo: 'KitmanLabs/Design_Prototyping_Kit' },
    })
    expect(meta.kit.commit).toMatch(/^[0-9a-f]{40}$/)
  })

  it('writes the prototype files, with the kit rules as PROTOTYPE.md and no CLAUDE.md', () => {
    for (const rel of [
      'PROTOTYPE.md',
      'brief.md',
      '.gitignore',
      'src/main.jsx',
      'src/App.jsx',
      'src/prototype/routes.js',
      'src/prototype/pages/index.js',
      'src/prototype/notes.js',
      'src/prototype/placeholders.js',
    ]) {
      expect(fs.existsSync(path.join(target, rel)), rel).toBe(true)
    }
    expect(fs.existsSync(path.join(target, 'CLAUDE.md'))).toBe(false)
    const brief = fs.readFileSync(path.join(target, 'brief.md'), 'utf8')
    expect(brief).toContain('**Intent:** IN0012')
    expect(brief).not.toMatch(/\{\{\w+\}\}/)
  })

  it('leaves out pages, stories, tests, the dev server and anything secret', () => {
    const files = filesUnder(target)
    expect(files.filter((rel) => isExcluded(rel))).toEqual([])
    for (const dir of ['src/pages', 'src/stories', 'src/test', 'server', '.claude', 'docs', '.storybook']) {
      expect(fs.existsSync(path.join(target, dir)), dir).toBe(false)
    }
    // App components the reference pages use, but the shell doesn't, stay in the kit.
    expect(fs.existsSync(path.join(target, 'src/components/AddGameDrawer.jsx'))).toBe(false)
    expect(fs.existsSync(path.join(target, 'src/components/LayoutWithMainNav.jsx'))).toBe(true)
  })

  it('resolves every import inside the clone', () => {
    expect(checkClone(target)).toEqual([])
  })

  it("declares only packages the kit declares, at the kit's versions", () => {
    const kitPkg = JSON.parse(fs.readFileSync(path.join(KIT, 'package.json'), 'utf8'))
    const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'))
    const kitVersions = { ...kitPkg.devDependencies, ...kitPkg.dependencies }
    for (const [name, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
      expect(version, name).toBe(kitVersions[name])
    }
    // Peers nothing imports by name still come.
    expect(pkg.dependencies['@emotion/styled']).toBeDefined()
    // Kit-only tooling doesn't.
    expect(pkg.devDependencies.storybook).toBeUndefined()
  })

  it('refuses a folder that is not empty', () => {
    expect(() => clone({ target, install: false, log: () => {} })).toThrow(/isn't empty/)
  })

  it('needs a version, from the folder name or the option', () => {
    const unnamed = path.join(parent, 'prototype')
    expect(() => clone({ target: unnamed, install: false, log: () => {} })).toThrow(/version/)
  })
})

describe('importsOf', () => {
  it('finds static, multi-line, re-exported and dynamic imports', () => {
    const source = [
      "import React from 'react'",
      'import {',
      '  Box,',
      '  Stack,',
      "} from '../playbook-components'",
      "export { default as Card } from './Card'",
      "const Page = lazy(() => import('./Page'))",
      "import './styles.css'",
    ].join('\n')
    expect(importsOf(source, 'x.jsx').sort()).toEqual(
      ['../playbook-components', './Card', './Page', './styles.css', 'react'].sort()
    )
  })

  it('ignores imports written in comments', () => {
    const source = "// import { Button } from '../playbook-components'\n/* import x from 'y' */\nexport const a = 1"
    expect(importsOf(source, 'x.js')).toEqual([])
  })

  it('finds CSS imports', () => {
    expect(importsOf("@import url('./tokens.css');", 'x.css')).toEqual(['./tokens.css'])
  })
})
