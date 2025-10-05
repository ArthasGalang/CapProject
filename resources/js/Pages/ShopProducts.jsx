
import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';
import AddProductModal from '../Components/AddProductModal';

const initialForm = {
  CategoryID: '',
  SKU: '',
  ProductName: '',
  Description: '',
  Price: '',
  Stock: '',
  Image: null,
  isActive: true,
};

const ShopProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend
    alert('Product added! (UI only)');
    handleCloseModal();
  };

  return (
    <>
      <Header />
      <main className="shop-products-main">
        <div className="shop-products-container">
          <ShopSidebar active="products" />
          <div className="shop-products-content">
            <div className="shop-products-card">
              <h1 className="shop-products-title">Product Management</h1>
              <div className="shop-products-subtitle">Manage your product listings</div>
              <div className="shop-products-header">
                <div className="shop-products-filters">
                  <select className="shop-products-select">
                    <option>All Categories</option>
                  </select>
                  <select className="shop-products-select" style={{ minWidth: 150 }}>
                    <option>All Status</option>
                  </select>
                  <select className="shop-products-select">
                    <option>Sort By: Newest</option>
                  </select>
                </div>
                <button
                  className="shop-products-add-btn"
                  onClick={handleOpenModal}
                >
                  <span className="shop-products-plus">+</span> Add New Product
                </button>
              </div>
              <div className="shop-products-grid">
                {/* Product Card Example */}
                {[1,2].map((i) => (
                  <div key={i} className="shop-product-card">
                    {/* Image Placeholder */}
                    <div className="shop-product-image-placeholder">
                      <span role="img" aria-label="product"></span>
                    </div>
                    <div className="shop-product-name">{i === 1 ? 'Smartphone' : 'Product Name'}</div>
                    <div className="shop-product-price">₱{i === 1 ? '8,000' : '249.99'}</div>
                    <div className="shop-product-category">{i === 1 ? 'Electronics' : 'Category'}</div>
                    {/* Buttons */}
                    <div className="shop-product-buttons">
                      <button className="shop-product-edit-btn">Edit</button>
                      <button className="shop-product-delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modal for Add New Product */}
      {showModal && (
        <AddProductModal
          form={form}
          onChange={handleChange}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
      <Footer />
    </>
  );
};

export default ShopProducts;
