import React, { useEffect, useState } from 'react';

const AddProductModal = ({ form, onChange, onClose, onSubmit, shopId }) => {
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Array of File or string (URL)
  const [activeIdx, setActiveIdx] = useState(0);
  // Status default
  useEffect(() => {
    if (!form.Status) {
      onChange({ target: { name: 'Status', value: 'OffSale' } });
    }
    if (!form.ShopID && shopId) {
      onChange({ target: { name: 'ShopID', value: shopId } });
    }
  }, [form.Status, form.ShopID, shopId, onChange]);

  // No backend: just log and close
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product form (frontend only):', form);
    if (onSubmit) onSubmit(form);
    if (onClose) onClose();
  };

  // No backend: use static categories for demo
  useEffect(() => {
    setCategories([
      { CategoryID: 1, CategoryName: 'Category 1' },
      { CategoryID: 2, CategoryName: 'Category 2' },
      { CategoryID: 3, CategoryName: 'Category 3' },
    ]);
  }, []);


  // Handle file input change
  const handleImageChange = (e) => {
  debugger; // Debug image selection
  debugger; // Debug product submission
    const files = Array.from(e.target.files || []);
    // Merge with existing (avoid duplicates by name)
    const existing = imageFiles.filter(f => typeof f === 'string' || !files.some(nf => nf.name === f.name));
    const next = [...existing, ...files];
    setImageFiles(next);
    // Update main/additional images in form
    if (next.length > 0) {
      // Always use File object if available
      const mainImg = next[activeIdx] || next[0];
      const additionalImgs = next.filter((_, i) => i !== activeIdx);
      onChange({ target: { name: 'MainImage', value: mainImg } });
      onChange({ target: { name: 'AdditionalImages', value: additionalImgs } });
    } else {
      onChange({ target: { name: 'MainImage', value: null } });
      onChange({ target: { name: 'AdditionalImages', value: [] } });
    }
    onChange({ target: { name: 'Image', value: next } }); // For backward compatibility
    setActiveIdx(next.length > 0 ? next.length - 1 : 0); // Show last added or reset
  };

  // Remove image by index
  const handleRemoveImage = idx => {
    const next = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(next);
    // Update main/additional images in form
    if (next.length > 0) {
      const newMainIdx = Math.max(0, idx - 1);
      onChange({ target: { name: 'MainImage', value: next[newMainIdx] } });
      onChange({ target: { name: 'AdditionalImages', value: next.filter((_, i) => i !== newMainIdx) } });
    } else {
      onChange({ target: { name: 'MainImage', value: null } });
      onChange({ target: { name: 'AdditionalImages', value: [] } });
    }
    onChange({ target: { name: 'Image', value: next } });
    setActiveIdx(Math.max(0, idx - 1));
  };

  // Carousel navigation
  const handlePrev = () => setActiveIdx(activeIdx > 0 ? activeIdx - 1 : imageFiles.length - 1);
  const handleNext = () => setActiveIdx(activeIdx < imageFiles.length - 1 ? activeIdx + 1 : 0);

  return (
    <div className="shop-modal-overlay">
      <div className="shop-modal" style={{ maxWidth: 1200, minWidth: 800, width: '98%' }}>
        <button onClick={onClose} className="shop-modal-close">&times;</button>
        <h2 className="shop-modal-title" style={{ textAlign: 'center', marginBottom: 32, color: '#28b864' }}>Add New Product</h2>
        <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Left: Product Images (carousel style) */}
          <div style={{ flex: '0 0 420px', maxWidth: 440, minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Main image preview */}
            <div style={{ width: 340, height: 340, background: '#eee', borderRadius: 12, border: '2px solid #28b864', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {imageFiles.length === 0 ? (
                <span role="img" aria-label="product" style={{ fontSize: 80, color: '#bbb' }}>🖼️</span>
              ) : (
                <img
                  src={typeof imageFiles[activeIdx] === 'string' ? imageFiles[activeIdx] : URL.createObjectURL(imageFiles[activeIdx])}
                  alt={`Product ${activeIdx+1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                />
              )}
            </div>
            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              {imageFiles.map((_, idx) => (
                <span key={idx} style={{ width: 10, height: 10, borderRadius: '50%', background: idx === activeIdx ? '#28b864' : '#ccc', display: 'inline-block' }}></span>
              ))}
            </div>
            {/* Thumbnails carousel (all images) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={handlePrev} style={{ background: 'none', border: 'none', fontSize: 24, color: '#28b864', cursor: 'pointer', marginRight: 4 }} disabled={imageFiles.length < 2}>&lt;</button>
              {imageFiles.map((img, idx) => (
                <div
                  key={idx}
                  style={{ width: 60, height: 60, borderRadius: 8, border: idx === activeIdx ? '2px solid #28b864' : '1px solid #222', overflow: 'hidden', background: '#f3f4f6', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setActiveIdx(idx)}
                >
                  <img
                    src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                    alt={`Thumb ${idx+1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button type="button" onClick={e => { e.stopPropagation(); handleRemoveImage(idx); }} style={{ position: 'absolute', top: 2, right: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontWeight: 'bold', color: '#d00', boxShadow: '0 1px 4px #0002', fontSize: 12 }}>×</button>
                </div>
              ))}
              <button type="button" onClick={handleNext} style={{ background: 'none', border: 'none', fontSize: 24, color: '#28b864', cursor: 'pointer', marginLeft: 4 }} disabled={imageFiles.length < 2}>&gt;</button>
            </div>
            {/* Add Image button */}
            <label htmlFor="add-image-input" style={{ width: 180, marginTop: 8, display: 'block' }}>
              <div style={{ border: '2px solid #28b864', borderRadius: 8, padding: '0.7rem 0', textAlign: 'center', color: '#28b864', fontWeight: 500, fontSize: 18, cursor: 'pointer', background: '#fff', marginBottom: 8 }}>
                Add Image
              </div>
              <input id="add-image-input" name="Image" type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
          {/* Right: Product Details */}
          <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 400, maxWidth: 600, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', gap: '2.2rem' }}>
            <div style={{ flex: 2 }}>
              <label className="shop-modal-label">Product Name</label>
              <input name="ProductName" value={form.ProductName} onChange={onChange} required placeholder="Product Name" className="shop-modal-input" style={{ width: '100%', fontSize: 18, padding: '0.7rem 1.2rem' }} />
            </div>
            <div style={{ flex: 1, maxWidth: 160 }}>
              <label className="shop-modal-label">SKU</label>
              <input name="SKU" value={form.SKU} onChange={onChange} required placeholder="SKU" className="shop-modal-input" style={{ width: '100%', fontSize: 16, padding: '0.7rem 1.2rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2.2rem' }}>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Category</label>
              <select name="CategoryID" value={form.CategoryID} onChange={onChange} required className="shop-modal-input" style={{ width: '100%', fontSize: 18, padding: '0.7rem 1.2rem' }}>
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c.CategoryID || c.id} value={c.CategoryID || c.id}>{c.CategoryName}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Stock</label>
              <input name="Stock" value={form.Stock} onChange={onChange} required placeholder="Stock" type="number" min="0" step="1" className="shop-modal-input" style={{ width: '100%', fontSize: 18, padding: '0.7rem 1.2rem' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="shop-modal-label">Price</label>
              <input name="Price" value={form.Price} onChange={onChange} required placeholder="Price" type="number" min="0" step="0.01" className="shop-modal-input" style={{ width: '100%', fontSize: 18, padding: '0.7rem 1.2rem' }} />
            </div>
          </div>
          <div>
            <label className="shop-modal-label">Description</label>
            <textarea name="Description" value={form.Description} onChange={onChange} required placeholder="Description" className="shop-modal-textarea" style={{ minHeight: 180, fontSize: 18, padding: '0.7rem 1.2rem', width: '100%', resize: 'none' }} />
          </div>
          <div>
            <label className="shop-modal-label">Status</label>
            <select name="Status" value={form.Status || 'OffSale'} onChange={onChange} required className="shop-modal-input" style={{ width: '100%', fontSize: 18, padding: '0.7rem 1.2rem' }}>
              <option value="Active">Active</option>
              <option value="OutOfStock">OutOfStock</option>
              <option value="OffSale">OffSale</option>
            </select>
          </div>
          <button type="submit" className="shop-modal-submit" style={{ marginTop: 18, width: '100%' }}>Add Product</button>
        </form>
      </div>
    </div>
  </div>

  );
}

export default AddProductModal;
