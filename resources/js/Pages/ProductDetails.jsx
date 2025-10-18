import React, { useState } from "react";
import { usePage } from '@inertiajs/react';
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const ProductDetails = () => {
  const { ProductID } = usePage().props;
  const [product, setProduct] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    fetch(`/api/product/${ProductID}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      });
  }, [ProductID]);

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

  // Carousel logic
  const images = [
    product.images && product.images[0] ? product.images[0] : '',
    ...(Array.isArray(product.additionalImages) ? product.additionalImages : [])
  ];
  const goPrev = () => setSelectedImageIdx(idx => Math.max(0, idx - 1));
  const goNext = () => setSelectedImageIdx(idx => Math.min(images.length - 1, idx + 1));

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        {/* Main Product Card */}
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          {/* Left: Image Carousel */}
          <div style={{ flex: '1 1 340px', minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#eaeaea', borderRadius: '1rem', padding: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, height: 400, maxWidth: 400, border: '2px solid #2ecc71', width: 400 }}>
              <img src={images[selectedImageIdx]} alt="Product" style={{ width: 360, height: 360, objectFit: 'cover', borderRadius: '1rem', background: '#fff', margin: 'auto' }} />
            </div>
            {/* Carousel Controls */}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={goPrev} disabled={selectedImageIdx === 0} style={{ background: 'none', border: 'none', fontSize: '2rem', color: selectedImageIdx === 0 ? '#ccc' : '#2ecc71', cursor: 'pointer' }}>&lt;</button>
              {images.map((img, idx) => (
                <div key={img} style={{ width: 54, height: 54, borderRadius: '0.5rem', border: selectedImageIdx === idx ? '2px solid #2ecc71' : '2px solid #222', background: '#eaeaea', display: 'inline-block', margin: '0 2px', boxSizing: 'border-box' }}>
                  <img src={img} alt={`Thumb ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} onClick={() => setSelectedImageIdx(idx)} />
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
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '2rem' }}>
              <button className="loginBtn" style={{ flex: 1, fontWeight: 700, fontSize: '1.15rem', height: '48px', background: 'var(--color-primary)', border: '2px solid var(--color-primary)' }}>Buy Now</button>
              <button className="registerBtn" style={{ flex: 1, fontWeight: 700, fontSize: '1.15rem', height: '48px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>Add to Cart</button>
            </div>
          </div>
        </div>
        {/* Secondary Card: Description & Shop Info */}
        <div style={{ maxWidth: 1100, margin: '2rem auto 0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.7rem', color: '#222' }}>Description</div>
          <div style={{ color: '#444', fontSize: '1.1rem', marginBottom: '1.2rem' }}>{product.description}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '1.2rem' }}>
            {product.shopLogo && (
              <img src={product.shopLogo} alt="Shop Logo" style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #2ecc71', objectFit: 'cover', background: '#eaeaea' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>{product.shopName}</div>
              <div style={{ color: '#888', fontSize: '1rem' }}>Owner: {product.ownerName}</div>
            </div>
          </div>
        </div>
        {/* Recent Reviews Card */}
        <div style={{ maxWidth: 1100, margin: '2rem auto 0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.7rem', color: '#222' }}>Recent Reviews</div>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '1rem 0', display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                <div style={{ fontWeight: 700, color: '#2ecc71', fontSize: '1.1rem', marginRight: '0.7rem' }}>★ {review.Rating}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#222', marginBottom: '0.3rem' }}>{review.userName}</div>
                  <div style={{ color: '#444', fontSize: '1rem', marginBottom: '0.3rem' }}>{review.ReviewText}</div>
                  <div style={{ color: '#aaa', fontSize: '0.95rem' }}>{new Date(review.CreatedAt).toLocaleDateString()}</div>
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
