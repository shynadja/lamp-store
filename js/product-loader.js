document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch('products-data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id === productId);
            if (!product) return showErrorMessage(); // Показываем сообщение об ошибке

            displayProduct(product); // Отображаем продукт на странице
            setupAddToCartButton(product); // Настройка кнопки добавления в корзину
        })
        .catch(() => showErrorMessage()); // Сообщение об ошибке при неудаче запроса

    function showErrorMessage() {
        document.getElementById('product-page').innerHTML = '<h2>Товар не найден</h2>';
    }

    function displayProduct(product) {
        const container = document.getElementById('product-page');
        container.innerHTML = `
            <div class="product-images">
                <img src="${product.image_url}" alt="${product.name}" class="main-image" onerror="this.src='images/default-product.jpg'">
            </div>
            <div class="product-details">
                <h1>${product.name}</h1>
                <p class="price">${product.price} руб.</p>
                <div class="product-specs">
                    <h3>Характеристики:</h3>
                    <ul>
                        <li><strong>Тип:</strong> ${product.type}</li>
                        <li><strong>Мощность:</strong> ${product.power}</li>
                        <li><strong>Срок службы:</strong> ${product.lifespan}</li>
                    </ul>
                </div>
                <div class="product-description">
                    <h3>Описание:</h3>
                    <p>${product.description}</p>
                </div>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        `;
    }

    function setupAddToCartButton(product) {
        const btn = document.querySelector('.add-to-cart');
        if (btn) { // Регистрация обработчика только при наличии кнопки
            btn.addEventListener('click', () => {
                addToCart(product);
                updateCartHeader();
                alert('Товар добавлен в корзину!');
            });
        }
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({ 
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartHeader() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const cartCountEl = document.querySelector('.cart-count');
        const cartTotalEl = document.querySelector('.cart-total');
        
        if (cartCountEl) cartCountEl.textContent = totalItems;
        if (cartTotalEl) cartTotalEl.textContent = `${totalPrice} руб.`;
    }
});