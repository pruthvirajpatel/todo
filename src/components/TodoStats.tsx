// components/TodoStats.tsx
// OPTIMIZED: Wrapped with React.memo to prevent unnecessary re-renders
// Receives memoized stats from useTodos hook
// Mobile-responsive design

import { memo } from "react";
import { TodoStats as Stats } from "../types/todo.types";

interface TodoStatsProps {
  stats: Stats;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

/**
 * Statistics and actions for todos
 * OPTIMIZED with React.memo
 * ✅ Only re-renders when stats object changes (via useMemo in hook)
 * ✅ Stable callback from parent
 * Mobile-responsive grid layout
 */
const TodoStats = memo(function TodoStats({
  stats,
  hasCompleted,
  onClearCompleted,
}: TodoStatsProps) {
  // ✅ OPTIMIZED: React.memo + useMemo'd stats = only re-renders when stats actually change

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 sm:p-6 mt-4 sm:mt-6"
      data-testid="todo-stats"
    >
      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="text-center p-2 sm:p-0">
          <p
            className="text-2xl sm:text-3xl font-bold text-blue-600"
            data-testid="stat-total"
          >
            {stats.total}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Total</p>
        </div>

        <div className="text-center p-2 sm:p-0">
          <p
            className="text-2xl sm:text-3xl font-bold text-yellow-600"
            data-testid="stat-active"
          >
            {stats.active}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Active</p>
        </div>

        <div className="text-center p-2 sm:p-0">
          <p
            className="text-2xl sm:text-3xl font-bold text-green-600"
            data-testid="stat-completed"
          >
            {stats.completed}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Completed</p>
        </div>

        <div className="text-center p-2 sm:p-0">
          <p
            className="text-2xl sm:text-3xl font-bold text-purple-600"
            data-testid="stat-completion-rate"
          >
            {stats.completionRate}%
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Complete</p>
        </div>
      </div>

      {/* Clear Completed Button - Touch-friendly */}
      {stats.completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="mt-4 w-full px-4 py-2.5 sm:py-2 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation"
          data-testid="clear-completed-button"
          disabled={!hasCompleted}
        >
          Clear Completed ({stats.completed})
        </button>
      )}
    </div>
  );
});
export { TodoStats };
