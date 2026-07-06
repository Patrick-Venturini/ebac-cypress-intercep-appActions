describe('Funcionalidade: Administrar Reservas de livros', () => {

    beforeEach(() => {
        cy.loginApp('usuario@teste.com', 'user123')
        cy.loginToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3ODMzNzg4ODcsImV4cCI6MTc4MzQwNzY4N30.QJtZ7gQLJinKJH6gU7GZXxmtVUBej_Z3WmKvMKQyyBY")
    })

    it.only('Deve exibir as reservas via intercept', () => {
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