import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ProductPage from './pages/ProductPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import EditOrderPage from './pages/EditOrderPage';
import AddProductPage from './pages/AddProductPage';
import AdminPage from './pages/AdminPage';
import EditProductPage from './pages/EditProductPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}></Route>
      <Route index element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/edit-order/:id" element={<EditOrderPage />} />
      <Route path="/add-product" element={<AddProductPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/edit-product/:id" element={<EditProductPage />} />
    </Routes>
  );
}

export default App;
