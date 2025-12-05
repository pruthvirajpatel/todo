// App.tsx
// VERSION 7: FULLY OPTIMIZED - All 6 optimization steps applied
// ✅ Code splitting with React.lazy
// ✅ Conditional virtualization for large lists
// ✅ Mobile-responsive design

import { useTodos } from "./hooks/useTodos";
import { TodoForm } from "./components/TodoForm";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { TodoStats } from "./components/TodoStats";
import { lazy, Suspense } from "react";

// ✅ Lazy load VirtualTodoList (includes react-window)
const VirtualTodoList = lazy(() => import("./components/VariableTodoList"));

// ✅ Loading fallback component
const ListLoadingFallback = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading list...</p>
    </div>
  </div>
);

/**
 * Main Todo Application
 * OPTIMIZED VERSION - Fully optimized with all performance techniques:
 * - React.memo on all components
 * - useCallback for stable function references
 * - useMemo for expensive calculations
 * - Component splitting for granular updates
 * - List virtualization for large datasets (50+ items)
 * - Code splitting with lazy loading
 * Mobile-responsive layout for all screen sizes
 */
function App() {
  const {
    todos,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    hasCompleted,
  } = useTodos();
  const useVirtualization = todos.length > 50; // Threshold for virtualization
  return (
    <div
      className="min-h-screen bg-gray-50 py-4 px-3 sm:py-8 sm:px-4 md:px-6"
      data-testid="app-container"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            data-testid="app-title"
          >
            📝 Todo App
          </h1>
        </header>

        {/* Todo Form */}
        <TodoForm onAdd={addTodo} />

        {/* Filter Buttons */}
        <TodoFilter current={filter} onChange={setFilter} />

        {/* Todo List */}
        {useVirtualization ? (
          <Suspense fallback={<ListLoadingFallback />}>
            <VirtualTodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              height={600}
              itemHeight={80}
            />
          </Suspense>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        )}

        {/* Statistics */}
        <TodoStats
          stats={stats}
          hasCompleted={hasCompleted}
          onClearCompleted={clearCompleted}
        />
      </div>
    </div>
  );
}

export default App;
