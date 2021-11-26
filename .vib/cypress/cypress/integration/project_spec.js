/// <reference types="cypress" />
describe('Project page', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/account/sign-in')
    cy.wait(500)
    cy.get('#login_username').type(Cypress.env('adminusername')).should('have.value', Cypress.env('adminusername'));
    cy.get('#login_password').type(Cypress.env('adminpassword')).should('have.value', Cypress.env('adminpassword'));
    cy.get('#log_in').click()
    cy.wait(2000)
  })

  it('Include a new project', () => {
    cy.get('a[href*="harbor/projects"]').click()
    cy.wait(500)
    cy.get('.btn.btn-secondary.ng-star-inserted').click()
    cy.wait(500)
    cy.get('#create_project_name').type('testproject').should('have.value','testproject')
    cy.wait(500)
    cy.get('#new-project-ok').click()
    cy.wait(500)
    cy.get('.alert.alert-success').should('exist')
    cy.wait(500)
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('.dropdown-item').contains('Log Out').click()
  })

  it('Visit new project page', () => {
    cy.get('a[href*="harbor/projects"]').click()
    cy.wait(500)
    cy.contains('testproject').click()
    cy.wait(500)
    cy.get('.ml-05.project-name').contains('testproject').should('exist')
    cy.wait(500)
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('.dropdown-item').contains('Log Out').click()
    cy.wait(500)
  })
})
