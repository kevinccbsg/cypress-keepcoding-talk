
describe('Beerflix e2e tests', () => {
  beforeEach(() => {
    cy.fixture('login.json').as('loginData');
    cy.visit('/');
  });

  it('Visit website', () => {
    cy.url().should('include', 'app');
  });

  it('Check that renders icon and form fields', () => {
    cy.get('[data-cy=login-image]')
      .should('have.attr', 'src')
      .should('include','emoji-beer');
    cy.get('[data-cy=email-input]');
    cy.get('[data-cy=password-input]');
    cy.get('[data-cy=login-button]');
  });

  it('Complete Login form', () => {
    cy.server();
    cy.route('POST', '/api/v1/user/login').as('loginRequest');
    cy.get('@loginData').then(({ user, fakePWD }) => {
      cy.screenshot('default-form-validation', {
        capture: 'runner',
      });
      cy.get('[data-cy=email-input]').type(user);
      cy.get('[data-cy=password-input]').type(`${fakePWD}{enter}`, { log: false });
      cy.wait('@loginRequest');
      cy.url().should('include', '/home');
    });
  });

  it('should show the loading component before getting the error', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/api/v1/user/login',
      status: 404,
      delay: 3000,
      response: 'fixture:loginErrorResponse',
    }).as('loginRequest');
    cy.get('@loginData').then((loginData) => {
      cy.login(loginData);
      cy.screenshot('error-on-login', {
        blackout: ['form'],
        capture: 'viewport',
      });
      cy.get('[data-cy=login-error]');
      cy.wait('@loginRequest');
      cy.get('[data-cy=login-error]').should('be.visible');
    });
  });

  it('Get beers 10', () => {
    cy.server();
    cy.route('GET', '/api/v1/beers**').as('beerRequest');
    cy.login();
    cy.url().should('include', '/home');
    cy.wait('@beerRequest');
    cy.get('[data-cy=beer-item]').should('have.length', 10);
  });

  it('should add one like to the first beer', () => {
    cy.server();
    cy.route('POST', '/api/v1/beers/*/like').as('likeRequest');
    cy.route('GET', '/api/v1/beers**').as('beerRequest');
    cy.login();
    cy.get('[data-cy=search-input]').type('pilsen{enter}');
    cy.get('[data-cy=beer-item]').first().should('have.id', '4');
    cy.get('[data-cy=beer-button]').first().as('firstLikeButton');
    cy.get('@firstLikeButton').contains(0);
    cy.get('@firstLikeButton').click();
    cy.wait('@likeRequest');
    cy.get('@firstLikeButton').contains(1);
    cy.cleanBeerLike();
  });
});
