/// <reference types="cypress" />
describe('Replication page', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/account/sign-in')
    cy.wait(500)
    cy.get('#login_username').type(Cypress.env('adminusername')).should('have.value', Cypress.env('adminusername'));
    cy.get('#login_password').type(Cypress.env('adminpassword')).should('have.value', Cypress.env('adminpassword'));
    cy.get('#log_in').click()
    cy.wait(2000)
  })

  it('Include a new replications', () => {
    cy.get('a[href*="harbor/replications"]').click()
    cy.wait(500)
    cy.get('#new_replication_rule_id').click()
    cy.wait(500)
    cy.get("[id=pull_base]").first().click({force:true})
    cy.get('#src_registry_id').select('dockerhub-https://hub.docker.com')
    cy.get('#ruleName').type('replication-example').should('have.value','replication-example')
    cy.get('#filter_name').type('bitnami/minideb').should('have.value','bitnami/minideb')
    cy.get('#filter_tag').type('buster').should('have.value','buster')
    cy.get('#dest_namespace').type('destination-test').should('have.value','destination-test')
    cy.wait(500)
    cy.get('.btn.btn-primary').click()
    cy.wait(500)
    cy.get('.alert.alert-success').should('exist')
    cy.wait(500)
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('.dropdown-item').contains('Log Out').click()
  })

  it('Visit new replications page', () => {
    cy.get('a[href*="harbor/replications"]').click()
    cy.wait(500)
    cy.contains('replication-example').should('exist')
    cy.wait(500)
    cy.get('.nav-text.dropdown-toggle').click()
    cy.wait(500)
    cy.get('.dropdown-item').contains('Log Out').click()
    cy.wait(500)
  })

  it('Apply new replication', () => {
    cy.get('a[href*="harbor/replications"]').click()
    cy.wait(500)
    cy.get('[type="radio"]').first().click({force:true})
    cy.wait(500)
    cy.get('#replication_exe_id').click()
    cy.wait(500)
    cy.get('[type="button"]').contains("REPLICATE").click({force:true})
    cy.contains("Succeeded", { timeout: 60000 }).should("exist");
  })
})
