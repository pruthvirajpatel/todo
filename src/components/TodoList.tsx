// components/TodoList.tsx
// OPTIMIZED: Works with memoized TodoItem components
// Used for small lists (<50 items), switches to virtualization for larger lists
// Mobile-responsive design

import { Todo } from "../types/todo.types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

/**
 * List of todos
 * OPTIMIZED: Renders all items directly (for lists <50 items)
 * ✅ Each TodoItem is memoized to prevent unnecessary re-renders
 * ✅ App.tsx switches to VirtualTodoList for 50+ items
 * Mobile-responsive spacing
 */
export function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        className="text-center py-8 sm:py-12 text-gray-500 px-4"
        data-testid="empty-state"
      >
        <p className="text-base sm:text-lg">No todos yet!</p>
        <p className="text-xs sm:text-sm mt-2">Add one above to get started.</p>
      </div>
    );
  }

  // ✅ OPTIMIZED: For small lists, direct rendering is fine
  // For large lists (50+), App.tsx automatically uses VirtualTodoList instead

  return (
    <div className="flex flex-col gap-2 sm:gap-3" data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
