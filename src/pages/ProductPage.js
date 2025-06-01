import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import productsData from '../products-data.json';
import useCart from '../hooks/useCart';
import '../index.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = productsData.products.find(p => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      navigate('/cart'); // Переход на страницу корзины после добавления товара
    }
  };

  if (!product) {
    return (
      <div className="home-page">
        <Header />
        <div>Товар не найден</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <Header />
      <main className="product-page">
        <div className="product-content">
          <div className="product-left-column">
            <div className="product-images">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="main-image" 
              />
            </div>
          </div>
          
          <div className="product-details">
            <h1>{product.name}</h1>
            <div className="price">{product.price.toLocaleString('ru-RU')} ₽</div>
            
            <div className="product-specs">
              <h3>Характеристики:</h3>
              <ul>
                <li>Тип: {product.type}</li>
                <li>Мощность: {product.power}</li>
                <li>Срок службы: {product.lifespan}</li>
              </ul>
            </div>
            
            <div className="product-description">
              <h3>Описание:</h3>
              <p>{product.description}</p>
            </div>

            <div className="cart-action right-aligned">
              <button 
                className="add-to-cart fixed-width"
                onClick={handleAddToCart}
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;