const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrinho = document.getElementById('template-carrinho').content
const fragment = document.createDocumentFragment()

let carrinho = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrinho')) {
        carrinho = JSON.parse(localStorage.getItem('carrinho')) //Pega o que tem no localstorage e volta como objeto
        pintarCarrinho()
    }
})

cards.addEventListener('click', e => {
    addCarrinho(e)
})

items.addEventListener('click', e => {
    btnAction(e)
})

const fetchData = async () => {
    try {

        //A resposta vem da base de dados usando fetch
        const res = await fetch('api.json')

        //Tendo a resposta, guardamos o dado e vem em json
        const data = await res.json()
        pintarCards(data)

    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.preco
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)

    })
    cards.appendChild(fragment)
}


const addCarrinho = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrinho(e.target.parentElement)
    }
    e.stopPropagation() //detem qualquer outro evendo que pode gerar nos itens
}

const setCarrinho = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        preco: objeto.querySelector('p').textContent,
        quantidade: 1
    }

    if (carrinho.hasOwnProperty(producto.id)) {
        producto.quantidade = carrinho[producto.id].quantidade + 1 // pergunto se o obj tem a propriedade, caso sim, realizo a operaçao
    }

    carrinho[producto.id] = { ...producto } //Se for falso, coloco no carrinho
    pintarCarrinho()
}

const pintarCarrinho = () => {
    items.innerHTML = ''
    Object.values(carrinho).forEach(producto => {
        templateCarrinho.querySelector('th').textContent = producto.id
        templateCarrinho.querySelectorAll('td')[0].textContent = producto.title
        templateCarrinho.querySelectorAll('td')[1].textContent = producto.quantidade
        templateCarrinho.querySelector('.btn-info').dataset.id = producto.id
        templateCarrinho.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrinho.querySelector('span').textContent = producto.quantidade * producto.preco

        const clone = templateCarrinho.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrinho', JSON.stringify(carrinho)) // guardamos nossa colecao de obj com a chave carrinho no localStorage como texto(stringify) 
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrinho).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrinho vazio</th>
        `
        return
    }

    const nQuantidade = Object.values(carrinho).reduce((acc, { quantidade }) => acc + quantidade, 0)
    const nPreco = Object.values(carrinho).reduce((acc, { quantidade, preco }) => acc + quantidade * preco, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nQuantidade
    templateFooter.querySelector('span').textContent = nPreco

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnLimpar = document.getElementById('limpar-carrinho')
    btnLimpar.addEventListener('click', () => {
        carrinho = {}
        pintarCarrinho()
    })
}


const btnAction = e => {

    //Açao de aumentar
    if (e.target.classList.contains('btn-info')) {
        const produto = carrinho[e.target.dataset.id]
        produto.quantidade = carrinho[e.target.dataset.id].quantidade + 1
        carrinho[e.target.dataset.id] = { ...produto }
        pintarCarrinho()
    }

    //Açao de diminuir
    if (e.target.classList.contains('btn-danger')) {
        const produto = carrinho[e.target.dataset.id]
        produto.quantidade--
        if (produto.quantidade === 0) {
            delete carrinho[e.target.dataset.id]
        }
        pintarCarrinho()
    }

    e.stopPropagation()
}


//Salvar cadastro no localStorage

let lista = document.getElementById('nome', 'cpf', 'dn', 'tel', 'email', 'endereco')

function salvar(){
     let lista = JSON.parse(localStorage.getItem('lista') || '[]')

     lista.push(
         {
             nome: nome.value,
             cpf: cpf.value,
             dn: dn.value,
             tel: tel.value,
             email: email.value,
             endereco: endereco.value
         }
     )
     localStorage.setItem('lista' , JSON.stringify(lista))
     document.getElementById('res').innerHTML = 'Cadastro realizado com sucesso!'
}