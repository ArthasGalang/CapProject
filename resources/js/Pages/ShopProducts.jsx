
import React, { useState, useEffect, useRef } from 'react';
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
  Image: [], // array of File or string
  isActive: true,
};

const ShopProducts = ({ shopId }) => {
  // Filter states
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSort, setFilterSort] = useState('newest');
  // Categories state
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);
  // Add Product Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    ProductName: '',
    SKU: '',
    CategoryID: '',
    Price: '',
    Stock: '',
    Description: '',
    Status: 'Active', // 'Active' or 'OffSale'
    Image: [],
  });
  const [addImageIndex, setAddImageIndex] = useState(0);
  // Modal state for product details
  const [showDetails, setShowDetails] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [detailsImageIndex, setDetailsImageIndex] = useState(0);
  const [detailsEditMode, setDetailsEditMode] = useState(false);
  // Only details tab now
  // Open details modal
  const openDetails = (product) => {
    // Log raw AdditionalImages value from the product row (DB) for debugging
    try {
      console.log('openDetails: raw AdditionalImages for product', product.ProductID, product.AdditionalImages ?? product.AdditionalImagesRaw ?? null);
    } catch (e) { console.log('openDetails: error reading AdditionalImages', e); }

    // Also log normalized URLs that the UI will use
    try {
      const imgs = getProductImages(product);
      console.log('openDetails: normalized product image URLs', product.ProductID, imgs);
    } catch (e) { console.log('openDetails: error normalizing images', e); }

    // Clone product into editable state to avoid mutating list directly
    const clone = JSON.parse(JSON.stringify(product));
    // Ensure AdditionalImages is an array in the editable clone
    try {
      if (!clone.AdditionalImages) clone.AdditionalImages = [];
      else if (typeof clone.AdditionalImages === 'string' && clone.AdditionalImages.startsWith('[')) {
        const parsed = JSON.parse(clone.AdditionalImages);
        if (Array.isArray(parsed)) clone.AdditionalImages = parsed;
      }
    } catch (e) { clone.AdditionalImages = clone.AdditionalImages || []; }

    setDetailsProduct(clone);
    setShowDetails(true);
    setDetailsImageIndex(0);
    setDetailsEditMode(false);
  // Only details tab now
  };

  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
    setDetailsProduct(null);
    setDetailsImageIndex(0);
    setDetailsEditMode(false);
  // Only details tab now
  };

  // Ref for hidden file input in details modal
  const detailsFileRef = useRef(null);

  const handleAddImageToDetails = (files) => {
    if (!files || files.length === 0) return;
    const imgs = Array.from(files);
    const clone = { ...detailsProduct };
    clone.AdditionalImages = clone.AdditionalImages || [];
    imgs.forEach(f => {
      // Create a temporary preview URL; server upload will be handled on Save if implemented
      try {
        const url = URL.createObjectURL(f);
        clone.AdditionalImages.push(url);
      } catch (e) {
        // if not a File (string), push as-is
        clone.AdditionalImages.push(f);
      }
    });
    setDetailsProduct(clone);
  };
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (shopId) {
      setLoading(true);
      fetch(`/api/products?shop_id=${shopId}`)
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [shopId]);

  // Helpers to normalize product image fields
  const placeholderProductImage = 'https://via.placeholder.com/320x360?text=No+Image';

  const normalizeImageUrl = (val) => {
    if (!val) return null;
    if (typeof val !== 'string') return null;
    let s = val.trim();

    // If looks like a JSON array string, try to parse and use first element
    if (s.startsWith('[')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length) {
          // recursively normalize first usable entry
          for (const item of parsed) {
            const nu = normalizeImageUrl(item);
            if (nu) return nu;
          }
        }
      } catch (e) {
        // fallthrough to cleaning
      }
    }

    // If the string contains encoded JSON-like content (e.g. %22...), decode it first
    try {
      if (/%22|%5B|%5D/.test(s)) {
        const decoded = decodeURIComponent(s);
        if (decoded && decoded !== s) s = decoded;
      }
    } catch (e) { /* ignore decode errors */ }

    // If it's a blob or data URL (local preview), return as-is
    if (s.startsWith('blob:') || s.startsWith('data:') || s.startsWith('file:')) return s;

    // Strip surrounding quotes or brackets
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      s = s.slice(1, -1);
    }
    s = s.replace(/^[\[\]\s\"]+|[\[\]\s\"]+$/g, '');

    if (!s) return null;

    // Normalize repeated slashes (but keep protocol if present)
    // First, if full URL, return as-is after decoding
    if (s.startsWith('http://') || s.startsWith('https://')) {
      // collapse duplicate slashes after protocol
      return s.replace(/([^:]\/)\/+/, '$1');
    }

    // Remove any leading slashes
    s = s.replace(/^\/+/, '');

    // Remove leading storage/ if present
    s = s.replace(/^storage[\\/]+/, '');

    // Collapse double slashes in the path
    s = s.replace(/\\/g, '/');
    s = s.replace(/(^[^:\/]*:)?\/\/+/, (m) => m); // keep simple
    s = s.replace(/([^:]\/)\/+/g, '$1');

    return `/storage/${s}`;
  };

  const getProductImages = (product) => {
    if (!product) return [];
    // Build images list: main Image(s) first, then AdditionalImages
    const collected = [];

    // Helper to push parsed values (string or array)
    const pushParsed = (val) => {
      if (!val && val !== 0) return;
      if (Array.isArray(val)) {
        for (const it of val) collected.push(it);
      } else if (typeof val === 'string') {
        const s = val.trim();
        // try JSON parse
        if (s.startsWith('[')) {
          try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) {
              for (const it of parsed) collected.push(it);
              return;
            }
          } catch (e) { /* fallthrough */ }
        }
        collected.push(s);
      } else {
        collected.push(val);
      }
    };

    // Main image field may be stored as JSON (array) or string
    if (product.Image) pushParsed(product.Image);
    if (product.Images) pushParsed(product.Images);
    if (product.ImageUrl) pushParsed(product.ImageUrl);

    // Now AdditionalImages explicitly (this is what you asked to show)
    if (product.AdditionalImages) pushParsed(product.AdditionalImages);

    // Fallbacks: ImagesJson or other variants
    if (product.ImagesJson) pushParsed(product.ImagesJson);

    // Normalize to urls
    const urls = collected
      .map((v) => (typeof v === 'string' ? normalizeImageUrl(v) : null))
      .filter(Boolean);
    // Deduplicate while preserving order
    const seen = new Set();
    const out = [];
    for (const u of urls) {
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
    return out;
  };

  const getProductImage = (product, index = 0) => {
    const imgs = getProductImages(product);
    if (imgs.length === 0) return placeholderProductImage;
    return imgs[Math.min(index, imgs.length - 1)];
  };

  // Reset to first page when products change or view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, viewMode]);

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

  // Inline styles for improved list/table appearance
  const styles = {
  headerBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 12, borderBottom: '2px solid #2ecc71', background: '#fbfff9' },
    filtersWrap: { display: 'flex', alignItems: 'center', gap: 8 },
    viewToggleWrap: { display: 'flex', gap: 6, alignItems: 'center' },
    toggleBtn: (active) => ({
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #e0e0e0',
      background: active ? '#fff' : 'transparent',
      cursor: 'pointer',
      color: '#333',
      fontWeight: 600,
    }),
    addBtn: { background: '#2ecc71', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 },
  tableHeader: { display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: 0, padding: '12px 16px', borderBottom: '2px solid #2ecc71', background: '#f2fff6', color: '#1b5e20', fontWeight: 700 },
  row: { display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: 0, alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f3f3f3', background: '#ffffff' },
  rowWithActions: { display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: 0, alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f3f3f3', background: '#ffffff' },
  actionsCell: { display: 'flex', justifyContent: 'flex-end' },
    thumbnail: { width: 56, height: 56, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, flex: '0 0 56px' },
    productName: { fontWeight: 700, color: '#222' },
    productCategory: { color: '#888', fontSize: 13 },
    skuCell: { color: '#444', textAlign: 'left' },
    soldCell: { color: '#444', textAlign: 'left' },
    stockCell: (stock) => ({ color: (Number(stock) <= 0 ? '#c0392b' : '#444'), textAlign: 'left' }),
    priceCell: { textAlign: 'right', fontWeight: 700, color: '#1b5e20' },
  actionBtns: { display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' },
  editBtn: { background: '#eaffef', color: '#1b8a44', border: '1px solid #cff5d9', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  deleteBtn: { background: '#ffecec', color: '#e53935', border: '1px solid #ffd6d6', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 },
    paginationWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '12px 0' },
    pageBtn: (disabled) => ({ width: 36, height: 36, borderRadius: 18, border: 'none', background: disabled ? '#f0f0f0' : '#eafaf0', color: disabled ? '#bbb' : '#1b8a44', cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    dotsWrap: { display: 'flex', gap: 6, alignItems: 'center', padding: '0 8px' },
    dot: { width: 8, height: 8, borderRadius: 8, background: '#e0efe6' },
    dotActive: { width: 8, height: 8, borderRadius: 8, background: '#1b8a44' },
    pageInfo: { color: '#1b8a44', fontWeight: 700, marginLeft: 8 },
  };

  // (moved below after filtering)
  // Filter and sort products before pagination
  let filteredProducts = products;
  if (filterCategory) {
    filteredProducts = filteredProducts.filter(p => String(p.CategoryID) === String(filterCategory));
  }
  if (filterStatus) {
    filteredProducts = filteredProducts.filter(p => String(p.Status) === String(filterStatus));
  }
  // Sort
  if (filterSort === 'priceLow') {
    filteredProducts = filteredProducts.slice().sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
  } else if (filterSort === 'priceHigh') {
    filteredProducts = filteredProducts.slice().sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
  } else if (filterSort === 'name') {
    filteredProducts = filteredProducts.slice().sort((a, b) => String(a.ProductName).localeCompare(String(b.ProductName)));
  } else {
    // newest: sort by ProductID descending (assuming higher ID is newer)
    filteredProducts = filteredProducts.slice().sort((a, b) => parseInt(b.ProductID) - parseInt(a.ProductID));
  }
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  // Ensure currentPage is within bounds when products shrink
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const goPrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const goNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // ...existing code...

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setAddForm({
      ProductName: '',
      SKU: '',
      CategoryID: '',
      Price: '',
      Stock: '',
      Description: '',
      Status: 'Active',
      Image: [],
    });
    setAddImageIndex(0);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddForm({
      ProductName: '',
      SKU: '',
      CategoryID: '',
      Price: '',
      Stock: '',
      Description: '',
      Status: 'Active',
      Image: [],
    });
    setAddImageIndex(0);
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setAddForm(f => ({ ...f, Image: [...(f.Image || []), ...Array.from(files)] }));
      setAddImageIndex(0);
    } else {
      setAddForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!shopId) {
      alert('No shop selected.');
      return;
    }
    if (!addForm.ProductName || !addForm.SKU || !addForm.CategoryID || !addForm.Price || addForm.Stock === '') {
      alert('Please fill out all required fields.');
      return;
    }
    if (!addForm.Image || addForm.Image.length === 0) {
      alert('Please add at least one image.');
      return;
    }
    const fd = new FormData();
    fd.append('ShopID', shopId);
    fd.append('CategoryID', addForm.CategoryID);
    fd.append('ProductName', addForm.ProductName);
    fd.append('SKU', addForm.SKU);
    fd.append('Description', addForm.Description);
    fd.append('Price', addForm.Price);
    fd.append('Stock', addForm.Stock || 0);
    // Main image: the selected image (big placeholder)
    if (addForm.Image && addForm.Image.length > 0) {
      const mainImage = addForm.Image[addImageIndex] || addForm.Image[0];
      fd.append('Image', mainImage);
      // AdditionalImages: all other images except the main one
      const additionalImages = addForm.Image.filter((img, idx) => idx !== addImageIndex);
      additionalImages.forEach((img) => {
        fd.append('AdditionalImages[]', img);
      });
    }
    fd.append('SoldAmount', 0);
    fd.append('Discount', 0);
    fd.append('IsFeatured', 0);
    fd.append('Attributes', JSON.stringify([]));
    fd.append('PublishedAt', new Date().toISOString().slice(0, 19).replace('T', ' '));
    fd.append('Status', addForm.Status || 'Active');
    fd.append('BoughtBy', JSON.stringify([]));
    fd.append('Tags', JSON.stringify([]));
    fd.append('IsActive', addForm.Status === 'Active');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        alert('Product added!');
        handleCloseAddModal();
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
              <div className="shop-products-header" style={styles.headerBar}>
                <div className="shop-products-filters" style={styles.filtersWrap}>
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 8 }}>
                    <select
                      className="shop-products-select"
                      style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.CategoryID || cat.id} value={cat.CategoryID || cat.id}>{cat.CategoryName || cat.name}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 8 }}>
                    <select
                      className="shop-products-select"
                      style={{ minWidth: 150, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="OffSale">OffSale</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select
                      className="shop-products-select"
                      style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}
                      value={filterSort}
                      onChange={e => setFilterSort(e.target.value)}
                    >
                      <option value="newest">Sort By: Newest</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="name">Name</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* View mode toggle */}
                  <div className="view-toggle" style={styles.viewToggleWrap}>
                    <button
                      aria-pressed={viewMode === 'list'}
                      onClick={() => setViewMode('list')}
                      style={styles.toggleBtn(viewMode === 'list')}
                      title="List view"
                    >
                      List
                    </button>
                    <button
                      aria-pressed={viewMode === 'grid'}
                      onClick={() => setViewMode('grid')}
                      style={styles.toggleBtn(viewMode === 'grid')}
                      title="Grid view"
                    >
                      Grid
                    </button>
                  </div>

                  <button
                    style={styles.addBtn}
                    onClick={handleOpenAddModal}
                  >
                    <span style={{marginRight: 8, fontSize: 18}}>+</span> Add New Product
                  </button>
      {/* Add Product Modal */}
      {showAddModal && (
        <div role="dialog" aria-modal="true" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200}} onClick={handleCloseAddModal}>
          <div style={{width: 900, height: 540, background: '#fff', borderRadius: 10, padding: 0, boxShadow: '0 12px 36px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 32px 0 32px', borderBottom: '1px solid #e0e0e0', position: 'relative'}}>
              <div style={{fontSize: 24, fontWeight: 800, color: '#2ecc71', textAlign: 'center', flex: 1}}>Add Product</div>
              <button onClick={handleCloseAddModal} aria-label="Close" style={{background: 'none', border: 'none', fontSize: 28, color: '#bbb', cursor: 'pointer', position: 'absolute', right: 24, top: 18, lineHeight: 1, padding: 0}}>&times;</button>
            </div>
            <form onSubmit={handleAddProduct} style={{display: 'flex', gap: 32, padding: '24px 32px 24px 32px', flex: 1, minHeight: 0, overflow: 'hidden'}}>
              {/* Left: Main image and thumbnails */}
              <div style={{flex: '0 0 340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 18}}>
                <div style={{width: 320, height: 292, border: '2px solid #2ecc71', borderRadius: 12, background: '#f7fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.06)'}}>
                  {addForm.Image && addForm.Image.length > 0 ? (
                    <img src={URL.createObjectURL(addForm.Image[addImageIndex])} alt={addForm.ProductName} style={{maxWidth: '100%', maxHeight: '100%', borderRadius: 8}} />
                  ) : (
                    <div style={{color: '#888'}}>No image</div>
                  )}
                </div>
                {/* Thumbnails and arrows */}
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <button type="button" onClick={() => setAddImageIndex(i => Math.max(0, i - 1))} disabled={addImageIndex === 0} style={{background: 'none', border: 'none', fontSize: 24, color: '#2ecc71', cursor: 'pointer'}}>{'<'}</button>
                  {(addForm.Image && addForm.Image.length > 0) ? (
                    addForm.Image.map((img, idx) => (
                      <div key={idx} style={{position: 'relative'}}>
                        <img src={URL.createObjectURL(img)} alt={`thumb-${idx}`} style={{width: 56, height: 56, borderRadius: 8, border: idx === addImageIndex ? '2px solid #2ecc71' : '1px solid #eee', objectFit: 'cover', cursor: 'pointer'}} onClick={() => setAddImageIndex(idx)} />
                        <span style={{position: 'absolute', top: -8, right: -8, background: '#fff', border: '1px solid #ffd6d6', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e53935', fontSize: 11, cursor: 'pointer'}}>×</span>
                      </div>
                    ))
                  ) : null}
                  <button type="button" onClick={() => setAddImageIndex(i => Math.min((addForm.Image?.length ?? 1) - 1, i + 1))} disabled={addForm.Image && addImageIndex === addForm.Image.length - 1} style={{background: 'none', border: 'none', fontSize: 24, color: '#2ecc71', cursor: 'pointer'}}>{'>'}</button>
                </div>
                <label style={{marginTop: 8}}>
                  <input
                    type="file"
                    name="Image"
                    accept="image/*"
                    multiple
                    onChange={handleAddFormChange}
                    style={{display: 'none'}}
                    key={addForm.Image.length} // force reset so same file can be added again
                  />
                  <span style={{display: 'inline-block', background: '#2ecc71', color: '#fff', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer'}}>Add Image</span>
                </label>
              </div>
              {/* Right: Details */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 0}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 10, columnGap: 24, marginBottom: 12}}>
                  <div style={{fontSize: 15, color: '#666'}}>Product Name:<br /><input name="ProductName" value={addForm.ProductName} onChange={handleAddFormChange} required style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}} /></div>
                  <div style={{fontSize: 15, color: '#666'}}>SKU:<br /><input name="SKU" value={addForm.SKU} onChange={handleAddFormChange} required style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}} /></div>
                  <div style={{fontSize: 15, color: '#666'}}>Category:<br />
                    <select
                      name="CategoryID"
                      value={addForm.CategoryID}
                      onChange={handleAddFormChange}
                      required
                      style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}}
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map(cat => (
                        <option key={cat.CategoryID || cat.id} value={cat.CategoryID || cat.id}>{cat.CategoryName || cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{fontSize: 15, color: '#666'}}>Price:<br /><input name="Price" value={addForm.Price} onChange={handleAddFormChange} required type="number" min="0" step="0.01" style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}} /></div>
                  <div style={{fontSize: 15, color: '#666'}}>Stock:<br /><input name="Stock" value={addForm.Stock} onChange={handleAddFormChange} required type="number" min="0" step="1" style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}} /></div>
                  <div style={{fontSize: 15, color: '#666'}}>Status:<br />
                    <select name="Status" value={addForm.Status} onChange={handleAddFormChange} style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}}>
                      <option value="Active">Active</option>
                      <option value="OffSale">OffSale</option>
                    </select>
                  </div>
                </div>
                <div style={{fontSize: 15, color: '#666', marginBottom: 4}}>Description:</div>
                <textarea name="Description" value={addForm.Description} onChange={handleAddFormChange} required style={{width: '100%', minHeight: 100, border: '2px solid #2ecc71', borderRadius: 8, padding: 10, fontSize: 15, resize: 'none', marginBottom: 16, color: '#222', background: '#fafafa'}} />
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 2}}>
                  <button type="submit" style={{background: '#2ecc71', color: '#fff', border: '2px solid #2ecc71', padding: '8px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>Save</button>
                  <button type="button" style={{background: '#fff', color: '#2ecc71', border: '2px solid #2ecc71', padding: '8px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginLeft: 12}} onClick={handleCloseAddModal}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
                </div>
              </div>
              {/* Conditional rendering for list or grid view */}
              {loading ? (
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 36, height: 36, border: '4px solid #e0f7ef', borderTop: '4px solid #22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#1b8a44', marginTop: 12, fontWeight: 500, fontSize: 15 }}>Loading...</span>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <>
                <div className="shop-products-grid">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map(product => (
                      <div key={product.ProductID} className="shop-product-card">
                        <div className="shop-product-image-placeholder">
                          <img src={getProductImage(product)} alt={product.ProductName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div className="shop-product-name">{product.ProductName}</div>
                        <div className="shop-product-price">₱{parseFloat(product.Price).toLocaleString()}</div>
                        <div className="shop-product-category">{product.CategoryName || product.CategoryID || 'Category'}</div>
                        <div className="shop-product-buttons">
                            <button style={styles.editBtn} onClick={() => openDetails(product)}>View Details</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{textAlign: 'center', color: '#888', width: '100%'}}>No products found for this shop.</div>
                  )}
                </div>
                {/* pagination controls for grid (bottom-centered) */}
                {products.length > itemsPerPage && (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                    <div style={styles.paginationWrap}>
                      <button onClick={goPrev} style={styles.pageBtn(currentPage === 1)} disabled={currentPage === 1}>‹</button>
                      <div style={styles.dotsWrap}>
                        <div style={currentPage === 1 ? styles.dotActive : styles.dot} />
                        <div style={currentPage === 2 ? styles.dotActive : styles.dot} />
                        <div style={currentPage === 3 ? styles.dotActive : styles.dot} />
                        {/* for simplicity we keep 3 dots; the pageInfo shows exact page */}
                      </div>
                      <button onClick={goNext} style={styles.pageBtn(currentPage === totalPages)} disabled={currentPage === totalPages}>›</button>
                      <div style={styles.pageInfo}>Page {currentPage} of {totalPages}</div>
                    </div>
                  </div>
                )}
                </>
              ) : (
                // list view as table-like layout
                <div className="shop-products-list">
                  {paginatedProducts.length > 0 ? (
                    <div style={{width: '100%', overflowX: 'auto'}}>
                      <div style={styles.tableHeader}>
                        <div>Product</div>
                        <div>SKU</div>
                        <div>Sold</div>
                        <div>Stock</div>
                        <div style={{textAlign: 'right'}}>Price</div>
                        <div style={{textAlign: 'right'}}>Actions</div>
                      </div>
                      {paginatedProducts.map(product => (
                        <div key={product.ProductID} style={styles.rowWithActions}>
                          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                            <div style={styles.thumbnail}>
                              <img src={getProductImage(product)} alt={product.ProductName} style={{width: '56px', height: '56px', objectFit: 'cover', borderRadius: 6}} />
                            </div>
                            <div>
                              <div style={styles.productName}>{product.ProductName}</div>
                              <div style={styles.productCategory}>{product.CategoryName || product.CategoryID || 'Category'}</div>
                            </div>
                          </div>

                          <div style={styles.skuCell}>{product.SKU || product.Sku || '-'}</div>

                          <div style={styles.soldCell}>{(product.SoldAmount !== undefined && product.SoldAmount !== null) ? product.SoldAmount : (product.Sold || 0)}</div>

                          <div style={styles.stockCell(product.Stock)}>{product.Stock !== undefined && product.Stock !== null ? product.Stock : (product.StockQuantity ?? '-')}</div>

                          <div style={{textAlign: 'right'}}>
                            <div style={styles.priceCell}>₱{product.Price ? parseFloat(product.Price).toLocaleString() : '0'}</div>
                          </div>

                          <div style={styles.actionsCell}>
                            <div style={styles.actionBtns}>
                              <button style={styles.editBtn} onClick={() => openDetails(product)}>View Details</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* pagination controls for list */}
                      {products.length > itemsPerPage && (
                        <div style={styles.paginationWrap}>
                          <button onClick={goPrev} style={styles.pageBtn(currentPage === 1)} disabled={currentPage === 1}>‹</button>
                          <div style={styles.dotsWrap}>
                            <div style={currentPage === 1 ? styles.dotActive : styles.dot} />
                            <div style={currentPage === 2 ? styles.dotActive : styles.dot} />
                            <div style={currentPage === 3 ? styles.dotActive : styles.dot} />
                          </div>
                          <button onClick={goNext} style={styles.pageBtn(currentPage === totalPages)} disabled={currentPage === totalPages}>›</button>
                          <div style={styles.pageInfo}>Page {currentPage} of {totalPages}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', color: '#888', width: '100%'}}>No products found for this shop.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Modal for Add New Product removed */}
      {/* Product Details Modal - matches provided image */}
      {showDetails && detailsProduct && (
        <div role="dialog" aria-modal="true" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200}} onClick={closeDetails}>
          <div style={{width: 900, height: 540, background: '#fff', borderRadius: 10, padding: 0, boxShadow: '0 12px 36px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 32px 0 32px', borderBottom: '1px solid #e0e0e0', position: 'relative'}}>
              <div style={{fontSize: 24, fontWeight: 800, color: '#2ecc71', textAlign: 'center', flex: 1}}>Product Details</div>
              <button onClick={closeDetails} aria-label="Close" style={{background: 'none', border: 'none', fontSize: 28, color: '#bbb', cursor: 'pointer', position: 'absolute', right: 24, top: 18, lineHeight: 1, padding: 0}}>&times;</button>
            </div>
            <div style={{display: 'flex', gap: 32, padding: '24px 32px 24px 32px', flex: 1, minHeight: 0, overflow: 'hidden'}}>
              {/* Left: Main image and thumbnails */}
              <div style={{flex: '0 0 340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 18}}>
                <div style={{width: 320, height: 292, border: '2px solid #2ecc71', borderRadius: 12, background: '#f7fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.06)'}}>
                  <img src={getProductImage(detailsProduct, detailsImageIndex)} alt={detailsProduct.ProductName} style={{maxWidth: '100%', maxHeight: '100%', borderRadius: 8}} />
                </div>
                {/* Thumbnails and arrows */}
                <div style={{display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'column'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, width: '100%'}}>
                    <button onClick={() => setDetailsImageIndex(i => Math.max(0, i - 1))} disabled={detailsImageIndex === 0} style={{background: 'none', border: 'none', fontSize: 24, color: '#2ecc71', cursor: 'pointer'}}>{'<'}</button>
                    <div style={{display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, alignItems: 'center'}}>
                      {getProductImages(detailsProduct).length > 0 ? (
                        getProductImages(detailsProduct).map((src, idx) => (
                          <div key={idx} style={{position: 'relative', flex: '0 0 auto'}}>
                            <img src={src} alt={`thumb-${idx}`} style={{width: 56, height: 56, borderRadius: 8, border: idx === detailsImageIndex ? '2px solid #2ecc71' : '1px solid #eee', objectFit: 'cover', cursor: 'pointer'}} onClick={() => setDetailsImageIndex(idx)} />
                            {/* show remove icon only when in edit mode and image exists in AdditionalImages */}
                            {detailsEditMode && (detailsProduct.AdditionalImages || []).some(ai => normalizeImageUrl(ai) === src || ai === src) ? (
                              <span onClick={() => {
                                const clone = { ...detailsProduct };
                                // find index within AdditionalImages of the image matching this thumbnail
                                const targetIdx = (clone.AdditionalImages || []).findIndex(ai => normalizeImageUrl(ai) === src || ai === src);
                                if (targetIdx !== -1) {
                                  clone.AdditionalImages = (clone.AdditionalImages || []).slice();
                                  clone.AdditionalImages.splice(targetIdx, 1);
                                  setDetailsProduct(clone);
                                  setDetailsImageIndex(0);
                                }
                              }} style={{position: 'absolute', top: -8, right: -8, background: '#fff', border: '1px solid #ffd6d6', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e53935', fontSize: 11, cursor: 'pointer'}}>×</span>
                            ) : null}
                          </div>
                        ))
                      ) : null}
                    </div>
                    <button onClick={() => setDetailsImageIndex(i => Math.min(getProductImages(detailsProduct).length - 1, i + 1))} disabled={detailsImageIndex === (getProductImages(detailsProduct).length - 1) || getProductImages(detailsProduct).length === 0} style={{background: 'none', border: 'none', fontSize: 24, color: '#2ecc71', cursor: 'pointer'}}>{'>'}</button>
                  </div>

                  {/* Add Image button visible when editing */}
                  {detailsEditMode ? (
                    <div style={{marginTop: 8}}>
                      <input type="file" accept="image/*" multiple style={{display: 'none'}} ref={detailsFileRef} onChange={(e) => handleAddImageToDetails(e.target.files)} />
                      <button type="button" onClick={() => detailsFileRef.current && detailsFileRef.current.click()} style={{background: '#2ecc71', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700}}>Add Image</button>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Right: Details and tabs */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 0}}>
                <div style={{fontSize: 22, fontWeight: 700, marginBottom: 2, color: '#222'}}>{detailsProduct.ProductName}</div>
                <div style={{color: '#888', marginBottom: 16, fontSize: 15}}>SKU: <span style={{color: '#444'}}>{detailsProduct.SKU || detailsProduct.Sku || '-'}</span></div>
                {/* Only Details Tab (Metrics removed) */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 10, columnGap: 24, marginBottom: 12}}>
                      <div style={{fontSize: 15, color: '#666'}}>Category:<br />
                        {detailsEditMode ? (
                          <select
                            value={detailsProduct.CategoryID || ''}
                            onChange={e => setDetailsProduct(p => ({ ...p, CategoryID: e.target.value, CategoryName: (categories.find(cat => String(cat.CategoryID || cat.id) === e.target.value)?.CategoryName || '') }))}
                            required
                            style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}}
                          >
                            <option value="" disabled>Select category</option>
                            {categories.map(cat => (
                              <option key={cat.CategoryID || cat.id} value={cat.CategoryID || cat.id}>{cat.CategoryName || cat.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{fontWeight: 600, color: '#222'}}>{detailsProduct.CategoryName || detailsProduct.CategoryID || '-'}</span>
                        )}
                      </div>
                      <div style={{fontSize: 15, color: '#666'}}>Status:<br />
                        {detailsEditMode ? (
                          <select value={detailsProduct.Status || (detailsProduct.IsActive ? 'Active' : 'Inactive')} onChange={(e) => setDetailsProduct(p => ({ ...p, Status: e.target.value }))} style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          <span style={{fontWeight: 600, color: '#222'}}>{detailsProduct.Status || (detailsProduct.IsActive ? 'Active' : 'Inactive')}</span>
                        )}
                      </div>
                      <div style={{fontSize: 15, color: '#666'}}>Price:<br />
                        {detailsEditMode ? (
                          <input type="number" value={detailsProduct.Price || 0} onChange={(e) => setDetailsProduct(p => ({ ...p, Price: e.target.value }))} style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}} />
                        ) : (
                          <span style={{fontWeight: 600, color: '#1b5e20'}}>₱{detailsProduct.Price ? parseFloat(detailsProduct.Price).toLocaleString() : '0'}</span>
                        )}
                      </div>
                      <div style={{fontSize: 15, color: '#666'}}>Stock:<br />
                        {detailsEditMode ? (
                          <input type="number" value={detailsProduct.Stock || 0} onChange={(e) => setDetailsProduct(p => ({ ...p, Stock: e.target.value }))} style={{width: '100%', border: '1px solid #ccc', borderRadius: 6, padding: 8, fontSize: 15, marginTop: 2}} />
                        ) : (
                          <span style={{fontWeight: 600, color: '#222'}}>{detailsProduct.Stock !== undefined && detailsProduct.Stock !== null ? detailsProduct.Stock : (detailsProduct.StockQuantity ?? '-')}</span>
                        )}
                      </div>
                    </div>
                    <div style={{fontSize: 15, color: '#666', marginBottom: 4}}>Description:</div>
                    {detailsEditMode ? (
                      <textarea value={detailsProduct.Description || ''} onChange={(e) => setDetailsProduct(p => ({ ...p, Description: e.target.value }))} style={{width: '100%', minHeight: 100, border: '2px solid #2ecc71', borderRadius: 8, padding: 10, fontSize: 15, resize: 'none', marginBottom: 16, color: '#222', background: '#fff'}} />
                    ) : (
                      <textarea readOnly value={detailsProduct.Description || ''} style={{width: '100%', minHeight: 100, border: '2px solid #2ecc71', borderRadius: 8, padding: 10, fontSize: 15, resize: 'none', marginBottom: 16, color: '#222', background: '#fafafa'}} />
                    )}
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 2}}>
                      {detailsEditMode ? (
                        <>
                          <button onClick={() => {
                            // Local save: update products array with edited detailsProduct
                            const updated = products.map(p => (p.ProductID === detailsProduct.ProductID ? detailsProduct : p));
                            setProducts(updated);
                            setDetailsEditMode(false);
                            alert('Changes saved locally. Implement server save when ready.');
                          }} style={{background: '#2ecc71', color: '#fff', border: '2px solid #2ecc71', padding: '8px 24px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginRight: 12}}>Save</button>
                          <button onClick={() => {
                            // Revert local edits by re-opening original product from products list
                            const orig = products.find(p => p.ProductID === detailsProduct.ProductID);
                            if (orig) openDetails(orig);
                            else setDetailsEditMode(false);
                          }} style={{background: '#fff', color: '#2ecc71', border: '2px solid #2ecc71', padding: '8px 24px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>Cancel</button>
                        </>
                      ) : (
                        <button style={{background: '#fff', color: '#2ecc71', border: '2px solid #2ecc71', padding: '8px 24px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer'}} onClick={() => setDetailsEditMode(true)}>Edit</button>
                      )}
                    </div>
                  </div>
              
              </div>
            </div>
            {/* Removed bottom close button */}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ShopProducts;
