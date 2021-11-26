/// <reference types="cypress" />
describe('Login page', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/account/sign-in')
    cy.wait(500)
    cy.get('#login_username').type(Cypress.env('adminusername')).should('have.value', Cypress.env('adminusername'));
    cy.get('#login_password').type(Cypress.env('adminpassword')).should('have.value', Cypress.env('adminpassword'));
    cy.get('#log_in').click()
    cy.wait(2000)
  })

  it('test logout.', () => {
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('#clr-id-22').click()
    cy.wait(500)
    cy.get('#log_in').should('exist')
  })
})
