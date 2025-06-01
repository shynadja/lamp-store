import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import productsData from '../products-data.json';
import ordersData from '../orders-data.json';
import '../index.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    setProducts(productsData.products);
    
    const formattedOrders = ordersData.orders.map(order => {
      let customerInfo = 'Нет данных';
      if (order.customerInfo) {
        customerInfo = `${order.customerInfo.name || ''} ${order.customerInfo.phone || ''} ${order.customerInfo.email || ''}`.trim();
      } else if (order.user_id) {
        customerInfo = `Гость (ID: ${order.user_id})`;
      }

      const createdAt = new Date(order.created_at);
      const updatedAt = order.updated_at ? new Date(order.updated_at) : createdAt;

      return {
        id: order.id,
        orderNumber: `#${order.id.slice(0, 6)}`,
        status: order.status,
        customer: customerInfo,
        total: order.total_amount.toLocaleString('ru-RU'),
        createdAt: createdAt.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        updatedAt: updatedAt.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        items: order.items
      };
    });

    setOrders(formattedOrders);
  }, [navigate]);

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-container">
        <div className="admin-header-content">
          <h1 className="admin-title">Панель администратора</h1>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin');
            }}
          >
            Выйти
          </button>
        </div>
      </div>

      <main className="admin-page">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Товары
          </button>
          <button
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Заказы
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="admin-content">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название товара</th>
                    <th>Цена, руб.</th>
                    <th>Скидка, %</th>
                    <th>Описание</th>
                    <th>Тип</th>
                    <th>Мощность</th>
                    <th>Срок службы</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id.slice(0, 6)}...</td>
                      <td>{product.name}</td>
                      <td>{product.price.toLocaleString('ru-RU')}</td>
                      <td>{product.discount || 0}</td>
                      <td className="description-cell">
                        {product.description.length > 50 
                          ? `${product.description.substring(0, 50)}...` 
                          : product.description}
                      </td>
                      <td>{product.type}</td>
                      <td>{product.power}</td>
                      <td>{product.lifespan}</td>
                      <td className="actions-cell">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditProduct(product.id)}
                          title="Редактировать"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Удалить"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer">
                <button 
                  className="add-product-btn"
                  onClick={() => navigate('/add-product')}
                >
                  <FaPlus /> Добавить товар
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-content">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Номер заказа</th>
                    <th>Статус заказа</th>
                    <th>Сумма заказа, руб.</th>
                    <th>Информация о заказчике</th>
                    <th>Дата создания заказа</th>
                    <th>Дата изменения заказа</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id.slice(0, 6)}...</td>
                        <td>{order.orderNumber}</td>
                        <td>{order.status}</td>
                        <td>{order.total} ₽</td>
                        <td className="customer-cell">
                          {order.customer || 'Нет данных'}
                        </td>
                        <td>{order.createdAt}</td>
                        <td>{order.updatedAt}</td>
                        <td className="actions-cell">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditOrder(order.id)}
                            title="Редактировать"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Удалить"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-orders">
                        Нет доступных заказов
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;