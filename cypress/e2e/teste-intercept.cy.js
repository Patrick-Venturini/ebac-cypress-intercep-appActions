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

    it('Deve simluar um erro do cliente', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 400, body: {
                erro: 'erro do cliente'
            }
        }).as('erroClient')

        cy.login('usuario@teste.com', 'user123')
        cy.wait('@erroClient')
        cy.get('#alert-container').should('contain', 'Erro ao fazer login')
    })

    const reservas = {
        "reservations": [
            {
                "id": 3,
                "status": "active",
                "reservation_date": "2026-07-02 02:18:38",
                "pickup_deadline": "2026-07-04T02:18:38.243Z",
                "pickup_date": null,
                "return_deadline": null,
                "return_date": null,
                "notes": "",
                "renewal_count": 0,
                "title": "Olá mundo",
                "author": "Patrick Venturini",
                "category": "Ação",
                "cover_image": "hh-pedra-filosofal.jpg",
                "isbn": "978-85-AUTO-0010-3",
                "editor": "Editora Rocco",
                "language": "Português",
                "calculated_status": "expired",
                "hours_remaining": -67
            }
        ],
        "statistics": {
            "active": 0,
            "pickedUp": 0,
            "returned": 0,
            "cancelled": 0,
            "overdue": 0,
            "expired": 1
        },
        "pagination": {
            "total": 1,
            "limit": 20,
            "offset": 0,
            "hasNext": false,
            "hasPrev": false,
            "showing": 1
        },
        "filters": {
            "status": "all",
            "orderBy": "desc"
        }
    }

    it.only('Deve exibir as reservas via intercept', () => {
        cy.login('usuario@teste.com', 'user123')
        cy.get('h4').should('contain', 'Olá')

        cy.intercept('GET', 'api/reservations', {
            statusCode: 200,
            body: reservas
        }).as('listarReservas')

        cy.visit('dashboard.html')
        cy.wait('@listarReservas')
    })

    it('Deve fazer login com sucesso com usuário admin', () => {
        cy.login('admin@biblioteca.com', 'admin123')
        cy.get('h1').should('contain', 'Painel Administrativo')
    })
})