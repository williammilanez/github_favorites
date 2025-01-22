export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

    // forma desestruturada
        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))

    // forma estruturada
        // return fetch(endpoint)
        // .then(data => data.json())
        // .then(data => ({
        //     login: data.login,
        //     name: data.name,
        //     public_repos: data.public_repos,
        //     followers: data.followers
        // }))
    }
}

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    // função para carregamento dos dados
    load() {
        // os dados serão uma array contendo um objeto
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    // deletar
    delete(user) {
        // Higher-order functions (map, filter, find, reduce)
        // filter, serve para filtrar
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
    }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
    }

    // atualiza os usuários
    update() {
        this.removeAllTr()
        
        // mapeamento, objetos que preciso
        this.entries.forEach( user => {
            const row = this.createRow() // isso retorna uma 'tr'

            // serve para mudar o usuário
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza de que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row) //append = funcionalidade que recebe um elemento
        })
    }

    // estrutura de row utilizada para cada elemento que tiver nos dados
    createRow() {
        const tr = document.createElement('tr')

        // criando a 'tr' do html pelo js
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/williammilanez.png" alt="Imagem de William">

                <a href="https://github.com/williammilanez" target="_blank">
                    <p>William Milanez</p>
                    <span>williammilanez</span>
                </a>
            </td>

            <td class="repositories">
                23
            </td>

            <td class="followers">
                0
            </td>

            <td>
                <button class="remove">&times;</button>
            </td>
        `

        return tr
    }

    // remove as linhas de usuários do html 'tr'
    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
    }
}