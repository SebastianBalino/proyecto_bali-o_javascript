const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

let carrito = {}

// EVENTOS //
document.addEventListener('DOMContentLoaded', e => { fetchData() 
    armarCarrito()
    } 
);
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// TRAER PRODUCTOS DESDE EL API //
const fetchData = async () => {
    const res = await fetch('api.json');
    const data = await res.json()
    console.log(data)
    armarCards(data)
}

// ARMA LOS PRODUCTOS COS SUS PROPIEDADES //
const armarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// AGREGAR PRODUCTOS AL CARRITO //
const addCarrito = e => {  

    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        Swal.fire
        ("Producto agregado al carrito " +
        e.target.parentElement.querySelector("h5").textContent,
        )
        
    }
    e.stopPropagation()
}


const setCarrito = item => {
    
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,        
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    
    armarCarrito()
}

const armarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    armarFooter()  
}

const armarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">El Carrito está vacío <br><br><br><br><hr> </th>
        `
        return
    }
    
    // SUMA CANTIDADES //
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {

        Swal.fire({
            icon: 'error',
            title: 'Productos removidos',
            footer: '<a href="">Volver a la tienda</a>'
        })
        

        carrito = {}
        armarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        armarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        armarCarrito()
    }
    e.stopPropagation()
}