/// <reference types="cypress" />

describe('Minimal App Load and Element Check', () => {

  it('should successfully load the page and find the main content', () => {
    // Navigate to your application's URL
    // *** IMPORTANT: Change the URL below to the actual address of your running app ***
    cy.visit('http://localhost:5173/');

    // Assertion 1: Check the URL path
    cy.url().should('include', '/');

    // Assertion 2: Check for a critical element (e.g., the main <h1> heading)
    // Replace 'h1' with a more specific selector if needed (e.g., 'header > h1' or a data-testid)
    cy.get('h1').should('exist').and('be.visible').and('not.be.empty');
  });

});