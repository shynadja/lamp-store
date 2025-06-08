import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { adminGetOrders, adminDeleteOrder, adminGetProducts, adminDeleteProduct } from '../api/api';
import '../index.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await adminGetOrders();
      const formattedOrders = ordersData.map(order => {
        const customerInfo = order.customer_name 
          ? `${order.customer_name} | ${order.customer_phone}${order.customer_email ? ` | ${order.customer_email}` : ''}`
          : `Гость (ID: ${order.user_id || 'неизвестен'})`;

        const createdAt = new Date(order.created_at);
        const updatedAt = new Date(order.updated_at || order.created_at);

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
          items: order.items,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email
        };
      });
      setOrders(formattedOrders);
    } catch (err) {
      setError('Не удалось загрузить заказы');
      console.error('Ошибка загрузки заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await adminDeleteOrder(orderId);
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) {
        setError('Не удалось удалить заказ');
        console.error('Ошибка удаления заказа:', err);
      }
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/admin/edit-order/${orderId}`);
  };

  const handleAddProduct = () => {
    navigate('/admin/add-product');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  // Добавляем функцию для загрузки продуктов
const fetchProducts = async () => {
  setLoading(true);
  try {
    const productsData = await adminGetProducts();
    setProducts(productsData);
  } catch (err) {
    setError('Не удалось загрузить товары');
    console.error('Ошибка загрузки товаров:', err);
  } finally {
    setLoading(false);
  }
};

// Обновляем useEffect для загрузки продуктов при переключении вкладки
useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    navigate('/admin/login');
    return;
  }

  if (activeTab === 'orders') {
    fetchOrders();
  } else {
    fetchProducts();
  }
}, [navigate, activeTab]);

const handleDeleteProduct = async (productId) => {
  if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
    try {
      await adminDeleteProduct(productId); // Используем adminDeleteProduct
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      setError('Не удалось удалить товар');
      console.error('Ошибка удаления товара:', err);
    }
  }
};

  return (
    <div className="admin-page-container">
      <div className="admin-header-container">
        <div className="admin-header-content">
          <h1 className="admin-title">Панель администратора</h1>
          <div className="admin-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
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

        {error && <div className="error-message">{error}</div>}

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
                  onClick={handleAddProduct}
                >
                  <FaPlus /> Добавить товар
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-content">
            <div className="admin-table-container">
              {loading ? (
                <div className="loading-indicator">Загрузка заказов...</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Номер заказа</th>
                      <th>Статус</th>
                      <th>Сумма</th>
                      <th>Клиент</th>
                      <th>Дата создания</th>
                      <th>Дата изменения</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.orderNumber}</td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.total} ₽</td>
                          <td className="customer-cell">
                            <div className="customer-info">
                              <div>{order.customer_name || 'Не указано'}</div>
                              <div>{order.customer_phone || 'Не указано'}</div>
                              {order.customer_email && <div>{order.customer_email}</div>}
                            </div>
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
                        <td colSpan="7" className="no-orders">
                          {error ? 'Ошибка загрузки' : 'Нет доступных заказов'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;