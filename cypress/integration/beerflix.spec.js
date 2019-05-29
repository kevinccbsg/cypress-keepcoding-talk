
describe('Beerflix e2e tests', () => {
  it('Visit website', () => {
    cy.visit('/');
    cy.url().should('include', 'app');
  });
});
