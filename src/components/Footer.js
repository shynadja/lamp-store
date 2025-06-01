import React from 'react';
import { Link } from 'react-router-dom';
import "../index.css";

const Footer = () => {
  return (
    <footer>
      <p>2025 Завод ламп</p>
      <Link to="/login" className="authform">Войти</Link>
    </footer>
  );
};

export default Footer;