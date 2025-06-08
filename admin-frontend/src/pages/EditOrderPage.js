import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetOrder, adminUpdateOrder } from '../api/api';
import '../index.css';

const OrderEditPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await adminGetOrder(orderId);
        setOrder({
          ...orderData,
          items: orderData.items.map(item => ({
            ...item,
            discountedPrice: item.price * (1 - (item.discount || 0)/100)
          }))
        });
      } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setOrder(prev => {
      const updatedItems = prev.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.discountedPrice * item.quantity), 
        0
      );
      
      return {
        ...prev,
        items: updatedItems,
        total_amount: newTotal
      };
    });
  };

  const handleStatusChange = (e) => {
    setOrder(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!order) return;
    
    setSaving(true);
    try {
      await adminUpdateOrder(order.id, {
        status: order.status,
        items: order.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount
        }))
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Ошибка при сохранении заказа:', error);
      alert('Не удалось сохранить изменения');
      navigate('/admin/login');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">

        <div className="loading-container">Загрузка данных заказа...</div>

      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container">

        <div className="error-container">Заказ не найден</div>

      </div>
    );
  }

  return (
    <div className="page-container">
      
      <div className="order-edit-container">
        <div className="order-edit-content">
          <div className="order-edit-header">
            <h1>Редактирование заказа {order.orderNumber || `#${order.id.slice(0, 6)}`}</h1>
            <div className="order-edit-actions">
              <button 
                className="btn-save" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>

            </div>
          </div>

          <div className="order-info">
            <div className="order-status-container">
              <label>Статус:</label>
              <select value={order.status} onChange={handleStatusChange}>
                <option value="оформлен">Оформлен</option>
                <option value="собран">Собран</option>
                <option value="получен">Получен</option>
                <option value="отменен">Отменен</option>
              </select>
            </div>
          </div>

          <div className="customer-info">
            <h3>Информация о покупателе:</h3>
            <div className="customer-details">
              <p><strong>Имя:</strong> {order.customer_name || 'Не указано'}</p>
              <p><strong>Телефон:</strong> {order.customer_phone || 'Не указано'}</p>
              <p><strong>Email:</strong> {order.customer_email || 'Не указано'}</p>
            </div>
          </div>

          <div className="order-items">
            <h3>Товары:</h3>
            {order.items.length > 0 ? (
              <>
                <div className="order-items-header">
                  <span>Название</span>
                  <span>Кол-во</span>
                  <span>Цена</span>
                  <span>Скидка</span>
                  <span>Итого</span>
                </div>
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.product_name}</span>
                    <div className="item-quantity">
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="item-price">{item.price} ₽</span>
                    <span className="item-discount">{item.discount || 0}%</span>
                    <span className="item-total">
                      {(item.discountedPrice * item.quantity).toFixed(2)} ₽
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <p>Нет товаров в заказе</p>
            )}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Сумма заказа:</span>
              <span>{order.total_amount.toFixed(2)} ₽</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderEditPage;