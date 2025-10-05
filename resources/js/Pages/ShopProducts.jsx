import React, { useState } from 'react';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';


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
        <div className="shop-modal-overlay">
          <div className="shop-modal">
            <button onClick={handleCloseModal} className="shop-modal-close">&times;</button>
            <h2 className="shop-modal-title">Add New Product</h2>
            <form onSubmit={handleSubmit} className="shop-modal-form">
              <div>
                <label className="shop-modal-label">Category</label>
                <input name="CategoryID" value={form.CategoryID} onChange={handleChange} required placeholder="Category ID" className="shop-modal-input" />
              </div>
              <div>
                <label className="shop-modal-label">SKU</label>
                <input name="SKU" value={form.SKU} onChange={handleChange} required placeholder="SKU" className="shop-modal-input" />
              </div>
              <div>
                <label className="shop-modal-label">Product Name</label>
                <input name="ProductName" value={form.ProductName} onChange={handleChange} required placeholder="Product Name" className="shop-modal-input" />
              </div>
              <div>
                <label className="shop-modal-label">Description</label>
                <textarea name="Description" value={form.Description} onChange={handleChange} required placeholder="Description" className="shop-modal-textarea" />
              </div>
              <div className="shop-modal-row">
                <div style={{ flex: 1 }}>
                  <label className="shop-modal-label">Price</label>
                  <input name="Price" value={form.Price} onChange={handleChange} required placeholder="Price" type="number" min="0" step="0.01" className="shop-modal-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="shop-modal-label">Stock</label>
                  <input name="Stock" value={form.Stock} onChange={handleChange} required placeholder="Stock" type="number" min="0" step="1" className="shop-modal-input" />
                </div>
              </div>
              <div>
                <label className="shop-modal-label">Image</label>
                <input name="Image" type="file" accept="image/*" onChange={handleChange} className="shop-modal-file" />
              </div>
              <div className="shop-modal-checkbox-wrapper">
                <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} id="isActive" />
                <label htmlFor="isActive" className="shop-modal-checkbox-label">Active</label>
              </div>
              <button type="submit" className="shop-modal-submit">Add Product</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ShopProducts;
