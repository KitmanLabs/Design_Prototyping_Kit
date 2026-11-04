// @vitest-environment node
/* eslint-disable design-system/no-hardcoded-colors -- fixtures are the rules' test inputs */
import path from 'path'
import { fileURLToPath } from 'url'
import stylelint from 'stylelint'
import { describe, expect, it } from 'vitest'

const pluginPath = path.dirname(fileURLToPath(import.meta.url))

async function lint(code) {
  const { results } = await stylelint.lint({
    code,
    config: {
      plugins: [pluginPath],
      rules: {
        'design-system/no-hardcoded-colors': true,
        'design-system/use-design-tokens': true,
        'design-system/font-usage': true,
      },
    },
  })
  return results[0].warnings.map((w) => ({ rule: w.rule, text: w.text }))
}

const forRule = (warnings, rule) => warnings.filter((w) => w.rule === rule).map((w) => w.text)

describe('design-system/no-hardcoded-colors', () => {
  it.each([
    ['#3B4960', 'var(--color-primary)'],
    ['#3b4960', 'var(--color-primary)'],
    ['#F1F2F3', 'var(--color-secondary)'],
    ['#28a745', 'var(--color-success)'],
    ['#28A745', 'var(--color-success)'],
    ['#dc3545', 'var(--color-error)'],
    ['#ffc107', 'var(--color-warning)'],
    ['#ffffff', 'var(--color-white)'],
    ['#000000', 'var(--color-black)'],
  ])('suggests the token for brand color %s', async (color, token) => {
    const warnings = forRule(await lint(`a { border: 1px solid ${color}; }`), 'design-system/no-hardcoded-colors')
    expect(warnings).toEqual([`Expected "${token}" instead of "${color}". Use design tokens. (design-system/no-hardcoded-colors)`])
  })

  it('rejects other hex colors without a suggestion', async () => {
    const warnings = forRule(await lint('a { border: 1px solid #123456; }'), 'design-system/no-hardcoded-colors')
    expect(warnings).toEqual(['Unexpected hardcoded color "#123456". Use var(--color-*) design tokens instead. (design-system/no-hardcoded-colors)'])
  })

  it('rejects rgb() and rgba() colors', async () => {
    const warnings = forRule(await lint('a { border: 1px solid rgba(0, 0, 0, 0.5); }'), 'design-system/no-hardcoded-colors')
    expect(warnings).toHaveLength(1)
  })

  it('allows design tokens', async () => {
    expect(await lint('a { border: 1px solid var(--color-border-primary); }')).toEqual([])
  })
})

describe('design-system/use-design-tokens', () => {
  it('flags color properties that do not use a token', async () => {
    const warnings = forRule(await lint('a { color: red; }'), 'design-system/use-design-tokens')
    expect(warnings).toHaveLength(1)
  })

  it.each(['var(--color-text-primary)', 'transparent', 'inherit', 'currentColor'])('allows %s', async (value) => {
    expect(forRule(await lint(`a { color: ${value}; }`), 'design-system/use-design-tokens')).toEqual([])
  })
})

describe('design-system/font-usage', () => {
  it('flags fonts outside the design system', async () => {
    const warnings = forRule(await lint('a { font-family: Arial, sans-serif; }'), 'design-system/font-usage')
    expect(warnings).toHaveLength(1)
  })

  it.each(['var(--font-family-primary)', "'Open Sans', sans-serif"])('allows %s', async (value) => {
    expect(forRule(await lint(`a { font-family: ${value}; }`), 'design-system/font-usage')).toEqual([])
  })
})
