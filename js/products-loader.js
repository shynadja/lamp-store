document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров из JSON-файла
    fetch('products-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось загрузить данные о товарах');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data.products);
            setupCategoryFilters(data.products);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            document.getElementById('product-container').innerHTML = 
                '<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
        });

    // Функция для отображения товаров
    function displayProducts(products, category = 'all') {
        const container = document.getElementById('product-container');
        container.innerHTML = '';

        // Фильтрация по категории, если выбрана не "все"
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.type.toLowerCase() === category.toLowerCase());

        if (filteredProducts.length === 0) {
            container.innerHTML = '<p class="no-products">Товары данной категории отсутствуют</p>';
            return;
        }

        // Создаем HTML-разметку для каждого товара
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <a href="product.html?id=${product.id}" class="product-link">
                    <div class="product-image-container">
                        <img src="${product.image_url}" alt="${product.name}" class="product-image" 
                             onerror="this.src='images/default-product.jpg'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-spec">${product.power}, ${product.lifespan}</p>
                        <p class="product-price">${product.price} руб.</p>
                    </div>
                </a>
            `;
            container.appendChild(productCard);
        });
    }

    // Функция для настройки фильтров по категориям
    function setupCategoryFilters(products) {
        const categoryLinks = document.querySelectorAll('.category-link');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Удаляем активный класс у всех ссылок
                categoryLinks.forEach(l => l.classList.remove('active'));
                
                // Добавляем активный класс текущей ссылке
                this.classList.add('active');
                
                // Получаем выбранную категорию
                const category = this.dataset.category;
                
                // Отображаем товары выбранной категории
                displayProducts(products, category);
            });
        });
    }
});