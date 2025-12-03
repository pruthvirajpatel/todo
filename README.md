# Todo Application

A modern, fully-tested todo application built with React 19, TypeScript, and Vite.

## 🚀 Tech Stack

### Core
- **React 19.2.0** - Latest React with modern features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Next-generation frontend tooling with lightning-fast HMR

### Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework (v4 with new `@import` syntax)
- **SASS/SCSS 1.94.2** - CSS preprocessor for advanced styling
- **PostCSS** - CSS transformations and autoprefixing

### Testing
- **Jest 30.2.0** - Unit testing framework
- **React Testing Library 16.3.0** - Component testing utilities
- **Cypress 15.7.1** - End-to-end testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM

### Code Quality
- **ESLint 9.39.1** - Code linting with React-specific rules
- **TypeScript ESLint** - TypeScript-aware linting

## 📦 Installation

```bash
npm install
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server with HMR
```

### Build
```bash
npm run build        # Type-check and build for production
npm run preview      # Preview production build locally
```

### Testing
```bash
npm run test              # Run Jest unit tests
npm run test:watch        # Run Jest in watch mode
npm run cypress:open      # Open Cypress interactive test runner
npm run cypress:run       # Run Cypress tests in headless mode
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## 🎨 Styling Approach

This project uses a hybrid styling approach:

### Tailwind CSS v4
- **Import syntax**: Uses `@import "tailwindcss"` (not `@tailwind` directives)
- **Utility classes**: Available in JSX/TSX files
- **Configuration**: Minimal config in `tailwind.config.cjs`

### SCSS/SASS
- **Preprocessor**: Full SCSS support via Vite
- **File structure**: Component-specific `.scss` files alongside components
- **Global styles**: Defined in `src/index.scss`

**Example usage:**
```scss
// src/index.scss
@import "tailwindcss";

body {
  background-color: rgb(243 244 246); // Tailwind gray-100
  color: rgb(17 24 39);              // Tailwind gray-900
}
```

**Note**: Tailwind v4 restricts `@apply` usage. Prefer regular CSS properties or utility classes in JSX.

## 🏗️ Build Configuration

### Vite Setup
- **Plugin**: `@vitejs/plugin-react` for Fast Refresh
- **SCSS Support**: Built-in preprocessor options
- **Hot Module Replacement**: Instant updates during development

### PostCSS Pipeline
```javascript
// postcss.config.cjs
{
  '@tailwindcss/postcss': {},  // Tailwind v4 PostCSS plugin
  autoprefixer: {}             // Vendor prefixing
}
```

## 🧪 Testing Strategy

### Unit Testing (Jest + React Testing Library)
- **Configuration**: `jest.config.cjs` with jsdom environment
- **Setup file**: `jest.setup.ts` for global test configuration
- **Module mocking**: Identity-obj-proxy for CSS/SCSS imports
- **TypeScript support**: ts-jest transformer

**Test files:**
- `*.test.tsx` - Component unit tests
- Located alongside component files

### E2E Testing (Cypress)
- **Configuration**: `cypress.config.ts`
- **Test files**: `*.cy.tsx` - Component tests with Cypress
- **Test directory**: `cypress/` for integration tests

## 📁 Project Structure

```
todo/
├── src/
│   ├── assets/          # Static assets
│   ├── __mocks__/       # Jest mocks
│   ├── App.tsx          # Main App component
│   ├── App.scss         # App-specific styles
│   ├── App.test.tsx     # App unit tests
│   ├── App.cy.tsx       # App Cypress tests
│   ├── main.tsx         # Application entry point
│   ├── index.scss       # Global styles with Tailwind import
│   └── global.d.ts      # Global TypeScript definitions
├── public/              # Public static assets
├── cypress/             # Cypress E2E tests
├── dist/                # Production build output
├── tailwind.config.cjs  # Tailwind v4 configuration
├── postcss.config.cjs   # PostCSS configuration
├── vite.config.ts       # Vite configuration
├── jest.config.cjs      # Jest configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## ⚙️ Configuration Files

### TypeScript
- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node/build tool settings

### Tailwind CSS v4
```javascript
// tailwind.config.cjs
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
};
```

### Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
})
```

## 🚨 Important Notes

### Tailwind CSS v4 Migration
If upgrading from Tailwind v3, note these breaking changes:
1. Replace `@tailwind base/components/utilities` with `@import "tailwindcss"`
2. Limited `@apply` support - use regular CSS or utility classes in JSX
3. Simplified configuration structure

### Module Types
The project uses ES modules (`"type": "module"` in package.json):
- Use `.cjs` extension for CommonJS files (config files)
- Use `.ts`/`.tsx` for TypeScript modules

## 📝 Development Guidelines

1. **Component Testing**: Write unit tests alongside components
2. **Type Safety**: Leverage TypeScript for type checking
3. **Styling**: Use Tailwind utilities in JSX, SCSS for complex component styles
4. **Code Quality**: Run linting before commits
5. **E2E Coverage**: Add Cypress tests for critical user flows

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test && npm run cypress:run`
4. Run linting: `npm run lint`
5. Build: `npm run build`
6. Submit a pull request

## 📄 License

Private project - All rights reserved

---

Built with ⚡️ Vite and ❤️ React
