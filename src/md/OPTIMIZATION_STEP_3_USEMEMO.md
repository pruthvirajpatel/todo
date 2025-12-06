# 🚀 Optimization Step 3: useMemo

## 📊 Prerequisite
✅ You should have completed Step 1 (React.memo)
✅ You should have completed Step 2 (useCallback)
✅ Components are memoized and callbacks are stable

---

## 🎯 What We're Fixing

### **The Problem:**

Even with memo and useCallback, expensive calculations still run on EVERY render:

```typescript
// In useTodos hook:
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // ❌ These run on EVERY render, even when data hasn't changed:
  const filteredTodos = filterTodos(todos, filter);
  const stats = calculateStats(todos);
  
  // Even if we just change an unrelated state, these calculations run again!
}
```

**Example Problem:**
```
1. User types in the TodoForm input
2. Form state changes
3. App re-renders
4. useTodos re-runs
5. filterTodos() runs again (even though todos didn't change!)
6. calculateStats() runs again (even though todos didn't change!)
7. Stats object is new → TodoStats re-renders (even with memo!)
```

---

## 💡 The Solution: useMemo

### **What is useMemo?**

`useMemo` memoizes (caches) calculation results so they're only recalculated when dependencies change.

```typescript
// Without useMemo - runs EVERY render:
const result = expensiveCalculation(data);

// With useMemo - only recalculates when data changes:
const result = useMemo(() => expensiveCalculation(data), [data]);
```

### **How It Works:**
1. On first render: Runs calculation and caches result
2. On re-renders: Checks if dependencies changed
3. If dependencies unchanged: Returns cached result
4. If dependencies changed: Re-runs calculation and caches new result

---

## 📝 Implementation Steps

### **Step 1: Optimize Filtered Todos**

**Location:** `src/hooks/useTodos.ts`

**Before:**
```typescript
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // ... callbacks with useCallback ...

  // ❌ Runs on every render
  const filteredTodos = filterTodos(todos, filter);
  const stats = calculateStats(todos);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    // ... callbacks ...
  };
}
```

**After:**
```typescript
import { useState, useEffect, useCallback, useMemo } from 'react'; // ← Add useMemo
import { Todo, FilterType } from '../types/todo.types';
import { storageService } from '../services/storageService';
import { filterTodos, calculateStats } from '../utils/todoHelpers';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load from localStorage
  useEffect(() => {
    const savedTodos = storageService.loadTodos();
    setTodos(savedTodos);
  }, []);

  // Save to localStorage
  useEffect(() => {
    storageService.saveTodos(todos);
  }, [todos]);

  // Callbacks with useCallback (from Step 2)
  const addTodo = useCallback((text: string, priority: Todo['priority'] = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // ✅ Only recalculates when todos or filter changes
  const filteredTodos = useMemo(() => {
    console.log('🔄 Filtering todos...'); // ← Temporary: verify it's optimized
    return filterTodos(todos, filter);
  }, [todos, filter]); // ← Dependencies

  // ✅ Only recalculates when todos changes
  const stats = useMemo(() => {
    console.log('🔄 Calculating stats...'); // ← Temporary: verify it's optimized
    return calculateStats(todos);
  }, [todos]); // ← Dependencies

  // ✅ Only recalculates when todos changes (simple computation, but returns new object)
  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
    hasCompleted
  };
}
```

**Key Changes:**

1. **Import useMemo**
   ```typescript
   import { useState, useEffect, useCallback, useMemo } from 'react';
   ```

2. **Wrap filteredTodos calculation**
   ```typescript
   const filteredTodos = useMemo(() => {
     return filterTodos(todos, filter);
   }, [todos, filter]); // Only recalc when these change
   ```

3. **Wrap stats calculation**
   ```typescript
   const stats = useMemo(() => {
     return calculateStats(todos);
   }, [todos]); // Only recalc when todos change
   ```

4. **Wrap hasCompleted** (returns new boolean, but more importantly creates stable reference)
   ```typescript
   const hasCompleted = useMemo(() => {
     return todos.some(todo => todo.completed);
   }, [todos]);
   ```

---

### **Step 2: Verify the Calculations are Optimized**

Add temporary console logs to see when calculations run:

```typescript
const filteredTodos = useMemo(() => {
  console.log('🔄 Filtering todos...'); // Should only log when todos/filter changes
  return filterTodos(todos, filter);
}, [todos, filter]);

const stats = useMemo(() => {
  console.log('🔄 Calculating stats...'); // Should only log when todos changes
  return calculateStats(todos);
}, [todos]);
```

**Test:**
1. Type in the add todo input
2. Check console
3. You should NOT see the console logs (calculations didn't run!)

**Remove console logs after verification!**

---

## 🧪 Testing Your Changes

### **Test 1: Verify Calculations Don't Run Unnecessarily**

**Without useMemo:**
```javascript
// Type one character in input
→ App re-renders
→ "🔄 Filtering todos..." (unnecessary!)
→ "🔄 Calculating stats..." (unnecessary!)
```

**With useMemo:**
```javascript
// Type one character in input
→ App re-renders
→ (no console logs - calculations skipped!)
```

---

### **Test 2: Verify Calculations DO Run When Needed**

```javascript
// Toggle a todo
→ todos changes
→ "🔄 Filtering todos..." (needed!)
→ "🔄 Calculating stats..." (needed!)

// Change filter
→ filter changes
→ "🔄 Filtering todos..." (needed!)
→ (no stats calculation - stats doesn't depend on filter!)
```

---

### **Test 3: React DevTools Profiler**

Compare rendering time with/without useMemo:

**Setup:**
1. Load 1000 todos
2. Open React DevTools → Profiler
3. Start recording

**Test Scenario 1: Type in input**
```
Without useMemo:
- Commit time: ~15-20ms
- Reason: Expensive filtering on every keystroke

With useMemo:
- Commit time: ~2-3ms
- Reason: Calculations skipped
- ↓ 85% faster!
```

**Test Scenario 2: Toggle todo**
```
Both should take similar time:
- Calculations need to run either way
- useMemo doesn't help here (which is expected!)
```

---

## 📊 Measure the Improvement

### **Metrics to Track:**

| Action | Before useMemo | After useMemo | Improvement |
|--------|----------------|---------------|-------------|
| **Type in input** | ___ ms | ___ ms | ___% |
| **Change filter** | ___ ms | ___ ms | ___% |
| **Toggle todo** | ___ ms | ___ ms | No change (expected) |
| **Add todo** | ___ ms | ___ ms | ___% |

**Expected Improvements:**
- Actions that don't change todos: 60-80% faster
- Actions that change todos: Similar (calculations need to run)

---

## 🎓 Understanding When to Use useMemo

### **Common Misconception:**

❌ "useMemo makes things faster"

✅ **Reality:** useMemo adds overhead, but prevents expensive re-calculations

### **The Cost-Benefit Analysis:**

**useMemo adds cost:**
1. Storing the cached value in memory
2. Comparing dependencies on every render
3. Extra code complexity

**useMemo saves cost when:**
1. Calculation is expensive (loops, filtering, mapping large arrays)
2. Result is used in dependencies (useEffect, useMemo, useCallback)
3. Result is passed to memoized child components
4. Calculation creates new objects/arrays (breaks referential equality)

---

## 🐛 Common Pitfalls

### **Pitfall 1: Over-Using useMemo**

❌ **DON'T NEED useMemo for:**
```typescript
// Simple primitive calculations:
const total = count * price; // Fast enough!

// Single operations:
const firstName = user.fullName.split(' ')[0]; // Fast!

// Already primitive values:
const isActive = status === 'active'; // Fast!
```

✅ **DO NEED useMemo for:**
```typescript
// Filtering/mapping large arrays:
const filtered = useMemo(() => 
  todos.filter(todo => todo.completed), 
  [todos]
);

// Expensive calculations:
const sorted = useMemo(() => 
  todos.sort((a, b) => a.priority.localeCompare(b.priority)),
  [todos]
);

// Creating objects/arrays (for child props):
const config = useMemo(() => ({
  theme: 'dark',
  locale: 'en'
}), []); // Stable reference
```

---

### **Pitfall 2: Wrong Dependencies**

❌ **WRONG - Missing dependencies:**
```typescript
const filtered = useMemo(() => {
  return todos.filter(todo => todo.priority === priority);
}, [todos]); // ❌ Missing `priority`!
```

This will use stale `priority` value!

✅ **RIGHT:**
```typescript
const filtered = useMemo(() => {
  return todos.filter(todo => todo.priority === priority);
}, [todos, priority]); // ✅ Correct
```

---

### **Pitfall 3: Too Many Dependencies**

```typescript
// This defeats the purpose:
const result = useMemo(() => {
  return calculate(a, b, c, d, e, f, g);
}, [a, b, c, d, e, f, g]); // Changes all the time!
```

**Solutions:**
1. Combine related values into objects
2. Use refs for values that don't need to trigger recalculation
3. Maybe you don't need useMemo at all

---

### **Pitfall 4: Mutating Cached Value**

❌ **WRONG:**
```typescript
const sorted = useMemo(() => {
  return todos.sort((a, b) => a.priority - b.priority);
}, [todos]);
// ❌ .sort() mutates the original array!
```

✅ **RIGHT:**
```typescript
const sorted = useMemo(() => {
  return [...todos].sort((a, b) => a.priority - b.priority);
}, [todos]);
// ✅ Create a copy first
```

---

## 🔍 When to Use useMemo

### **Use useMemo when:**

1. ✅ **Expensive calculations:**
   ```typescript
   const expensiveResult = useMemo(() => {
     // Heavy computation
     return todos.map(todo => ({
       ...todo,
       details: calculateComplexDetails(todo)
     }));
   }, [todos]);
   ```

2. ✅ **Preventing unnecessary re-renders:**
   ```typescript
   const config = useMemo(() => ({
     theme: theme,
     locale: locale
   }), [theme, locale]);
   
   return <MemoizedChild config={config} />;
   // Without useMemo, config is new object every render
   ```

3. ✅ **As dependency in other hooks:**
   ```typescript
   const filtered = useMemo(() => 
     todos.filter(todo => todo.completed),
     [todos]
   );
   
   useEffect(() => {
     console.log('Filtered changed');
   }, [filtered]); // Won't run unless todos actually changed
   ```

---

### **Don't use useMemo when:**

1. ❌ **Calculation is cheap:**
   ```typescript
   // Just do it directly:
   const total = items.length;
   const isValid = value > 0;
   ```

2. ❌ **Value isn't used as dependency:**
   ```typescript
   // If only used in JSX and not passed to memoized components:
   const greeting = `Hello, ${name}!`;
   ```

3. ❌ **Premature optimization:**
   - Measure first!
   - Only optimize bottlenecks

---

## 💡 Advanced Patterns

### **Pattern 1: Chaining useMemo**

```typescript
// First memoization:
const filteredTodos = useMemo(() => 
  todos.filter(todo => todo.completed),
  [todos]
);

// Second memoization (depends on first):
const sortedFilteredTodos = useMemo(() =>
  [...filteredTodos].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  [filteredTodos]
);
```

---

### **Pattern 2: useMemo for Complex Objects**

```typescript
// Instead of creating new object every render:
const todoContext = useMemo(() => ({
  todos,
  addTodo,
  deleteTodo,
  editTodo
}), [todos, addTodo, deleteTodo, editTodo]);

return (
  <TodoContext.Provider value={todoContext}>
    {children}
  </TodoContext.Provider>
);
```

---

### **Pattern 3: Memoizing with Selectors**

```typescript
// Reusable selector function:
const selectActiveTodos = (todos: Todo[]) => 
  todos.filter(todo => !todo.completed);

// Use in component:
const activeTodos = useMemo(() => 
  selectActiveTodos(todos),
  [todos]
);
```

---

### **Pattern 4: Conditional Memoization**

```typescript
const processedData = useMemo(() => {
  if (!shouldProcess) {
    return rawData; // Fast path
  }
  
  // Expensive processing
  return rawData.map(item => processItem(item));
}, [rawData, shouldProcess]);
```

---

## ✅ Success Criteria

You've successfully completed Step 3 when:

- [ ] filteredTodos calculation wrapped with useMemo
- [ ] stats calculation wrapped with useMemo  
- [ ] hasCompleted wrapped with useMemo
- [ ] Correct dependencies specified for each
- [ ] Calculations don't run on unrelated state changes
- [ ] Calculations DO run when dependencies change
- [ ] App still functions correctly
- [ ] Metrics show improvement for non-todo-changing actions

---

## 🎯 Expected Results

### **Combined Results (Steps 1 + 2 + 3):**

```
Baseline (unoptimized):
- Toggle todo: ~50ms, 100 re-renders
- Type in input: ~30ms, unnecessary calculations

After Step 1 (memo):
- Toggle todo: ~30ms, still many re-renders
- Type in input: ~30ms, unnecessary calculations

After Step 2 (+ useCallback):
- Toggle todo: ~10ms, 1-2 re-renders
- Type in input: ~30ms, unnecessary calculations

After Step 3 (+ useMemo):
- Toggle todo: ~10ms, 1-2 re-renders
- Type in input: ~5ms, no calculations!
- ↓ 80-90% overall improvement!
```

---

## 🚨 Troubleshooting

### **Problem: Calculations Still Running Too Often**

1. **Check dependencies:** Are they correct and minimal?
2. **Check for object/array recreation:** Dependencies must be stable
3. **Verify with console.logs:** Add logs inside useMemo

---

### **Problem: Stale Values**

If you're getting old/stale values:
```typescript
// ❌ Missing dependency:
const result = useMemo(() => {
  return todos.filter(todo => todo.priority === priority);
}, [todos]); // Missing priority!

// ✅ Add all dependencies:
const result = useMemo(() => {
  return todos.filter(todo => todo.priority === priority);
}, [todos, priority]);
```

---

### **Problem: No Performance Improvement**

Possible reasons:
1. Calculation wasn't expensive enough to benefit from memoization
2. Dependencies change on every render (need to stabilize them)
3. React DevTools Profiler might show overhead is worth it
4. Measure with realistic data sizes (test with 1000+ todos)

---

## 📚 Further Reading

- [useMemo Documentation](https://react.dev/reference/react/useMemo)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Profiling Components](https://react.dev/learn/react-developer-tools)

---

## 🎉 Congratulations!

You've completed the third optimization step! Your app should now:
- ✅ Skip unnecessary re-renders (React.memo)
- ✅ Have stable function references (useCallback)
- ✅ Skip expensive calculations (useMemo)
- ✅ Be significantly faster overall!

**Next Step:** Open `OPTIMIZATION_STEP_4_SPLITTING.md` to learn about component splitting strategies!

---

**Remember:** The React performance trinity is memo + useCallback + useMemo working together. Each builds on the others!
