import { memo } from "react";
import { Priority } from "../types/todo.types";

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const PrioritySelector = memo(function PrioritySelector({
  value,
  onChange,
}: PrioritySelectorProps) {
  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-red-500" },
  ];
  return (
    <div className="flex gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Priority)}
        className="px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto appearance-none"
        data-testid="priority-select"
      >
        {priorities.map(({ value: priorityValue, label }) => (
          <option key={priorityValue} value={priorityValue}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default PrioritySelector;
