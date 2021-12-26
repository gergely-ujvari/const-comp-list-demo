/// <reference types="cypress" />

describe('Company list', () => {
    it('The default list appears', () => {
        cy.visit('/');
        cy.contains('TestCo Inc.').should('be.visible');
    });

    it('Searching for company name works', () => {
        cy.visit('/');
        cy.get('.ant-input').type('Exampl{enter}');
        cy.contains('Example Co.').should('be.visible');
    });

    it('Can search for name segment', () => {
        cy.visit('/');
        cy.get('.ant-input').type('ample{enter}');
        cy.contains('Example Co.').should('be.visible');
    });

    it('Speciality filter', () => {
        cy.visit('/');
        cy.get(':nth-child(10) > .ant-checkbox > .ant-checkbox-input').click();
        cy.get(':nth-child(3) > .ant-checkbox > .ant-checkbox-input').click();
        cy.get(':nth-child(13) > .ant-checkbox > .ant-checkbox-input').click();
        cy.get(':nth-child(7) > .ant-checkbox > .ant-checkbox-input').click();
        cy.contains('TestCo Inc.').should('be.visible');
        cy.get('[data-row-key="1"] > :nth-child(4) > :nth-child(1)').should('have.css', 'background-color', 'rgb(139, 0, 0)');
    });

    it('Combined search', () => {
        cy.visit('/');
        cy.get('.ant-input').type('estCo{enter}');
        cy.get(':nth-child(10) > .ant-checkbox > .ant-checkbox-input').click();
        cy.get(':nth-child(3) > .ant-checkbox > .ant-checkbox-input').click();
        cy.contains('TestCo Inc.').should('be.visible');
        cy.get('[data-row-key="1"] > :nth-child(4) > :nth-child(1)').should('have.css', 'background-color', 'rgb(139, 0, 0)');
    });
});
