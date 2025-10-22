

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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


  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));
  // Ensure currentPage is within bounds when orders shrink
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [orders.length, totalPages]);

  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                  {/* Styled grid-based table for orders */}
                  <div style={{width: '100%', overflowX: 'auto'}}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr', gap: 0, padding: '12px 16px', borderBottom: '2px solid #2ecc71', background: '#f2fff6', color: '#1b5e20', fontWeight: 700 }}>
                      <div>Order ID</div>
                      <div>Customer</div>
                      <div>Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div style={{textAlign: 'right'}}>Actions</div>
                    </div>
                    {loading ? (
                      <div style={{ gridColumn: '1 / span 6', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 60 }}>
                        <div style={{ width: 36, height: 36, border: '4px solid #e0f7ef', borderTop: '4px solid #22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <span style={{ color: '#1b8a44', marginTop: 12, fontWeight: 500, fontSize: 15 }}>Loading...</span>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                      </div>
                    ) : error ? (
                      <div style={{ gridColumn: '1 / span 6', color: 'red', padding: '24px 0', textAlign: 'center' }}>Error: {error}</div>
                    ) : orders.length === 0 ? (
                      <div style={{ gridColumn: '1 / span 6', color: '#888', padding: '24px 0', textAlign: 'center' }}>No orders found.</div>
                    ) : (
                      paginatedOrders.map(order => (
                        <div key={order.OrderID} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr', gap: 0, alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f3f3f3', background: '#ffffff' }}>
                          <div style={{ fontWeight: 600, color: '#222' }}>#{order.OrderID}</div>
                          <div style={{ color: '#444' }}>{order.CustomerName}</div>
                          <div style={{ color: '#444' }}>{order.OrderDate ? new Date(order.OrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</div>
                          <div style={{ color: '#1b5e20', fontWeight: 700 }}>P{order.TotalPrice ? Number(order.TotalPrice).toFixed(2) : ''}</div>
                          <div><span className={`order-status order-status--${order.Status ? order.Status.toLowerCase() : ''}`}>{order.Status}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button className="order-action-btn" style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem', marginRight: '0.5rem', background: '#eaffef', color: '#1b8a44', border: '1px solid #cff5d9', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Details</button>
                            <button
                              className="order-action-btn"
                              style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem', background: '#eaffef', color: '#1b8a44', border: '1px solid #cff5d9', borderRadius: 8, cursor: order.Status === 'Completed' ? 'not-allowed' : 'pointer', fontWeight: 700 }}
                              onClick={() => handleNextStatus(order)}
                              disabled={order.Status === 'Completed'}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Pagination Controls - centered below the table */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '18px 0 0 0', width: '100%' }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: currentPage === 1 ? '#f0f0f0' : '#eafaf0', color: currentPage === 1 ? '#bbb' : '#1b8a44', cursor: currentPage === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'<'}</button>
                    <span style={{ color: '#1b8a44', fontWeight: 700, marginLeft: 8 }}>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: currentPage === totalPages ? '#f0f0f0' : '#eafaf0', color: currentPage === totalPages ? '#bbb' : '#1b8a44', cursor: currentPage === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'>'}</button>
                  </div>
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
