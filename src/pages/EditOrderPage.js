import {React, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const OrderEditPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    // Состояние заказа
    const [order, setOrder] = useState({
        id: orderId,
        status: '',
        items: [],
        total: 0,
        discount: 0,
        finalTotal: 0,
        customerInfo: {
            name: '',
            phone: '',
            email: ''
        }
    });

    // Состояние для поиска
    const [searchResult, setSearchResult] = useState(null);

    // Обработчик поиска
    const handleSearch = (e) => {
        const query = e.target.value;
        
        // Если введен номер заказа (6 цифр), ищем заказ
        if (/^\d{6}$/.test(query)) {
            // Здесь будет запрос к API для поиска заказа
            // Теперь возвращаем пустой заказ вместо мок-данных
            setSearchResult({
                id: query,
                status: '',
                items: [],
                total: 0,
                discount: 0,
                finalTotal: 0,
                customerInfo: {
                    name: '',
                    phone: '',
                    email: ''
                }
            });
        } else {
            setSearchResult(null);
        }
    };

    // Применить найденный заказ
    const applySearchResult = () => {
        if (searchResult) {
            setOrder(searchResult);
            setSearchResult(null);
        }
    };

    // Обработчик изменения количества товара
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setOrder(prevOrder => {
            const updatedItems = prevOrder.items.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            
            const newTotal = updatedItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
            
            return {
                ...prevOrder,
                items: updatedItems,
                total: newTotal,
                finalTotal: newTotal - prevOrder.discount
            };
        });
    };

    // Обработчик изменения статуса заказа
    const handleStatusChange = (e) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            status: e.target.value
        }));
    };

    // Обработчик сохранения заказа
    const handleSave = () => {
        // Здесь будет логика сохранения изменений через API
        console.log('Заказ сохранен:', order);
        navigate('/admin/orders');
    };

    // Обработчик удаления заказа
    const handleDelete = () => {
        // Здесь будет логика удаления заказа через API
        console.log('Заказ удален:', orderId);
        navigate('/admin/orders');
    };

    // Обработчик добавления товара
    const handleAddProduct = () => {
        // Здесь будет логика добавления товара в заказ
        console.log('Добавление товара в заказ');
    };

    return (
        <div className="page-container">
            <Header onSearch={handleSearch} />
            
            {/* Модальное окно для результатов поиска */}
            {searchResult && (
                <div className="search-modal">
                    <div className="search-modal-content">
                        <h3>Найден заказ №{searchResult.id}</h3>
                        <p>Статус: {searchResult.status || 'Не указан'}</p>
                        <p>Товаров: {searchResult.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        <p>Сумма: {searchResult.finalTotal} ₽</p>
                        <div className="search-modal-actions">
                            <button onClick={applySearchResult}>Загрузить заказ</button>
                            <button onClick={() => setSearchResult(null)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="order-edit-container">
                <div className="order-edit-content">
                    <div className="order-edit-header">
                        <h1>Редактирование заказа</h1>
                        <div className="order-edit-actions">
                            <button className="btn-add" onClick={handleAddProduct}>Добавить товар</button>
                            <button className="btn-save" onClick={handleSave}>Сохранить</button>
                            <button className="btn-delete" onClick={handleDelete}>Удалить</button>
                        </div>
                    </div>

                    <div className="order-info">
                        <h2>Заказ №{order.id}</h2>
                        <div className="order-status-container">
                            <label>Статус:</label>
                            <select value={order.status} onChange={handleStatusChange}>
                                <option value="">Выберите статус</option>
                                <option value="оформлен">Оформлен</option>
                                <option value="собран">Собран</option>
                                <option value="получен">Получен</option>
                            </select>
                        </div>
                    </div>

                    <div className="order-items">
                        <h3>Товары:</h3>
                        {order.items.length > 0 ? (
                            <>
                                <div className="order-items-header">
                                    <span>Название товара</span>
                                    <span>Количество</span>
                                    <span>Стоимость</span>
                                    <span>Стоимость со скидкой</span>
                                </div>
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span className="item-name">{item.name}</span>
                                        <div className="item-quantity">
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span className="item-price">{item.price * item.quantity} ₽</span>
                                        <span className="item-discounted-price">{item.discountedPrice * item.quantity} ₽</span>
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
                            <span>{order.total} ₽</span>
                        </div>
                        <div className="summary-row">
                            <span>Скидка:</span>
                            <span>{order.discount} ₽</span>
                        </div>
                        <div className="summary-row total">
                            <span>Итого:</span>
                            <span>{order.finalTotal} ₽</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderEditPage;