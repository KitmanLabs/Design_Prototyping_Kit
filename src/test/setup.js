import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

expect.extend(matchers)

// Vitest runs without globals, so Testing Library cannot register its own
// automatic cleanup. Unmount between tests so DOM state does not leak.
afterEach(() => {
  cleanup()
})

// jsdom has no matchMedia. Provide both the legacy and the current listener APIs,
// as MUI X date pickers use addEventListener.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
}
