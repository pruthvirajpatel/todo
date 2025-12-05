// App.tsx
// VERSION 1: UNOPTIMIZED - Baseline for performance measurement
// UPDATED: Mobile-responsive design

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
 * UNOPTIMIZED VERSION - We'll measure baseline performance and optimize step by step
 * UPDATED: Mobile-responsive layout
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

        {/* Performance Marker */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-2">
          <p className="mb-1">🔧 Version: Unoptimized Baseline</p>
          <p className="hidden sm:block">
            Open React DevTools Profiler to measure performance
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
