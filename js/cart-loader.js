let cartCountEl, cartTotalEl; // Глобальные переменные для хранения элементов шапки

// Отложенная инициализация после полной загрузки всех ресурсов
window.onload = () => {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalSum = document.getElementById('cart-total-sum');
    const cartTotalItems = document.getElementById('cart-total-items');
    const cartDiscount = document.getElementById('cart-discount');

    // Сохраняем ссылки на элементы шапки
    cartCountEl = document.querySelector('.cart-count');
    cartTotalEl = document.querySelector('.cart-total');

    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
            cartTotalSum.textContent = '0 руб.';
            cartTotalItems.textContent = '0 шт.';
            cartDiscount.textContent = '0 руб.';
            return;
        }

        cartContainer.innerHTML = ''; // Очистка текущего содержания

        let total = 0;
        let totalItems = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image_url}" alt="${item.name}" onerror="this.src='images/default-product.jpg'" />
                </div>
                <div class="item-info">${item.name}</div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="item-total">${item.price * item.quantity} руб.</div>
                <button class="remove-item">×</button>
            `;
            cartContainer.appendChild(cartItem);

            total += item.price * item.quantity;
            totalItems += item.quantity;
        });

        cartTotalSum.textContent = `${total} руб.`;
        cartTotalItems.textContent = `${totalItems} шт.`;
        cartDiscount.textContent = '0 руб.';

        addEventListeners();
    }

    function addEventListeners() {
        // Регулировка количества товаров
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const itemId = itemElement.dataset.id;
                const isIncrease = this.classList.contains('increase');
                updateCartItemQuantity(itemId, isIncrease);
            });
        });

        // Удаление товара
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const itemId = itemElement.dataset.id;
                removeFromCart(itemId);
            });
        });
    }

    function updateCartItemQuantity(itemId, isIncrease) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex >= 0) {
            if (isIncrease) {
                cart[itemIndex].quantity++;
            } else {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1); // Полностью удаляем товар
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems(); // Перерисовываем корзину
            updateCartHeader(); // Обновляем общее количество и сумму
        }
    }

    function removeFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); // Перерисовываем корзину
        updateCartHeader(); // Обновляем общее количество и сумму
    }

    function updateCartHeader() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartCountEl) cartCountEl.textContent = totalItems;
        if (cartTotalEl) cartTotalEl.textContent = `${totalPrice} руб.`;
    }

    displayCartItems(); // Первоначальная загрузка данных
};