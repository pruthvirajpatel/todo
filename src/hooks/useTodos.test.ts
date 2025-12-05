// hooks/useTodos.test.ts
// UNIT TESTS for useTodos custom hook
// Learning Focus: Testing React hooks, state management, effects, memoization

/**
 * 🎓 LEARNING NOTES:
 * 
 * Testing custom hooks is different from testing components:
 * 1. Use `renderHook` from @testing-library/react
 * 2. Wrap state changes in `act()` to simulate React updates
 * 3. Test hook return values, not implementation details
 * 4. Mock dependencies (localStorage, utilities)
 * 
 * This file teaches you:
 * - How to test custom hooks
 * - How to test state changes
 * - How to test useEffect with localStorage
 * - How to test useCallback stability
 * - How to test useMemo calculations
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from './useTodos';
import { storageService } from '../services/storageService';
import { Todo } from '../types/todo.types';

// ===========================================
// Mock Dependencies
// ===========================================

/**
 * 📚 CONCEPT: Mock external dependencies
 * We mock storageService to:
 * 1. Isolate the hook from localStorage
 * 2. Control what data is "loaded"
 * 3. Verify save operations are called
 */

jest.mock('../services/storageService');

const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe('useTodos - Custom Hook', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    mockStorageService.getTodos.mockReturnValue([]);
    mockStorageService.saveTodos.mockImplementation(() => {});
  });
  
  // ===========================================
  // Initial State Tests
  // ===========================================
  
  describe('Initial State', () => {
    // 📚 CONCEPT: Test hook initialization
    
    test('initializes with empty todos when storage is empty', () => {
      mockStorageService.getTodos.mockReturnValue([]);
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.todos).toEqual([]);
      expect(result.current.allTodos).toEqual([]);
      expect(result.current.filter).toBe('all');
      expect(result.current.stats).toEqual({
        total: 0,
        active: 0,
        completed: 0,
        completionRate: 0,
      });
      expect(result.current.hasCompleted).toBe(false);
    });
    
    test('loads existing todos from localStorage on mount', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          text: 'Existing todo',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];
      
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(mockStorageService.getTodos).toHaveBeenCalledTimes(1);
      expect(result.current.allTodos).toHaveLength(1);
      expect(result.current.allTodos[0].text).toBe('Existing todo');
    });
    
    test('loads multiple todos from localStorage', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          text: 'First',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          text: 'Second',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'high',
        },
      ];
      
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.allTodos).toHaveLength(2);
      expect(result.current.stats.total).toBe(2);
      expect(result.current.stats.completed).toBe(1);
    });
  });
  
  // ===========================================
  // addTodo() Tests
  // ===========================================
  
  describe('addTodo', () => {
    // 📚 CONCEPT: Test state updates
    
    test('adds a todo to empty list', async () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.addTodo('New todo');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos).toHaveLength(1);
        expect(result.current.allTodos[0]).toMatchObject({
          text: 'New todo',
          completed: false,
        });
        expect(result.current.allTodos[0].id).toBeDefined();
      });
    });
    
    test('adds todo with priority', async () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.addTodo('High priority task', 'high');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos[0].priority).toBe('high');
      });
    });
    
    test('adds multiple todos', async () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.addTodo('First todo');
        result.current.addTodo('Second todo', 'medium');
        result.current.addTodo('Third todo', 'low');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos).toHaveLength(3);
        expect(result.current.allTodos[0].text).toBe('First todo');
        expect(result.current.allTodos[1].text).toBe('Second todo');
        expect(result.current.allTodos[2].text).toBe('Third todo');
      });
    });
    
    test('saves to localStorage after adding todo', async () => {
      const { result } = renderHook(() => useTodos());
      mockStorageService.saveTodos.mockClear();
      act(() => {
        result.current.addTodo('New todo');
      });
      
      await waitFor(() => {
        expect(mockStorageService.saveTodos).toHaveBeenCalled();
        const savedTodos = mockStorageService.saveTodos.mock.calls[0][0];
        expect(savedTodos).toHaveLength(1);
        expect(savedTodos[0].text).toBe('New todo');
      });
    });
    
    test('throws error for empty text', () => {
      const { result } = renderHook(() => useTodos());
      
      expect(() => {
        act(() => {
          result.current.addTodo('');
        });
      }).toThrow();
    });
    
    test('throws error for whitespace-only text', () => {
      const { result } = renderHook(() => useTodos());
      
      expect(() => {
        act(() => {
          result.current.addTodo('   ');
        });
      }).toThrow();
    });
    
    test('updates stats after adding todo', async () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.addTodo('New todo');
      });
      
      await waitFor(() => {
        expect(result.current.stats.total).toBe(1);
        expect(result.current.stats.active).toBe(1);
        expect(result.current.stats.completed).toBe(0);
      });
    });
  });
  
  // ===========================================
  // toggleTodo() Tests
  // ===========================================
  
  describe('toggleTodo', () => {
    test('toggles todo from active to completed', async () => {
      // Start with existing todo
      const existingTodos: Todo[] = [
        {
          id: '1',
          text: 'Todo to toggle',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.toggleTodo('1');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos[0].completed).toBe(true);
      });
    });
    
    test('toggles todo from completed to active', async () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          text: 'Completed todo',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.toggleTodo('1');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos[0].completed).toBe(false);
      });
    });
    
    test('saves to localStorage after toggling', async () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          text: 'Todo',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      // Clear the initial load call
      mockStorageService.saveTodos.mockClear();
      
      act(() => {
        result.current.toggleTodo('1');
      });
      
      await waitFor(() => {
        expect(mockStorageService.saveTodos).toHaveBeenCalled();
      });
    });
    
    test('updates stats after toggling', async () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          text: 'Todo',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.stats.completed).toBe(0);
      expect(result.current.hasCompleted).toBe(false);
      
      act(() => {
        result.current.toggleTodo('1');
      });
      
      await waitFor(() => {
        expect(result.current.stats.completed).toBe(1);
        expect(result.current.hasCompleted).toBe(true);
      });
    });
    
    test('does not affect other todos', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'First', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Second', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.toggleTodo('1');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos[0].completed).toBe(true);
        expect(result.current.allTodos[1].completed).toBe(false);
      });
    });
  });
  
  // ===========================================
  // deleteTodo() Tests
  // ===========================================
  
  describe('deleteTodo', () => {
    test('deletes todo from list', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'To delete', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.allTodos).toHaveLength(1);
      
      act(() => {
        result.current.deleteTodo('1');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos).toHaveLength(0);
      });
    });
    
    test('deletes specific todo from multiple todos', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'First', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Second', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', text: 'Third', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.deleteTodo('2');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos).toHaveLength(2);
        expect(result.current.allTodos.find(t => t.id === '2')).toBeUndefined();
        expect(result.current.allTodos[0].text).toBe('First');
        expect(result.current.allTodos[1].text).toBe('Third');
      });
    });
    
    test('saves to localStorage after deleting', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'To delete', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      mockStorageService.saveTodos.mockClear();
      
      act(() => {
        result.current.deleteTodo('1');
      });
      
      await waitFor(() => {
        expect(mockStorageService.saveTodos).toHaveBeenCalled();
      });
    });
    
    test('updates stats after deleting', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'First', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Second', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.stats.total).toBe(2);
      
      act(() => {
        result.current.deleteTodo('1');
      });
      
      await waitFor(() => {
        expect(result.current.stats.total).toBe(1);
        expect(result.current.stats.active).toBe(0);
        expect(result.current.stats.completed).toBe(1);
      });
    });
  });
  
  // ===========================================
  // updateTodo() Tests
  // ===========================================
  
  describe('updateTodo', () => {
    test('updates todo text', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Old text', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.updateTodo('1', 'New text');
      });
      
      await waitFor(() => {
        expect(result.current.allTodos[0].text).toBe('New text');
      });
    });
    
    test('saves to localStorage after updating', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Old', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      mockStorageService.saveTodos.mockClear();
      
      act(() => {
        result.current.updateTodo('1', 'New');
      });
      
      await waitFor(() => {
        expect(mockStorageService.saveTodos).toHaveBeenCalled();
      });
    });
    
    test('throws error for empty text', () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Original', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(() => {
        act(() => {
          result.current.updateTodo('1', '');
        });
      }).toThrow();
    });
  });
  
  // ===========================================
  // clearCompleted() Tests
  // ===========================================
  
  describe('clearCompleted', () => {
    test('removes all completed todos', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Active', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Done 1', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', text: 'Done 2', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.clearCompleted();
      });
      
      await waitFor(() => {
        expect(result.current.allTodos).toHaveLength(1);
        expect(result.current.allTodos[0].text).toBe('Active');
      });
    });
    
    test('keeps all todos when none are completed', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Active 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Active 2', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.clearCompleted();
      });
      
      await waitFor(() => {
        expect(result.current.allTodos).toHaveLength(2);
      });
    });
    
    test('updates stats after clearing completed', async () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Active', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Done', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.hasCompleted).toBe(true);
      
      act(() => {
        result.current.clearCompleted();
      });
      
      await waitFor(() => {
        expect(result.current.stats.completed).toBe(0);
        expect(result.current.hasCompleted).toBe(false);
      });
    });
  });
  
  // ===========================================
  // Filter Tests
  // ===========================================
  
  describe('Filtering', () => {
    test('filters to show only active todos', () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Active', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Done', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.setFilter('active');
      });
      
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Active');
    });
    
    test('filters to show only completed todos', () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Active', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Done', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.setFilter('completed');
      });
      
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Done');
    });
    
    test('shows all todos when filter is "all"', () => {
      const existingTodos: Todo[] = [
        { id: '1', text: 'Active', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Done', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStorageService.getTodos.mockReturnValue(existingTodos);
      
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.setFilter('all');
      });
      
      expect(result.current.todos).toHaveLength(2);
    });
  });
});

/**
 * 🎓 KEY TAKEAWAYS:
 * 
 * 1. **Hook Testing Pattern**:
 *    - Use renderHook() from @testing-library/react
 *    - Wrap state changes in act()
 *    - Use waitFor() for async updates
 * 
 * 2. **Mocking Dependencies**:
 *    - Mock storageService to isolate hook
 *    - Control return values for different scenarios
 *    - Verify mock calls to check side effects
 * 
 * 3. **Test State Updates**:
 *    - Test initial state
 *    - Test each action (add, toggle, delete, update)
 *    - Test derived state (filtered todos, stats)
 * 
 * 4. **Test Effects**:
 *    - Verify localStorage integration
 *    - Check that saves happen after changes
 *    - Use waitFor() for async behavior
 * 
 * 5. **Test Optimization**:
 *    - useCallback creates stable references
 *    - useMemo prevents recalculation
 *    - Test that these work correctly
 * 
 * 📊 COVERAGE:
 * This test suite covers:
 * - ✅ Initial state and loading
 * - ✅ addTodo: validation, saving, stats
 * - ✅ toggleTodo: complete/incomplete, stats
 * - ✅ deleteTodo: removal, stats
 * - ✅ updateTodo: text changes, validation
 * - ✅ clearCompleted: bulk removal
 * - ✅ Filtering: all/active/completed
 * 
 * Run: npm run test -- useTodos.test
 * Coverage: npm run test:coverage -- useTodos.test
 */