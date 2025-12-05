import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TodoItem } from "./TodoItem";
import { Todo } from "../types/todo.types";

interface VirtualTodoListProps {
  todos: Todo[];
  height?: number;
  itemHeight?: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export function VirtualTodoList({
  todos,
  height = 600,
  itemHeight = 80,
  onToggle,
  onDelete,
  onUpdate,
}: VirtualTodoListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: todos.length,
    estimateSize: () => itemHeight,
    getScrollElement: () => parentRef.current,
    overscan: 5, // buffer rows above + below
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} style={{ height, overflow: "auto" }}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
        }}
      >
        {items.map((item) => {
          const todo = todos[item.index];

          return (
            <div
              key={item.key}
              style={{
                position: "absolute",
                top: item.start,
                height: item.size,
                width: "100%",
                padding: "8px",
              }}
            >
              <TodoItem
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualTodoList;
