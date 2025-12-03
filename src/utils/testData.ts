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

// Make available in browser console for testing
if (typeof window !== 'undefined') {
  (window as any).generateTestTodos = generateTestTodos;
  console.log('💡 Test data helper loaded! Use generateTestTodos(count) in console');
}
