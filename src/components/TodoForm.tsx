// components/TodoForm.tsx
// VERSION 1: UNOPTIMIZED

import { useState } from 'react';

interface TodoFormProps {
  onAdd: (text: string, priority?: 'low' | 'medium' | 'high') => void;
}

/**
 * Form for adding new todos
 * UNOPTIMIZED VERSION
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
      className="bg-white shadow-md rounded-lg p-6 mb-6"
      data-testid="todo-form"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="todo-input"
            maxLength={200}
          />
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="add-button"
          >
            Add
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm" data-testid="form-error">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
