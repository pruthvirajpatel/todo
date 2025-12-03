// hooks/useTodos.ts
// VERSION 1: UNOPTIMIZED (Baseline for performance measurement)

import { useState, useEffect } from 'react';
import { Todo, FilterType, TodoStats } from '../types/todo.types';
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

  // Load todos from localStorage on mount
  useEffect(() => {
    const loaded = storageService.getTodos();
    setTodos(loaded);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    storageService.saveTodos(todos);
  }, [todos]);

  // Add a new todo
  // ⚠️ PERFORMANCE ISSUE: This function is recreated on every render
  const addTodo = (text: string, priority?: 'low' | 'medium' | 'high') => {
    const validation = validateTodoText(text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newTodo = createTodo(text, priority);
    setTodos([...todos, newTodo]); // ⚠️ Creates new array every time
  };

  // Toggle todo completion
  // ⚠️ PERFORMANCE ISSUE: Recreated on every render
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  // Delete a todo
  // ⚠️ PERFORMANCE ISSUE: Recreated on every render
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Update todo text
  // ⚠️ PERFORMANCE ISSUE: Recreated on every render
  const updateTodo = (id: string, text: string) => {
    const validation = validateTodoText(text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text, updatedAt: new Date() } : todo
      )
    );
  };

  // Clear completed todos
  // ⚠️ PERFORMANCE ISSUE: Recreated on every render
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

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
