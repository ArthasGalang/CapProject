
import React, { useState, useEffect } from 'react';
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
  Image: [], // array of File or string
  isActive: true,
};

const ShopProducts = ({ shopId }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (shopId) {
      fetch(`/api/products?shop_id=${shopId}`)
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([]));
    }
  }, [shopId]);

  // Accepts both normal and custom events (from AddProductModal)
  const handleChange = (e) => {
    if (e && e.target && e.target.name === 'Image') {
      // Array of File or string
      setForm({ ...form, Image: e.target.value });
    } else if (e && e.target) {
      const { name, value, type, checked, files } = e.target;
      if (type === 'checkbox') {
        setForm({ ...form, [name]: checked });
      } else {
        setForm({ ...form, [name]: value });
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopId) {
      alert('No shop selected.');
      return;
    }
    const fd = new FormData();
    fd.append('ShopID', shopId);
    fd.append('CategoryID', form.CategoryID);
    fd.append('SKU', form.SKU);
    fd.append('ProductName', form.ProductName);
    fd.append('Description', form.Description);
    fd.append('Price', form.Price);
    fd.append('Stock', form.Stock);
    fd.append('Status', form.Status || 'OffSale');
    fd.append('IsActive', form.IsActive !== undefined ? form.IsActive : true);
    // Images
    if (Array.isArray(form.Image)) {
      form.Image.forEach((img, idx) => {
        if (img instanceof File) {
          fd.append('Image[]', img);
        } else if (typeof img === 'string') {
          fd.append('ImageUrl[]', img);
        }
      });
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        alert('Product added!');
        handleCloseModal();
        // Optionally refresh products list
        fetch(`/api/products?shop_id=${shopId}`)
          .then(res => res.json())
          .then(data => setProducts(Array.isArray(data) ? data : []))
          .catch(() => setProducts([]));
      } else {
        alert('Failed to add product.');
      }
    } catch (err) {
      alert('Error adding product.');
    }
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
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 8 }}>
                    <select className="shop-products-select" style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}>
                      <option>All Categories</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 8 }}>
                    <select className="shop-products-select" style={{ minWidth: 150, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}>
                      <option>All Status</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select className="shop-products-select" style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}>
                      <option>Sort By: Newest</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                </div>
                <button
                  className="shop-products-add-btn"
                  onClick={handleOpenModal}
                >
                  <span className="shop-products-plus">+</span> Add New Product
                </button>
              </div>
              <div className="shop-products-grid">
                {products.length > 0 ? (
                  products.map(product => (
                    <div key={product.ProductID} className="shop-product-card">
                      <div className="shop-product-image-placeholder">
                        <span role="img" aria-label="product"></span>
                      </div>
                      <div className="shop-product-name">{product.ProductName}</div>
                      <div className="shop-product-price">₱{parseFloat(product.Price).toLocaleString()}</div>
                      <div className="shop-product-category">{product.CategoryName || product.CategoryID || 'Category'}</div>
                      <div className="shop-product-buttons">
                        <button className="shop-product-edit-btn">Edit</button>
                        <button className="shop-product-delete-btn">Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{textAlign: 'center', color: '#888', width: '100%'}}>No products found for this shop.</div>
                )}
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
          shopId={shopId}
        />
      )}
      <Footer />
    </>
  );
};

export default ShopProducts;
