import React, { useState } from "react";
import { usePage, router } from '@inertiajs/react';
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

import Toast from "@/Components/Toast";

const ProductDetails = () => {
  const { ProductID } = usePage().props;
  const [product, setProduct] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
    // Add to Cart state
    const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    fetch(`/api/product/${ProductID}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched product data:', data);
        if (data && data.reviews) {
          console.log('Fetched reviews:', data.reviews);
          if (Array.isArray(data.reviews)) {
            data.reviews.forEach((review, idx) => {
              console.log(`Review #${idx + 1}:`, review);
              if (review && review.replies) {
                console.log(`Replies for review #${idx + 1}:`, review.replies);
              }
            });
          }
        }
        setProduct(data);
      });
  }, [ProductID]);

  // Carousel/image normalization logic must run (and its hooks declared)
  // before any early returns so Hooks order stays stable.
  const placeholderSvg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial, Helvetica, sans-serif' font-size='24'>No image</text></svg>`);
  const placeholder = `data:image/svg+xml;utf8,${placeholderSvg}`;

  const normalizeToArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'string') {
      try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed.filter(Boolean); } catch (e) { }
      return val ? [val] : [];
    }
    return [String(val)];
  };

  // Build images array defensively even when `product` is null so hooks remain stable
  // Log raw image fields for debugging
  console.log('Raw image fields:', {
    image: product?.image,
    Image: product?.Image,
    images: product?.images,
    Images: product?.Images,
    ImageUrl: product?.ImageUrl,
    ImagePath: product?.ImagePath,
    additionalImages: product?.additionalImages,
    AdditionalImages: product?.AdditionalImages,
    AdditionalImgs: product?.AdditionalImgs,
    AdditionalImage: product?.AdditionalImage
  });

  // Collect all possible image arrays/strings
  const mainImages = normalizeToArray(product?.image || product?.Image || product?.images || product?.Images || product?.ImageUrl || product?.ImagePath);
  const additionalImages = normalizeToArray(product?.additionalImages || product?.AdditionalImages || product?.AdditionalImgs || product?.AdditionalImage);

  // Merge and deduplicate images
  const imagesSet = new Set([...mainImages, ...additionalImages].filter(Boolean));
  const images = Array.from(imagesSet);
  // Normalize image URLs to avoid relative-path issues (make absolute)
  const resolveImageUrl = (p) => {
    if (!p) return p;
    let s = String(p).trim();
    // If it's a JSON array string like '["products/..png"]', try to parse
    if ((s.startsWith('[') && s.endsWith(']')) || s.startsWith('{')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) { s = String(parsed[0]); }
        else if (typeof parsed === 'string') { s = parsed; }
      } catch (e) {
        // fallthrough to cleaning
      }
    }
    // strip quotes and brackets left-over
    s = s.replace(/^\[|\]$/g, '').replace(/^"|"$/g, '').trim();
    // collapse duplicate slashes
    s = s.replace(/\\/g, '/').replace(/\/+/g, '/');
    // Only prepend slash for relative paths, not for absolute URLs
    if (!s.startsWith('http://') && !s.startsWith('https://') && !s.startsWith('//') && !s.startsWith('/')) {
      s = `/${s.replace(/^\/+/, '')}`;
    }
    return s;
  };

  for (let i = 0; i < images.length; i++) images[i] = resolveImageUrl(images[i]);
  // ensure at least one placeholder image is present
  if (images.length === 0) images.push(placeholder);

  // Clamp selected index when images change
  React.useEffect(() => {
    setSelectedImageIdx(idx => Math.min(idx, Math.max(0, images.length - 1)));
  }, [images.length]);

    // Add to Cart handler
    const handleAddToCart = async () => {
      setAddingToCart(true);
    setCartMessage("");
    setShowToast(false);
      try {
        let userId = null;
        try {
          const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
          userId = user?.UserID || user?.id || null;
        } catch (e) { userId = null; }
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: ProductID, quantity, userId }),
        });
        if (!res.ok) throw new Error("Failed to add to cart");
        const data = await res.json();
  setCartMessage(data.message || "Added to Cart");
  setShowToast(true);
  // Trigger header to update cart count
  window.dispatchEvent(new Event('cart-updated'));
      } catch (err) {
        setCartMessage("Error adding to cart");
      } finally {
        setAddingToCart(false);
      }
    };

  // If product isn't loaded yet, show loading UI (hooks remain declared above)
  // Log product object for debugging
  console.log('Product object:', product);

  // Defensive: Normalize reviews and replies to always be arrays
  const reviews = Array.isArray(product?.reviews) ? product.reviews : (product?.reviews ? [product.reviews] : []);
  for (const r of reviews) {
    if (r && !Array.isArray(r.replies)) {
      r.replies = r.replies ? [r.replies] : [];
    }
  }

  if (!product) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading product details...</div>
        </main>
        <Footer />
      </>
    );
  }

  const goPrev = () => setSelectedImageIdx(idx => Math.max(0, idx - 1));
  const goNext = () => setSelectedImageIdx(idx => Math.min(images.length - 1, idx + 1));

  // Buy Now handler: create temp cart item and go to checkout
  const handleBuyNow = () => {
    let userId = null;
    try {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      userId = user?.UserID || user?.id || null;
    } catch (e) { userId = null; }
    if (!product) return;
    const tempCartItem = {
      CartItemID: `temp-${ProductID}-${Date.now()}`,
      ProductID,
      Quantity: quantity,
      Price: product.price,
      Subtotal: product.price * quantity,
      ShopID: product.ShopID ?? product.shopId,
      ProductName: product.title,
      Image: product.image,
      // Add other fields as needed
    };
    router.visit('/checkout', {
      data: {
        userId,
        selectedCartItemIds: [tempCartItem.CartItemID],
        tempCartItems: [tempCartItem],
        total: tempCartItem.Subtotal
      }
    });
  };

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        {/* Main Product Card */}
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          {/* Left: Image Carousel */}
          <div style={{ flex: '1 1 340px', minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#eaeaea', borderRadius: '1rem', padding: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, height: 400, maxWidth: 400, border: '2px solid #2ecc71', width: 400 }}>
              <img src={images[selectedImageIdx]} alt="Product" onError={(e) => { e.currentTarget.src = placeholder; }} style={{ width: 360, height: 360, objectFit: 'cover', borderRadius: '1rem', background: '#fff', margin: 'auto' }} />
            </div>
            {/* Carousel Controls */}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={goPrev} disabled={selectedImageIdx === 0} style={{ background: 'none', border: 'none', fontSize: '2rem', color: selectedImageIdx === 0 ? '#ccc' : '#2ecc71', cursor: 'pointer' }}>&lt;</button>
              {/* Show all images as thumbnails, user can click to switch */}
              {images.map((img, idx) => (
                <div key={idx} style={{ width: 54, height: 54, borderRadius: '0.5rem', border: selectedImageIdx === idx ? '2px solid #2ecc71' : '2px solid #222', background: '#eaeaea', display: 'inline-block', margin: '0 2px', boxSizing: 'border-box' }}>
                  <img src={img} alt={`Thumb ${idx+1}`} onError={(e) => { e.currentTarget.src = placeholder; }} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer' }} onClick={() => setSelectedImageIdx(idx)} />
                </div>
              ))}
              <button onClick={goNext} disabled={selectedImageIdx === images.length - 1} style={{ background: 'none', border: 'none', fontSize: '2rem', color: selectedImageIdx === images.length - 1 ? '#ccc' : '#2ecc71', cursor: 'pointer' }}>&gt;</button>
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.7rem', gap: 6 }}>
              {images.map((_, idx) => (
                <span key={idx} style={{ width: 10, height: 10, borderRadius: '50%', background: selectedImageIdx === idx ? '#2ecc71' : '#bbb', display: 'inline-block' }}></span>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ flex: '2 1 400px', minWidth: 320 }}>
            <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ fontWeight: 800, fontSize: '2.2rem', color: '#222', lineHeight: 1 }}>{product.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem' }}>₱{Number(product.price).toFixed(2)}</span>
              <span style={{ color: '#FFD600', fontSize: '1.5rem', marginLeft: '1rem' }}>★</span>
              <span style={{ fontWeight: 700, color: '#222', fontSize: '1.3rem' }}>{product.rating}</span>
              <span style={{ color: '#888', fontSize: '1.1rem' }}>({product.sold}) sold</span>
            </div>
            {/* Quantity Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>Quantity:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <button className="registerBtn" style={{ width: 36, height: 36, fontSize: '1.3rem', fontWeight: 700, padding: 0 }} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', minWidth: 32, textAlign: 'center' }}>{quantity}</span>
                <button className="loginBtn" style={{ width: 36, height: 36, fontSize: '1.3rem', fontWeight: 700, padding: 0 }} onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '15rem' }}>
              <button
                style={{
                  minWidth: 260,
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  height: '48px',
                  background: '#2ecc71',
                  color: '#fff',
                  border: '2px solid #2ecc71',
                  borderRadius: 8,
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={handleBuyNow}
              >Buy Now</button>
              <button
                style={{
                  minWidth: 260,
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  height: '48px',
                  background: '#fff',
                  color: '#2ecc71',
                  border: '2px solid #2ecc71',
                  borderRadius: 8,
                  padding: '0.5rem 1.2rem',
                  cursor: addingToCart ? 'not-allowed' : 'pointer',
                  opacity: addingToCart ? 0.6 : 1,
                  transition: 'background 0.2s'
                }}
                disabled={addingToCart}
                onClick={handleAddToCart}
              >{addingToCart ? 'Adding...' : 'Add to Cart'}</button>
              {/* Show Toast for Add to Cart */}
              {showToast && (
                <Toast message="Added to Cart" type="success" onClose={() => setShowToast(false)} />
              )}
            </div>
          </div>
        </div>
        {/* Secondary Card: Description & Shop Info */}
        <div style={{ maxWidth: 1100, margin: '2rem auto 0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 70 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #2ecc71', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2, overflow: 'hidden' }}>
                {product.shopLogo ? (
                  <img src={resolveImageUrl(product.shopLogo)} alt="Shop Logo" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#2ecc71', fontWeight: 600, fontSize: 16 }}>Shop</span>
                )}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#222' }}>{product.shopName}</div>
              <div style={{ color: '#aaa', fontSize: '1rem', marginBottom: 8 }}>Owner: {product.ownerName}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginLeft: 12 }}>
              <button
                onClick={() => window.location.href = `/shop/${product.ShopID ?? product.shopId}`}
                style={{ background: '#2ecc71', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: '2px solid #2ecc71', borderRadius: 8, padding: '0.5rem 1.2rem', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Visit Shop
              </button>
              <button
                style={{ background: '#fff', color: '#2ecc71', fontWeight: 700, fontSize: '0.95rem', border: '2px solid #2ecc71', borderRadius: 8, padding: '0.5rem 1.2rem', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Chat Now
              </button>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#222' }}>Description</div>
          <div style={{ color: '#444', fontSize: '1.1rem', marginBottom: '1.2rem' }}>{product.description}</div>
        </div>
        {/* Reviews & Replies Card */}
        <div style={{ maxWidth: 1100, margin: '2rem auto 0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.7rem', color: '#222' }}>Recent Reviews</div>
          {reviews && reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '1.2rem 0 0.7rem 0', display: 'flex', alignItems: 'flex-start', gap: '1.2rem', position: 'relative' }}>
                <div style={{ fontWeight: 700, color: '#2ecc71', fontSize: '1.25rem', marginRight: '0.7rem', minWidth: 38, textAlign: 'center' }}>★ {review.Rating}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: '0.2rem' }}>{review.userName}</div>
                  <div style={{ color: '#444', fontSize: '1.08rem', marginBottom: '0.3rem', lineHeight: 1.5 }}>{review.ReviewText || review.Comment}</div>
                  <div style={{ color: '#aaa', fontSize: '0.97rem', marginBottom: 4 }}>{review.CreatedAt ? new Date(review.CreatedAt).toLocaleDateString() : (review.ReviewDate ? new Date(review.ReviewDate).toLocaleDateString() : '')}</div>
                  {/* Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div style={{ marginTop: 10, marginLeft: 0, borderLeft: '3px solid #e0f7ef', paddingLeft: 16, background: '#f8fefb', borderRadius: 6 }}>
                      {review.replies.map((reply, ridx) => (
                        <div key={ridx} style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ fontWeight: 600, color: '#2ecc71', fontSize: '1.05rem', minWidth: 32 }}>↳</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#222', fontSize: '1.01rem', marginBottom: 2 }}>{reply.userName || reply.UserName || 'Shop Owner'}</div>
                            <div style={{ color: '#444', fontSize: '1.01rem', marginBottom: 2 }}>{reply.Comment || reply.comment}</div>
                            <div style={{ color: '#aaa', fontSize: '0.95rem' }}>{reply.CreatedAt ? new Date(reply.CreatedAt).toLocaleDateString() : (reply.created_at ? new Date(reply.created_at).toLocaleDateString() : '')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#888', fontSize: '1.1rem' }}>No reviews yet.</div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;
