import React, { useState } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const product = {
  title: "Placeholder",
  price: 100,
  rating: 4.9,
  reviews: 491,
  brand: "Seller",
  images: [
    "https://via.placeholder.com/400x120?text=Main+Image",
    "https://via.placeholder.com/80x120?text=Thumb1",
    "https://via.placeholder.com/80x120?text=Thumb2",
    "https://via.placeholder.com/80x120?text=Thumb3",
    "https://via.placeholder.com/80x120?text=Thumb4",
    "https://via.placeholder.com/80x120?text=Thumb5",
  ],
  designs: ["Option 1", "Option 2"],
  sizes: ["35cm", "40cm", "50cm", "70cm"],
};

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedDesign, setSelectedDesign] = useState(product.designs[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          {/* Left: Images */}
          <div style={{ flex: '1 1 340px', minWidth: 320 }}>
            <div style={{ background: '#f3f4f6', borderRadius: '1rem', padding: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, height: 420, maxWidth: 400 }}>
              <img src={selectedImage} alt="Product" style={{ width: '95%', height: '95%', maxWidth: 380, maxHeight: 300, objectFit: 'cover', borderRadius: '1rem', background: '#fff', margin: 'auto' }} />
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {product.images.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={`Thumb ${idx+1}`}
                  style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: '0.5rem', border: selectedImage === img ? '2px solid var(--color-primary)' : '2px solid #eee', cursor: 'pointer', background: '#fff' }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ flex: '2 1 400px', minWidth: 320 }}>
            <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.35rem', color: '#222' }}>{product.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.7rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem' }}>₱{product.price.toFixed(2)}</span>
              <span style={{ color: '#FFD600', fontSize: '1.2rem', marginLeft: '1rem' }}>★</span>
              <span style={{ fontWeight: 600, color: '#222' }}>{product.rating}</span>
              <span style={{ color: '#888', fontSize: '1rem' }}>({product.reviews})</span>
            </div>
            <div style={{ marginBottom: '1.2rem', color: '#555', fontSize: '1rem' }}>
              Brand: <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{product.brand}</span>
            </div>

            {/* Design Selection */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>Design:</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {product.designs.map(design => (
                  <button
                    key={design}
                    className={selectedDesign === design ? 'loginBtn' : 'registerBtn'}
                    style={{ padding: '0.6rem 1.2rem', fontWeight: 600, fontSize: '1rem', border: selectedDesign === design ? '2px solid var(--color-primary)' : '2px solid var(--color-primary)', background: selectedDesign === design ? 'var(--color-primary)' : '#fff', color: selectedDesign === design ? '#fff' : 'var(--color-primary)', borderRadius: '0.5rem', cursor: 'pointer' }}
                    onClick={() => setSelectedDesign(design)}
                  >
                    {design}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#222' }}>Size:</div>
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={selectedSize === size ? 'loginBtn' : 'registerBtn'}
                    style={{ padding: '0.5rem 1.1rem', fontWeight: 600, fontSize: '1rem', border: selectedSize === size ? '2px solid var(--color-primary)' : '2px solid var(--color-primary)', background: selectedSize === size ? 'var(--color-primary)' : '#fff', color: selectedSize === size ? '#fff' : 'var(--color-primary)', borderRadius: '0.5rem', cursor: 'pointer' }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
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
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;
