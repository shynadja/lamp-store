import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetProduct, adminUploadImage, adminUpdateProduct } from '../api/api';
import '../index.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    type: '',
    power: '',
    lifespan: '',
    description: '',
    image_url: '',
    discount: 0,
    image: null,
    imagePreview: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await adminGetProduct(id);
        
        let typeName = '';
        switch (productData.type_id) {
          case 1: typeName = 'LED'; break;
          case 2: typeName = 'лампы накаливания'; break;
          case 3: typeName = 'умные лампы'; break;
          default: typeName = 'LED';
        }
        
        setProduct({
          ...productData,
          type: typeName,
          imagePreview: productData.image_url
        });
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
        console.error('Ошибка загрузки товара:', err);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

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

  const getTypeId = (typeName) => {
    switch (typeName) {
      case 'LED': return 1;
      case 'лампы накаливания': return 2;
      case 'умные лампы': return 3;
      default: return 1;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = product.image_url;
      
      if (product.image) {
        const uploadData = await adminUploadImage(product.image);
        imageUrl = uploadData.image_url;
      }

      const productData = {
        name: product.name,
        type_id: getTypeId(product.type),
        power: product.power,
        lifespan: product.lifespan,
        price: parseFloat(product.price),
        description: product.description,
        image_url: imageUrl,
        discount: parseFloat(product.discount) || 0
      };

      await adminUpdateProduct(id, productData);
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Произошла ошибка при сохранении изменений');
      console.error('Ошибка:', err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product.id) {
    return (
      <div className="product-page-container">

        <main className="product-page">
          <div className="loading-indicator">Загрузка товара...</div>
        </main>

      </div>
    );
  }

  return (
    <div className="product-page-container">

      <main className="product-page">
        <div className="product-content">
          <div className="product-left-column">
            <div className="product-images">
              {product.imagePreview ? (
                <img 
                  src={product.imagePreview} 
                  alt={product.name} 
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
                Изменить фото
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
              {error && <div className="error-message">{error}</div>}
              
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
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="discount">Скидка (%):</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={product.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              
              <div className="product-specs">
                <h3>Характеристики:</h3>
                <div className="specs-grid">
                  <div className="spec-row">
                    <label htmlFor="type">Тип:</label>
                    <select
                      id="type"
                      name="type"
                      value={product.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="LED">LED</option>
                      <option value="лампы накаливания">Лампы накаливания</option>
                      <option value="умные лампы">Умные лампы</option>
                    </select>
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
                  rows="5"
                  required
                />
              </div>

              <div className="admin-actions">
                <button 
                  type="submit" 
                  className="edit-button"
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
};

export default EditProductPage;