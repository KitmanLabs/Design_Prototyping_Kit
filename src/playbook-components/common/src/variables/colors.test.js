import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import colors from './colors';

const tokensCss = fs.readFileSync(path.resolve(__dirname, '../../../../styles/design-tokens.css'), 'utf8');
const declared = new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

describe('the @kitman/common colors stand-in', () => {
  it('names only tokens design-tokens.css declares', () => {
    const missing = Object.entries(colors)
      .flatMap(([name, value]) => [...value.matchAll(/var\((--[\w-]+)\)/g)].map((m) => [name, m[1]]))
      .filter(([, token]) => !declared.has(token));
    expect(missing).toEqual([]);
  });

  // iP's p06 is white, and HeaderNew's background reads it.
  it("gives p06 iP's white", () => {
    expect(colors.p06).toBe('var(--color-white)');
  });
});
