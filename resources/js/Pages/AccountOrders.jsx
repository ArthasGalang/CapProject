import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AccountSidebar from "../Components/AccountSidebar";
import FloatingChatButton from "../Components/FloatingChatButton";

const orderTabs = [
  { status: 'ToPay', color: '#22c55e', label: 'To Pay' },
  { status: 'Preparing', color: '#f59e42', label: 'Preparing' },
  { status: 'Delivering', color: '#3b82f6', label: 'For Pickup/Deliver' },
  { status: 'Completed', color: '#6366f1', label: 'Completed' },
  { status: 'Cancelled', color: '#ef4444', label: 'Cancelled' }
];

const AccountOrders = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [orderDetails, setOrderDetails] = useState([]);

  React.useEffect(() => {
    // Get userId from localStorage (same logic as Header)
    let userId = null;
    try {
      const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
      userId = userData && (userData.UserID || userData.id);
    } catch (e) {
      userId = null;
    }
    if (!userId) {
      console.warn('No userId found in localStorage.');
      return;
    }
    // Fetch all order details from the MySQL view
    fetch(`/api/order-details?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.order_details)) {
          setOrderDetails(data.order_details);
          console.log('Order details from view:', data.order_details);
        } else {
          setOrderDetails([]);
        }
      })
      .catch((err) => {
        setOrderDetails([]);
        console.error("Error fetching order details:", err);
      });
  }, []);

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
                    return (
                      <div key={shopId} style={{marginBottom: '1.5rem', background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: '1.1rem 1rem'}}>
                        <div style={{fontWeight: 600, color: card.color, marginBottom: 8, fontSize: '1.08rem'}}>Shop: {shop.shopName || shopId}</div>
                        {/* Group by OrderID within shop */}
                        {[...new Set(shop.items.map(i => i.OrderID))].map(orderId => {
                          const orderItems = shop.items.filter(i => i.OrderID === orderId);
                          const orderDate = orderItems[0]?.OrderDate;
                          const total = orderItems.reduce((sum, i) => sum + (parseFloat(i.Subtotal) || 0), 0);
                          return (
                            <div key={orderId} style={{marginBottom: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: 8}}>
                              <div style={{fontWeight: 500, color: '#555', marginBottom: 4}}>Order #{orderId} <span style={{marginLeft: 12, color: '#888', fontWeight: 400}}>Date: {orderDate}</span></div>
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
                              <div style={{marginTop: 6, textAlign: 'right', fontWeight: 600, color: card.color}}>Total: ₱{total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
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
