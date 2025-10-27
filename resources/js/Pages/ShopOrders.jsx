

import React, { useEffect, useState } from 'react';
// Status progression array
const STATUS_FLOW = ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed'];

// Status color and label mapping
const STATUS_META = {
  'To Pay':   { color: '#22c55e', label: 'To Pay' },
  'Preparing': { color: '#f59e42', label: 'Preparing' },
  'For Pickup/Delivery': { color: '#3b82f6', label: 'For Pickup/Delivery' },
  'Completed': { color: '#6366f1', label: 'Completed' },
  'Cancelled': { color: '#ef4444', label: 'Cancelled' },
  'Delivering': { color: '#3b82f6', label: 'Delivering' }, // fallback for alternate status
  'ToPay': { color: '#22c55e', label: 'To Pay' }, // fallback for alternate status
};
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

const ShopOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;

  // Get shopId from props (passed by Inertia)
  const shopId = props.shopId;

  useEffect(() => {
    fetch('/api/shop-orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        // Filter orders by shopId
        const filtered = data.filter(order => order.ShopID == shopId);
        console.log('Fetched orders:', filtered);
        setOrders(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);


  // Only show valid statuses from migration
  const VALID_STATUSES = ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed', 'Cancelled'];
  const statusCounts = {};
  VALID_STATUSES.forEach(status => {
    statusCounts[status] = orders.filter(order => order.Status === status || order.Status?.replace(/\s/g, '') === status).length;
  });

  // Filter orders by selected status
  let filteredOrders = selectedStatus
    ? orders.filter(order => order.Status === selectedStatus)
    : orders;

  // Sorting logic
  if (sortColumn) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      let valA, valB;
      switch (sortColumn) {
        case 'OrderID':
          valA = Number(a.OrderID);
          valB = Number(b.OrderID);
          break;
        case 'Customer':
          valA = (a.BuyerName || a.CustomerName || '').toLowerCase();
          valB = (b.BuyerName || b.CustomerName || '').toLowerCase();
          break;
        case 'Date':
          valA = new Date(a.OrderDate || 0).getTime();
          valB = new Date(b.OrderDate || 0).getTime();
          break;
        case 'Amount':
          valA = Number(a.TotalAmount);
          valB = Number(b.TotalAmount);
          break;
        case 'Status':
          valA = (a.Status || '').toLowerCase();
          valB = (b.Status || '').toLowerCase();
          break;
        default:
          valA = '';
          valB = '';
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic (filtered)
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  // Ensure currentPage is within bounds when orders shrink or filter changes
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredOrders.length, totalPages]);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // Log shopId and orders for debugging
  console.log('Shop ID:', shopId);
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
                {/* Status summary cards (only valid statuses) */}
                <div style={{ display: 'flex', gap: '1.5rem', margin: '1.5rem 0 2rem 0', flexWrap: 'wrap', position: 'relative' }}>
                  {VALID_STATUSES.map((status, idx) => {
                    const meta = STATUS_META[status];
                    const isSelected = selectedStatus === status;
                    const isLast = idx === VALID_STATUSES.length - 1;
                    return (
                      <React.Fragment key={status}>
                        <div
                          onClick={() => {
                            setSelectedStatus(selectedStatus === status ? null : status);
                            setCurrentPage(1);
                          }}
                          style={{
                            background: isSelected ? meta.color + '22' : '#fff',
                            border: isSelected ? `2.5px solid ${meta.color}` : '2.5px solid #ddd',
                            borderRadius: '1rem',
                            padding: '1rem 2.2rem',
                            minWidth: 120,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: isSelected ? `0 4px 16px ${meta.color}33` : '0 2px 8px rgba(44,204,113,0.07)',
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            outline: isSelected ? `2.5px solid ${meta.color}` : 'none',
                            position: 'relative',
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.background = '#f7f7f7';
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) e.currentTarget.style.background = '#fff';
                          }}
                        >
                          <span style={{ color: isSelected ? meta.color : '#222', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{meta.label}</span>
                          <span style={{ color: isSelected ? meta.color : '#222', fontWeight: 800, fontSize: '1.5rem' }}>{statusCounts[status]}</span>
                          {isSelected && (
                            <span style={{ position: 'absolute', top: 8, right: 12, fontSize: 18, color: meta.color, fontWeight: 700 }}>&#10003;</span>
                          )}
                        </div>
                        {isLast && (
                          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8, position: 'relative' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                background: '#e0f7ef',
                                color: '#1b8a44',
                                fontWeight: 700,
                                fontSize: 13,
                                textAlign: 'center',
                                lineHeight: '18px',
                                cursor: 'default',
                                marginLeft: 2,
                                position: 'relative',
                              }}
                              title="Click a card to filter orders by status"
                            >i</span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <div style={{ borderBottom: '2px solid #2ecc71'}}></div>
                <div className="order-management__table-wrapper">
                  {/* Styled grid-based table for orders */}
                  <div style={{width: '100%', overflowX: 'auto'}}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr', gap: 0, padding: '12px 16px', borderBottom: '2px solid #2ecc71', background: '#f2fff6', color: '#1b5e20', fontWeight: 700 }}>
                      <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => {
                        if (sortColumn === 'OrderID') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        setSortColumn('OrderID');
                      }}>
                        Order ID {sortColumn === 'OrderID' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </div>
                      <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => {
                        if (sortColumn === 'Customer') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        setSortColumn('Customer');
                      }}>
                        Customer {sortColumn === 'Customer' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </div>
                      <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => {
                        if (sortColumn === 'Date') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        setSortColumn('Date');
                      }}>
                        Date {sortColumn === 'Date' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </div>
                      <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => {
                        if (sortColumn === 'Amount') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        setSortColumn('Amount');
                      }}>
                        Amount {sortColumn === 'Amount' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </div>
                      <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => {
                        if (sortColumn === 'Status') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        setSortColumn('Status');
                      }}>
                        Status {sortColumn === 'Status' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </div>
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
                          <div style={{ color: '#444' }}>
                            {order.BuyerName || order.CustomerName || ''}
                          </div>
                          <div style={{ color: '#444' }}>{order.OrderDate ? new Date(order.OrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</div>
                          <div style={{ color: '#1b5e20', fontWeight: 700 }}>₱{order.TotalAmount ? Number(order.TotalAmount).toFixed(2) : ''}</div>
                          <div>
                            {(() => {
                              const meta = STATUS_META[order.Status] || STATUS_META[order.Status?.replace(/\s/g, '')] || { color: '#888', label: order.Status };
                              return (
                                <span
                                  className="order-status"
                                  style={{
                                    background: meta.color + '22',
                                    color: meta.color,
                                    borderRadius: 8,
                                    padding: '2px 10px',
                                    fontWeight: 700,
                                    fontSize: '0.98rem',
                                    border: `1.5px solid ${meta.color}`,
                                    letterSpacing: 0.2,
                                  }}
                                >
                                  {meta.label}
                                </span>
                              );
                            })()}
                          </div>
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
