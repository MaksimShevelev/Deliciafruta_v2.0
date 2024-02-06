'use strict';

/*array de mis productos*/

let productos = [
    {
        id: 1,
        nombre: 'Gomigas con jugo',
        descripcion: 'Surtido de gomitas con agregado de jugo natural',
        precio: 500,
        imagen: 'con_jugo4.jpg',
        categoría: 'Clásico',
    },
    {
        id: 2,
        nombre: 'Gomigas artesanales',
        descripcion: 'Delicadas mermeladas artesanales hechas por nuestros maestros',
        precio: 600,
        imagen: 'gomitas_artesanal1.jpg',
        categoría: 'Para regalo',
    },
    {
        id: 3,
        nombre: 'Ositos de goma',
        descripcion: 'Ositas de goma famosas',
        precio: 350,
        imagen: 'ositos2.jpg',
        categoría: 'Forma',
    },
    {
        id: 4,
        nombre: 'Caramelos',
        descripcion: 'Surtido de golosinas de varios sabores',
        precio: 250,
        imagen: 'golosinas2.jpg',
        categoría: 'Clásico',
    },
    {
        id: 5,
        nombre: 'Set de regalo',
        descripcion: '1 kg de gomitas en un bonito empaque de regalo',
        precio: 4000,
        imagen: 'set_regalo2.jpg',
        categoría: 'Para regalo',
    },
    {
        id: 6,
        nombre: 'Con forma de frutas',
        descripcion: 'Una variedad de sabores de frutas en las gomitas',
        precio: 450,
        imagen: 'formas_frutas3.jpg',
        categoría: 'Forma',
    },
];

//los filtros de productos
document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.filtros a');
    let isBannerVisible = false;
    let bannerTimeout;

    categoryButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            const category = this.textContent.trim();
            filterByCategory(category);

            showFilterBanner(this);  
        });
    });

    const clearFiltersButton = document.querySelector('.filtros a:last-child');
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', function (event) {
            event.preventDefault();
            showAllCards();
        });
    }

    function filterByCategory(category) {
        const products = document.querySelectorAll('.productos .card');

        products.forEach(product => {
            const productId = parseInt(product.querySelector('.category').getAttribute('data-productid'));
            const selectedProduct = productos.find(item => item.id === productId);

            if (category === 'Borrar filtros' || selectedProduct.categoría === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    function showAllCards() {
        const products = document.querySelectorAll('.productos .card');

        products.forEach(product => {
            product.style.display = 'block';
        });
    }

//funcion para banners
    function showFilterBanner(clickedButton) {
        const banners = document.querySelectorAll('.filter-banner');
    
        if (!isBannerVisible) {
            const randomBanner = banners[Math.floor(Math.random() * banners.length)];
    
            randomBanner.style.display = 'block';
            isBannerVisible = true;
    
            clickedButton.style.pointerEvents = 'none';
    
            
            randomBanner.addEventListener('click', function bannerClickHandler() {
                if (randomBanner.id === 'filterBanner') {
                    addToCart(3);
                } else if (randomBanner.id === 'filterBanner1') {
                    addToCart(5);
                }
    
                randomBanner.style.display = 'none';
                isBannerVisible = false;
    
                clickedButton.style.pointerEvents = 'auto';
    
                randomBanner.removeEventListener('click', bannerClickHandler);
            });
    
            setTimeout(() => {
                randomBanner.style.display = 'none';
                isBannerVisible = false;

                clickedButton.style.pointerEvents = 'auto';
            }, 10000);
        }
    }
    
    window.addEventListener('beforeunload', function () {
        clearTimeout(bannerTimeout);
    });

});


//Carrito
let cartItems = []; // array para carrito

// datos de carrito
function updateCartInfo() {
    const navItemsAgregados = document.getElementById('navItemsAgregados');
    const carritoItemsAgregados = document.getElementById('carritoItemsAgregados');
    const carritoTotal = document.getElementById('carritoTotal');

    // Cantidad total de productos en carrito (con duplicados)
    const totalItemsWithDuplicates = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Precio total en carrito (con duplicados)
    const totalPriceWithDuplicates = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    // // Cantidad total de productos en carrito (únicos)
    const uniqueProducts = new Set(cartItems.map(item => item.id));
    const uniqueItemsCount = [...uniqueProducts].length;
    navItemsAgregados.textContent = uniqueItemsCount > 0 ? uniqueItemsCount : '';

    carritoItemsAgregados.textContent = totalItemsWithDuplicates > 0 ? totalItemsWithDuplicates : '';

    carritoTotal.textContent = totalPriceWithDuplicates.toFixed(2);

    navItemsAgregados.textContent = uniqueItemsCount > 0 ? uniqueItemsCount : '';
    navItemsAgregados.classList.toggle('has-items', uniqueItemsCount > 0);
}


// Agregar producto en carrito
function addToCart(productId) {
    const productElement = document.querySelector(`[data-productid="${productId}"]`);
    const priceSpan = productElement.querySelector('span');
    const price = parseFloat(priceSpan.textContent);

    const productInCart = cartItems.find(item => item.id === productId);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cartItems.push({ id: productId, price: price, quantity: 1 });
    }

    updateCartInfo();
}

document.querySelector('#btn-ver-carrito').addEventListener('click', function () {
    displayCartItems(); 
});

document.querySelector('#btn-ver-carrito1').addEventListener('click', function () {
    displayCartItems();
});

function displayCartItems() {
    const cartItemList = document.getElementById('cartItemList');
    cartItemList.innerHTML = '';

    const itemCounts = {};

    cartItems.forEach(item => {
        const product = productos.find(producto => producto.id === item.id);
        if (product) {
            const listItem = document.createElement('li');
            const productName = `${product.nombre} - $${item.price}`;

            itemCounts[item.id] = itemCounts[item.id] ? itemCounts[item.id] + item.quantity : item.quantity;

            listItem.textContent = `${productName} (x${itemCounts[item.id]})`;

            // Agregar un contenedor para íconos
            const iconContainer = document.createElement('li');
            iconContainer.classList.add('iconos');
            // Agregar íconos

            const plusIcon = document.createElement('button');
            plusIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>';
            plusIcon.classList.add('btn-primary3');
            plusIcon.onclick = function () {
                addToCart(item.id); 
                displayCartItems(); 
                updateCartInfo(); 
            };

            const minusIcon = document.createElement('button');
            minusIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg>';
            minusIcon.classList.add('btn-primary4');
            minusIcon.onclick = function () {
                removeFromCart(item.id); 
                displayCartItems(); 
                updateCartInfo(); 
            };

            const trashIcon = document.createElement('button');
            trashIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg>';
            trashIcon.classList.add('btn-primary5');
            trashIcon.onclick = function () {
                removeAllFromCart(item.id); 
                displayCartItems(); 
                updateCartInfo(); 
            };

            // Agregar los íconos a contenedor 
            iconContainer.appendChild(minusIcon);
            iconContainer.appendChild(plusIcon);
            iconContainer.appendChild(trashIcon);

            // Agregar el contenedor en la lista
            listItem.appendChild(iconContainer);

            // Agregar el contenedor en la lista general
            cartItemList.appendChild(listItem);
        }
    });

    function removeFromCart(productId) {
        const productInCart = cartItems.find(item => item.id === productId);
        if (productInCart) {
            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1;
            } else {
                return;
            }
        }
    }
    

    // Para borrar todo
    function removeAllFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
    }

    const totalItems = Object.values(itemCounts).reduce((acc, count) => acc + count, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2);

    document.getElementById('modalTotalItems').textContent = totalItems;
    document.getElementById('modalTotalPrice').textContent = totalPrice;
    document.getElementById('modalEntregaTotalPrice').textContent = totalPrice;
    
    updateCartInfo();
    toggleComprarButton();
    
}

document.getElementById('btnClearCart').addEventListener('click', function () {
    clearCart(); 
    displayCartItems(); 
    updateCartInfo(); 
});

function clearCart() {
    cartItems = [];
}

// Activar boton "Comprar" 
function toggleComprarButton() {
    const comprarButton = document.getElementById('btn-comprar');
    comprarButton.style.display = cartItems.length > 0 ? 'block' : 'none';
}

//Para activar los mensajes de errores en la forma
const requiredFields = document.querySelectorAll('#form1 [required]');

requiredFields.forEach(field => {
    const errorMessageId = `${field.name}-error`;
    const errorMessageElement = document.getElementById(errorMessageId);

    field.addEventListener('input', function () {
        const fieldValue = field.value.trim();

        if (fieldValue === '') {
            errorMessageElement.textContent = 'Este campo es obligatorio.';
            errorMessageElement.style.display = 'block';
        } else {
            errorMessageElement.textContent = '';
            errorMessageElement.style.display = 'none';
        }
    });
});

//Para validar la fecha en la forma
const dateField = document.querySelector('#date');
const dateErrorMessage = document.getElementById('date-error');

dateField.addEventListener('change', function () {
    const selectedDate = new Date(dateField.value);
    const today = new Date();

    if (selectedDate < today) {
        dateErrorMessage.textContent = 'Por favor ingrese una fecha válida. Este campo es obligatorio.';
        dateErrorMessage.style.display = 'block';
    } else {
        dateErrorMessage.textContent = '';
        dateErrorMessage.style.display = 'none';
    }
});


