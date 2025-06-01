import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import productsData from '../products-data.json';
import '../index.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load products data
    setProducts(productsData.products);
    setFilteredProducts(productsData.products);
  }, []);

  useEffect(() => {
    // Filter products based on category and search query
    let filtered = products;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.type === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [activeCategory, searchQuery, products]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} />
      
      <main>
        <div className="container">
          <aside className="catalog">
            <h3>Каталог</h3>
            <ul className="category-list">
              <li>
                <button 
                  className={`category-link ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('all')}
                >
                  Все товары
                </button>
              </li>
              <li>
                <button 
                  className={`category-link ${activeCategory === 'LED' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('LED')}
                >
                  LED
                </button>
              </li>
              <li>
                <button 
                  className={`category-link ${activeCategory === 'лампы накаливания' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('лампы накаливания')}
                >
                  Лампы накаливания
                </button>
              </li>
              <li>
                <button 
                  className={`category-link ${activeCategory === 'умные лампы' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('умные лампы')}
                >
                  Умные лампы
                </button>
              </li>
            </ul>
          </aside>
          <section className="special-offer">
            <img src="/images/special-offer.jpg" alt="Специальное предложение" />
          </section>
        </div>
        
        <section className="products">
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <a href={`/product/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-spec">{product.power}, {product.lifespan}</p>
                    <p className="product-price">{product.price} ₽</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;