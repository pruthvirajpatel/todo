// components/TodoFilter.tsx
// OPTIMIZED: Wrapped with React.memo to prevent unnecessary re-renders
// Only re-renders when filter prop changes
// Mobile-responsive design

import { memo } from "react";
import { FilterType } from "../types/todo.types";

interface TodoFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

/**
 * Filter buttons for todos
 * OPTIMIZED with React.memo
 * ✅ Only re-renders when current filter changes
 * ✅ Stable onChange callback from parent
 * Mobile-responsive layout
 */
const TodoFilter = memo(function TodoFilter({
  current,
  onChange,
}: TodoFilterProps) {
  const filters: FilterType[] = ["all", "active", "completed"];

  // ✅ OPTIMIZED: React.memo prevents re-renders unless filter prop changes

  return (
    <div
      className="flex flex-wrap gap-2 mb-4 sm:mb-6"
      data-testid="todo-filter"
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors touch-manipulation ${
            current === filter
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400"
          }`}
          data-testid={`filter-${filter}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
});

export { TodoFilter };
