/// <reference types="cypress" />
describe('Registry page', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/account/sign-in')
    cy.wait(500)
    cy.get('#login_username').type(Cypress.env('adminusername')).should('have.value', Cypress.env('adminusername'));
    cy.get('#login_password').type(Cypress.env('adminpassword')).should('have.value', Cypress.env('adminpassword'));
    cy.get('#log_in').click()
    cy.wait(2000)
  })

  it('Include a new registry', () => {
    cy.get('a[href*="harbor/registries"]').click()
    cy.wait(500)
    cy.get('#add.btn.btn-secondary').click()
    cy.wait(500)
    cy.get('#destination_name').type('dockerhub').should('have.value','dockerhub')
    cy.get('#destination_url').type('https://hub.docker.com/').should('have.value','https://hub.docker.com/')
    cy.get('#adapter').select('Docker Hub')
    cy.wait(500)
    cy.get('.btn.btn-primary').click()
    cy.wait(500)
    cy.get('.alert.alert-success').should('exist')
    cy.wait(500)
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('.dropdown-item').contains('Log Out').click()
  })

  it('Visit new registry page', () => {
    cy.get('a[href*="harbor/registries"]').click()
    cy.wait(500)
    cy.get('.flex-min-width.datagrid-cell.ng-star-inserted').contains('dockerhub').should('exist')
    cy.wait(500)
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('.dropdown-item').contains('Log Out').click()
    cy.wait(500)
  })
})
