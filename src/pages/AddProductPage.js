import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    type: '',
    power: '',
    lifespan: '',
    description: '',
    image: null,
    imagePreview: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика сохранения товара
    console.log('Товар добавлен:', product);
    navigate('/');
  };

  return (
    <div className="product-page-container">
      <Header />
      <main className="product-page">
        <div className="product-content">
          <div className="product-left-column">
            <div className="product-images">
              {product.imagePreview ? (
                <img 
                  src={product.imagePreview} 
                  alt="Предпросмотр" 
                  className="main-image" 
                />
              ) : (
                <div className="image-placeholder">
                  <span>Изображение товара</span>
                </div>
              )}
            </div>
            <div className="admin-actions">
              <label htmlFor="image-upload" className="edit-button">
                Добавить фото
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          
          <div className="product-details">
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <label htmlFor="name">Название товара:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <label htmlFor="price">Стоимость:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="product-specs">
                <h3>Характеристики:</h3>
                <div className="specs-grid">
                  <div className="spec-row">
                    <label htmlFor="type">Тип:</label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={product.type}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="spec-row">
                    <label htmlFor="power">Мощность:</label>
                    <input
                      type="text"
                      id="power"
                      name="power"
                      value={product.power}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="spec-row">
                    <label htmlFor="lifespan">Срок службы:</label>
                    <input
                      type="text"
                      id="lifespan"
                      name="lifespan"
                      value={product.lifespan}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <label htmlFor="description">Описание:</label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="admin-actions">
                <button type="submit" className="edit-button">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage;