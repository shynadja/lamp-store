import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createOrder } from '../api/api';
import '../index.css';

const CheckoutPage = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [deliveryMethod] = useState('self-pickup');
  const [paymentMethod] = useState('on-receipt');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity * (1 - (item.discount || 0)/100)), 
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', phone: '', email: '' };

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Введите имя';
      valid = false;
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
      valid = false;
    } else if (!/^[\d\s()+.-]{10,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Введите корректный номер';
      valid = false;
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Введите email';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Введите корректный email';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0
        })),
        delivery_method: deliveryMethod,
        payment_method: paymentMethod
      };

      const createdOrder = await createOrder(orderData);
      setOrderNumber(createdOrder.id);
      clearCart();
      setOrderConfirmed(true);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      setSubmitError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderConfirmed) {
    return (
      <div className="checkout-page">
        <Header />
        <main>
          <div className="empty-cart">
            <p>Ваша корзина пуста</p>
            <button 
              onClick={() => navigate('/')} 
              className="back-to-shop-btn"
            >
              Вернуться в магазин
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="checkout-page">
        <Header />
        <main>
          <div className="order-confirmation">
            <h2>Заказ №{orderNumber} оформлен.</h2>
            <p>Ожидайте сообщения о готовности.</p>
            <button 
              className="back-to-shop-btn"
              onClick={() => navigate('/')}
            >
              Вернуться в магазин
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />
      
      <main>
        <div className="checkout-content">
          <h2 className="checkout-title">Оформление заказа</h2>
          
          {submitError && <div className="error-message">{submitError}</div>}
        
          <form onSubmit={handleSubmitOrder} className="checkout-grid">
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="item-image">
                    <img 
                      src={item.image_url || '/images/default-product.jpg'} 
                      alt={item.name}
                      onError={(e) => e.target.src = '/images/default-product.jpg'}
                    />
                  </div>
                  <div className="item-name">
                    <h3>{item.name}</h3>
                    {item.discount > 0 && (
                      <span className="discount-badge">-{item.discount}%</span>
                    )}
                  </div>
                  <div className="item-quantity">
                    <button 
                      type="button"
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      type="button"
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    {(item.price * item.quantity * (1 - (item.discount || 0)/100)).toLocaleString('ru-RU')} ₽
                  </div>
                  <button 
                    type="button"
                    className="remove-item" 
                    onClick={() => removeItem(item.id)}
                    aria-label="Удалить товар"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="order-details">
              <div className="delivery-section">
                <h3>Доставка:</h3>
                <div className="delivery-option">
                  <input 
                    type="radio" 
                    name="delivery" 
                    value="self-pickup" 
                    checked
                    readOnly
                  />
                  <label>Самовывоз</label>
                </div>
              </div>
              
              <div className="payment-section">
                <h3>Оплата:</h3>
                <div className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="on-receipt" 
                    checked
                    readOnly
                  />
                  <label>При получении</label>
                </div>
              </div>
              
              <div className="customer-info">
                <h3>Контактные данные:</h3>
                <div className="form-group">
                  <label>Имя*:</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Телефон*:</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Email*:</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Товары, {totalItems} шт.</span>
                  <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="summary-row">
                  <span>Скидка:</span>
                  <span>{cartItems.reduce((sum, item) => sum + (item.price * item.quantity * (item.discount || 0)/100), 0).toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="summary-row total">
                  <span>Итого:</span>
                  <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button 
                  type="submit"
                  className="confirm-order" 
                  disabled={cartItems.length === 0 || isSubmitting}
                >
                  {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;