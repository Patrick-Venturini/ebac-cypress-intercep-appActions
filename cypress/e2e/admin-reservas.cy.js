describe('Funcionalidade: Administrar Reservas de livros', () => {

    beforeEach(() => {
        cy.loginApp(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
        //cy.loginToken(Cypress.env('TOKEN_COMUM'))
    })

    it('Deve exibir as reservas via intercept', () => {
        cy.fixture('reservas').then((dadosReservas) => {
            cy.intercept('GET', 'api/reservations', {
                statusCode: 200,
                body: dadosReservas
            }).as('listarReservas')

            cy.visit('dashboard.html')
            cy.wait('@listarReservas')
        })

    })
})