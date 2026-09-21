import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    // Only this repository's own specs. The working tree can hold a scratch
    // checkout under .external/ whose suites must not join this run.
    include: ['tests/**/*.spec.ts'],
  },
})
