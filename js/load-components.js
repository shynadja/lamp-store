// Функция для загрузки компонентов
function loadComponents() {
    // Загрузка шапки
    fetch('components/header.html')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить шапку');
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            updateCartInfo(); // Обновляем информацию в корзине после загрузки
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            document.body.insertAdjacentHTML('afterbegin', '<header>Шапка сайта</header>');
        });

    // Загрузка футера
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить футер');
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => {
            console.error('Ошибка загрузки футера:', error);
            document.body.insertAdjacentHTML('beforeend', '<footer>Футер сайта</footer>');
        });

    // Функция для обновления информации в корзине
    function updateCartInfo() {
        // Здесь может быть логика получения актуальных данных корзины
        // Например, из localStorage или API
        const cartCount = localStorage.getItem('cartCount');
        const cartTotal = localStorage.getItem('cartTotal');
        
        const countElement = document.querySelector('.cart-count');
        const totalElement = document.querySelector('.cart-total');
        
        if (countElement) countElement.textContent = cartCount;
        if (totalElement) totalElement.textContent = cartTotal;
    }
}

// Запускаем загрузку компонентов когда DOM полностью загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}