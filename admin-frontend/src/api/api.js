import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API для администратора с авторизацией
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для авторизации только для adminApi
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Админские API (требуют авторизации)
export const adminGetOrders = async () => {
  const response = await adminApi.get('/orders');
  return response.data;
};

export const adminGetOrder = async (orderId) => {
  const response = await adminApi.get(`/orders/${orderId}`);
  return response.data;
};

export const adminUpdateOrder = async (orderId, orderData) => {
  const response = await adminApi.put(`/orders/${orderId}`, orderData);
  return response.data;
};

export const adminDeleteOrder = async (orderId) => {
  const response = await adminApi.delete(`/orders/${orderId}`);
  return response.data;
};

export const adminCreateProduct = async (productData) => {
  const response = await adminApi.post('/api/products', productData);
  return response.data;
};

export const adminGetProduct = async (productId) => {
  const response = await adminApi.get(`/api/products/${productId}`);
  return response.data;
};

export const adminUpdateProduct = async (productId, productData) => {
  const response = await adminApi.put(`/api/products/${productId}`, productData);
  return response.data;
};

export const adminDeleteProduct = async (productId) => {
  const response = await adminApi.delete(`/api/products/${productId}`);
  return response.data;
};

export const adminGetProducts = async () => {
  const response = await adminApi.get('/api/products');
  return response.data;
};

export const adminUploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  const response = await adminApi.post('/api/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export { adminApi };