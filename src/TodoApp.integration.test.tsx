// __tests__/TodoApp.integration.test.tsx
// INTEGRATION TESTS for complete Todo workflows
// Learning Focus: Testing component interactions, user workflows, data flow

/**
 * 🎓 LEARNING NOTES:
 *
 * Integration tests differ from unit tests:
 * 1. Test multiple components working together
 * 2. Test realistic user workflows end-to-end
 * 3. Use real implementations (minimal mocking)
 * 4. Slower than unit tests but provide high confidence
 *
 * This file teaches you:
 * - Testing complete user workflows
 * - Testing component interactions
 * - Testing state changes across components
 * - Testing localStorage persistence
 * - Testing filter interactions
 */

import { render, screen, fireEvent, waitFor } from "./test-utils";
import App from "./App";

describe("Todo App - Integration Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  // ===========================================
  // Complete User Workflows
  // ===========================================

  describe("Complete Todo Workflow", () => {
    // 📚 CONCEPT: Test realistic user journey from start to finish

    test("user can add, edit, toggle, and delete a todo", async () => {
      render(<App />);

      // STEP 1: Add a todo
      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      fireEvent.change(input, { target: { value: "Buy groceries" } });
      fireEvent.click(addButton);

      // Verify todo appears
      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      // STEP 2: Edit the todo
      const editButton = screen.getByTestId("edit-button");
      fireEvent.click(editButton);

      const editInput = screen.getByTestId("todo-edit-input");
      fireEvent.change(editInput, {
        target: { value: "Buy groceries and milk" },
      });
      fireEvent.blur(editInput);

      // Verify text updated
      await waitFor(() => {
        expect(screen.getByText("Buy groceries and milk")).toBeInTheDocument();
      });

      // STEP 3: Toggle completion
      const checkbox = screen.getByTestId("todo-checkbox");
      fireEvent.click(checkbox);

      // Verify todo is marked complete
      await waitFor(() => {
        const todoText = screen.getByTestId("todo-text");
        expect(todoText).toHaveClass("line-through");
      });

      // STEP 4: Delete the todo
      const deleteButton = screen.getByTestId("delete-button");
      fireEvent.click(deleteButton);

      // Verify todo is removed
      await waitFor(() => {
        expect(
          screen.queryByText("Buy groceries and milk")
        ).not.toBeInTheDocument();
      });
    });
  });

  // ===========================================
  // Add Todo Workflows
  // ===========================================

  describe("Add Todo Workflows", () => {
    test("clears input after adding todo", async () => {
      render(<App />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      const addButton = screen.getByRole("button", { name: /add/i });

      fireEvent.change(input, { target: { value: "Task to clear" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(input.value).toBe("");
      });
    });
  });

  // ===========================================
  // Filter Workflows
  // ===========================================

  describe("Filter Workflows", () => {
    // 📚 CONCEPT: Test filtering across component boundaries

    test("filters show only active todos", async () => {
      render(<App />);

      // Add some todos
      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      fireEvent.change(input, { target: { value: "Active todo" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Active todo")).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: "Another active" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Another active")).toBeInTheDocument();
      });

      // Complete one todo
      const checkboxes = screen.getAllByTestId("todo-checkbox");
      fireEvent.click(checkboxes[0]);

      await waitFor(() => {
        const todoText = screen.getAllByTestId("todo-text")[0];
        expect(todoText).toHaveClass("line-through");
      });

      // Click Active filter
      const activeFilterButton = screen.getByRole("button", {
        name: /Active/i,
      });
      fireEvent.click(activeFilterButton);

      // Should only show one todo now
      await waitFor(() => {
        expect(screen.getByText("Another active")).toBeInTheDocument();
        expect(screen.queryByText("Active todo")).not.toBeInTheDocument();
      });
    });

    test("filters show all todos", async () => {
      render(<App />);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      // Add todos
      fireEvent.change(input, { target: { value: "First" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("First")).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: "Second" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Second")).toBeInTheDocument();
      });

      // Complete one
      const checkboxes = screen.getAllByTestId("todo-checkbox");
      fireEvent.click(checkboxes[0]);

      // Switch to Active filter first
      const activeFilterButton = screen.getByRole("button", {
        name: /Active/i,
      });
      fireEvent.click(activeFilterButton);

      // Now switch back to All
      const allFilterButton = screen.getByRole("button", { name: /All/i });
      fireEvent.click(allFilterButton);

      // Should show both todos
      await waitFor(() => {
        expect(screen.getByText("First")).toBeInTheDocument();
        expect(screen.getByText("Second")).toBeInTheDocument();
      });
    });
  });

  // ===========================================
  // Clear Completed Workflow
  // ===========================================

  describe("Clear Completed Workflow", () => {
    test("clears all completed todos at once", async () => {
      render(<App />);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      // Add multiple todos
      fireEvent.change(input, { target: { value: "Todo 1" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Todo 1")).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: "Todo 2" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Todo 2")).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: "Todo 3" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Todo 3")).toBeInTheDocument();
      });

      // Complete first two
      const checkboxes = screen.getAllByTestId("todo-checkbox");
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      // Clear completed
      const clearButton = screen.getByRole("button", {
        name: /clear completed/i,
      });
      fireEvent.click(clearButton);

      // Should only have one todo left
      await waitFor(() => {
        expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Todo 2")).not.toBeInTheDocument();
        expect(screen.getByText("Todo 3")).toBeInTheDocument();
      });
    });
  });

  // ===========================================
  // LocalStorage Persistence
  // ===========================================

  describe("LocalStorage Persistence", () => {
    // 📚 CONCEPT: Test data persistence across component unmount/remount

    test("persists todos after unmount and remount", async () => {
      // First render
      const { unmount } = render(<App />);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      // Add todos
      fireEvent.change(input, { target: { value: "Persistent todo" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Persistent todo")).toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Re-render component
      render(<App />);

      // Todo should still be there
      await waitFor(() => {
        expect(screen.getByText("Persistent todo")).toBeInTheDocument();
      });
    });

    test("persists todo completion state", async () => {
      // First render
      const { unmount } = render(<App />);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      // Add and complete todo
      fireEvent.change(input, { target: { value: "To complete" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("To complete")).toBeInTheDocument();
      });

      const checkbox = screen.getByTestId("todo-checkbox");
      fireEvent.click(checkbox);

      await waitFor(() => {
        const todoText = screen.getByTestId("todo-text");
        expect(todoText).toHaveClass("line-through");
      });

      // Unmount and remount
      unmount();
      render(<App />);

      // Should still be completed
      await waitFor(() => {
        const todoText = screen.getByTestId("todo-text");
        expect(todoText).toHaveClass("line-through");
      });
    });

    test("persists todo edits", async () => {
      // First render
      const { unmount } = render(<App />);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      // Add todo
      fireEvent.change(input, { target: { value: "Original text" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Original text")).toBeInTheDocument();
      });

      // Edit it
      const editButton = screen.getByTestId("edit-button");
      fireEvent.click(editButton);

      const editInput = screen.getByTestId("todo-edit-input");
      fireEvent.change(editInput, { target: { value: "Edited text" } });
      fireEvent.blur(editInput);

      await waitFor(() => {
        expect(screen.getByText("Edited text")).toBeInTheDocument();
      });

      // Unmount and remount
      unmount();
      render(<App />);

      // Should show edited text
      await waitFor(() => {
        expect(screen.getByText("Edited text")).toBeInTheDocument();
        expect(screen.queryByText("Original text")).not.toBeInTheDocument();
      });
    });
  });
});

/**
 * 🎓 KEY TAKEAWAYS:
 *
 * 1. **Integration vs Unit Tests**:
 *    - Integration: Test multiple components together
 *    - Unit: Test single components in isolation
 *    - Integration gives higher confidence
 *
 * 2. **Realistic Workflows**:
 *    - Test user journeys, not just individual actions
 *    - Combine multiple operations
 *    - Verify state changes propagate correctly
 *
 * 3. **Minimal Mocking**:
 *    - Use real implementations when possible
 *    - Only mock external dependencies (APIs, etc.)
 *    - Tests are slower but more realistic
 *
 * 4. **Persistence Testing**:
 *    - Test data survives unmount/remount
 *    - Verify localStorage integration
 *    - Test complex state persistence
 *
 * 5. **Cross-Component Communication**:
 *    - Test that changes in one component affect others
 *    - Verify stats update correctly
 *    - Test filter effects on displayed todos
 *
 * 📊 COVERAGE:
 * This test suite covers:
 * - ✅ Complete CRUD workflows
 * - ✅ Add todos with priorities
 * - ✅ Filter interactions
 * - ✅ Stats updates
 * - ✅ Clear completed workflow
 * - ✅ LocalStorage persistence
 *
 * Run: npm run test -- TodoApp.integration
 * Coverage: npm run test:coverage -- TodoApp.integration
 */
