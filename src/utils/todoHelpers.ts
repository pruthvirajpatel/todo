// utils/todoHelpers.ts

import { Todo, FilterType, TodoStats } from '../types/todo.types';

/**
 * Generate a unique ID for todos
 * Using crypto.randomUUID() for browser-native UUID generation
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Create a new todo object
 */
export const createTodo = (text: string, priority?: 'low' | 'medium' | 'high'): Todo => {
  const now = new Date();
  return {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    priority,
  };
};

/**
 * Filter todos based on filter type
 */
export const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'all':
    default:
      return todos;
  }
};

/**
 * Calculate statistics from todos
 */
export const calculateStats = (todos: Todo[]): TodoStats => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    active,
    completed,
    completionRate: Math.round(completionRate * 10) / 10, // Round to 1 decimal
  };
};

/**
 * Sort todos by creation date (newest first)
 */
export const sortTodosByDate = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Sort todos by priority
 */
export const sortTodosByPriority = (todos: Todo[]): Todo[] => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...todos].sort((a, b) => {
    const aPriority = priorityOrder[a.priority || 'low'];
    const bPriority = priorityOrder[b.priority || 'low'];
    return bPriority - aPriority;
  });
};

/**
 * Validate todo text
 */
export const validateTodoText = (text: string): { valid: boolean; error?: string } => {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Todo text cannot be empty' };
  }
  
  if (trimmed.length > 200) {
    return { valid: false, error: 'Todo text cannot exceed 200 characters' };
  }
  
  return { valid: true };
};
