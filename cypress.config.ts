import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite dev server URL
    supportFile: false,               // if you don't have a support file
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}', // your test files
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
  // Optional: component testing if needed
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'cypress/component/**/*.cy.{ts,tsx,jsx}'
  }
})
