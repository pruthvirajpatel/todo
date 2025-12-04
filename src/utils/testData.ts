// utils/testData.ts

import { createTodo } from './todoHelpers';
import { Todo } from '../types/todo.types';

/**
 * Generate test todos for performance testing
 * @param count Number of todos to generate
 */
export function generateTestTodos(count: number): Todo[] {
  const todos: Todo[] = [];
  const priorities = ['low', 'medium', 'high'] as const;
  const tasks = [
    'Review code',
    'Write documentation',
    'Fix bug',
    'Add feature',
    'Update dependencies',
    'Refactor component',
    'Write tests',
    'Deploy to production',
    'Review PR',
    'Update README',
  ];
  
  for (let i = 0; i < count; i++) {
    const priority = priorities[i % 3];
    const task = tasks[i % tasks.length];
    const completed = Math.random() > 0.5;
    
    const todo = createTodo(
      `${task} #${i + 1} - ${priority} priority`,
      priority
    );
    
    todo.completed = completed;
    todos.push(todo);
  }
  
  return todos;
}

/**
 * Load test data directly into localStorage and reload the page
 * @param count Number of todos to generate
 */
export function loadTestData(count: number): void {
  const todos = generateTestTodos(count);
  localStorage.setItem('todos_performance_app', JSON.stringify(todos));
  console.log(`✅ Loaded ${count} test todos. Reloading page...`);
  setTimeout(() => location.reload(), 500);
}

/**
 * Clear all todos from localStorage
 */
export function clearAllData(): void {
  localStorage.removeItem('todos_performance_app');
  console.log('✅ Cleared all data. Reloading page...');
  setTimeout(() => location.reload(), 500);
}

// Make available in browser console for testing
if (typeof window !== 'undefined') {
  (window as any).generateTestTodos = generateTestTodos;
  (window as any).loadTestData = loadTestData;
  (window as any).clearAllData = clearAllData;
  
  console.log(`
╔═══════════════════════════════════════╗
║   📊 Test Data Helpers Loaded!       ║
╠═══════════════════════════════════════╣
║ 💡 Available Commands:                ║
║                                       ║
║ loadTestData(100)                     ║
║   → Load 100 test todos & reload     ║
║                                       ║
║ clearAllData()                        ║
║   → Clear all todos & reload         ║
║                                       ║
║ generateTestTodos(50)                 ║
║   → Generate 50 todos (no reload)    ║
╚═══════════════════════════════════════╝
  `);
}
