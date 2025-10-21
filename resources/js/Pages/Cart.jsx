// --- Image normalization logic from ProductCard ---
const placeholderProductImage = 'https://via.placeholder.com/60x60?text=Product';
const normalizeImageUrl = (val) => {
  if (!val) return null;
  if (typeof val !== 'string') return null;
  let s = val.trim();
  if (s.startsWith('[')) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length) {
        for (const item of parsed) {
          const nu = normalizeImageUrl(item);
          if (nu) return nu;
        }
      }
    } catch (e) {}
  }
  try {
    if (/%22|%5B|%5D/.test(s)) {
      const decoded = decodeURIComponent(s);
      if (decoded && decoded !== s) s = decoded;
    }
  } catch (e) {}
  if (s.startsWith('blob:') || s.startsWith('data:') || s.startsWith('file:')) return s;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  s = s.replace(/^[\[\]\s\"]+|[\[\]\s\"]+$/g, '');
  if (!s) return null;
  if (s.startsWith('http://') || s.startsWith('https://')) {
    return s.replace(/([^:])\/\/+/, '$1/');
  }
  s = s.replace(/^\/+/, '');
  s = s.replace(/^storage[\/]+/, '');
  s = s.replace(/\\/g, '/');
  s = s.replace(/\/\/+/, '/');
  return `/storage/${s}`;
};

const getProductImages = (product) => {
  if (!product) return [];
  const collected = [];
  const pushParsed = (val) => {
    if (!val && val !== 0) return;
    if (Array.isArray(val)) {
      for (const it of val) collected.push(it);
    } else if (typeof val === 'string') {
      const s = val.trim();
      if (s.startsWith('[')) {
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) {
            for (const it of parsed) collected.push(it);
            return;
          }
        } catch (e) {}
      }
      collected.push(s);
    } else {
      collected.push(val);
    }
  };
  if (product.Image) pushParsed(product.Image);
  if (product.Images) pushParsed(product.Images);
  if (product.ImageUrl) pushParsed(product.ImageUrl);
  if (product.AdditionalImages) pushParsed(product.AdditionalImages);
  if (product.ImagesJson) pushParsed(product.ImagesJson);
  const urls = collected
    .map((v) => (typeof v === 'string' ? normalizeImageUrl(v) : null))
    .filter(Boolean);
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
import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { router } from '@inertiajs/react';


const Cart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [updatingId, setUpdatingId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState(null);
  const [shopNames, setShopNames] = React.useState({});

  React.useEffect(() => {
    let uid = null;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      uid = user?.UserID || user?.id || null;
    } catch (err) { uid = null; }
    setUserId(uid);
    if (!uid) return;
    fetch(`/api/cart-items?userId=${uid}`)
      .then(res => res.json())
      .then(data => {
        setCartItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    // Fetch all shop names in one request
    const shopIds = Array.from(new Set(cartItems.map(item => item.ShopID)));
    if (shopIds.length === 0) return;
    fetch(`/api/shops/many?ids=${shopIds.join(',')}`)
      .then(res => res.json())
      .then(shops => {
        const names = {};
        shops.forEach(shop => {
          if (shop && shop.ShopID) names[shop.ShopID] = shop.ShopName;
        });
        setShopNames(names);
      });
  }, [cartItems]);

  // Group items by ShopID
  const itemsByShop = React.useMemo(() => {
    const grouped = {};
    cartItems.forEach(item => {
      if (!grouped[item.ShopID]) grouped[item.ShopID] = [];
      grouped[item.ShopID].push(item);
    });
    return grouped;
  }, [cartItems]);

  // Calculate total for selected products only
  const total = cartItems
    .filter(item => selectedProducts.includes(item.CartItemID))
    .reduce((sum, item) => sum + (parseFloat(item.Subtotal) || 0), 0);

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem' }}>
          <h1 className="shopItemName" style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: 700 }}>Shopping Cart</h1>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>Loading...</div>
          ) : !userId ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>Please log in to view your cart.</div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>Your cart is empty.</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', color: '#222', fontWeight: 600 }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}></th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}></th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Quantity</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Total</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(itemsByShop).map(([shopId, items]) => {
                    const allChecked = items.every(item => selectedProducts.includes(item.CartItemID));
                    return (
                      <React.Fragment key={shopId}>
                        <tr>
                          <td style={{ width: 40, textAlign: 'center', background: 'none', border: 'none', padding: '2.2rem 0 1.2rem 0' }}>
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                              <input
                                type="checkbox"
                                checked={allChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedProducts(prev => [...new Set([...prev, ...items.map(i => i.CartItemID)])]);
                                  } else {
                                    setSelectedProducts(prev => prev.filter(id => !items.map(i => i.CartItemID).includes(id)));
                                  }
                                }}
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '8px',
                                  border: allChecked ? '2.5px solid #1976d2' : '2px solid #229954',
                                  background: allChecked ? '#229954' : '#fff',
                                  boxShadow: allChecked ? '0 0 0 2px #1976d2' : 'none',
                                  appearance: 'none',
                                  display: 'inline-block',
                                  position: 'relative',
                                  verticalAlign: 'middle',
                                  cursor: 'pointer',
                                  outline: 'none',
                                  transition: 'border 0.2s, box-shadow 0.2s',
                                }}
                                onFocus={e => { e.target.style.boxShadow = '0 0 0 2px #1976d2'; }}
                                onBlur={e => { e.target.style.boxShadow = allChecked ? '0 0 0 2px #1976d2' : 'none'; }}
                              />
                              {allChecked && (
                                <svg viewBox="0 0 20 20" width="18" height="18" style={{ position: 'absolute', left: 5, top: 5, pointerEvents: 'none' }}>
                                  <polyline points="4,10 8,14 16,6" style={{ fill: 'none', stroke: '#fff', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
                                </svg>
                              )}
                            </span>
                          </td>
                          <td colSpan={6} style={{ padding: '2.2rem 0 1.2rem 0', background: 'none', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <span style={{ fontWeight: 700, color: '#229954', fontSize: '1.15rem', whiteSpace: 'nowrap', marginRight: '1.2rem' }}>
                                {shopNames[shopId] ? shopNames[shopId] : `Shop #${shopId}`}
                              </span>
                              <div style={{ borderBottom: '3px solid #27ae60', width: '100%' }}></div>
                            </div>
                          </td>
                        </tr>
                        {items.map(item => (
                          <tr key={item.CartItemID} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ width: 40, textAlign: 'center', background: 'none', border: 'none', padding: '1rem' }}>
                              <span style={{ position: 'relative', display: 'inline-block' }}>
                                <input
                                  type="checkbox"
                                  checked={selectedProducts.includes(item.CartItemID)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setSelectedProducts(prev => [...new Set([...prev, item.CartItemID])]);
                                    } else {
                                      setSelectedProducts(prev => prev.filter(id => id !== item.CartItemID));
                                    }
                                  }}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '6px',
                                    border: '2px solid #229954',
                                    background: selectedProducts.includes(item.CartItemID) ? '#229954' : '#fff',
                                    appearance: 'none',
                                    display: 'inline-block',
                                    position: 'relative',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                  }}
                                />
                                {selectedProducts.includes(item.CartItemID) && (
                                  <span style={{
                                    position: 'absolute',
                                    left: 6,
                                    top: 2,
                                    width: 10,
                                    height: 10,
                                    background: 'none',
                                    pointerEvents: 'none',
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 900,
                                    zIndex: 2,
                                  }}>✓</span>
                                )}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <img
                                src={getProductImage(item.Product || item) || placeholderProductImage}
                                alt={item.ProductName || (item.Product && item.Product.ProductName) || 'Product'}
                                style={{ width: 60, height: 60, borderRadius: '0.5rem', objectFit: 'cover', background: '#f3f4f6' }}
                              />
                            </td>
                            <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{item.ProductName || (item.Product && item.Product.ProductName) || `Product #${item.ProductID}`}</td>
                            <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#222' }}>₱{parseFloat(item.Price).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button
                                style={{
                                  border: 'none', background: '#eee', color: '#229954', fontWeight: 700, fontSize: '1.1rem', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', marginRight: 8,
                                  transition: 'background 0.2s, color 0.2s'
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#229954'; e.currentTarget.style.color = '#fff'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.color = '#229954'; }}
                                disabled={updatingId === item.CartItemID || item.Quantity <= 1}
                                onClick={async () => {
                                  if (item.Quantity <= 1) return;
                                  setUpdatingId(item.CartItemID);
                                  const res = await fetch(`/api/cart-items/${item.CartItemID}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ Quantity: item.Quantity - 1 })
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setCartItems(prev => prev.map(ci => ci.CartItemID === item.CartItemID ? { ...ci, Quantity: updated.Quantity, Subtotal: updated.Subtotal, Price: updated.Price } : ci));
                                  }
                                  setUpdatingId(null);
                                }}
                              >-</button>
                              <span style={{ minWidth: 32, display: 'inline-block', textAlign: 'center' }}>{item.Quantity}</span>
                              <button
                                style={{
                                  border: 'none', background: '#eee', color: '#229954', fontWeight: 700, fontSize: '1.1rem', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', marginLeft: 8,
                                  transition: 'background 0.2s, color 0.2s'
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#229954'; e.currentTarget.style.color = '#fff'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.color = '#229954'; }}
                                disabled={updatingId === item.CartItemID}
                                onClick={async () => {
                                  setUpdatingId(item.CartItemID);
                                  const res = await fetch(`/api/cart-items/${item.CartItemID}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ Quantity: item.Quantity + 1 })
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setCartItems(prev => prev.map(ci => ci.CartItemID === item.CartItemID ? { ...ci, Quantity: updated.Quantity, Subtotal: updated.Subtotal, Price: updated.Price } : ci));
                                  }
                                  setUpdatingId(null);
                                }}
                              >+</button>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#229954' }}>₱{parseFloat(item.Subtotal).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button
                                className="registerBtn"
                                style={{
                                  fontSize: '0.95rem',
                                  padding: '0.3rem 0.8rem',
                                  borderRadius: '1.5rem',
                                  border: '1.5px solid #229954',
                                  background: '#fff',
                                  color: '#229954',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'background 0.2s, color 0.2s',
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#229954'; e.currentTarget.style.color = '#fff'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#229954'; }}
                                onClick={async () => {
                                  setUpdatingId(item.CartItemID);
                                  const res = await fetch(`/api/cart-items/${item.CartItemID}`, {
                                    method: 'DELETE',
                                  });
                                  if (res.ok) {
                                    setCartItems(prev => prev.filter(ci => ci.CartItemID !== item.CartItemID));
                                    setSelectedProducts(prev => prev.filter(id => id !== item.CartItemID));
                                  }
                                  setUpdatingId(null);
                                }}
                              >Remove</button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
          {/* Cart Summary and Checkout */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
              position: 'sticky',
              bottom: 0,
              background: '#fff',
              zIndex: 10,
              boxShadow: '0 -2px 16px rgba(44,204,113,0.07)',
              padding: '1.5rem 2rem 1.5rem 2rem',
            }}
          >
            {/* Left: Select All, Delete */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="checkbox"
                  checked={selectedProducts.length === cartItems.length && cartItems.length > 0}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedProducts(cartItems.map(item => item.CartItemID));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '6px',
                    border: '2px solid #229954',
                    background: (selectedProducts.length === cartItems.length && cartItems.length > 0) ? '#229954' : '#fff',
                    appearance: 'none',
                    display: 'inline-block',
                    position: 'relative',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                  }}
                />
                {(selectedProducts.length === cartItems.length && cartItems.length > 0) && (
                  <span style={{
                    position: 'absolute',
                    left: 6,
                    top: 2,
                    width: 10,
                    height: 10,
                    background: 'none',
                    pointerEvents: 'none',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 900,
                    zIndex: 2,
                  }}>✓</span>
                )}
              </span>
              <span style={{ fontWeight: 500, fontSize: '1.08rem', color: '#222' }}>
                Select All ({cartItems.length})
              </span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e74c3c',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  cursor: selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: selectedProducts.length === 0 ? 0.5 : 1,
                  marginLeft: 8,
                }}
                disabled={selectedProducts.length === 0}
                onClick={async () => {
                  if (selectedProducts.length === 0) return;
                  for (const id of selectedProducts) {
                    await fetch(`/api/cart-items/${id}`, { method: 'DELETE' });
                  }
                  setCartItems(prev => prev.filter(ci => !selectedProducts.includes(ci.CartItemID)));
                  setSelectedProducts([]);
                }}
              >Delete</button>
            </div>
            {/* Right: Total and Checkout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                Total ({selectedProducts.length} item{selectedProducts.length !== 1 ? 's' : ''}): ₱{total.toLocaleString(undefined, {minimumFractionDigits:2})}
              </div>
              <button
                className="loginBtn"
                style={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '0.9rem 2.5rem',
                  background: 'var(--color-primary)',
                  border: '2px solid var(--color-primary)',
                  opacity: selectedProducts.length === 0 ? 0.5 : 1,
                  cursor: selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={selectedProducts.length === 0}
                onClick={() => {
                  if (selectedProducts.length === 0) return;
                  router.visit('/checkout', {
                    data: {
                      userId,
                      selectedCartItemIds: selectedProducts,
                      total
                    }
                  });
                }}
              >Checkout</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
