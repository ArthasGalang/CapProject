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
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="products" />
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', minHeight: 600 }}>
              <h1 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2.2rem', marginBottom: '0.2rem' }}>Product Management</h1>
              <div style={{ color: '#5C6060', fontWeight: 500, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Manage your product listings</div>
              <div style={{ background: '#f7f8fa', borderRadius: '1rem 1rem 0 0', padding: '1.2rem 1.5rem 1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-primary-light, #ffb366)' }}>
                <div style={{ display: 'flex', gap: '1.2rem' }}>
                  <select style={{ padding: '0.7rem 1.2rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem', minWidth: 170 }}>
                    <option>All Categories</option>
                  </select>
                  <select style={{ padding: '0.7rem 1.2rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem', minWidth: 150 }}>
                    <option>All Status</option>
                  </select>
                  <select style={{ padding: '0.7rem 1.2rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem', minWidth: 170 }}>
                    <option>Sort By: Newest</option>
                  </select>
                </div>
                <button
                  style={{ background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: '0.5rem', padding: '0.8rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={handleOpenModal}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>+</span> Add New Product
                </button>
              </div>
              <div style={{ padding: '2rem 0 0 0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {/* Product Card Example */}
                {[1,2].map((i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '1.1rem', boxShadow: '0 1px 6px rgba(44,204,113,0.07)', padding: '1.5rem 1.2rem 1.2rem 1.2rem', minWidth: 210, maxWidth: 220, flex: '1 1 210px', border: '1.5px solid #f0f0f0', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', position: 'relative' }}>
                    {/* Image Placeholder */}
                    <div style={{ width: 180, height: 150, background: '#f3f4f6', borderRadius: '0.7rem', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#bbb' }}>
                      <span role="img" aria-label="product"></span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1.13rem', marginBottom: 2, textAlign: 'center' }}>{i === 1 ? 'Smartphone' : 'Product Name'}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 2, textAlign: 'center' }}>₱{i === 1 ? '8,000' : '249.99'}</div>
                    <div style={{ color: 'var(--color-primary)', fontSize: '1rem', marginBottom: 10, textAlign: 'center', fontWeight: 500 }}>{i === 1 ? 'Electronics' : 'Category'}</div>
                    {/* Buttons */}
                    <div style={{ width: '100%', display: 'flex', gap: '0.7rem', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                      <button style={{ flex: 1, background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: '0.4rem', padding: '0.6rem 0', cursor: 'pointer', transition: 'background 0.2s' }}>Edit</button>
                      <button style={{ flex: 1, background: '#ff7300', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: '0.4rem', padding: '0.6rem 0', cursor: 'pointer', transition: 'background 0.2s' }}>Delete</button>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 24px rgba(44,204,113,0.13)', padding: '2.5rem 2.2rem', minWidth: 380, maxWidth: 420, width: '100%', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#aaa', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '1.2rem', textAlign: 'center' }}>Add New Product</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontWeight: 500 }}>Category</label>
                <input name="CategoryID" value={form.CategoryID} onChange={handleChange} required placeholder="Category ID" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: 4 }} />
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>SKU</label>
                <input name="SKU" value={form.SKU} onChange={handleChange} required placeholder="SKU" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: 4 }} />
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Product Name</label>
                <input name="ProductName" value={form.ProductName} onChange={handleChange} required placeholder="Product Name" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: 4 }} />
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Description</label>
                <textarea name="Description" value={form.Description} onChange={handleChange} required placeholder="Description" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: 4, minHeight: 60 }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 500 }}>Price</label>
                  <input name="Price" value={form.Price} onChange={handleChange} required placeholder="Price" type="number" min="0" step="0.01" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 500 }}>Stock</label>
                  <input name="Stock" value={form.Stock} onChange={handleChange} required placeholder="Stock" type="number" min="0" step="1" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: 4 }} />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Image</label>
                <input name="Image" type="file" accept="image/*" onChange={handleChange} style={{ width: '100%', marginTop: 4 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} id="isActive" />
                <label htmlFor="isActive" style={{ fontWeight: 500, cursor: 'pointer' }}>Active</label>
              </div>
              <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', borderRadius: '0.5rem', padding: '0.9rem 0', cursor: 'pointer', marginTop: 10 }}>Add Product</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ShopProducts;
