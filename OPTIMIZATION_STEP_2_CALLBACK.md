# 🚀 Optimization Step 2: useCallback

## 📊 Prerequisite
✅ You should have completed Step 1 (React.memo)
✅ TodoItem, TodoStats, and TodoFilter are wrapped with memo

---

## 🎯 What We're Fixing

### **The Problem:**

Even with React.memo from Step 1, you might notice that TodoItems STILL re-render unnecessarily. Why?

```typescript
// In App.tsx or useTodos hook:
function App() {
  const [todos, setTodos] = useState([]);
  
  // ❌ NEW FUNCTION CREATED EVERY RENDER
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return <TodoItem todo={todo} onToggle={toggleTodo} />;
  // ↑ React.memo sees "different" onToggle every time!
}
```

### **Why This Breaks React.memo:**

1. Every time App/useTodos re-renders, `toggleTodo` is recreated
2. React.memo does shallow comparison: `oldToggle !== newToggle`
3. Even though the function DOES the same thing, it's a different object
4. React.memo sees "props changed" and re-renders anyway

**The Result:** React.memo is useless if we pass it new function references every time!

---

## 💡 The Solution: useCallback

### **What is useCallback?**

`useCallback` memoizes (caches) function references so they stay the same between renders.

```typescript
// Without useCallback - NEW function every render:
const handleClick = () => {
  doSomething();
};

// With useCallback - SAME function unless dependencies change:
const handleClick = useCallback(() => {
  doSomething();
}, []); // ← Dependencies array
```

### **How It Works:**
1. On first render: Creates and caches the function
2. On re-renders: Returns the cached function if dependencies haven't changed
3. If dependencies change: Creates a new function and caches it

---

## 📝 Implementation Steps

### **Step 1: Optimize useTodos Hook**

**Location:** `src/hooks/useTodos.ts`

**Before:**
```typescript
import { useState, useEffect } from 'react';
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

  // ❌ These create new functions every render
  const addTodo = (text: string, priority: Todo['priority'] = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, text: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = filterTodos(todos, filter);
  const stats = calculateStats(todos);

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
    hasCompleted: todos.some(todo => todo.completed)
  };
}
```

**After:**
```typescript
import { useState, useEffect, useCallback } from 'react'; // ← Add useCallback
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

  // ✅ Wrap with useCallback and use functional updates
  const addTodo = useCallback((text: string, priority: Todo['priority'] = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]); // ← Use functional update
  }, []); // ← Empty deps - function never changes

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )); // ← Use functional update
  }, []); // ← Empty deps

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id)); // ← Use functional update
  }, []); // ← Empty deps

  const editTodo = useCallback((id: string, text: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    )); // ← Use functional update
  }, []); // ← Empty deps

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed)); // ← Use functional update
  }, []); // ← Empty deps

  const filteredTodos = filterTodos(todos, filter);
  const stats = calculateStats(todos);

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
    hasCompleted: todos.some(todo => todo.completed)
  };
}
```

**Key Changes:**

1. **Import useCallback**
   ```typescript
   import { useState, useEffect, useCallback } from 'react';
   ```

2. **Wrap functions with useCallback**
   ```typescript
   const addTodo = useCallback((text, priority) => {
     // ...
   }, []); // Dependencies
   ```

3. **Use functional updates** (CRITICAL!)
   ```typescript
   // ❌ Old way - depends on `todos`:
   setTodos(todos.filter(todo => todo.id !== id));
   
   // ✅ New way - uses previous state:
   setTodos(prev => prev.filter(todo => todo.id !== id));
   ```

4. **Empty dependency arrays**
   - We can use `[]` because we use functional updates
   - Functions will never need to be recreated!

---

### **Step 2: Optimize TodoList Component (if needed)**

**Location:** `src/components/TodoList.tsx`

If you're passing callbacks down through TodoList, make sure they're stable:

```typescript
import { memo } from 'react';
import { Todo } from '../types/todo.types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;    // ← Already stable from useCallback
  onDelete: (id: string) => void;    // ← Already stable from useCallback
  onEdit: (id: string, text: string) => void;  // ← Already stable from useCallback
}

// You can optionally memo this too:
const TodoList = memo(function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No todos yet. Add one above to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
});

export default TodoList;
```

---

## 🧪 Testing Your Changes

### **Test 1: Verify Stable References**

Add this temporary code to verify callbacks don't change:

```typescript
// In TodoItem component (temporarily):
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const onToggleRef = useRef(onToggle);
  
  useEffect(() => {
    if (onToggleRef.current !== onToggle) {
      console.log('🔴 onToggle changed! useCallback not working');
      onToggleRef.current = onToggle;
    } else {
      console.log('✅ onToggle stable');
    }
  });
  
  // Rest of component...
});
```

**Expected:** You should see "✅ onToggle stable" after the first render.

**Remove this test code after verification!**

---

### **Test 2: React DevTools Profiler**

1. **Start recording in Profiler**
2. **Toggle a todo**
3. **Check rendered components:**

**Before useCallback + memo:**
```
All 100 TodoItems rendered (even with memo)
```

**After useCallback + memo:**
```
Only 1-2 TodoItems rendered (the ones that changed)
```

---

### **Test 3: Performance Comparison**

Load 100 todos and measure:

```javascript
// In console:
const start = performance.now();
// Click toggle button
const end = performance.now();
console.log(`Toggle took ${end - start}ms`);
```

**Expected Results:**
- Before: 30-50ms
- After: 5-10ms (70-80% faster!)

---

## 📊 Measure the Improvement

### **Metrics to Track:**

| Metric | Step 1 (memo only) | Step 2 (+ useCallback) | Improvement |
|--------|-------------------|----------------------|-------------|
| **Toggle todo** | ___ ms | ___ ms | ___% |
| **Edit todo** | ___ ms | ___ ms | ___% |
| **Add todo** | ___ ms | ___ ms | ___% |
| **Re-renders** | Still high | Minimal | ___% ↓ |

---

## 🎓 Understanding the Full Picture

### **Why Functional Updates Matter:**

❌ **Without functional updates:**
```typescript
const toggleTodo = useCallback((id: string) => {
  setTodos(todos.map(todo => ...)); // ← Depends on `todos`
}, [todos]); // ← Must include todos in deps
// Function recreates every time todos changes (which is ALWAYS)
```

✅ **With functional updates:**
```typescript
const toggleTodo = useCallback((id: string) => {
  setTodos(prev => prev.map(todo => ...)); // ← Uses previous state
}, []); // ← No dependencies needed!
// Function NEVER recreates - stays stable forever!
```

---

## 🐛 Common Pitfalls

### **Pitfall 1: Forgetting Functional Updates**

❌ **WRONG - defeats the purpose:**
```typescript
const toggleTodo = useCallback((id: string) => {
  setTodos(todos.map(...)); // ← Closes over `todos`
}, []); // ← Missing dependency - STALE CLOSURE BUG!
```

This will use stale todos data!

✅ **RIGHT:**
```typescript
const toggleTodo = useCallback((id: string) => {
  setTodos(prev => prev.map(...)); // ← Always gets latest state
}, []);
```

---

### **Pitfall 2: Missing Dependencies**

```typescript
const handleSubmit = useCallback(() => {
  console.log(userName); // ← Uses external variable
}, []); // ❌ Missing userName in deps!
```

**Fix:** Include all external values:
```typescript
const handleSubmit = useCallback(() => {
  console.log(userName);
}, [userName]); // ✅ Correct
```

Or use refs for values that don't need to trigger recreates:
```typescript
const userNameRef = useRef(userName);
userNameRef.current = userName;

const handleSubmit = useCallback(() => {
  console.log(userNameRef.current);
}, []); // ✅ Correct - no dependencies needed
```

---

### **Pitfall 3: Over-Using useCallback**

❌ **DON'T NEED useCallback for:**
```typescript
// Internal event handlers not passed to children:
const handleLocalClick = () => {
  setCount(count + 1);
};

return <button onClick={handleLocalClick}>Click</button>;
// ↑ This button isn't memoized, so useCallback adds overhead
```

✅ **DO USE useCallback for:**
```typescript
// Functions passed to memoized children:
const handleToggle = useCallback((id) => {
  setTodos(prev => ...);
}, []);

return <MemoizedTodoItem onToggle={handleToggle} />;
```

---

## 🔍 When to Use useCallback

### **Use useCallback when:**
1. ✅ Passing function to memoized child component (with React.memo)
2. ✅ Function is a dependency of useEffect/useMemo/useCallback
3. ✅ Function is passed to many components
4. ✅ Creating functions in a loop

### **Don't use useCallback when:**
1. ❌ Function is only used in current component
2. ❌ Child component isn't memoized
3. ❌ Function has many dependencies that change often
4. ❌ Premature optimization (measure first!)

---

## 💡 Pro Tips

### **Tip 1: ESLint Rule**

Install and enable the exhaustive-deps rule:

```json
// .eslintrc
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

This will warn you about missing dependencies!

---

### **Tip 2: Pattern for State Updates**

**Always use functional updates in useCallback:**

```typescript
// ✅ Good pattern:
const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
  setTodos(prev => prev.map(todo =>
    todo.id === id ? { ...todo, ...updates } : todo
  ));
}, []);
```

---

### **Tip 3: Combining useCallback with Context**

```typescript
// In a context provider:
const TodoContext = createContext(null);

function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  
  // ✅ Callbacks stay stable across all consumers
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, createTodo(text)]);
  }, []);
  
  const value = useMemo(() => ({
    todos,
    addTodo
  }), [todos, addTodo]); // ← addTodo never changes!
  
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
```

---

### **Tip 4: Debugging Stale Closures**

If you suspect a stale closure bug:

```typescript
const toggleTodo = useCallback((id: string) => {
  console.log('Current todos:', todos); // Will be stale!
  setTodos(prev => {
    console.log('Latest todos:', prev); // Will be current!
    return prev.map(todo => ...);
  });
}, []);
```

---

## ✅ Success Criteria

You've successfully completed Step 2 when:

- [ ] All callback functions wrapped with useCallback
- [ ] All state updates use functional form (prev => ...)
- [ ] Empty dependency arrays where possible
- [ ] React DevTools shows minimal re-renders
- [ ] Toggle action only re-renders changed TodoItem
- [ ] No stale closure bugs (test by interacting with todos)
- [ ] Metrics show improvement over Step 1

---

## 🎯 Expected Results

### **Combined Results (Step 1 + Step 2):**

```
Before Optimization:
- Toggle one todo: 100 components, ~50ms

After Step 1 (memo only):
- Toggle one todo: Still many components, ~30ms
- Why? Functions change every render, breaking memo

After Step 2 (memo + useCallback):
- Toggle one todo: 1-2 components, ~5ms
- ↓ 90% reduction in re-renders!
- ↓ 90% faster interactions!
```

---

## 🚨 Troubleshooting

### **Problem: Still Seeing Unnecessary Re-renders**

1. **Check:** Are callbacks wrapped with useCallback? ✅
2. **Check:** Are you using functional updates? ✅
3. **Check:** Are components wrapped with React.memo? ✅
4. **Issue might be:** Inline objects/arrays in props → Continue to Step 3

---

### **Problem: Stale Closure Bugs**

**Symptoms:**
- Old data used in callbacks
- State updates don't reflect current values

**Fix:** Always use functional updates:
```typescript
// ❌ Uses stale value:
setTodos(todos.filter(...));

// ✅ Uses latest value:
setTodos(prev => prev.filter(...));
```

---

### **Problem: Too Many Dependencies**

```typescript
// If you have:
const handleSubmit = useCallback(() => {
  doSomething(value1, value2, value3, value4);
}, [value1, value2, value3, value4]); // Changes often!

// Consider using refs:
const valuesRef = useRef({ value1, value2, value3, value4 });
valuesRef.current = { value1, value2, value3, value4 };

const handleSubmit = useCallback(() => {
  const { value1, value2, value3, value4 } = valuesRef.current;
  doSomething(value1, value2, value3, value4);
}, []); // Stable!
```

---

## 📚 Further Reading

- [useCallback Documentation](https://react.dev/reference/react/useCallback)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- [Functional Updates](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)
- [Stale Closures](https://dmitripavlutin.com/react-hooks-stale-closures/)

---

## 🎉 Congratulations!

You've completed the second optimization step! Your app should now:
- ✅ Have stable function references
- ✅ Properly benefit from React.memo
- ✅ Show minimal unnecessary re-renders
- ✅ Handle interactions much faster

**Next Step:** Open `OPTIMIZATION_STEP_3_USEMEMO.md` to optimize expensive calculations!

---

**Remember:** useCallback + React.memo = Performance Power Couple! One doesn't work well without the other.
