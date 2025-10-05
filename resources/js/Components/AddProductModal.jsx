import React from 'react';

const AddProductModal = ({ form, onChange, onClose, onSubmit }) => (
  <div className="shop-modal-overlay">
    <div className="shop-modal" style={{ maxWidth: 900, minWidth: 600, width: '90%' }}>
      <button onClick={onClose} className="shop-modal-close">&times;</button>
      <h2 className="shop-modal-title" style={{ textAlign: 'left', marginBottom: 32 }}>Add New Product</h2>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left: Product Image */}
        <div style={{ flex: '0 0 320px', maxWidth: 340, minWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="shop-product-image-placeholder" style={{ width: 260, height: 260, marginBottom: 18, background: '#f3f4f6', borderRadius: '1rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {form.Image ? (
              <img src={typeof form.Image === 'string' ? form.Image : URL.createObjectURL(form.Image)} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span role="img" aria-label="product" style={{ fontSize: 80, color: '#bbb' }}>🖼️</span>
            )}
          </div>
          <label className="shop-modal-label" style={{ marginBottom: 6 }}>Change Image</label>
          <input name="Image" type="file" accept="image/*" onChange={onChange} className="shop-modal-file" style={{ marginBottom: 12 }} />
        </div>
        {/* Right: Product Details */}
        <form onSubmit={onSubmit} style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Product Name</label>
              <input name="ProductName" value={form.ProductName} onChange={onChange} required placeholder="Product Name" className="shop-modal-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">SKU</label>
              <input name="SKU" value={form.SKU} onChange={onChange} required placeholder="SKU" className="shop-modal-input" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Category</label>
              <input name="CategoryID" value={form.CategoryID} onChange={onChange} required placeholder="Category ID" className="shop-modal-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Stock</label>
              <input name="Stock" value={form.Stock} onChange={onChange} required placeholder="Stock" type="number" min="0" step="1" className="shop-modal-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Price</label>
              <input name="Price" value={form.Price} onChange={onChange} required placeholder="Price" type="number" min="0" step="0.01" className="shop-modal-input" />
            </div>
          </div>
          <div>
            <label className="shop-modal-label">Description</label>
            <textarea name="Description" value={form.Description} onChange={onChange} required placeholder="Description" className="shop-modal-textarea" style={{ minHeight: 80 }} />
          </div>
          <div className="shop-modal-checkbox-wrapper" style={{ marginTop: 8 }}>
            <input name="isActive" type="checkbox" checked={form.isActive} onChange={onChange} id="isActive" />
            <label htmlFor="isActive" className="shop-modal-checkbox-label">Active</label>
          </div>
          <button type="submit" className="shop-modal-submit" style={{ marginTop: 18, width: '100%' }}>Add Product</button>
        </form>
      </div>
    </div>
  </div>
);

export default AddProductModal;
