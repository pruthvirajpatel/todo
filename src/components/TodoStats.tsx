// components/TodoStats.tsx
// VERSION 1: UNOPTIMIZED

import { TodoStats as Stats } from '../types/todo.types';

interface TodoStatsProps {
  stats: Stats;
  onClearCompleted: () => void;
}

/**
 * Statistics and actions for todos
 * UNOPTIMIZED VERSION
 */
export function TodoStats({ stats, onClearCompleted }: TodoStatsProps) {
  // ⚠️ PERFORMANCE ISSUE: Re-renders on every parent state change
  // even when stats haven't changed

  return (
    <div 
      className="bg-white shadow-md rounded-lg p-6 mt-6"
      data-testid="todo-stats"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600" data-testid="stat-total">
            {stats.total}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-600" data-testid="stat-active">
            {stats.active}
          </p>
          <p className="text-sm text-gray-600 mt-1">Active</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-green-600" data-testid="stat-completed">
            {stats.completed}
          </p>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600" data-testid="stat-completion-rate">
            {stats.completionRate}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Complete</p>
        </div>
      </div>

      {stats.completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="mt-4 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          data-testid="clear-completed-button"
        >
          Clear Completed ({stats.completed})
        </button>
      )}
    </div>
  );
}
