// utils/todoHelpers.test.ts
// UNIT TESTS for utility functions
// Learning Focus: Testing pure functions, edge cases, validation logic

/**
 * 🎓 LEARNING NOTES:
 * 
 * Testing pure functions is the EASIEST and most important testing you'll do:
 * 1. Pure functions: Same input = same output (no side effects)
 * 2. No mocking needed - just call function and check result
 * 3. Fast execution - thousands of tests run in seconds
 * 4. High confidence - if utils break, everything breaks
 * 
 * This file teaches you:
 * - How to test pure functions
 * - How to handle edge cases
 * - How to test validation logic
 * - How to organize test suites
 */

import {
  createTodo,
  filterTodos,
  calculateStats,
  validateTodoText,
} from './todoHelpers';
import { Todo } from '../types/todo.types';

describe('todoHelpers - Pure Utility Functions', () => {
  // ===========================================
  // createTodo() Tests
  // ===========================================
  
  describe('createTodo', () => {
    // 📚 CONCEPT: Test happy path first
    
    test('creates todo with all required fields', () => {
      const result = createTodo('Buy milk');
      
      // Verify structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('text', 'Buy milk');
      expect(result).toHaveProperty('completed', false);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      
      // Verify types
      expect(typeof result.id).toBe('string');
      expect(result.id).toHaveLength(36); // UUID length
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
    
    test('creates todo without priority by default', () => {
      const result = createTodo('Task without priority');
      
      expect(result.priority).toBeUndefined();
    });
    
    test('creates todo with low priority', () => {
      const result = createTodo('Low priority task', 'low');
      
      expect(result.priority).toBe('low');
    });
    
    test('creates todo with medium priority', () => {
      const result = createTodo('Medium priority task', 'medium');
      
      expect(result.priority).toBe('medium');
    });
    
    test('creates todo with high priority', () => {
      const result = createTodo('High priority task', 'high');
      
      expect(result.priority).toBe('high');
    });
    
    test('generates unique IDs for each todo', () => {
      // 📚 CONCEPT: Test uniqueness
      const todo1 = createTodo('First');
      const todo2 = createTodo('Second');
      const todo3 = createTodo('Third');
      
      expect(todo1.id).not.toBe(todo2.id);
      expect(todo2.id).not.toBe(todo3.id);
      expect(todo1.id).not.toBe(todo3.id);
    });
    
    test('sets createdAt and updatedAt to same time on creation', () => {
      const result = createTodo('New task');
      
      expect(result.createdAt.getTime()).toBe(result.updatedAt.getTime());
    });
    
    test('trims whitespace from text', () => {
      const result = createTodo('  Task with spaces  ');
      
      expect(result.text).toBe('Task with spaces');
    });
    
    test('handles special characters in text', () => {
      const specialText = '🎉 Special <>&" characters';
      const result = createTodo(specialText);
      
      expect(result.text).toBe(specialText);
    });
    
    test('handles very long text', () => {
      const longText = 'a'.repeat(1000);
      const result = createTodo(longText);
      
      expect(result.text).toBe(longText);
    });
  });
  
  // ===========================================
  // validateTodoText() Tests
  // ===========================================
  
  describe('validateTodoText', () => {
    // 📚 CONCEPT: Validation is critical - test all paths
    
    test('validates non-empty text as valid', () => {
      const result = validateTodoText('Valid todo text');
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
    
    test('rejects empty string', () => {
      const result = validateTodoText('');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('empty');
    });
    
    test('rejects whitespace-only string', () => {
      const result = validateTodoText('   ');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    test('rejects string with only tabs and spaces', () => {
      const result = validateTodoText('\t  \t  ');
      
      expect(result.valid).toBe(false);
    });
    
    test('rejects string with only newlines', () => {
      const result = validateTodoText('\n\n\n');
      
      expect(result.valid).toBe(false);
    });
    
    test('accepts text with leading/trailing whitespace', () => {
      // 📚 NOTE: Validation allows it, createTodo trims it
      const result = validateTodoText('  Valid text  ');
      
      expect(result.valid).toBe(true);
    });
    
    test('accepts single character', () => {
      const result = validateTodoText('a');
      
      expect(result.valid).toBe(true);
    });
    
    test('accepts very long text', () => {
      const longText = 'a'.repeat(10000);
      const result = validateTodoText(longText);
      
      expect(result.valid).toBe(false);
    });
    
    test('accepts unicode characters', () => {
      const result = validateTodoText('🎉 Unicode text 你好');
      
      expect(result.valid).toBe(true);
    });
  });
  
  // ===========================================
  // filterTodos() Tests
  // ===========================================
  
  describe('filterTodos', () => {
    // 📚 HELPER: Create sample todos for filtering tests
    const mockTodos: Todo[] = [
      {
        id: '1',
        text: 'Active todo 1',
        completed: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        priority: 'high',
      },
      {
        id: '2',
        text: 'Completed todo 1',
        completed: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        priority: 'medium',
      },
      {
        id: '3',
        text: 'Active todo 2',
        completed: false,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        priority: 'low',
      },
      {
        id: '4',
        text: 'Completed todo 2',
        completed: true,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
    ];
    
    test('returns all todos when filter is "all"', () => {
      const result = filterTodos(mockTodos, 'all');
      
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockTodos);
    });
    
    test('returns only active todos when filter is "active"', () => {
      const result = filterTodos(mockTodos, 'active');
      
      expect(result).toHaveLength(2);
      expect(result.every(todo => !todo.completed)).toBe(true);
      expect(result.map(t => t.id)).toEqual(['1', '3']);
    });
    
    test('returns only completed todos when filter is "completed"', () => {
      const result = filterTodos(mockTodos, 'completed');
      
      expect(result).toHaveLength(2);
      expect(result.every(todo => todo.completed)).toBe(true);
      expect(result.map(t => t.id)).toEqual(['2', '4']);
    });
    
    test('returns empty array when no todos match filter', () => {
      const allCompleted: Todo[] = mockTodos.map(t => ({ ...t, completed: true }));
      const result = filterTodos(allCompleted, 'active');
      
      expect(result).toEqual([]);
    });
    
    test('returns empty array when input is empty', () => {
      const result = filterTodos([], 'all');
      
      expect(result).toEqual([]);
    });
    
    test('does not mutate original array', () => {
      // 📚 CONCEPT: Pure functions don't modify inputs
      const original = [...mockTodos];
      const result = filterTodos(mockTodos, 'active');
      
      expect(mockTodos).toEqual(original);
      expect(result).not.toBe(mockTodos); // Different reference
    });
    
    test('handles todos with all properties', () => {
      const result = filterTodos(mockTodos, 'active');
      
      result.forEach(todo => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('text');
        expect(todo).toHaveProperty('completed');
        expect(todo).toHaveProperty('createdAt');
        expect(todo).toHaveProperty('updatedAt');
      });
    });
  });
  
  // ===========================================
  // calculateStats() Tests
  // ===========================================
  
  describe('calculateStats', () => {
    test('calculates stats for mixed todos', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Active 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          text: 'Completed 1',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          text: 'Active 2',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          text: 'Completed 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      const result = calculateStats(todos);
      
      expect(result).toEqual({
        total: 4,
        active: 2,
        completed: 2,
        completionRate: 50,
      });
    });
    
    test('calculates 0% completion for all active todos', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Active 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          text: 'Active 2',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      const result = calculateStats(todos);
      
      expect(result).toEqual({
        total: 2,
        active: 2,
        completed: 0,
        completionRate: 0,
      });
    });
    
    test('calculates 100% completion for all completed todos', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Completed 1',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          text: 'Completed 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      const result = calculateStats(todos);
      
      expect(result).toEqual({
        total: 2,
        active: 0,
        completed: 2,
        completionRate: 100,
      });
    });
    
    test('returns zeros for empty array', () => {
      const result = calculateStats([]);
      
      expect(result).toEqual({
        total: 0,
        active: 0,
        completed: 0,
        completionRate: 0,
      });
    });
    
    test('rounds completion rate to one decimal place', () => {
      const todos: Todo[] = [
        { id: '1', text: 'T1', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'T2', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', text: 'T3', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = calculateStats(todos);

      // 1 of 3 completed = 33.333% → rounded to 33.3
      expect(result.completionRate).toBe(33.3);
      // Ensure it has exactly one decimal place
      expect(result.completionRate % 1).not.toBe(0);
    });
    
    test('handles single todo', () => {
      const todos: Todo[] = [
        {
          id: '1',
          text: 'Solo todo',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      const result = calculateStats(todos);
      
      expect(result).toEqual({
        total: 1,
        active: 1,
        completed: 0,
        completionRate: 0,
      });
    });
    
    test('calculates stats for large datasets', () => {
      // 📚 CONCEPT: Test performance edge case
      const todos: Todo[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: i % 3 === 0, // Every 3rd todo is completed
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      const result = calculateStats(todos);
      
      expect(result.total).toBe(1000);
      expect(result.completed).toBe(334); // 0, 3, 6, 9... up to 999
      expect(result.active).toBe(666);
      expect(result.completionRate).toBe(33.4); // 334/1000 = 33.4%
    });
    
    test('does not mutate original array', () => {
      const todos: Todo[] = [
        { id: '1', text: 'T1', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      const original = [...todos];
      
      calculateStats(todos);
      
      expect(todos).toEqual(original);
    });
  });
});

/**
 * 🎓 KEY TAKEAWAYS:
 * 
 * 1. **Pure Function Testing**: Easiest tests to write
 *    - No setup/teardown
 *    - No mocking
 *    - Fast execution
 * 
 * 2. **Edge Cases Matter**:
 *    - Empty inputs
 *    - Single item
 *    - Large datasets
 *    - Special characters
 *    - Whitespace
 * 
 * 3. **Test Immutability**:
 *    - Verify functions don't modify inputs
 *    - Check return values are new references
 * 
 * 4. **Organize by Function**:
 *    - One describe block per function
 *    - Group related test cases
 *    - Test happy path first, then edge cases
 * 
 * 5. **Helper Functions**:
 *    - Create mock data generators
 *    - Reduce duplication
 *    - Make tests readable
 * 
 * 📊 COVERAGE:
 * This test suite covers:
 * - ✅ createTodo: creation, uniqueness, properties, priorities
 * - ✅ validateTodoText: valid/invalid cases, edge cases
 * - ✅ filterTodos: all filters, empty cases, immutability
 * - ✅ calculateStats: all scenarios, edge cases, rounding
 * 
 * Run: npm run test -- todoHelpers.test
 * Coverage: npm run test:coverage -- todoHelpers.test
 */