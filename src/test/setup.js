import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

expect.extend(matchers)

// Vitest runs without globals, so Testing Library cannot register its own
// automatic cleanup. Unmount between tests so DOM state does not leak.
afterEach(() => {
  cleanup()
})

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  })
}
