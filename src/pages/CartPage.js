import { React, useState } from 'react';
import useCart from '../hooks/useCart';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const [discount] = useState(0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  return (
    <div >
      <Header />
      
      <div className="cart-page">
        <h1>Корзина</h1>
        
        <section className="cart-items">
          {cartItems.length === 0 ? (
            <p>Ваша корзина пуста</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image_url || '/images/default-product.jpg'} 
                    alt={item.name} 
                    onError={(e) => {
                      e.target.src = '/images/default-product.jpg';
                    }}
                  />
                </div>
                <div className="item-name">
                  <h3>{item.name}</h3>
                  
                </div>
                <div className="item-quantity">
                  <button 
                    className="quantity-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </section>
        
        <div className="cart-summary">
          <div className="summary-row">
            <span>Товары, {totalItems} шт.</span>
            <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="summary-row">
            <span>Скидка:</span>
            <span>{discount.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="summary-row total">
            <span>Итого:</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <a 
            href="/checkout" 
            className={`checkout-btn ${cartItems.length === 0 ? 'disabled' : ''}`}
            onClick={e => cartItems.length === 0 && e.preventDefault()}
          >
            Заказать
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;