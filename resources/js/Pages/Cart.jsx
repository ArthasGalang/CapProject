import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const Cart = () => (
  <>
    <Header />
    <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem' }}>
        <h1 className="shopItemName" style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: 700 }}>Shopping Cart</h1>
        {/* Cart Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', color: '#222', fontWeight: 600 }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}></th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Design</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Size</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Quantity</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Remove</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder Item 1 */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>
                <img src="https://via.placeholder.com/60x60?text=Item1" alt="Item1" style={{ width: 60, height: 60, borderRadius: '0.5rem', objectFit: 'cover', background: '#f3f4f6' }} />
              </td>
              <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Product 1</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>Option 1</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>35cm</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <button className="registerBtn" style={{ width: 28, height: 28, fontSize: '1.1rem', fontWeight: 700, padding: 0 }}>-</button>
                  <span style={{ fontWeight: 600, fontSize: '1rem', minWidth: 24, textAlign: 'center' }}>1</span>
                  <button className="loginBtn" style={{ width: 28, height: 28, fontSize: '1.1rem', fontWeight: 700, padding: 0 }}>+</button>
                </div>
              </td>
              <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#222' }}>₱100.00</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button className="registerBtn" style={{ fontSize: '0.95rem', padding: '0.3rem 0.8rem' }}>Remove</button>
              </td>
            </tr>
            {/* Placeholder Item 2 */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>
                <img src="https://via.placeholder.com/60x60?text=Item2" alt="Item2" style={{ width: 60, height: 60, borderRadius: '0.5rem', objectFit: 'cover', background: '#f3f4f6' }} />
              </td>
              <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Product 2</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>Option 2</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>50cm</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <button className="registerBtn" style={{ width: 28, height: 28, fontSize: '1.1rem', fontWeight: 700, padding: 0 }}>-</button>
                  <span style={{ fontWeight: 600, fontSize: '1rem', minWidth: 24, textAlign: 'center' }}>2</span>
                  <button className="loginBtn" style={{ width: 28, height: 28, fontSize: '1.1rem', fontWeight: 700, padding: 0 }}>+</button>
                </div>
              </td>
              <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#222' }}>₱200.00</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button className="registerBtn" style={{ fontSize: '0.95rem', padding: '0.3rem 0.8rem' }}>Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Cart Summary and Checkout */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
            Total: ₱300.00
          </div>
          <button className="loginBtn" style={{ fontWeight: 600, fontSize: '1.1rem', padding: '0.9rem 2.5rem', background: 'var(--color-primary)', border: '2px solid var(--color-primary)' }}>Checkout</button>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Cart;
