// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('login', ({ user = '', fakePWD = '' } = {}) => {
  if (!user && !fakePWD) {
    // API login
    cy
      .request('POST', Cypress.env('apiURL'), {
        email: Cypress.env('testUser'),
      })
      .then(({ body }) => {
        const { user } = body;
        cy.setCookie('token', user.apiKey);
        cy.visit('/home');
      })
  } else {
    // end to end login
    cy.get('[data-cy=email-input]').type(user);
    cy.get('[data-cy=password-input]').type(`${fakePWD}{enter}`, { log: false });
  }
});


Cypress.Commands.add('cleanBeerLike', () => {
  cy.getCookie('token')
  .then(cookie => {
    cy.request({
      method: 'DELETE',
      url: Cypress.env('resetLikeURL'),
      headers: {
        'X-API-KEY': cookie.value,
      },
    });
  });
});
