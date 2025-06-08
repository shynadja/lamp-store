import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import EditOrderPage from './pages/EditOrderPage';
import AddProductPage from './pages/AddProductPage';
import AdminPage from './pages/AdminPage';
import EditProductPage from './pages/EditProductPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
     <Routes>
      <Route index element={<AdminLoginPage />} />
      
      {/* Защищенные маршруты */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/login" element={<AdminPage />} />
        <Route path="/admin/edit-order/:id" element={<EditOrderPage />} />
        <Route path="/admin/add-product" element={<AddProductPage />} />
        <Route path="/admin/edit-product/:id" element={<EditProductPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
      </Routes>

  );
}

export default App;