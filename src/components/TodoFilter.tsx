// components/TodoFilter.tsx
// VERSION 1: UNOPTIMIZED

import { FilterType } from '../types/todo.types';

interface TodoFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

/**
 * Filter buttons for todos
 * UNOPTIMIZED VERSION
 */
export function TodoFilter({ current, onChange }: TodoFilterProps) {
  const filters: FilterType[] = ['all', 'active', 'completed'];

  // ⚠️ PERFORMANCE ISSUE: Re-renders on every parent state change

  return (
    <div 
      className="flex gap-2 mb-6"
      data-testid="todo-filter"
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            current === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          data-testid={`filter-${filter}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
