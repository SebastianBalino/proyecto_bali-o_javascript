const Click = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

Click.forEach(btn => {
    btn.addEventListener('click', agregarEntradaAlCarrito)
})


function agregarEntradaAlCarrito(e) {
    const boton = e.target
    const entrada = boton.closest('.card')
    const entradaTitulo = entrada.querySelector('.card-title').textContent;
    const entradaPrecio = entrada.querySelector('.precio').textContent;
    const entradaImg = entrada.querySelector('.card-img-top').src;

    const newEntrada = {
        title: entradaTitulo,
        precio: entradaPrecio,
        img: entradaImg,
        cantidad: 1
    }

    agregarEntrada(newEntrada)
}


function agregarEntrada(newEntrada) {


    const InputElemnto = tbody.getElementsByClassName('input__elemento')
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newEntrada.title.trim()) {
            carrito[i].cantidad++;
            const inputValue = InputElemnto[i]
            inputValue.value++;
            CarritoTotal()
            return null;
        }
    }

    carrito.push(newEntrada)

    renderCarrito()
}


function renderCarrito() {
    tbody.innerHTML = ''
    carrito.map(entrada => {
        const tr = document.createElement('tr')
        tr.classList.add('ItemCarrito')
        const Content = `
    
    <th scope="row">Esta comprando entradas para:</th>
            <td class="table__entradas">
                <img src=${entrada.img}  alt="">
                <h6 class="title">${entrada.title}</h6>
            </td>
            <td class="table__price"><p>${entrada.precio}</p></td>
            <td class="table__cantidad">
                <input type="number" min="1" value=${entrada.cantidad} class="input__elemento">
                <button class="delete btn btn-danger">x</button>
            </td>
    
    `
        tr.innerHTML = Content;
        tbody.append(tr)

        tr.querySelector(".delete").addEventListener('click', removerEntradaCarrito)
        tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
    })
    CarritoTotal()
}

function CarritoTotal() {
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((entrada) => {
        const precio = Number(entrada.precio.replace("$", ''))
        Total = Total + precio * entrada.cantidad
    })

    itemCartTotal.innerHTML = `Total $${Total}`
    addLocalStorage()
}

function removerEntradaCarrito(e) {
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].title.trim() === title.trim()) {
            carrito.splice(i, 1)
        }
    }

    tr.remove()
    CarritoTotal()
}

function sumaCantidad(e) {
    const sumaInput = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(entrada => {
        if (entrada.title.trim() === title) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            entrada.cantidad = sumaInput.value;
            CarritoTotal()
        }
    })
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderCarrito()
    }
    
}