// components/TodoForm.tsx
// VERSION 1: UNOPTIMIZED
// UPDATED: Mobile-responsive design

import { useCallback, useState } from "react";
import { Priority } from "../types/todo.types";
import PrioritySelector from "./PrioritySelector"; // ← Import new component
import TodoInput from "./TodoInput";

interface TodoFormProps {
  onAdd: (text: string, priority?: Priority) => void;
}

/**
 * Form for adding new todos
 * UNOPTIMIZED VERSION
 * UPDATED: Mobile-responsive layout
 */
export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [error, setError] = useState<string>("");

  // ✅ Stable callback for input
  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
      if (error) setError("");
    },
    [error]
  );

  // ✅ Stable callback for priority
  const handlePriorityChange = useCallback((newPriority: Priority) => {
    setPriority(newPriority);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      onAdd(text, priority);
      setText("");
      setPriority("medium");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
      data-testid="todo-form"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          {/* Todo Input - Full width on mobile */}
          {/* ✅ Isolated input - won't re-render when priority changes */}
          <TodoInput value={text} onChange={handleTextChange} />
          {/* Priority Select */}
          {/* ✅ Isolated priority selector - won't re-render when text changes */}
          <PrioritySelector value={priority} onChange={handlePriorityChange} />

          {/* Add Button */}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation w-full sm:w-auto"
            data-testid="add-button"
          >
            Add Todo
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p
            className="text-red-600 text-xs sm:text-sm"
            data-testid="form-error"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
