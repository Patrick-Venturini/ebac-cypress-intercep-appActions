/// <reference types="cypress" />

describe('Login no hub de leitura', () => {

    beforeEach(() => {
        cy.visit('login.html')
    });

    it('Deve fazer login com sucesso com usuário comum - sem app actions', () => {
        cy.login('usuario@teste.com', 'user123')
        cy.get('h4').should('contain', 'Olá')

    })

    it('Deve fazer login com sucesso com usuário comum - via api', () => {
        cy.request({
            method: 'POST',
            url: 'api/login',
            body: {
                "email": "usuario@teste.com",
                "password": "user123"
            }
        }).then((response) => {
            expect(response.status).to.equal(200)

            //Criar o estado da aplicação
            window.localStorage.setItem('authToken', response.body.token)
            window.localStorage.setItem('isAdmin', false)
            window.localStorage.setItem('userId', response.body.id)
            window.localStorage.setItem('userName', response.body.name)

            cy.visit('dashboard.html')
            cy.get('h4').should('contain', 'Olá')
        })

    })

    it('Deve fazer login com sucesso com usuário comum - setando o token', () => {
        let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3ODMzNzg4ODcsImV4cCI6MTc4MzQwNzY4N30.QJtZ7gQLJinKJH6gU7GZXxmtVUBej_Z3WmKvMKQyyBY"
        window.localStorage.setItem('authToken', token)

        cy.visit('dashboard.html')
        cy.get('h4').should('contain', 'Olá')
    })

    it('Deve fazer login com sucesso com usuário admin', () => {
        cy.setCookie('jwt_education_shown', 'true')

        cy.login('admin@biblioteca.com', 'admin123')
        cy.get('h1').should('contain', 'Painel Administrativo')

        // cy.wait(10000)
        // cy.clearCookie('jwt_education_shown')
        // cy.reload()
    })

    it.skip('Deve mudar o idioma do site da EBAC via cookie', () => {
        cy.visit('https://lms.ebaconline.com.br/')
        cy.setCookie('i18n_redirected', 'en')
        cy.reload()
    })
})