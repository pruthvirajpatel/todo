// components/TodoItem.tsx
// VERSION 1: UNOPTIMIZED
// UPDATED: Mobile-responsive design

import { memo, useState } from "react";
import { Todo } from "../types/todo.types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

/**
 * Individual todo item with edit functionality
 * UNOPTIMIZED VERSION - Will re-render on any parent state change
 * UPDATED: Mobile-responsive layout
 */
const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  console.log(`🔄 TodoItem ${todo.text.slice(0, 20)} rendered`);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const handleUpdate = () => {
    if (editText.trim() && editText !== todo.text) {
      try {
        onUpdate(todo.id, editText);
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to update todo:", err);
      }
    } else {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  // Priority badge color
  const getPriorityColor = () => {
    switch (todo.priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ⚠️ PERFORMANCE ISSUE: This component re-renders whenever ANY todo in the list changes
  // because the parent passes down inline functions that change reference

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        todo.completed ? "opacity-60" : ""
      }`}
      data-testid="todo-item"
    >
      {/* Checkbox - Touch-friendly on mobile */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0 mt-0.5 sm:mt-0"
        data-testid="todo-checkbox"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1.5 sm:py-1 text-sm sm:text-base border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            data-testid="todo-edit-input"
          />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span
              className={`flex-1 text-sm sm:text-base break-words ${
                todo.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
              onDoubleClick={() => !todo.completed && setIsEditing(true)}
              data-testid="todo-text"
            >
              {todo.text}
            </span>

            {/* Priority Badge */}
            {todo.priority && (
              <span
                className={`inline-block px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${getPriorityColor()}`}
                data-testid="todo-priority"
              >
                {todo.priority}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions - Touch-friendly buttons on mobile */}
      {!isEditing && (
        <div className="flex gap-2 sm:gap-2 justify-end sm:justify-start">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 active:text-blue-900 transition-colors touch-manipulation font-medium"
            data-testid="edit-button"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm text-red-600 hover:text-red-800 active:text-red-900 transition-colors touch-manipulation font-medium"
            data-testid="delete-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
});

export { TodoItem };
