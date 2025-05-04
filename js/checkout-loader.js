document.addEventListener('DOMContentLoaded', function() {
    const checkoutContainer = document.getElementById('checkout-container');
    
    function loadCheckoutData() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            checkoutContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <a href="index.html" class="back-to-shop">Вернуться в магазин</a>
                </div>
            `;
            return;
        }
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        checkoutContainer.innerHTML = `
            <div class="order-items">
                <div id="checkout-items">
                    ${cart.map(item => `
                        <div class="checkout-item" data-id="${item.id}">
                            <div class="item-image">
                                <img src="${item.image_url}" alt="${item.name}" onerror="this.src='images/default-product.jpg'">
                            </div>
                            <div class="item-name">${item.name}</div>
                                <div class="item-quantity">
                                <button class="quantity-btn decrease">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase">+</button>
                            </div>
                            <div class="item-total">${item.price * item.quantity} руб.</div>
                            <button class="remove-item">×</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Товары, ${totalItems} шт.</span>
                        <span>${totalPrice} руб.</span>
                    </div>
                    <div class="summary-row">
                        <span>Скидка</span>
                        <span>0 руб.</span>
                    </div>
                    <div class="summary-row total">
                        <span>Итого</span>
                        <span>${totalPrice} руб.</span>
                    </div>
                </div>
            </div>
            
            <div class="delivery-payment">
                <form id="checkout-form">
                    <div class="delivery-section">
                        <h2>Доставка:</h2>
                        <div class="delivery-options">
                            <label class="delivery-option">
                                <input type="radio" name="delivery" value="pickup" checked>
                                <span class="checkmark"></span>
                                Самовывоз
                            </label>
                        </div>
                    </div>
                    
                    <div class="payment-section">
                        <h2>Оплата:</h2>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="cash" checked>
                                <span class="checkmark"></span>
                                При получении
                            </label>
                        </div>
                    </div>
                    
                    <div class="customer-info">
                        <h2>Контактные данные</h2>
                        <label>
                            Имя:
                            <input type="text" name="name" required>
                        </label>
                        <label>
                            Телефон:
                            <input type="tel" name="phone" required>
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email">
                        </label>
                    </div>
                    
                    <button type="submit" class="confirm-order">Подтвердить</button>
                </form>
            </div>
        `;
        
        // Обработчики событий
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Переключение видимости поля адреса
        document.querySelectorAll('input[name="delivery"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const addressField = document.querySelector('.delivery-address');
                addressField.classList.toggle('hidden', this.value !== 'courier');
            });
        });
        
        // Изменение количества товаров
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemElement = this.closest('.checkout-item');
                const itemId = itemElement.dataset.id;
                const isIncrease = this.classList.contains('increase');
                updateCartItemQuantity(itemId, isIncrease);
            });
        });
        
        // Удаление товара
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemElement = this.closest('.checkout-item');
                const itemId = itemElement.dataset.id;
                removeFromCart(itemId);
            });
        });
        
        // Оформление заказа
        document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
    
    function updateCartItemQuantity(itemId, isIncrease) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            if (isIncrease) {
                item.quantity += 1;
            } else {
                item.quantity = Math.max(1, item.quantity - 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCheckoutData(); // Перезагружаем данные
            updateCartHeader(); // Обновляем шапку
        }
    }
    
    function removeFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCheckoutData(); // Перезагружаем данные
        updateCartHeader(); // Обновляем шапку
    }
    
    function updateCartHeader() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('.cart-total');
        
        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotal) cartTotal.textContent = `${totalPrice} руб.`;
    }
    
    function placeOrder() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) return;
        
        const formData = new FormData(document.getElementById('checkout-form'));
        const order = {
            items: cart,
            delivery: formData.get('delivery'),
            payment: formData.get('payment'),
            address: formData.get('delivery') === 'courier' ? formData.get('address') : null,
            customer: {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email')
            },
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };
        
        // Здесь можно добавить отправку заказа на сервер
        console.log('Оформлен заказ:', order);
        
        // Очищаем корзину после оформления
        localStorage.removeItem('cart');
        updateCartHeader();
        
        // Перенаправляем на страницу подтверждения
        window.location.href = 'order-success.html';
    }
    
    // Инициализация
    loadCheckoutData();
});