// App.tsx
// VERSION 1: UNOPTIMIZED - Baseline for performance measurement

import { useTodos } from "./hooks/useTodos";
import { TodoForm } from "./components/TodoForm";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { TodoStats } from "./components/TodoStats";

/**
 * Main Todo Application
 * UNOPTIMIZED VERSION - We'll measure baseline performance and optimize step by step
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
  } = useTodos();

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4"
      data-testid="app-container"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            data-testid="app-title"
          >
            📝 Performance Todo App
          </h1>
          <p className="text-gray-600">
            Learning React Performance Optimization
          </p>
        </header>

        {/* Todo Form */}
        <TodoForm onAdd={addTodo} />

        {/* Filter Buttons */}
        <TodoFilter current={filter} onChange={setFilter} />

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        {/* Statistics */}
        <TodoStats stats={stats} onClearCompleted={clearCompleted} />

        {/* Performance Marker */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔧 Version: Unoptimized Baseline</p>
          <p>Open React DevTools Profiler to measure performance</p>
        </div>
      </div>
    </div>
  );
}

export default App;
