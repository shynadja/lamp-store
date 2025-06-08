import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import '../index.css';

// Моковые данные администратора (в реальном приложении должны храниться на сервере)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // SHA-256 хэш пароля "admin"
};

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Функция для хэширования пароля с SHA-256
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Проверка учетных данных
      const passwordHash = hashPassword(password);
      
      if (username === ADMIN_CREDENTIALS.username && 
          passwordHash === ADMIN_CREDENTIALS.passwordHash) {
        // В реальном приложении здесь должен быть запрос к API
        // и получение токена аутентификации
        
        // Создаем моковый токен
        const mockToken = CryptoJS.AES.encrypt(
          JSON.stringify({ username, role: 'admin' }),
          'secret_key'
        ).toString();
        
        // Сохраняем токен в localStorage
        localStorage.setItem('adminToken', mockToken);
        
        // Перенаправляем в админ-панель
        navigate('/admin/login');
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err) {
      setError('Ошибка при авторизации');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h1>Авторизация</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Логин</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button type="submit" className="login-button">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;