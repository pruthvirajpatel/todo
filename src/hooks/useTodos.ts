// hooks/useTodos.ts
// VERSION 1: UNOPTIMIZED (Baseline for performance measurement)
// FIX: Prevent overwriting localStorage on initial mount

import { useState, useEffect, useRef, useCallback } from 'react';
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
 * UNOPTIMIZED VERSION - We'll optimize this step by step
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
  // ⚠️ PERFORMANCE ISSUE: Recalculated on every render
  const filteredTodos = filterTodos(todos, filter);

  // Calculate statistics
  // ⚠️ PERFORMANCE ISSUE: Recalculated on every render
  const stats = calculateStats(todos);

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
  };
}
