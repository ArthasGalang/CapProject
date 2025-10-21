

import React, { useEffect, useState } from 'react';
// Status progression array
const STATUS_FLOW = ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed'];
  // Function to get the next status
  const getNextStatus = (currentStatus) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return currentStatus;
    return STATUS_FLOW[idx + 1];
  };

  // Function to handle Next button click
  const handleNextStatus = (order) => {
    const nextStatus = getNextStatus(order.Status);
    if (nextStatus === order.Status) return; // Already at final status
    // Optimistically update UI
    setOrders(prevOrders => prevOrders.map(o =>
      o.OrderID === order.OrderID ? { ...o, Status: nextStatus } : o
    ));
    // Send update to backend
    fetch(`/api/orders/${order.OrderID}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then(data => {
        // Optionally update state with backend response
      })
      .catch(err => {
        // Revert UI if error
        setOrders(prevOrders => prevOrders.map(o =>
          o.OrderID === order.OrderID ? { ...o, Status: order.Status } : o
        ));
        alert('Failed to update status: ' + err.message);
      });
  };
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
        console.log('Fetched orders:', data);
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Log session user id and orders for debugging
  console.log('Session User ID:', sessionUserId);
  console.log('Orders state:', orders);

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
                      ) : orders.length === 0 ? (
                        <tr><td colSpan="6">No orders found.</td></tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.OrderID}>
                            <td>#{order.OrderID}</td>
                            <td>{order.CustomerName}</td>
                            <td>{order.OrderDate ? new Date(order.OrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</td>
                            <td>P{order.TotalPrice ? Number(order.TotalPrice).toFixed(2) : ''}</td>
                            <td><span className={`order-status order-status--${order.Status ? order.Status.toLowerCase() : ''}`}>{order.Status}</span></td>
                            <td>
                              <button className="order-action-btn" style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem', marginRight: '0.5rem' }}>Details</button>
                              <button
                                className="order-action-btn"
                                style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem' }}
                                onClick={() => handleNextStatus(order)}
                                disabled={order.Status === 'Completed'}
                              >
                                Next
                              </button>
                            </td>
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
