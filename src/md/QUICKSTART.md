# 🚀 Quick Start Guide

Get the React Performance Todo app running in 2 minutes!

## Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **npm** 8+ (check with `npm --version`)
- **Git** (optional, for cloning)

## Installation

```bash
# Clone the repository
git clone https://github.com/pruthvirajpatel/todo.git
cd todo

# Install dependencies (takes ~30 seconds)
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser! 🎉

## First Steps

### 1. Try the App
- Add a todo
- Toggle completion
- Filter by status
- Clear completed todos

### 2. Check the Code
```
src/
├── App.tsx           # Main component
├── components/       # UI components
│   ├── TodoItem.tsx  # Individual todo
│   ├── TodoInput.tsx # Add new todos
│   └── TodoList.tsx  # List container
├── hooks/           # Custom hooks
│   └── useTodos.ts  # Todo state management
└── utils/           # Helper functions
```

### 3. Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run cypress:open
```

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run tests
npm run lint     # Check code quality
```

## Making Changes

### Add a New Feature

1. **Create a branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**

3. **Test locally:**
   ```bash
   npm test
   npm run build
   npm run preview
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

### Understanding the Performance Optimizations

The app demonstrates several optimization techniques:

1. **React.memo** - Components only re-render when props change
2. **useCallback** - Stable function references
3. **useMemo** - Cached computed values
4. **Virtual Lists** - Only render visible items
5. **Code Splitting** - Lazy load components

Check out the full guides in the repo!

## Project Structure

```
todo/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilities
│   └── App.tsx            # Main app
├── cypress/               # E2E tests
│   ├── e2e/              # Test specs
│   └── support/          # Test helpers
├── public/               # Static assets
├── docs/                 # Documentation
│   ├── OPTIMIZATION_*.md # Step-by-step guides
│   └── PERFORMANCE_*.md  # Performance docs
└── package.json          # Dependencies
```

## Common Tasks

### Add a New Component

```bash
# Create the component file
touch src/components/MyComponent.tsx
```

```tsx
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Add a Test

```bash
# Create test file
touch src/components/MyComponent.test.tsx
```

```tsx
// src/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders title', () => {
  render(<MyComponent title="Hello" />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Style with Tailwind

```tsx
// Use Tailwind utility classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click Me
  </button>
</div>
```

## Troubleshooting

### Port 5173 Already in Use

```bash
# Kill the process using port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
vite --port 3000
```

### Dependencies Won't Install

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Tests Failing

```bash
# Update snapshots
npm test -- -u

# Run specific test
npm test -- MyComponent
```

### Hot Reload Not Working

```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

## Performance Monitoring

### Check Bundle Size

```bash
npm run build
# Opens bundle-stats.html automatically
```

### Profile React Performance

1. Open React DevTools
2. Go to "Profiler" tab
3. Click "Record"
4. Interact with the app
5. Click "Stop"
6. Analyze the flame graph

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Click "Generate Report"
4. Check all 4 scores (should be 100!)

## Learning Path

1. ✅ **Get it running** (you're here!)
2. 📖 **Read [README.md](./README.md)** - Project overview
3. 🎯 **Try [PERFORMANCE_JOURNEY.md](./PERFORMANCE_JOURNEY.md)** - Learn optimization
4. 🔧 **Follow optimization guides** - Step-by-step tutorials
5. 🚀 **Deploy it** - See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Need Help?

- 📖 Check the [README](./README.md)
- 🐛 Found a bug? Open an issue
- 💡 Have an idea? Start a discussion
- 📧 Email: [your-email@example.com]

## Next Steps

- ⭐ **Star the repo** if you find it helpful
- 🍴 **Fork it** to experiment
- 📝 **Read the guides** to learn optimization
- 🚀 **Deploy your version** to show off!

---

**Happy coding! 🎉**
