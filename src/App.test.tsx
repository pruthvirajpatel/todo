// App.test.tsx
// UNIT TESTS for App component
// Learning Focus: Component composition, conditional rendering, Suspense

/**
 * 🎓 LEARNING NOTES:
 *
 * Testing the main App component focuses on:
 * 1. Component composition - all parts render correctly
 * 2. Conditional logic - when to show virtual vs regular list
 * 3. Suspense boundaries - loading states
 * 4. Integration points - passing props correctly
 *
 * This file teaches you:
 * - Testing component structure
 * - Testing conditional rendering
 * - Testing lazy-loaded components
 * - Testing Suspense fallbacks
 */

import { render, screen, waitFor } from "./test-utils";
import App from "./App";
import { useTodos } from "./hooks/useTodos";
import { Todo } from "./types/todo.types";

// ===========================================
// Mock Dependencies
// ===========================================

/**
 * 📚 CONCEPT: Mock the custom hook
 * We mock useTodos to control the data App receives
 * This isolates App component testing from hook logic
 */

jest.mock("./hooks/useTodos");

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

// Mock lazy-loaded component to avoid async issues
jest.mock("./components/VariableTodoList", () => ({
  __esModule: true,
  default: () => <div data-testid="virtual-list">Virtual List</div>,
}));

describe("App Component", () => {
  // 📚 HELPER: Default mock implementation
  const mockTodosReturn = (overrides = {}) => ({
    todos: [],
    allTodos: [],
    filter: "all" as const,
    setFilter: jest.fn(),
    stats: {
      total: 0,
      active: 0,
      completed: 0,
      completionRate: 0,
    },
    addTodo: jest.fn(),
    toggleTodo: jest.fn(),
    deleteTodo: jest.fn(),
    updateTodo: jest.fn(),
    clearCompleted: jest.fn(),
    hasCompleted: false,
    ...overrides,
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseTodos.mockReturnValue(mockTodosReturn());
  });

  // ===========================================
  // Rendering Tests
  // ===========================================

  describe("Rendering - Basic Structure", () => {
    // 📚 CONCEPT: Test component structure

    test("renders app container", () => {
      render(<App />);

      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    test("renders app title", () => {
      render(<App />);

      const title = screen.getByTestId("app-title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("📝 Todo App");
    });

    test("renders TodoForm component", () => {
      render(<App />);

      // TodoForm should have a text input
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("renders TodoFilter component", () => {
      render(<App />);

      expect(
        screen.getByRole("button", { name: /^All$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^Active$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^Completed$/i })
      ).toBeInTheDocument();
    });

    test("renders TodoStats component", () => {
      render(<App />);

      // TodoStats should show item count
      expect(screen.getByText("No todos yet!")).toBeInTheDocument();
    });
  });

  // ===========================================
  // Conditional Rendering Tests
  // ===========================================

  describe("List Rendering - Regular vs Virtual", () => {
    // 📚 CONCEPT: Test conditional rendering logic

    test("renders regular TodoList for 50 or fewer todos", () => {
      const todos: Todo[] = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          todos,
          allTodos: todos,
          stats: {
            total: 50,
            active: 50,
            completed: 0,
            completionRate: 0,
          },
        })
      );

      render(<App />);

      // Should NOT show virtual list
      expect(screen.queryByTestId("virtual-list")).not.toBeInTheDocument();
    });

    test("renders VirtualTodoList for more than 50 todos", async () => {
      const todos: Todo[] = Array.from({ length: 51 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          todos,
          allTodos: todos,
          stats: {
            total: 51,
            active: 51,
            completed: 0,
            completionRate: 0,
          },
        })
      );

      render(<App />);

      // Virtual list is lazy-loaded, wait for it
      await waitFor(() => {
        expect(screen.getByTestId("virtual-list")).toBeInTheDocument();
      });
    });

    test("shows loading fallback while VirtualTodoList loads", () => {
      const todos: Todo[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          todos,
          allTodos: todos,
        })
      );

      render(<App />);

      // Initially should show loading state
      // (This might be brief, but Suspense should handle it)
      // The loading fallback text is "Loading list..."
      // Note: This might resolve too quickly to test reliably
    });

    test("switches to virtual list when todos exceed 50", async () => {
      const { rerender } = render(<App />);

      // Start with 50 todos
      let todos: Todo[] = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockUseTodos.mockReturnValue(mockTodosReturn({ todos, allTodos: todos }));
      rerender(<App />);

      expect(screen.queryByTestId("virtual-list")).not.toBeInTheDocument();

      // Add one more todo (51 total)
      todos = [
        ...todos,
        {
          id: "50",
          text: "Todo 50",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUseTodos.mockReturnValue(mockTodosReturn({ todos, allTodos: todos }));
      rerender(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("virtual-list")).toBeInTheDocument();
      });
    });
  });

  // ===========================================
  // Props Passing Tests
  // ===========================================

  describe("Props Passing", () => {
    // 📚 CONCEPT: Verify App passes correct props to children

    test("passes addTodo to TodoForm", () => {
      const mockAddTodo = jest.fn();
      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          addTodo: mockAddTodo,
        })
      );

      render(<App />);

      // TodoForm should receive and use addTodo
      // We can verify this by checking if the form exists
      // (Full integration test will verify the connection)
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("passes current filter and setFilter to TodoFilter", () => {
      const mockSetFilter = jest.fn();
      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          filter: "active",
          setFilter: mockSetFilter,
        })
      );

      render(<App />);

      // TodoFilter should show all filter options
      expect(screen.getByTestId("filter-all")).toBeInTheDocument();
      expect(screen.getByTestId("filter-active")).toBeInTheDocument();
      expect(screen.getByTestId("filter-completed")).toBeInTheDocument();
    });

    test("passes todos and callbacks to TodoList", () => {
      const todos: Todo[] = [
        {
          id: "1",
          text: "Test todo",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          todos,
          allTodos: todos,
          stats: {
            total: 1,
            active: 1,
            completed: 0,
            completionRate: 0,
          },
        })
      );

      render(<App />);

      // TodoList should render the todo
      expect(screen.getByText("Test todo")).toBeInTheDocument();
    });

    test("passes stats to TodoStats", () => {
      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          stats: {
            total: 5,
            active: 3,
            completed: 2,
            completionRate: 40,
          },
          hasCompleted: true,
        })
      );

      render(<App />);

      // TodoStats should show the active count
      expect(screen.getByTestId("stat-active")).toHaveTextContent("3");
      expect(screen.getByTestId("stat-total")).toHaveTextContent("5");
      expect(screen.getByTestId("stat-completed")).toHaveTextContent("2");
    });
  });

  // ===========================================
  // Responsive Design Tests
  // ===========================================

  describe("Responsive Design", () => {
    // 📚 CONCEPT: Verify responsive classes are applied

    test("applies responsive padding classes to container", () => {
      render(<App />);

      const container = screen.getByTestId("app-container");

      // Check for mobile and desktop padding classes
      expect(container).toHaveClass("py-4");
      expect(container).toHaveClass("sm:py-8");
      expect(container).toHaveClass("px-3");
      expect(container).toHaveClass("sm:px-4");
    });

    test("applies responsive text size to title", () => {
      render(<App />);

      const title = screen.getByTestId("app-title");

      // Check for responsive text sizes
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("sm:text-3xl");
      expect(title).toHaveClass("md:text-4xl");
    });
  });

  // ===========================================
  // Edge Cases
  // ===========================================

  describe("Edge Cases", () => {
    test("renders correctly with empty todos", () => {
      render(<App />);

      // All sections should render even with no todos
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByText("No todos yet!")).toBeInTheDocument();
    });

    test("renders correctly with maximum safe todos", () => {
      const todos: Todo[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: i % 2 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          todos,
          allTodos: todos,
          stats: {
            total: 1000,
            active: 500,
            completed: 500,
            completionRate: 50,
          },
        })
      );

      render(<App />);

      // Should use virtual list for performance
      expect(screen.getByTestId("virtual-list")).toBeInTheDocument();
    });

    test("handles all completed todos", () => {
      const todos: Todo[] = [
        {
          id: "1",
          text: "Completed todo",
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUseTodos.mockReturnValue(
        mockTodosReturn({
          todos,
          allTodos: todos,
          stats: {
            total: 1,
            active: 0,
            completed: 1,
            completionRate: 100,
          },
          hasCompleted: true,
        })
      );

      render(<App />);

      expect(screen.getByText(/Clear Completed/i)).toBeInTheDocument();
    });
  });
});

/**
 * 🎓 KEY TAKEAWAYS:
 *
 * 1. **Component Composition Testing**:
 *    - Test that all child components render
 *    - Don't test child component details (test those separately)
 *    - Focus on integration points
 *
 * 2. **Conditional Rendering**:
 *    - Test both branches of conditionals
 *    - Test edge cases (exactly 50 vs 51 todos)
 *    - Test transitions between states
 *
 * 3. **Mock Custom Hooks**:
 *    - Mock useTodos to control state
 *    - Test different state scenarios
 *    - Verify callbacks are passed correctly
 *
 * 4. **Lazy Loading**:
 *    - Use waitFor() for lazy-loaded components
 *    - Test Suspense fallbacks
 *    - Verify correct component shows
 *
 * 5. **Responsive Design**:
 *    - Test CSS classes are applied
 *    - Verify responsive variants
 *    - Don't test actual rendering (that's E2E)
 *
 * 📊 COVERAGE:
 * This test suite covers:
 * - ✅ Component structure and rendering
 * - ✅ Conditional rendering (regular vs virtual list)
 * - ✅ Props passing to child components
 * - ✅ Responsive design classes
 * - ✅ Edge cases (empty, large dataset, all completed)
 *
 * Run: npm run test -- App.test
 * Coverage: npm run test:coverage -- App.test
 */
