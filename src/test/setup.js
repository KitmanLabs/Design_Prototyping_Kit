import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

expect.extend(matchers)

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  })
}

