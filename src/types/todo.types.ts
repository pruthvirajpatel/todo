// types/todo.types.ts

/**
 * Core Todo interface
 */
export interface Todo {
  id: string;                    // Unique identifier (UUID)
  text: string;                  // Todo description
  completed: boolean;            // Completion status
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  priority?: Priority; // Optional priority
}

/**
 * Filter types for todo list
 */
export type FilterType = 'all' | 'active' | 'completed';

export type Priority = 'low' | 'medium' | 'high';

/**
 * Statistics about todos
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  completionRate: number;
}

/**
 * Form values for creating/editing todos
 */
export interface TodoFormValues {
  text: string;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Action types for reducer pattern (if we use it later)
 */
export type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'CLEAR_COMPLETED' };
