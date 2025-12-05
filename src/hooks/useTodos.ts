// hooks/useTodos.ts
// OPTIMIZED: useCallback with functional updates + useMemo for calculations
// ✅ All handlers use functional updates (prev => ...) with empty dependencies
// ✅ filteredTodos and stats are memoized to prevent recalculation
// FIX: Prevents overwriting localStorage on initial mount

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Todo, FilterType } from '../types/todo.types';
import { storageService } from '../services/storageService';
import {
  createTodo,
  filterTodos,
  calculateStats,
  validateTodoText,
} from '../utils/todoHelpers';

/**
 * Custom hook for managing todos
 * OPTIMIZED with useCallback and useMemo
 * ✅ Stable function references enable React.memo in child components
 * ✅ Expensive calculations only run when dependencies change
 * ✅ Functional updates avoid recreating callbacks
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const isInitialMount = useRef(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const loaded = storageService.getTodos();
    setTodos(loaded);
  }, []);

  // Save todos to localStorage whenever they change
  // BUT skip the first render (initial mount) to prevent overwriting loaded data
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    storageService.saveTodos(todos);
  }, [todos]);

  // Add a new todo
  const addTodo = useCallback((text: string, priority?: 'low' | 'medium' | 'high') => {
    const validation = validateTodoText(text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    const newTodo = createTodo(text, priority);
    setTodos(prev => [...prev, newTodo]);
  }, []);

  // Toggle todo
  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed  } : todo
      )
    );
  }, []);

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
      setTodos(prev => prev.filter(todo =>todo.id !== id ));
  }, []);

  // Update todo text
  const updateTodo = useCallback((id: string, text: string) => {
    const validation = validateTodoText(text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    setTodos(prev => 
      prev.map(todo =>
        todo.id === id ? { ...todo, text} : todo
      )
    );
  }, []);

  // Clear completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // Filter todos based on current filter
  const filteredTodos = useMemo(() =>  filterTodos(todos, filter), [todos, filter]);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(todos), [todos]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    hasCompleted: stats.completed > 0,
  };
}
