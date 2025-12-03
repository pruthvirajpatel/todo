// services/storageService.ts

import { Todo } from '../types/todo.types';

const STORAGE_KEY = 'todos_performance_app';

/**
 * Storage service for persisting todos to localStorage
 * Provides abstraction layer for easy migration to API later
 */
export const storageService = {
  /**
   * Load todos from localStorage
   */
  getTodos(): Todo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return [];
    }
  },

  /**
   * Save todos to localStorage
   */
  saveTodos(todos: Todo[]): void {
    try {
      const data = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider cleaning old data.');
      }
    }
  },

  /**
   * Clear all todos from localStorage
   */
  clearTodos(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error);
    }
  },

  /**
   * Get storage size in bytes
   */
  getStorageSize(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? new Blob([data]).size : 0;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  },
};
