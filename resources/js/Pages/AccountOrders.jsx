import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AccountSidebar from "../Components/AccountSidebar";
import FloatingChatButton from "../Components/FloatingChatButton";
import ReportProductButton from "@/Components/ReportProductButton";

const orderTabs = [
  { status: 'To Pay', color: '#22c55e', label: 'To Pay' },
  { status: 'Preparing', color: '#f59e42', label: 'Preparing' },
  { status: 'Delivering', color: '#3b82f6', label: 'For Pickup/Deliver' },
  { status: 'Completed', color: '#6366f1', label: 'Completed' },
  { status: 'Cancelled', color: '#ef4444', label: 'Cancelled' }
];

const AccountOrders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [shopOwners, setShopOwners] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  let userId = null;

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      const result = await res.json();
      if (result.success) {
        setShowCancelModal(false);
        setCancelOrderId(null);
        // Optionally refresh orders
        setOrderDetails(details => details.map(o => o.OrderID === orderId ? { ...o, Status: 'Cancelled' } : o));
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };
  try {
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    userId = userData && (userData.UserID || userData.id);
  } catch (e) {
    userId = null;
  }
  useEffect(() => {
    if (!userId) {
      window.location.href = '/?showLoginModal=1';
      return;
    }
    // Fetch all order details from the MySQL view
    fetch(`/api/order-details?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.order_details)) {
          setOrderDetails(data.order_details);
          console.log('Order details from view:', data.order_details);
          
          // Extract unique shop IDs and fetch shop owner information
          const uniqueShopIds = [...new Set(data.order_details.map(o => o.ShopID))];
          uniqueShopIds.forEach(shopId => {
            fetch(`/api/shops/${shopId}`)
              .then(res => res.json())
              .then(shop => {
                if (shop && shop.UserID) {
                  setShopOwners(prev => ({ ...prev, [shopId]: shop.UserID }));
                }
              })
              .catch(err => console.error('Error fetching shop owner:', err));
          });
        } else {
          setOrderDetails([]);
        }
      })
      .catch((err) => {
        setOrderDetails([]);
        console.error("Error fetching order details:", err);
      });
  }, [userId]);
  if (!userId) return null;

  return (
    <>
      <Header />
      <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', width: '100%', maxWidth: 1400, margin: '0 auto', paddingTop: '2.5rem'}}>
        <div style={{minWidth: 240, maxWidth: 280, marginRight: '2.5rem'}}>
          <AccountSidebar active="orders" />
        </div>
        <section className="account-section" style={{flex: 1, maxWidth: 1200, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.7rem 2.2rem', position: 'relative'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2 className="account-title" style={{marginBottom: '0.7rem', fontSize: '2.1rem', fontWeight: 700, color: 'var(--color-primary)'}}>Orders</h2>
            {/* Tabs for order statuses */}
            <div style={{width: '100%', marginTop: '2.5rem'}}>
              <div style={{display: 'flex', borderBottom: '2px solid #eee', marginBottom: '2rem', width: '100%'}}>
                {orderTabs.map((tab, idx) => (
                  <button
                    key={tab.status}
                    onClick={() => setActiveTab(idx)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === idx ? `3px solid ${tab.color}` : '3px solid transparent',
                      color: activeTab === idx ? tab.color : '#888',
                      fontWeight: activeTab === idx ? 700 : 500,
                      fontSize: '1.1rem',
                      padding: '0.7rem 0',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'color 0.2s, border-bottom 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div>
                {/* Tab content: show orders for the active status */}
                {(() => {
                  const card = orderTabs[activeTab];
                  const filtered = orderDetails.filter(o => o.Status === card.status);
                  const shops = {};
                  filtered.forEach(item => {
                    if (!shops[item.ShopID]) shops[item.ShopID] = { shopName: item.ShopName, items: [] };
                    shops[item.ShopID].items.push(item);
                  });
                  const shopIds = Object.keys(shops);
                  if (shopIds.length === 0) return <div style={{color:'#888', padding:'2rem 0'}}>No orders for this status.</div>;
                  return shopIds.map(shopId => {
                    const shop = shops[shopId];
                    const ownerUserId = shopOwners[shopId];
                    return (
                      <div key={shopId} style={{marginBottom: '1.5rem', background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: '1.1rem 1rem'}}>
                        <div style={{fontWeight: 600, color: card.color, marginBottom: 8, fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 12}}>
                          <span>Shop: {shop.shopName || shopId}</span>
                          {ownerUserId && <span style={{fontSize: '0.95rem', color: '#888', fontWeight: 500}}>(Owner ID: {ownerUserId})</span>}
                        </div>
                        {/* Group by OrderID within shop */}
                        {[...new Set(shop.items.map(i => i.OrderID))].map(orderId => {
                          const orderItems = shop.items.filter(i => i.OrderID === orderId);
                          const orderDate = orderItems[0]?.OrderDate;
                          const total = orderItems.reduce((sum, i) => sum + (parseFloat(i.Subtotal) || 0), 0);
                          return (
                            <div key={orderId} style={{marginBottom: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: 8, position: 'relative'}}>
                              <div style={{display:'flex', alignItems:'center', gap:10, fontWeight: 500, color: '#555', marginBottom: 4}}>
                                <span style={{marginRight: 8}}><ReportProductButton productId={orderId} /></span>
                                <span>Order #{orderId}</span>
                                <span style={{marginLeft: 12, color: '#888', fontWeight: 400}}>Date: {orderDate}</span>
                              </div>
                              <div style={{width: '100%', marginBottom: 0}}>
                                <div style={{display: 'flex', fontWeight: 600, color: '#888', fontSize: '0.98rem', marginBottom: 6, paddingLeft: 4}}>
                                  <div style={{width: 56}}></div>
                                  <div style={{flex: 2, marginLeft: 15}}>Product Name</div>
                                  <div style={{flex: 1}}>Quantity</div>
                                  <div style={{flex: 1}}>Subtotal</div>
                                </div>
                                {orderItems.map((item, idx) => (
                                  <div key={item.OrderItemID || idx} style={{display: 'flex', alignItems: 'center', gap: 12, background: '#f7f7f7', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '0.7rem', padding: '0.7rem 0.5rem 0.7rem 0.7rem'}}>
                                    {/* Product Icon */}
                                    <div style={{width: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                      {(() => {
                                        let img = null;
                                        try {
                                          const imgs = typeof item.Image === 'string' ? JSON.parse(item.Image) : item.Image;
                                          if (Array.isArray(imgs) && imgs.length > 0) {
                                            img = imgs[0];
                                          } else if (typeof imgs === 'string') {
                                            img = imgs;
                                          }
                                        } catch (e) { img = null; }
                                        return img ? (
                                          <img src={img.startsWith('http') ? img : `/storage/${img}`} alt={item.ProductName} style={{width: 44, height: 44, objectFit: 'cover', borderRadius: 8, background: '#eee'}} />
                                        ) : (
                                          <div style={{width: 44, height: 44, borderRadius: 8, background: '#eee'}} />
                                        );
                                      })()}
                                    </div>
                                    <div style={{flex: 2, fontWeight: 500}}>{item.ProductName}</div>
                                    <div style={{flex: 1, marginLeft: 12}}>{item.Quantity}</div>
                                    <div style={{flex: 1}}>₱{parseFloat(item.Subtotal).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                                  </div>
                                ))}
                              </div>
                              {/* Buyer Note */}
                              {orderItems[0]?.BuyerNote && (
                                <div style={{marginTop: 8, fontStyle: 'italic', color: '#555', background: '#f3f3f3', borderRadius: 6, padding: '0.6rem 1rem', fontSize: '0.98rem'}}>
                                  <span style={{fontWeight: 500, color: '#888'}}>Note to seller:</span> {orderItems[0].BuyerNote}
                                </div>
                              )}
                              <div style={{marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                  {card.status === 'To Pay' && (
                                    <>
                                      <button
                                        style={{background:'#ef4444', color:'#fff', fontWeight:600, fontSize:'1rem', padding:'0.5rem 1.3rem', borderRadius:6, border:'none', cursor:'pointer'}}
                                        onClick={() => { setShowCancelModal(true); setCancelOrderId(orderId); }}
                                      >
                                        Cancel Order
                                      </button>
                                      {orderItems[0]?.PaymentMethod && orderItems[0].PaymentMethod.toLowerCase().trim() === 'ewallet' && (
                                        <button
                                          style={{background:'#1976d2', color:'#fff', fontWeight:600, fontSize:'1rem', padding:'0.5rem 1.3rem', borderRadius:6, border:'none', cursor:'pointer'}}
                                          onClick={() => alert('Show QR payment modal for order ' + orderId)}
                                        >
                                          Pay with QR
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div style={{fontWeight: 600, color: card.color, fontSize: '1.08rem'}}>Total: ₱{total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                              </div>
      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{background:'#fff', borderRadius:'1rem', boxShadow:'0 4px 24px rgba(44,204,113,0.15)', padding:'2.5rem 2rem', minWidth:320, textAlign:'center', position:'relative'}}>
            <h2 style={{fontWeight:700, fontSize:'1.2rem', marginBottom:'1rem', color:'#ef4444'}}>Cancel Order?</h2>
            <p style={{marginBottom:'2rem'}}>Are you sure you want to cancel this order?</p>
            <button
              style={{background:'#ef4444', color:'#fff', fontWeight:600, fontSize:'1.1rem', padding:'0.7rem 2rem', borderRadius:8, border:'none', cursor:'pointer', marginRight:12}}
              onClick={() => handleCancelOrder(cancelOrderId)}
            >
              Yes, Cancel
            </button>
            <button
              style={{background:'#eee', color:'#555', fontWeight:600, fontSize:'1.1rem', padding:'0.7rem 2rem', borderRadius:8, border:'none', cursor:'pointer'}}
              onClick={() => { setShowCancelModal(false); setCancelOrderId(null); }}
            >
              No, Go Back
            </button>
            <button
              style={{position:'absolute', top:12, right:18, background:'none', border:'none', fontSize:22, color:'#888', cursor:'pointer'}}
              onClick={() => { setShowCancelModal(false); setCancelOrderId(null); }}
              aria-label="Close"
            >×</button>
          </div>
        </div>
      )}
                              {/* Report button removed from bottom, now at top */}
                            </div>
                          );
                        })}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

          </div>
        </section>
      </div>
  <FloatingChatButton onClick={() => alert('Open chat window')} />
  <Footer />
    </>
  );
};

export default AccountOrders;
