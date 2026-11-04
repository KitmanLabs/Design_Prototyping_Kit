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
  // Matches nothing, so responsive components render their smallest (xs) layout.
  // MUI 9's useMediaQuery subscribes with addEventListener.
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  })
}
