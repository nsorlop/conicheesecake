let cart = JSON.parse(localStorage.getItem('coni_cart')) || [];

function saveCart() {
    localStorage.setItem('coni_cart', JSON.stringify(cart));
}

function addProductToCart(event, productId, name) {
    const selectElement = document.getElementById('size-' + productId);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const sizeName = selectedOption.getAttribute('data-size');
    const price = parseFloat(selectedOption.getAttribute('data-price'));

    const card = event.target.closest('article');
    const imgSrc = card.querySelector('img').src;

    flyToCartAnimation(event.target, imgSrc);
    addToCart(name, sizeName, price);
}

function flyToCartAnimation(buttonElement, imgSrc) {
    const cartIcon = document.querySelector('.cart-btn');
    const btnRect = buttonElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImg = document.createElement('img');
    flyingImg.src = imgSrc;
    flyingImg.style.position = 'fixed';
    flyingImg.style.left = `${btnRect.left + btnRect.width / 2}px`;
    flyingImg.style.top = `${btnRect.top + btnRect.height / 2}px`;
    flyingImg.style.width = '60px';
    flyingImg.style.height = '60px';
    flyingImg.style.borderRadius = '50%';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.pointerEvents = 'none';
    flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    flyingImg.style.transform = 'translate(-50%, -50%)';
    flyingImg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';

    document.body.appendChild(flyingImg);

    setTimeout(() => {
        flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingImg.style.width = '15px';
        flyingImg.style.height = '15px';
        flyingImg.style.opacity = '0.2';
    }, 10);

    setTimeout(() => {
        flyingImg.remove();
        cartIcon.classList.remove('cart-bounce');
        void cartIcon.offsetWidth; 
        cartIcon.classList.add('cart-bounce');
    }, 800);
}

function closeAllModals() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('nav-links').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('show');
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = navLinks.classList.contains('open');
    
    if (isOpen) {
        closeAllModals();
    } else {
        navLinks.classList.add('open');
        overlay.classList.add('show');
    }
}

function toggleCart(forceOpen = null) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    let isOpen = sidebar.classList.contains('open');
    let shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

    if (shouldOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
        document.getElementById('nav-links').classList.remove('open');
    } else {
        sidebar.classList.remove('open');
        if (!document.getElementById('nav-links').classList.contains('open')) {
            overlay.classList.remove('show');
        }
    }
}

function addToCart(name, sizeName, price) {
    const existingItem = cart.find(item => item.name === name && item.size === sizeName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, size: sizeName, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    toggleCart(true); 
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
    
    const cartItemsDiv = document.getElementById('cart-items-container');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; color: #B098C6; margin-top:40px;">Tu cesta está vacía</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <small>Tamaño: ${item.size}</small><br>
                        <small style="color: var(--color-primary); font-weight: bold;">${itemTotal}€</small>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                        <div class="quantity-controls">
                            <button onclick="changeQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('cart-total').innerText = total + '€';
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert('Añade alguna tarta a la cesta primero.');
        return;
    }
    
    let message = "Hola, me gustaría realizar el siguiente encargo:%0A%0A";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += ` ${item.quantity}x ${item.name}%0A   Tamaño: ${item.size} (${itemTotal}€)%0A`;
    });
    
    message += `%0A*TOTAL DEL PEDIDO: ${total}€*%0A%0A¿Para cuándo podría recogerlo en La Font de la Figuera?`;
    
    const telefonoWhatsApp = "34644219118"; 
    window.open(`https://wa.me/${telefonoWhatsApp}?text=${message}`, '_blank');
}

document.addEventListener('DOMContentLoaded', updateCartUI);