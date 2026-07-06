/// <reference types="cypress" />

describe('Simulações de testes com intercept', () => {

    beforeEach(() => {
        cy.visit('login.html')
    });

    it('Deve fazer login com sucesso com usuário comum', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 200,
            body: {
                token: 'token123',
                name: 'Usuário de teste'
            }
        }).as('loginMock')

        cy.login('usuario@teste.com', 'user123')
        cy.wait('@loginMock')
        cy.get('h4').should('contain', 'Olá')

    })

    it('Deve simluar um erro de servidor', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 500
        }).as('erroServer')

        cy.login('usuario@teste.com', 'user123')
        cy.wait('@erroServer')
        cy.get('#alert-container').should('contain', 'Erro de conexão. Tente novamente.')
    })

    it.only('Deve simluar um erro do cliente', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 400, body: {
                erro: 'erro do cliente'
            }
        }).as('erroClient')

        cy.login('usuario@teste.com', 'user123')
        cy.wait('@erroClient')
        cy.get('#alert-container').should('contain', 'Erro ao fazer login')
    })

    it('Deve fazer login com sucesso com usuário admin', () => {
        cy.login('admin@biblioteca.com', 'admin123')
        cy.get('h1').should('contain', 'Painel Administrativo')
    })
})