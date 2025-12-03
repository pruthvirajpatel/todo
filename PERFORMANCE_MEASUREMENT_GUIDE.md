# 📊 Phase 2: Performance Measurement & Baseline Setup

## 🎯 Objective
Establish baseline performance metrics before any optimization.

---

## Step 2.1: Install Performance Measurement Tools

### **1. Chrome DevTools** (Built-in)
Already available in Chrome/Edge browser.

### **2. React DevTools** (Required)
```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

### **3. Lighthouse CLI** (Optional but recommended)
```bash
# Install globally
npm install -g lighthouse

# Or use built-in Chrome DevTools Lighthouse
```

### **4. Add Performance Testing Script**
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lighthouse": "lighthouse http://localhost:4173 --view --preset=desktop",
    "lighthouse:mobile": "lighthouse http://localhost:4173 --view"
  }
}
```

---

## Step 2.2: Build and Serve the App

```bash
# 1. Build for production
npm run build

# 2. Serve the production build
npm run preview

# App should be running at http://localhost:4173
```

---

## Step 2.3: Run Lighthouse Audit

### **Method 1: Chrome DevTools** (Recommended for beginners)

1. Open Chrome DevTools (F12)
2. Click "Lighthouse" tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - Device: Desktop
4. Click "Analyze page load"

### **Method 2: Lighthouse CLI**

```bash
# Make sure app is running (npm run preview)
npm run lighthouse
```

### **📊 Baseline Metrics to Capture**

Create a file to track your measurements:

```markdown
# Performance Baseline

## Date: [Current Date]
## Version: Unoptimized Baseline

### Lighthouse Scores (Desktop)
- Performance: ___/100
- Accessibility: ___/100
- Best Practices: ___/100
- SEO: ___/100

### Core Web Vitals
- First Contentful Paint (FCP): ___ ms
- Largest Contentful Paint (LCP): ___ ms
- Time to Interactive (TTI): ___ ms
- Speed Index: ___ ms
- Total Blocking Time (TBT): ___ ms
- Cumulative Layout Shift (CLS): ___

### Bundle Size
- Total JavaScript: ___ KB
- Total CSS: ___ KB
- Total Size: ___ KB
```

---

## Step 2.4: Chrome DevTools Performance Tab

### **Record a Performance Profile**

1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Click Record button (●)
4. Perform these actions in the app:
   - Add 5 todos
   - Toggle 3 todos as complete
   - Filter to "Active"
   - Filter to "Completed"
   - Delete 2 todos
5. Stop recording

### **What to Look For:**

#### **CPU/Main Thread Time**
```
Main Thread breakdown:
- Scripting (JavaScript): ___ ms
- Rendering: ___ ms
- Painting: ___ ms
- System: ___ ms
- Idle: ___ ms
```

#### **Long Tasks**
- Look for yellow/red bars (>50ms = Long Task)
- Note which functions take longest

#### **Frame Rate**
- Green bars = 60 FPS (good)
- Red/Yellow bars = Dropped frames (bad)

---

## Step 2.5: React DevTools Profiler

### **Method 1: Record Component Renders**

1. Open React DevTools
2. Click "Profiler" tab
3. Click Record button (●)
4. Interact with app (add/toggle/delete todos)
5. Stop recording

### **Metrics to Capture:**

```markdown
### React Profiler Results

#### Add Todo Action:
- Total render time: ___ ms
- Number of components rendered: ___
- Slowest component: ___________ (___ ms)

#### Toggle Todo Action:
- Total render time: ___ ms
- Number of components rendered: ___
- Slowest component: ___________ (___ ms)

#### Filter Change:
- Total render time: ___ ms
- Number of components rendered: ___
- Slowest component: ___________ (___ ms)
```

### **Method 2: Highlight Component Updates**

1. React DevTools → Settings (gear icon)
2. Enable "Highlight updates when components render"
3. Interact with app
4. Watch which components flash (green = re-render)

### **⚠️ Performance Anti-Patterns to Look For:**

1. **Unnecessary Re-renders:**
   - TodoItem components flashing when unrelated todo changes
   - TodoStats flashing when filter changes
   - TodoForm flashing when todos update

2. **Multiple Renders:**
   - Same component rendering multiple times for single action

3. **Cascade Re-renders:**
   - Parent re-render causing all children to re-render

---

## Step 2.6: Measure with Many Todos

### **Create Test Data Script**

Create `src/utils/testData.ts`:

```typescript
import { createTodo } from './todoHelpers';
import { Todo } from '../types/todo.types';

export function generateTestTodos(count: number): Todo[] {
  const todos: Todo[] = [];
  const priorities = ['low', 'medium', 'high'] as const;
  
  for (let i = 0; i < count; i++) {
    const priority = priorities[i % 3];
    const completed = Math.random() > 0.5;
    
    const todo = createTodo(
      `Test Todo #${i + 1} - ${priority} priority task`,
      priority
    );
    
    todo.completed = completed;
    todos.push(todo);
  }
  
  return todos;
}

// Add to window for console access
if (typeof window !== 'undefined') {
  (window as any).generateTestTodos = generateTestTodos;
}
```

### **Load Test Data in Browser Console:**

```javascript
// Generate 100 todos
const todos = generateTestTodos(100);

// Save to localStorage
localStorage.setItem('todos_performance_app', JSON.stringify(todos));

// Reload page
location.reload();
```

### **Test Performance with Different Counts:**

```markdown
### Performance with Scale

#### 10 Todos:
- Add todo time: ___ ms
- Toggle todo time: ___ ms
- Filter change time: ___ ms

#### 100 Todos:
- Add todo time: ___ ms
- Toggle todo time: ___ ms
- Filter change time: ___ ms

#### 1000 Todos:
- Add todo time: ___ ms
- Toggle todo time: ___ ms
- Filter change time: ___ ms
- Scroll performance: ___/10 (smooth to janky)
```

---

## Step 2.7: Memory Profiling

### **Check for Memory Leaks:**

1. Chrome DevTools → Memory tab
2. Take heap snapshot
3. Interact with app (add/delete many todos)
4. Take another heap snapshot
5. Compare snapshots

### **What to Look For:**
- Increasing detached DOM nodes
- Growing array sizes
- Event listeners not cleaned up

---

## Step 2.8: Bundle Size Analysis

### **Install Bundle Analyzer:**

```bash
npm install --save-dev rollup-plugin-visualizer
```

### **Update `vite.config.ts`:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
```

### **Analyze Bundle:**

```bash
npm run build

# Opens stats.html in browser showing bundle composition
```

### **Baseline Bundle Metrics:**

```markdown
### Bundle Analysis

#### JavaScript:
- Total: ___ KB (gzipped: ___ KB)
- Vendor (node_modules): ___ KB
- App code: ___ KB

#### CSS:
- Total: ___ KB (gzipped: ___ KB)

#### Largest Dependencies:
1. _____________ : ___ KB
2. _____________ : ___ KB
3. _____________ : ___ KB
```

---

## Step 2.9: Document Your Baseline

Create `PERFORMANCE_BASELINE.md`:

```markdown
# Performance Baseline - Unoptimized Version

## Date: December 4, 2024
## Environment:
- Browser: Chrome 120
- Device: [Your device]
- CPU: [Your CPU]
- RAM: [Your RAM]

## Lighthouse Scores (Desktop)
- Performance: ___/100
- Accessibility: ___/100

## Core Web Vitals
- FCP: ___ ms
- LCP: ___ ms
- TTI: ___ ms
- TBT: ___ ms

## React Performance (100 Todos)
- Add todo: ___ ms, ___ components rendered
- Toggle todo: ___ ms, ___ components rendered
- Filter change: ___ ms, ___ components rendered
- Average render time: ___ ms

## Bundle Size
- Total JS: ___ KB (gzipped)
- Total CSS: ___ KB (gzipped)

## Known Issues
1. All TodoItem components re-render when any todo changes
2. Statistics recalculated on every render
3. Functions recreated on every render (no useCallback)
4. No virtualization for long lists
5. No code splitting

## Next Steps
- Optimize with React.memo
- Add useCallback/useMemo
- Implement virtualization
- Add code splitting
```

---

## 📸 Screenshot Checklist

Take screenshots of:
- ✅ Lighthouse report
- ✅ Chrome Performance flame chart
- ✅ React Profiler results
- ✅ Bundle analyzer output
- ✅ Network tab (showing bundle sizes)

---

## ✅ Baseline Complete!

You now have:
1. ✅ Quantified performance metrics
2. ✅ Identified bottlenecks
3. ✅ Baseline for measuring improvements
4. ✅ Clear optimization targets

**Next:** We'll start optimizing step by step and measure improvements!

---

## 🎯 Expected Baseline Results

### **Typical Unoptimized App:**
- Lighthouse Performance: 70-85/100
- LCP: 1.5-2.5s
- Total blocking time: 200-500ms
- Bundle size: 150-200KB gzipped
- 100 todos render time: 50-150ms
- All components re-render unnecessarily

### **Our Target After Optimization:**
- Lighthouse Performance: 95+/100
- LCP: <1.0s
- Total blocking time: <50ms
- Bundle size: <100KB gzipped
- 100 todos render time: <20ms
- Only changed components re-render
