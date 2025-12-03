import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

/**
 * Custom render function that wraps components with common providers
 * Useful when you add Context providers, Router, etc. in the future
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add custom options here as needed
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  // For now, just pass through to RTL render
  // When you add Context providers, wrap ui here
  return render(ui, options);
}

// Re-export everything from RTL
export * from '@testing-library/react';

// Override render with custom version
export { customRender as render };

/**
 * Common test utilities
 */

/**
 * Wait for async updates to complete
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Get element by test ID (type-safe helper)
 */
export const getByTestId = (container: HTMLElement, testId: string) => {
  const element = container.querySelector(`[data-testid="${testId}"]`);
  if (!element) {
    throw new Error(`Element with data-testid="${testId}" not found`);
  }
  return element;
};

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  let store: Record<string, string> = {};

  const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};
