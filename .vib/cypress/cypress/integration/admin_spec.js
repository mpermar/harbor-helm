/// <reference types="cypress" />
describe('Admin page', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/account/sign-in')
    cy.wait(500)
  })

  it('allows login to a valid user.', () => {
    cy.get('#login_username').type(Cypress.env('adminusername')).should('have.value', Cypress.env('adminusername'));
    cy.get('#login_password').type(Cypress.env('adminpassword')).should('have.value', Cypress.env('adminpassword'));
    cy.get('#log_in').click()
    cy.wait(2000)
    cy.get('div').should('not.have.class', 'error active ng-star-inserted')
  })

  it('login with a invalid user.', () => {
    cy.get('#login_username').type(Cypress.env('username')).should('have.value', Cypress.env('username'));
    cy.get('#login_password').type(Cypress.env('password')).should('have.value', Cypress.env('password'));
    cy.get('#log_in').click()
    cy.wait(2000)
    cy.get('div').should('have.class', 'error active ng-star-inserted')
  })
})
