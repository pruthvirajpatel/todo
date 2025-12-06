# Testing Guide - Option 1 (Colocated Tests)

## 📁 Testing Structure

We use **colocated tests** - test files live next to the components they test.

```
src/
├── components/
│   └── TodoList/
│       ├── TodoList.tsx           # Component
│       ├── TodoList.test.tsx      # Unit tests (colocated)
│       └── TodoList.cy.tsx        # E2E tests (colocated)
├── App.tsx
├── App.test.tsx                    # Colocated test
└── test-utils/
    └── index.ts                    # Shared test utilities
```

## 🧪 Testing Layers

### **1. Unit Tests (Jest + React Testing Library)**
- **Location**: `*.test.tsx` files next to components
- **Purpose**: Test component behavior in isolation
- **Run**: `npm run test`

### **2. Integration Tests (Jest + RTL)**
- **Location**: Same `*.test.tsx` files
- **Purpose**: Test multiple components working together
- **Run**: `npm run test`

### **3. E2E Tests (Cypress)**
- **Location**: `*.cy.tsx` files next to components
- **Purpose**: Test full user workflows
- **Run**: `npm run cypress:open` or `npm run cypress:run`

---

## 📝 Writing Tests

### **Test File Naming**
```
ComponentName.tsx       # Component
ComponentName.test.tsx  # Unit/integration tests
ComponentName.cy.tsx    # E2E tests
```

### **Using Test Utils**

Import from `test-utils` instead of `@testing-library/react`:

```typescript
// ❌ Don't do this
import { render, screen } from '@testing-library/react';

// ✅ Do this instead - adjust path based on file location
// For src/App.test.tsx:
import { render, screen } from './test-utils';

// For src/components/TodoList/TodoList.test.tsx:
import { render, screen } from '../../test-utils';
```

**Path Guide:**
- From `src/` level: `'./test-utils'`
- From `src/components/` level: `'../test-utils'`
- From `src/components/SubFolder/` level: `'../../test-utils'`

**Why?** `test-utils` provides:
- Custom render with providers (Context, Router, etc.)
- Common testing helpers
- Consistent test setup across the project

### **Using data-testid Attributes**

Add `data-testid` to elements you want to test:

```tsx
// In component
<button 
  onClick={handleClick}
  data-testid="submit-button"
>
  Submit
</button>

// In test
const button = screen.getByTestId('submit-button');
expect(button).toBeInTheDocument();
```

**Naming convention**: Use kebab-case, e.g., `data-testid="todo-item-checkbox"`

---

## 🎯 Test Organization

### **Group Tests by Feature**

```typescript
describe('TodoItem Component', () => {
  describe('Rendering', () => {
    test('renders todo text', () => { /* ... */ });
    test('renders checkbox', () => { /* ... */ });
  });

  describe('Interactions', () => {
    test('toggles checkbox on click', () => { /* ... */ });
    test('calls onDelete when delete button clicked', () => { /* ... */ });
  });

  describe('Edge Cases', () => {
    test('handles empty todo text', () => { /* ... */ });
  });
});
```

---

## 🚀 Running Tests

### **Basic Commands**

```bash
# Run all tests once
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run coverage in watch mode
npm run test:coverage:watch

# Open Cypress interactive mode
npm run cypress:open

# Run Cypress headless
npm run cypress:run
```

### **Running Specific Tests**

```bash
# Run only tests matching a pattern
npm run test -- App.test

# Run only a specific describe block
npm run test -- -t "Rendering"

# Update snapshots
npm run test -- -u
```

---

## 📊 Coverage Requirements

Coverage thresholds are configured in `jest.config.cjs`:

```javascript
coverageThresholds: {
  global: {
    branches: 70,    // 70% of code branches covered
    functions: 70,   // 70% of functions covered
    lines: 70,       // 70% of code lines covered
    statements: 70   // 70% of statements covered
  }
}
```

**View coverage report:**
```bash
npm run test:coverage
# Opens coverage/lcov-report/index.html in browser
```

**Files excluded from coverage:**
- `*.d.ts` - Type definitions
- `*.test.tsx` - Test files
- `*.cy.tsx` - Cypress files
- `main.tsx` - Entry point
- `__mocks__/` - Mock files

---

## ✅ Best Practices

### **1. Test Behavior, Not Implementation**

```typescript
// ❌ Bad - tests implementation details
test('sets state.count to 1', () => {
  // Testing internal state
});

// ✅ Good - tests user-visible behavior
test('displays count of 1 after clicking button', () => {
  render(<Counter />);
  fireEvent.click(screen.getByTestId('increment-button'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### **2. Use Semantic Queries**

Prefer queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Form inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

```typescript
// ✅ Best - uses role (accessible)
const button = screen.getByRole('button', { name: /submit/i });

// ✅ Good - uses label (form elements)
const input = screen.getByLabelText('Email');

// ⚠️ OK - uses test ID (when necessary)
const custom = screen.getByTestId('custom-widget');
```

### **3. Keep Tests Simple**

One assertion per test when possible:

```typescript
// ✅ Good - focused test
test('renders heading', () => {
  render(<App />);
  expect(screen.getByText('Todo App')).toBeInTheDocument();
});

test('increments counter on click', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### **4. Clean Up After Tests**

Jest automatically cleans up, but if you use timers or subscriptions:

```typescript
afterEach(() => {
  jest.clearAllTimers();
  // Clean up subscriptions, etc.
});
```

---

## 🔧 Mocking

### **Mock Functions**

```typescript
test('calls onSubmit with todo text', () => {
  const mockSubmit = jest.fn();
  render(<TodoForm onSubmit={mockSubmit} />);
  
  fireEvent.change(screen.getByRole('textbox'), { 
    target: { value: 'New todo' } 
  });
  fireEvent.submit(screen.getByRole('form'));
  
  expect(mockSubmit).toHaveBeenCalledWith('New todo');
});
```

### **Mock localStorage**

```typescript
import { mockLocalStorage } from '../../test-utils'; // Adjust path as needed

beforeEach(() => {
  mockLocalStorage();
});

test('saves todos to localStorage', () => {
  // localStorage is now mocked and can be tested
});
```

### **Mock Modules**

```typescript
// At top of test file
jest.mock('./api', () => ({
  fetchTodos: jest.fn(() => Promise.resolve([]))
}));
```

---

## 🐛 Debugging Tests

### **Debug Output**

```typescript
import { screen, render } from '../../test-utils'; // Adjust path as needed

test('debugging example', () => {
  const { debug } = render(<App />);
  
  // Print entire DOM
  debug();
  
  // Print specific element
  debug(screen.getByTestId('todo-list'));
});
```

### **Queries Not Working?**

```typescript
// See all available text content
screen.debug();

// See what roles are available
screen.logTestingPlaygroundURL();
```

---

## 📚 Additional Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎓 Example Test Template

Use this template for new component tests:

```typescript
// Adjust import path based on file location
import { render, screen, fireEvent } from '../../test-utils'; // Example for nested component
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  describe('Rendering', () => {
    test('renders component', () => {
      render(<ComponentName />);
      expect(screen.getByTestId('component-name')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('handles user interaction', () => {
      render(<ComponentName />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      // Assert expected behavior
    });
  });

  describe('Edge Cases', () => {
    test('handles empty state', () => {
      render(<ComponentName items={[]} />);
      expect(screen.getByText('No items')).toBeInTheDocument();
    });
  });
});
```

---

**Remember**: Tests are documentation! Write clear, descriptive test names that explain what the component should do.
