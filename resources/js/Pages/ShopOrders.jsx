

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
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });
  // Separate state for table action confirmation
  const [tableActionOrder, setTableActionOrder] = useState(null);
  const [emptyModalOpen, setEmptyModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Function to open modal and fetch order items
  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
    setItemsLoading(true);
    fetch(`/api/order-items?order_id=${order.OrderID}`)
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : [];
        console.log('Order Items for OrderID', order.OrderID, items);
        setOrderItems(items);
        setItemsLoading(false);
      })
      .catch(() => {
        setOrderItems([]);
        setItemsLoading(false);
      });
  };
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
        // Log TotalPrice for each order
        filtered.forEach(order => {
          console.log(`OrderID: ${order.OrderID}, TotalPrice:`, order.TotalPrice);
        });
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
          valA = Number(a.TotalPrice);
          valB = Number(b.TotalPrice);
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
                          <div style={{ color: '#1b5e20', fontWeight: 700 }}>₱{order.TotalPrice ? Number(order.TotalPrice).toFixed(2) : ''}</div>
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
                            <button className="order-action-btn" style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem', marginRight: '0.5rem', background: '#eaffef', color: '#1b8a44', border: '1px solid #cff5d9', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }} onClick={() => handleShowDetails(order)}>Details</button>
                            {order.Status !== 'Cancelled' && (
                              <button
                                className="order-action-btn"
                                style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem', background: '#eaffef', color: '#1b8a44', border: '1px solid #cff5d9', borderRadius: 8, cursor: order.Status === 'Completed' ? 'not-allowed' : 'pointer', fontWeight: 700 }}
                                disabled={order.Status === 'Completed'}
                                onClick={() => {
                                  if (order.Status !== 'Completed') {
                                    setTableActionOrder(order);
                                    setEmptyModalOpen(true);
                                  }
                                }}
                              >
                                Next
                              </button>
                            )}
      {/* Next Status Confirmation Modal for Table Next Button */}
      {emptyModalOpen && tableActionOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.08)', zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => { setEmptyModalOpen(false); setTableActionOrder(null); }} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              Confirm status change?
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              Are you sure you want to move this order to the next status?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => { setEmptyModalOpen(false); setTableActionOrder(null); }}
              >Cancel</button>
              <button
                style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={async () => {
                  // Next status logic for table Next button
                  const nextStatus = getNextStatus(tableActionOrder.Status);
                  if (nextStatus === tableActionOrder.Status) return;
                  try {
                    const res = await fetch(`/api/orders/${tableActionOrder.OrderID}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: nextStatus })
                    });
                    if (!res.ok) throw new Error('Failed to update status');
                    setOrders(prev => prev.map(o => o.OrderID === tableActionOrder.OrderID ? { ...o, Status: nextStatus } : o));
                    setEmptyModalOpen(false);
                    setTableActionOrder(null);
                  } catch (err) {
                    alert('Failed to update status: ' + err.message);
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
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
      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: 18 }}>Order Details</h3>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: 8 }}>Order Info</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                <tbody>
                  {Object.entries(selectedOrder).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ fontWeight: 500, color: '#888', padding: '4px 8px', width: 120 }}>{key}</td>
                      <td style={{ padding: '4px 8px', color: '#222', fontWeight: 500 }}>{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: 8 }}>Order Items</div>
              {itemsLoading ? (
                <div style={{ color: '#888', fontWeight: 500, marginBottom: 8 }}>Loading items...</div>
              ) : orderItems.length === 0 ? (
                <div style={{ color: '#888', fontWeight: 500, marginBottom: 8 }}>No items found.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {Object.keys(orderItems[0]).filter(key => key !== 'created_at' && key !== 'updated_at').map((key) => (
                        <th key={key} style={{ fontWeight: 600, color: '#888', padding: '4px 8px', background: '#f7f7f7' }}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, idx) => (
                      <tr key={idx}>
                        {Object.entries(item).filter(([key]) => key !== 'created_at' && key !== 'updated_at').map(([key, value], i) => (
                          <td key={i} style={{ padding: '4px 8px', color: '#222', fontWeight: 500 }}>{String(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {/* Hide buttons if status is Cancelled or Completed */}
              {selectedOrder.Status !== 'Completed' && selectedOrder.Status !== 'Cancelled' && (
                <>
                  {/* Next button */}
                  <button
                    style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #22c55e22' }}
                    onClick={() => setConfirmModal({ open: true, action: 'next' })}
                  >Next Status</button>
                  {/* Cancel button */}
                  <button
                    style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #ef444422' }}
                    onClick={() => setConfirmModal({ open: true, action: 'cancel' })}
                  >Cancel Order</button>
                </>
              )}
            </div>
  {/* Confirmation Modal for Order Details Modal (only when modalOpen is true) */}
  {modalOpen && confirmModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', padding: '2rem 2.2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setConfirmModal({ open: false, action: null })} style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              {confirmModal.action === 'next' ? 'Confirm status change?' : 'Confirm cancellation?'}
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              {confirmModal.action === 'next'
                ? `Are you sure you want to move this order to the next status?`
                : `Are you sure you want to cancel this order? This action cannot be undone.`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => setConfirmModal({ open: false, action: null })}
              >Cancel</button>
              <button
                style={{ background: confirmModal.action === 'next' ? '#22c55e' : '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={async () => {
                  if (confirmModal.action === 'next') {
                    // Next status logic for modal
                    const STATUS_FLOW = ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed'];
                    const currentIdx = STATUS_FLOW.indexOf(selectedOrder.Status);
                    const nextStatus = currentIdx !== -1 && currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : selectedOrder.Status;
                    if (nextStatus === selectedOrder.Status) return;
                    try {
                      const res = await fetch(`/api/orders/${selectedOrder.OrderID}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: nextStatus })
                      });
                      if (!res.ok) throw new Error('Failed to update status');
                      setOrders(prev => prev.map(o => o.OrderID === selectedOrder.OrderID ? { ...o, Status: nextStatus } : o));
                      setSelectedOrder({ ...selectedOrder, Status: nextStatus });
                      setConfirmModal({ open: false, action: null });
                    } catch (err) {
                      alert('Failed to update status: ' + err.message);
                    }
                  } else if (confirmModal.action === 'cancel') {
                    // Cancel logic for modal
                    try {
                      const res = await fetch(`/api/orders/${selectedOrder.OrderID}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Cancelled' })
                      });
                      if (!res.ok) throw new Error('Failed to cancel order');
                      setOrders(prev => prev.map(o => o.OrderID === selectedOrder.OrderID ? { ...o, Status: 'Cancelled' } : o));
                      setSelectedOrder({ ...selectedOrder, Status: 'Cancelled' });
                      setConfirmModal({ open: false, action: null });
                      setModalOpen(false);
                    } catch (err) {
                      alert('Failed to cancel order: ' + err.message);
                    }
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Table Next Button */}
      {tableActionOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', padding: '2rem 2.2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setTableActionOrder(null)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              Confirm status change?
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              Are you sure you want to move this order to the next status?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => setTableActionOrder(null)}
              >Cancel</button>
              <button
                style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={async () => {
                  // Next status logic for table
                  const STATUS_FLOW = ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed'];
                  const currentIdx = STATUS_FLOW.indexOf(tableActionOrder.Status);
                  const nextStatus = currentIdx !== -1 && currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : tableActionOrder.Status;
                  if (nextStatus === tableActionOrder.Status) return;
                  try {
                    const res = await fetch(`/api/orders/${tableActionOrder.OrderID}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: nextStatus })
                    });
                    if (!res.ok) throw new Error('Failed to update status');
                    setOrders(prev => prev.map(o => o.OrderID === tableActionOrder.OrderID ? { ...o, Status: nextStatus } : o));
                    setTableActionOrder(null);
                  } catch (err) {
                    alert('Failed to update status: ' + err.message);
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopOrders;
