import React from 'react';
import App from './App';

describe('<App />', () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  describe('Rendering', () => {
    it('renders the main heading', () => {
      cy.getByTestId('main-heading')
        .should('exist')
        .and('contain.text', 'Vite + React');
    });

    it('renders Vite and React logos', () => {
      cy.getByTestId('vite-logo').should('exist');
      cy.getByTestId('react-logo').should('exist');
    });

    it('renders Tailwind demo section', () => {
      cy.getByTestId('tailwind-demo')
        .should('exist')
        .and('contain.text', 'Hello Tailwind + React!');
    });
  });

  describe('Interactions', () => {
    it('increments counter on button click', () => {
      cy.getByTestId('counter-button')
        .should('contain.text', 'count is 0')
        .click()
        .should('contain.text', 'count is 1')
        .click()
        .should('contain.text', 'count is 2');
    });
  });

  describe('Links', () => {
    it('has correct link attributes', () => {
      cy.getByTestId('vite-link')
        .should('have.attr', 'href', 'https://vite.dev')
        .and('have.attr', 'target', '_blank');

      cy.getByTestId('react-link')
        .should('have.attr', 'href', 'https://react.dev')
        .and('have.attr', 'target', '_blank');
    });
  });
});

// Cypress custom command for getByTestId
declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});
