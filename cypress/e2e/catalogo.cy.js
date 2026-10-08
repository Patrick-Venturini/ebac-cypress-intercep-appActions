describe('Funcionalidade: Catalogo de Livros', () => {
    beforeEach(() => {
        cy.loginApp(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
        cy.setCookie('jwt_education_shown', 'true')
    })

    it('Deve exibir livros cadastrados via intercept - Cenário positivo', () => {
        cy.fixture('books').then((dadosBooks) => {
            cy.intercept('GET', 'api/books?page=1&limit=12', {
                statusCode: 200,
                body: dadosBooks
            }).as('exibirLivros')

            cy.visit('catalog.html')
            cy.wait('@exibirLivros')

        })
    })

    //Nesse teste foi identificado um BUG na aplicação onde ao tentar salvar um registro já existente
    //é esperado que seja exibida uma mensagem de erro na UI, porém esta sendo exibida uma mensagem
    //de sucesso.
    it('Deve tentar cadastrar um livro já existente como admin - Cenário negativo + app actions', () => {
        cy.fixture('books').then((dadosBooks) => {
            cy.intercept('POST', 'api/books', {
                statusCode: 400,
                body: {
                    message: 'Já existe um livro com este título e autor.'
                }
            }).as('errorPost')

            cy.visit('admin-books.html')
            cy.adicionarLivro(dadosBooks.books[0].title, dadosBooks.books[0].author, dadosBooks.books[0].category)
            cy.wait('@errorPost')
            cy.get('#alert-container').should('contain', 'Já existe um livro com este título e autor.')
        })
    })

})