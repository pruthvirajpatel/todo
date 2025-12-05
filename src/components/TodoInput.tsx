// components/TodoInput.tsx
// OPTIMIZED: Memoized component for text input
// Part of TodoForm component splitting (Step 4)
// Only re-renders when value prop changes

import { memo } from "react";

/**
 * Text input component for new todos
 * OPTIMIZED: Wrapped with React.memo
 * ✅ Isolated from priority selector
 * ✅ Only re-renders when text value changes
 * ✅ Receives stable onChange callback from parent
 */
const TodoInput = memo(function TodoInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex-1 w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What needs to be done?"
        data-testid="todo-input"
        id="todo-input"
        className="w-full bg-transparent focus:outline-none"
      />
    </div>
  );
});

export default TodoInput;
