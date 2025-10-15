import React from "react";
import Header from "../Components/Header";

const CheckoutPage = () => {
    return (
        <>
            <Header />
            <div style={{ maxWidth: '700px', margin: '48px auto', background: '#fff', borderRadius: '16px', boxShadow: '0 6px 32px rgba(0,0,0,0.10)', padding: '40px 32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: '#222' }}>Checkout</h1>
                <div style={{ marginBottom: '18px', color: '#555', fontSize: '1.08rem' }}>
                    <strong>Order Summary:</strong>
                    <ul style={{ marginTop: '12px', marginBottom: '12px', paddingLeft: '18px' }}>
                        <li>Sample Product 1 x 1 - ₱299</li>
                        <li>Sample Product 2 x 2 - ₱998</li>
                    </ul>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '8px' }}>Total: ₱1,297</div>
                </div>
                <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Shipping Address</label>
                    <input type="text" placeholder="Enter your address..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                </div>
                <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Payment Method</label>
                    <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}>
                        <option>Credit Card</option>
                        <option>GCash</option>
                        <option>PayMaya</option>
                        <option>Cash on Delivery</option>
                    </select>
                </div>
                <button style={{ width: '100%', padding: '14px', borderRadius: '8px', background: '#2ECC71', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', marginTop: '8px', transition: 'background 0.2s' }}>
                    Place Order
                </button>
            </div>
        </>
    );
};

export default CheckoutPage;
