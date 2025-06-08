import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Header = ({ onSearch }) => {
  return (
    <header className="header-grid">
      <div className="logo">
        <img src="/images/logo.png" alt="Логотип завода ламп" />
      </div>
      
      <nav className="main-nav">
        <Link to="/" className="nav-link">Главная</Link>
        <Link to="/cart" className="nav-link cart-link">Корзина</Link>
      </nav>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Поиск по сайту" 
          onChange={onSearch}
        />
        <button>Найти</button>
      </div>
    </header>
  );
};

export default Header;