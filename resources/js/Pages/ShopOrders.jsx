

import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get session user id (assume it's available globally, e.g., window.sessionUserId)
  const sessionUserId = window.sessionUserId;

  useEffect(() => {
    fetch('/api/shop-orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter orders for this shop owner
  const filteredOrders = orders.filter(order => order.ShopOwnerID == sessionUserId);

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="orders" />
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem' }}>
              <div className="order-management">
                <div className="order-management__header">
                  <h2 className="order-management__title">Shop Orders</h2>
                  <div className="order-management__subtitle">Manage and process your customer orders</div>
                </div>
                <div className="order-management__filter">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select className="order-management__select" style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2rem' }}>
                      <option>All Orders</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1rem', color: '#888' }}>▼</span>
                  </div>
                </div>
                <div className="order-management__table-wrapper">
                  <table className="order-management__table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6">Loading...</td></tr>
                      ) : error ? (
                        <tr><td colSpan="6" style={{ color: 'red' }}>Error: {error}</td></tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr><td colSpan="6">No orders found.</td></tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.OrderID}>
                            <td>#{order.OrderID}</td>
                            <td>{order.CustomerName}</td>
                            <td>{new Date(order.OrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                            <td>P{Number(order.TotalPrice).toFixed(2)}</td>
                            <td><span className={`order-status order-status--${order.Status.toLowerCase()}`}>{order.Status}</span></td>
                            <td><button className="order-action-btn">Details</button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShopOrders;
