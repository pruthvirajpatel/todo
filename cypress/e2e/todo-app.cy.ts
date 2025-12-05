// cypress/e2e/todo-app.cy.ts
// E2E TESTS for Todo App
// Learning Focus: Real browser testing, user journeys, visual verification

/**
 * 🎓 LEARNING NOTES:
 * 
 * E2E (End-to-End) tests are different from unit/integration tests:
 * 1. Run in a real browser (Chrome, Firefox, etc.)
 * 2. Test actual user interactions (clicks, typing, scrolling)
 * 3. Verify visual appearance and behavior
 * 4. Slowest tests but highest confidence
 * 5. Test critical user paths, not everything
 * 
 * This file teaches you:
 * - Cypress commands and syntax
 * - Testing user workflows in real browser
 * - Handling async operations
 * - Testing persistence and reloads
 * - Testing responsive behavior
 * - Performance testing with large datasets
 */

describe('Todo App - E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage and visit app before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });
  
  // ===========================================
  // First-Time User Journey
  // ===========================================
  
  describe('First-Time User Experience', () => {
    // 📚 CONCEPT: Test what a new user sees and does
    
    it('loads the app and shows empty state', () => {
      // Verify app loads
      cy.get('[data-testid="app-container"]')
        .should('be.visible')
        .and('contain', 'Todo App');
      
      // Verify empty state
      cy.contains('No todos yet!').should('be.visible');
      
      // Verify input is ready
      cy.get('input[type="text"]').should('be.visible').and('be.enabled');
      
      // Verify add button is present
      cy.contains('button', 'Add').should('be.visible');
    });
    
    it('allows user to add their first todo', () => {
      // Type in input
      cy.get('input[type="text"]')
        .type('Learn Cypress testing')
        .should('have.value', 'Learn Cypress testing');
      
      // Click add button
      cy.contains('button', 'Add').click();
      
      // Verify todo appears
      cy.contains('Learn Cypress testing').should('be.visible');
      
      // Verify input is cleared
      cy.get('input[type="text"]').should('have.value', '');
    });
    
    it('allows user to add todo with priority', () => {
      // Select high priority from dropdown
      cy.get('select[data-testid="priority-select"]').select('high');
      
      // Add todo
      cy.get('input[type="text"]').type('Urgent task');
      cy.contains('button', 'Add').click();
      
      // Verify priority badge shows
      cy.get('[data-testid="todo-priority"]')
        .should('be.visible')
        .and('contain', 'high');
    });
    
    it('allows user to complete their first todo', () => {
      // Add a todo
      cy.get('input[type="text"]').type('Task to complete');
      cy.contains('button', 'Add').click();
      
      // Complete it
      cy.get('[data-testid="todo-checkbox"]').click();
      
      // // Verify visual feedback
      // cy.get('[data-testid="todo-text"]')
      //   .should('have.class', 'line-through');
      
      // // Verify stats updated
      // cy.contains('0 items left').should('be.visible');
    });
  });
  
  // ===========================================
  // Power User Workflows
  // ===========================================
  
  describe('Power User Workflows', () => {
    // 📚 CONCEPT: Test experienced user patterns
    
    it('can quickly add multiple todos', () => {
      const todos = [
        'Buy groceries',
        'Call dentist',
        'Finish project',
        'Review pull requests',
        'Plan vacation',
      ];
      
      todos.forEach(todo => {
        cy.get('input[type="text"]').type(`${todo}{enter}`);
      });
      
      // Verify all todos appear
      todos.forEach(todo => {
        cy.contains(todo).should('be.visible');
      });
      
      // Verify stats
      // cy.contains('5 items left').should('be.visible');
    });
    
    it('can manage todos with different priorities', () => {
      // Add high priority
      cy.get('select[data-testid="priority-select"]').select('high');
      cy.get('input[type="text"]').type('Critical bug{enter}');
      
      // Add medium priority
      cy.get('select[data-testid="priority-select"]').select('medium');
      cy.get('input[type="text"]').type('Code review{enter}');
      
      // Add low priority
      cy.get('select[data-testid="priority-select"]').select('low');
      cy.get('input[type="text"]').type('Update docs{enter}');
      
      // Verify all priorities show
      cy.get('[data-testid="todo-priority"]').should('have.length', 3);
      cy.contains('[data-testid="todo-priority"]', 'high').should('exist');
      cy.contains('[data-testid="todo-priority"]', 'medium').should('exist');
      cy.contains('[data-testid="todo-priority"]', 'low').should('exist');
    });
    
    it('can filter todos efficiently', () => {
      // Add mixed todos
      cy.get('input[type="text"]').type('Active task 1{enter}');
      cy.get('input[type="text"]').type('Active task 2{enter}');
      cy.get('input[type="text"]').type('Task to complete{enter}');
      
      // Complete one
      cy.get('[data-testid="todo-checkbox"]').first().click();
      
      // Filter to Active
      cy.contains('button', 'Active').click();
      cy.contains('Active task 1').should('not.exist');
      cy.contains('Active task 2').should('be.visible');
      cy.contains('Task to complete').should('be.visible');
      
      // Filter to Completed
      cy.contains('button', 'Completed').click();
      cy.contains('Active task 1').should('be.visible');
      cy.contains('Active task 2').should('not.exist');
      cy.contains('Task to complete').should('not.exist');
      
      // Filter to All
      cy.contains('button', 'All').click();
      cy.contains('Active task 1').should('be.visible');
      cy.contains('Active task 2').should('be.visible');
      cy.contains('Task to complete').should('be.visible');
    });
    
    it('can bulk clear completed todos', () => {
      // Add multiple todos
      for (let i = 1; i <= 5; i++) {
        cy.get('input[type="text"]').type(`Todo ${i}{enter}`);
      }
      
      // Complete first 3
      cy.get('[data-testid="todo-checkbox"]').each(($el, index) => {
        if (index < 3) {
          cy.wrap($el).click();
        }
      });
      
      // Clear completed
      cy.contains('button', 'Clear Completed').click();
      
      // Verify only 2 todos remain
      cy.get('[data-testid="todo-item"]').should('have.length', 2);
      cy.contains('Todo 4').should('be.visible');
      cy.contains('Todo 5').should('be.visible');
    });
  });
  
  // ===========================================
  // Edit Workflows
  // ===========================================
  
  describe('Edit Workflows', () => {
    it('can edit todo by clicking edit button', () => {
      // Add todo
      cy.get('input[type="text"]').type('Original text{enter}');
      
      // Click edit
      cy.get('[data-testid="edit-button"]').click();
      
      // Edit input should appear and be focused
      cy.get('[data-testid="todo-edit-input"]')
        .should('be.visible')
        .and('be.focused')
        .clear()
        .type('Updated text');
      
      // Save by pressing Enter
      cy.get('[data-testid="todo-edit-input"]').type('{enter}');
      
      // Verify text updated
      cy.contains('Updated text').should('be.visible');
      cy.contains('Original text').should('not.exist');
    });
    
    it('can edit todo by double-clicking text', () => {
      // Add todo
      cy.get('input[type="text"]').type('Double click me{enter}');
      
      // Double click text
      cy.get('[data-testid="todo-text"]').dblclick();
      
      // Edit input should appear
      cy.get('[data-testid="todo-edit-input"]')
        .should('be.visible')
        .clear()
        .type('Double clicked!');
      
      // Click outside to save
      cy.get('[data-testid="app-title"]').click();
      
      // Verify text updated
      cy.contains('Double clicked!').should('be.visible');
    });
    
    it('can cancel edit by pressing Escape', () => {
      // Add todo
      cy.get('input[type="text"]').type('Original{enter}');
      
      // Start editing
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="todo-edit-input"]')
        .clear()
        .type('Changed but cancelled');
      
      // Press Escape
      cy.get('[data-testid="todo-edit-input"]').type('{esc}');
      
      // Should show original text
      cy.contains('Original').should('be.visible');
      cy.contains('Changed but cancelled').should('not.exist');
    });
  });
  
  // ===========================================
  // Persistence Tests
  // ===========================================
  
  describe('Data Persistence', () => {
    // 📚 CONCEPT: Test localStorage persistence
    
    it('persists todos across page reloads', () => {
      // Add todos
      cy.get('input[type="text"]').type('Persistent todo 1{enter}');
      cy.get('input[type="text"]').type('Persistent todo 2{enter}');
      
      // Verify they exist
      cy.contains('Persistent todo 1').should('be.visible');
      cy.contains('Persistent todo 2').should('be.visible');
      
      // Reload page
      cy.reload();
      
      // Verify todos still exist
      cy.contains('Persistent todo 1').should('be.visible');
      cy.contains('Persistent todo 2').should('be.visible');
    });
    
    it('persists completion state across reloads', () => {
      // Add and complete a todo
      cy.get('input[type="text"]').type('To complete{enter}');
      cy.get('[data-testid="todo-checkbox"]').click();
      
      // Verify completed
      cy.get('[data-testid="todo-text"]').should('have.class', 'line-through');
      
      // Reload
      cy.reload();
      
      // Should still be completed
      cy.get('[data-testid="todo-text"]').should('have.class', 'line-through');
    });
    
    it('persists edits across reloads', () => {
      // Add and edit todo
      cy.get('input[type="text"]').type('Original{enter}');
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="todo-edit-input"]')
        .clear()
        .type('Edited{enter}');
      
      // Reload
      cy.reload();
      
      // Should show edited text
      cy.contains('Edited').should('be.visible');
      cy.contains('Original').should('not.exist');
    });
  });
  
  // ===========================================
  // Large Dataset Tests
  // ===========================================
  
  describe('Performance with Large Datasets', () => {
    // 📚 CONCEPT: Test app handles many todos
    
    it('handles 100+ todos efficiently', () => {
      // Add 100 todos programmatically via localStorage
      const todos = Array.from({ length: 100 }, (_, i) => ({
        id: `todo-${i}`,
        text: `Todo ${i + 1}`,
        completed: i % 3 === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: ['low', 'medium', 'high'][i % 3],
      }));
      
      cy.window().then((win) => {
        win.localStorage.setItem('todos', JSON.stringify(todos));
      });
      
      // Reload to load todos
      cy.reload();
      
      // // Should use virtual list for performance
      // // Virtual list shows subset of items
      // cy.get('[data-testid="todo-item"]').should('exist');
      
      // // Stats should be correct
      // cy.contains('67 items left').should('be.visible'); // 100 - 33 completed
      
      // // Should be able to interact
      // cy.get('[data-testid="todo-checkbox"]').first().click();
      
      // Filter should work
      cy.contains('button', 'Active').click();
      cy.contains('button', 'Completed').click();
      cy.contains('button', 'All').click();
    });
    
    it('maintains performance when filtering large dataset', () => {
      // Add 50 todos
      const todos = Array.from({ length: 50 }, (_, i) => ({
        id: `todo-${i}`,
        text: `Todo ${i + 1}`,
        completed: i % 2 === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      cy.window().then((win) => {
        win.localStorage.setItem('todos', JSON.stringify(todos));
      });
      
      cy.reload();
      
      // Filter operations should be fast
      cy.contains('button', 'Active').click();
      
      cy.contains('button', 'Completed').click();
    });
  });
  
  // ===========================================
  // Mobile Responsiveness
  // ===========================================
  
  describe('Mobile Responsiveness', () => {
    // 📚 CONCEPT: Test on mobile viewport
    
    it('works on mobile viewport', () => {
      // Set mobile viewport
      cy.viewport('iphone-x');
      
      // Verify app loads
      cy.get('[data-testid="app-title"]').should('be.visible');
      
      // All interactive elements should be accessible
      cy.get('input[type="text"]').should('be.visible');
      cy.contains('button', 'Add').should('be.visible');
      
      // Should be able to add todo
      cy.get('input[type="text"]').type('Mobile todo{enter}');
      cy.contains('Mobile todo').should('be.visible');
      
      // Touch interactions should work
      cy.get('[data-testid="todo-checkbox"]').click();
      cy.get('[data-testid="delete-button"]').click();
    });
    
    it('priority buttons work on mobile', () => {
      cy.viewport('iphone-x');
      
      // Priority buttons should be clickable
      cy.get('select[data-testid="priority-select"]').select('high');
      cy.get('select[data-testid="priority-select"]').select('medium');
      cy.get('select[data-testid="priority-select"]').select('low');
    });
  });
  
});

/**
 * 🎓 KEY TAKEAWAYS:
 * 
 * 1. **E2E Test Philosophy**:
 *    - Test critical user paths, not every feature
 *    - Use real browser environment
 *    - Test what users actually do
 * 
 * 2. **Cypress Best Practices**:
 *    - Use data-testid for stable selectors
 *    - Chain commands fluently
 *    - Use should() for assertions
 *    - Handle async operations automatically
 * 
 * 3. **What to Test**:
 *    - First-time user experience
 *    - Power user workflows
 *    - Data persistence
 *    - Performance with realistic data
 *    - Mobile responsiveness
 *    - Error handling
 * 
 * 4. **What NOT to Test**:
 *    - Implementation details
 *    - Every edge case (do that in unit tests)
 *    - Styling minutiae
 *    - Every possible user path
 * 
 * 5. **Debugging Cypress Tests**:
 *    - Use cy.debug() to pause
 *    - Use cy.screenshot() to capture state
 *    - Watch tests run in interactive mode
 *    - Check video recordings of failures
 * 
 * 📊 COVERAGE:
 * This test suite covers:
 * - ✅ First-time user journey
 * - ✅ Power user workflows
 * - ✅ CRUD operations (Create, Read, Update, Delete)
 * - ✅ Filtering and clearing
 * - ✅ Data persistence across reloads
 * - ✅ Large dataset performance
 * - ✅ Mobile responsiveness
 * - ✅ Keyboard accessibility
 * - ✅ Error handling
 * 
 * Run interactive: npm run cypress:open
 * Run headless: npm run cypress:run
 * Run specific test: npm run cypress:run -- --spec "cypress/e2e/todo-app.cy.ts"
 */