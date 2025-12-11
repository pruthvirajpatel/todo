# React Performance Optimization - Todo App

A comprehensive React Todo application built to master performance optimization techniques through hands-on learning. This project demonstrates real-world performance improvements using React.memo, useCallback, useMemo, virtualization, and code splitting.

## 🚀 Live Demo

**Production:** <a href="https://todo-iota-hazel-72.vercel.app/" target="_blank" rel="noopener noreferrer">
https://todo-iota-hazel-72.vercel.app/
</a>



## 📊 Performance Journey

This project was built to understand and solve real performance problems:

**Check the src/md folder inside the Source folder for more details**


### Initial State (Unoptimized)
- ❌ All 100 TodoItem components re-rendering on every state change
- ❌ Render time: **67ms** per interaction
- ❌ 30-60x performance degradation due to unnecessary re-renders
- ❌ CSS rendering bottleneck: 257ms for completed todos vs 30ms for active

### Final State (Optimized)
- ✅ Only changed components re-render
- ✅ Render time: **1-2ms** per interaction
- ✅ 97% reduction in re-renders
- ✅ Optimized CSS with GPU acceleration
- ✅ List virtualization for large datasets
- ✅ Code splitting for faster initial load

## ✨ Features

### Core Functionality
- ✅ Add, edit, delete, and toggle todos
- ✅ Filter by All/Active/Completed
- ✅ Clear all completed todos
- ✅ LocalStorage persistence
- ✅ Mobile-responsive design

### Performance Features
- ⚡ React.memo for component memoization
- ⚡ useCallback for stable function references
- ⚡ useMemo for expensive calculations
- ⚡ Virtual scrolling with @tanstack/react-virtual
- ⚡ Code splitting with lazy loading
- ⚡ Optimized re-render patterns

### Developer Experience
- 🔧 TypeScript for type safety
- 🎨 Tailwind CSS v4 for styling
- 🧪 Jest + React Testing Library
- 🎭 Cypress for E2E testing
- 📊 Bundle size analysis
- 🔍 React DevTools Profiler integration

## 🛠️ Tech Stack

- **Framework:** React 19.2
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 4.1
- **Testing:** Jest 30 + Cypress 15
- **Deployment:** Vercel
- **Performance:** @tanstack/react-virtual

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/pruthvirajpatel/todo.git
cd todo

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm test:coverage    # Generate coverage report
npm run cypress:open # Open Cypress E2E tests
npm run cypress:run  # Run Cypress tests headless

# Code Quality
npm run lint         # Run ESLint
```

## 🧪 Testing

### Unit Tests (Jest)
- Component rendering tests
- Hook behavior tests
- Utility function tests
- Coverage reporting

### E2E Tests (Cypress)
- Full user flow testing
- Cross-browser compatibility
- Visual regression testing

## 📈 Performance Optimizations Implemented

### 1. React.memo
Prevents unnecessary re-renders of TodoItem components when props haven't changed.

```typescript
export const TodoItem = React.memo(({ todo, onToggle, onDelete, onEdit }) => {
  // Component only re-renders when todo, onToggle, onDelete, or onEdit change
});
```

### 2. useCallback
Ensures stable function references across renders.

```typescript
const handleToggle = useCallback((id: string) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
}, []);
```

### 3. useMemo
Caches expensive filtering calculations.

```typescript
const filteredTodos = useMemo(() => {
  return todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
}, [todos, filter]);
```

### 4. Virtual Scrolling
Renders only visible items for large lists.

```typescript
const rowVirtualizer = useVirtualizer({
  count: filteredTodos.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 72,
  overscan: 5
});
```

### 5. Code Splitting
Lazy loads components for faster initial page load.

```typescript
const TodoList = lazy(() => import('./components/TodoList'));
const Stats = lazy(() => import('./components/Stats'));
```

## 📊 Performance Metrics

### Load Performance (Lighthouse)
- Performance: **100/100**
- Best Practices: **100/100**

### Interaction Performance (React Profiler)
- **Before Optimization:** 67ms per interaction
- **After Optimization:** 1-2ms per interaction
- **Improvement:** 97% faster

### Bundle Size
- Total: ~150KB (gzipped)
- React vendor chunk: ~130KB
- App code: ~20KB

## 🎓 Learning Resources

### Quick Start
- **Get Started** - Run `npm install && npm run dev` to start developing
- **[Code Structure](#tech-stack)** - Explore the `/src` directory for React components
- **[Performance Metrics](#performance-metrics)** - See the before/after improvements

### Key Concepts Demonstrated

#### 1. React.memo - Preventing Unnecessary Re-renders
See implementation in `src/components/TodoItem.tsx`

#### 2. useCallback - Stable Function References  
See implementation in `src/hooks/useTodos.ts`

#### 3. useMemo - Cached Computations
See filtering logic in `src/App.tsx`

#### 4. Virtual Scrolling
See `@tanstack/react-virtual` usage in `src/components/TodoList.tsx`

#### 5. Code Splitting  
See lazy loading in `src/App.tsx`

### How to Measure Performance
1. **React DevTools Profiler** - Record interactions and analyze render times
2. **Chrome DevTools Performance** - Track overall app performance
3. **Lighthouse** - Run audits for comprehensive metrics
4. **Bundle Analysis** - Run `npm run build` to see bundle-stats.html

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npx vercel --prod
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Variables
No environment variables required for basic functionality.

## 🐛 Troubleshooting

### CSS Not Loading in Production
Make sure `postcss.config.ts` is present with Tailwind v4 configuration:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### Build Failing on Vercel
Ensure `tsconfig.json` excludes config files to prevent compilation errors.

### localStorage Not Working
Check browser privacy settings - localStorage requires cookies to be enabled.

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

This is a learning project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

## 📧 Contact

**Pruthviraj Patel**
- GitHub: [@pruthvirajpatel](https://github.com/pruthvirajpatel)

## 🙏 Acknowledgments

- React Team for excellent DevTools
- Vercel for seamless deployment
- Tailwind CSS for amazing styling utilities
- TanStack Virtual for virtualization library

---

**⭐ Star this repo if you found it helpful for learning React performance optimization!**
