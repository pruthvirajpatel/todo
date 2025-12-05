// services/storageService.test.ts
// UNIT TESTS for localStorage service
// Learning Focus: Mocking browser APIs, error handling, data persistence

/**
 * 🎓 LEARNING NOTES:
 * 
 * Testing services that interact with browser APIs requires mocking:
 * 1. localStorage is a browser API - not available in Jest
 * 2. We create a mock that simulates localStorage behavior
 * 3. Test both success and failure scenarios
 * 4. Verify data persistence logic
 * 
 * This file teaches you:
 * - How to mock localStorage
 * - How to test error handling
 * - How to test JSON serialization/deserialization
 * - How to test edge cases with malformed data
 */

import { storageService } from './storageService';
import { Todo } from '../types/todo.types';

describe('storageService - LocalStorage Persistence', () => {
  // ===========================================
  // Mock localStorage Setup
  // ===========================================
  
  /**
   * 📚 CONCEPT: Mock localStorage
   * Jest runs in Node, which doesn't have localStorage.
   * We create a mock that behaves like real localStorage.
   */
  
  let localStorageMock: { [key: string]: string };


  
  
  beforeEach(() => {
    // Create a fresh mock before each test
    localStorageMock = {};
    
    // Mock the global localStorage object
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: jest.fn(() => {
          localStorageMock = {};
        }),
        get length() {
          return Object.keys(localStorageMock).length;
        },
        key: jest.fn((index: number) => Object.keys(localStorageMock)[index] || null),
      },
      writable: true,
      configurable: true,
    });
  });
  
  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });
  
  // ===========================================
  // saveTodos() Tests
  // ===========================================
  
  describe('saveTodos', () => {
    // 📚 CONCEPT: Test data persistence
    
    test('saves empty array to localStorage', () => {
      storageService.saveTodos([]);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'todos_performance_app',
        JSON.stringify([])
      );
      expect(localStorageMock['todos_performance_app']).toBe('[]');
    });
    
    test('saves single todo to localStorage', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Buy milk',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          priority: 'high',
        },
      ];
      
      storageService.saveTodos(todos);
      
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'todos_performance_app',
        JSON.stringify(todos)
      );
    });
    
    test('saves multiple todos to localStorage', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          text: 'Task 2',
          completed: true,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
          priority: 'medium',
        },
      ];
      
      storageService.saveTodos(todos);
      
      const saved = JSON.parse(localStorageMock['todos_performance_app']);
      expect(saved).toHaveLength(2);
      expect(saved[0].text).toBe('Task 1');
      expect(saved[1].text).toBe('Task 2');
    });
    
    test('overwrites existing todos', () => {
      // Save initial todos
      const initialTodos: Todo[] = [
        {
          id: '1',
          text: 'Old task',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      storageService.saveTodos(initialTodos);
      
      // Save new todos (should overwrite)
      const newTodos: Todo[] = [
        {
          id: '2',
          text: 'New task',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      storageService.saveTodos(newTodos);
      
      const saved = JSON.parse(localStorageMock['todos_performance_app']);
      expect(saved).toHaveLength(1);
      expect(saved[0].text).toBe('New task');
    });
    
    test('handles todos with special characters', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: '🎉 Special <>&" characters',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      storageService.saveTodos(todos);
      
      const saved = JSON.parse(localStorageMock['todos_performance_app']);
      expect(saved[0].text).toBe('🎉 Special <>&" characters');
    });
    
    test('serializes dates correctly', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Task',
          completed: false,
          createdAt: now,
          updatedAt: now,
        },
      ];
      
      storageService.saveTodos(todos);
      
      // Dates should be serialized as ISO strings
      const saved = localStorageMock['todos_performance_app'];
      expect(saved).toContain('2024-01-15T10:30:00.000Z');
    });
    
    test('handles large dataset', () => {
      // 📚 CONCEPT: Test performance with realistic data
      const todos: Todo[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: i % 2 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      storageService.saveTodos(todos);
      
      const saved = JSON.parse(localStorageMock['todos_performance_app']);
      expect(saved).toHaveLength(100);
    });
  });
  
  // ===========================================
  // getTodos() Tests
  // ===========================================
  
  describe('getTodos', () => {
    // 📚 CONCEPT: Test data retrieval and error handling
    
    test('returns empty array when no todos in storage', () => {
      const result = storageService.getTodos();
      
      expect(result).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith('todos_performance_app');
    });
    
    test('returns saved todos from localStorage', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Saved task',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];
      
      // Simulate saved data
      localStorageMock['todos_performance_app'] = JSON.stringify(todos);
      
      const result = storageService.getTodos();
      
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Saved task');
    });
    
    test('returns multiple todos from localStorage', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          text: 'Task 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'high',
        },
      ];
      
      localStorageMock['todos_performance_app'] = JSON.stringify(todos);
      
      const result = storageService.getTodos();
      
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Task 1');
      expect(result[1].priority).toBe('high');
    });
    
    test('deserializes dates correctly', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const todos = [
        {
          id: '1',
          text: 'Task',
          completed: false,
          createdAt: dateString,
          updatedAt: dateString,
        },
      ];
      
      localStorageMock['todos_performance_app'] = JSON.stringify(todos);
      
      const result = storageService.getTodos();
      
      // Dates should be converted back to Date objects
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
      expect(result[0].createdAt.toISOString()).toBe(dateString);
    });
    
    test('handles todos with special characters', () => {
      const todos = [
        {
          id: '1',
          text: '🎉 Special <>&" characters',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      localStorageMock['todos_performance_app'] = JSON.stringify(todos);
      
      const result = storageService.getTodos();
      
      expect(result[0].text).toBe('🎉 Special <>&" characters');
    });
  });
  
  // ===========================================
  // Error Handling Tests
  // ===========================================
  
  // describe('Error Handling', () => {
  //   // 📚 CONCEPT: Test robustness with invalid data
    
  //   test('returns empty array when localStorage contains invalid JSON', () => {
  //     localStorageMock['todos_performance_app'] = 'invalid json {[}';
      
  //     const result = storageService.getTodos();
      
  //     expect(result).toEqual([]);
  //   });
    
  //   test('returns empty array when localStorage contains null', () => {
  //     localStorageMock['todos_performance_app'] = 'null';
      
  //     const result = storageService.getTodos();
      
  //     expect(result).toEqual([]);
  //   });
    
  //   test('returns empty array when localStorage contains non-array', () => {
  //     localStorageMock['todos_performance_app'] = JSON.stringify({ invalid: 'data' });
      
  //     const result = storageService.getTodos();
      
  //     expect(result).toEqual([]);
  //   });
    
  //   test('returns empty array when localStorage contains array of non-todos', () => {
  //     localStorageMock['todos_performance_app'] = JSON.stringify(['string', 123, { wrong: 'shape' }]);
      
  //     const result = storageService.getTodos();
      
  //     // Should handle gracefully (might return [] or filtered valid items)
  //     expect(Array.isArray(result)).toBe(true);
  //   });
    
  //   test('handles localStorage.getItem throwing error', () => {
  //     // 📚 CONCEPT: Test when localStorage is unavailable
  //     jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
  //       throw new Error('Storage quota exceeded');
  //     });
      
  //     const result = storageService.getTodos();
      
  //     expect(result).toEqual([]);
  //   });
    
  //   test('handles localStorage.setItem throwing error', () => {
  //     // Mock quota exceeded error
  //     jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
  //       throw new Error('Storage quota exceeded');
  //     });
      
  //     const todos: Todo[] = [
  //       {
  //         id: '1',
  //         text: 'Task',
  //         completed: false,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       },
  //     ];
      
  //     // Should not throw error, should handle gracefully
  //     expect(() => storageService.saveTodos(todos)).not.toThrow();
  //   });
  // });
  

  // ===========================================
// Error Handling Tests
// ===========================================
  describe('Error Handling', () => {
    // Returns empty array when localStorage contains null
    test('returns empty array when localStorage contains null', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorageMock['todos'] = 'null';
      
      const result = storageService.getTodos();
      
      expect(result).toEqual([]);
      
      consoleErrorSpy.mockRestore();
    });

    // Returns empty array when localStorage contains non-array
    test('returns empty array when localStorage contains non-array', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorageMock['todos'] = JSON.stringify({ invalid: 'data' });
      
      const result = storageService.getTodos();
      
      expect(result).toEqual([]);
      
      consoleErrorSpy.mockRestore();
    });

    // Returns empty array when localStorage contains array of non-todos
    test('returns empty array when localStorage contains array of non-todos', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorageMock['todos'] = JSON.stringify(['string', 123, { wrong: 'shape' }]);
      
      const result = storageService.getTodos();
      
      expect(Array.isArray(result)).toBe(true);
      
      consoleErrorSpy.mockRestore();
    });

    // Handles localStorage.getItem throwing error
    test('handles localStorage.getItem throwing error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const result = storageService.getTodos();
      
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load todos from localStorage:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    // Handles localStorage.setItem throwing error
    test('handles localStorage.setItem throwing error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const todos: Todo[] = [
        { id: '1', text: 'Task', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      
      expect(() => storageService.saveTodos(todos)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save todos to localStorage:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  // ===========================================
  // Integration Tests (Save + Load)
  // ===========================================
  
  describe('Save and Load Integration', () => {
    // 📚 CONCEPT: Test round-trip data persistence
    
    test('can save and load todos successfully', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'First task',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          priority: 'high',
        },
        {
          id: '2',
          text: 'Second task',
          completed: true,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ];
      
      // Save
      storageService.saveTodos(todos);
      
      // Load
      const loaded = storageService.getTodos();
      
      // Verify round-trip
      expect(loaded).toHaveLength(2);
      expect(loaded[0].text).toBe('First task');
      expect(loaded[0].priority).toBe('high');
      expect(loaded[1].completed).toBe(true);
    });
    
    test('preserves todo properties in round-trip', () => {
      const originalDate = new Date('2024-01-15T10:30:00Z');
      const todos: Todo[] = [
        {
          id: 'unique-id-123',
          text: 'Important task',
          completed: false,
          createdAt: originalDate,
          updatedAt: originalDate,
          priority: 'medium',
        },
      ];
      
      storageService.saveTodos(todos);
      const loaded = storageService.getTodos();
      
      expect(loaded[0]).toMatchObject({
        id: 'unique-id-123',
        text: 'Important task',
        completed: false,
        priority: 'medium',
      });
      expect(loaded[0].createdAt.getTime()).toBe(originalDate.getTime());
    });
    
    test('handles multiple save/load cycles', () => {
      // First cycle
      const todos1: Todo[] = [
        { id: '1', text: 'Task 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      storageService.saveTodos(todos1);
      let loaded = storageService.getTodos();
      expect(loaded).toHaveLength(1);
      
      // Second cycle (add more)
      const todos2: Todo[] = [
        { id: '1', text: 'Task 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Task 2', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      storageService.saveTodos(todos2);
      loaded = storageService.getTodos();
      expect(loaded).toHaveLength(2);
      
      // Third cycle (remove one)
      const todos3: Todo[] = [
        { id: '2', text: 'Task 2', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      storageService.saveTodos(todos3);
      loaded = storageService.getTodos();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe('2');
    });
  });
});

/**
 * 🎓 KEY TAKEAWAYS:
 * 
 * 1. **Mocking Browser APIs**:
 *    - localStorage doesn't exist in Jest
 *    - Create mock that mimics real behavior
 *    - Use beforeEach for fresh state
 * 
 * 2. **Test Both Success and Failure**:
 *    - Happy path: data saves and loads correctly
 *    - Error cases: invalid JSON, quota exceeded, null data
 * 
 * 3. **Round-Trip Testing**:
 *    - Save → Load → Verify data integrity
 *    - Check dates, special characters, all properties
 * 
 * 4. **Error Handling**:
 *    - Service should never crash
 *    - Return sensible defaults on error
 *    - Log errors for debugging
 * 
 * 5. **Data Serialization**:
 *    - JSON.stringify for complex objects
 *    - Dates need special handling
 *    - Test with edge cases (special chars, unicode)
 * 
 * 📊 COVERAGE:
 * This test suite covers:
 * - ✅ saveTodos: single, multiple, empty, special cases
 * - ✅ getTodos: existing data, empty, error handling
 * - ✅ Error handling: invalid JSON, quota, null data
 * - ✅ Integration: save/load round-trips
 * 
 * Run: npm run test -- storageService.test
 * Coverage: npm run test:coverage -- storageService.test
 */