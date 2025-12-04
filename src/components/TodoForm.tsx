// components/TodoForm.tsx
// VERSION 1: UNOPTIMIZED
// UPDATED: Mobile-responsive design

import { useState } from 'react';

interface TodoFormProps {
  onAdd: (text: string, priority?: 'low' | 'medium' | 'high') => void;
}

/**
 * Form for adding new todos
 * UNOPTIMIZED VERSION
 * UPDATED: Mobile-responsive layout
 */
export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onAdd(text, priority);
      setText('');
      setPriority('medium');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  // ⚠️ PERFORMANCE ISSUE: This component re-renders whenever parent re-renders
  // even if props haven't changed

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
      data-testid="todo-form"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          {/* Todo Input - Full width on mobile */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            data-testid="todo-input"
            maxLength={200}
          />
          
          {/* Priority Select */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            data-testid="priority-select"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>

          {/* Add Button */}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation w-full sm:w-auto"
            data-testid="add-button"
          >
            Add Todo
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-xs sm:text-sm" data-testid="form-error">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
