import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Базовый API для гостевых запросов
const guestApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Гостевые API (доступны без авторизации)
export const getProducts = async () => {
  const response = await guestApi.get('/api/products');
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await guestApi.get(`/api/products/${productId}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await guestApi.post('/orders', orderData);
  return response.data;
};