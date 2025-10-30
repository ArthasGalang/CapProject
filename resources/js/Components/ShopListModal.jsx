import React from "react";

const ShopListModal = ({
  open,
  onClose,
  onOpenCreateShop,
  shops,
  shopsLoading,
  setShowCreateShop,
}) => {
  return !open ? null : (
    <div className="shop-modal-overlay">
      <div className="shop-modal">
        <button onClick={onClose} className="shop-modal-close">&times;</button>
        <h2 className="shop-modal-title">Shops</h2>
        {/* Loading animation while fetching shops */}
        {shopsLoading ? (
          <div style={{ textAlign: 'center', margin: '1.2rem 0', color: '#888' }}>
            <span className="shop-modal-loading-spinner" style={{ display: 'inline-block', width: 32, height: 32, border: '4px solid #eee', borderTop: '4px solid #28b864', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
            <div>Loading shops...</div>
          </div>
        ) : (
          <>
            {shops.filter(shop => shop.name && shop.name.trim()).length === 0 ? (
              <div style={{ textAlign: 'center', margin: '1.2rem 0', color: '#888' }}>No shops found.</div>
            ) : (
              shops.filter(shop => shop.name && shop.name.trim()).map(shop => {
                const getVerificationStyle = (status) => {
                  switch(status) {
                    case 'Verified':
                      return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
                    case 'Rejected':
                      return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
                    case 'Pending':
                    default:
                      return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
                  }
                };
                const verificationStyle = getVerificationStyle(shop.verification);
                
                return (
                <button
                  key={shop.id}
                  className="shop-modal-shop-btn"
                  onMouseEnter={e => (e.currentTarget.style.background = '#28b864ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
                  onClick={() => {
                    const shopId = shop.ShopID || shop.id;
                    const url = `/eshop/${shopId}/dashboard`;
                    if (window.Inertia) {
                      window.Inertia.visit(url);
                    } else {
                      window.location.href = url;
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="shop-modal-shop-icon">
                      {shop.logoUrl ? (
                        <img src={shop.logoUrl} alt={shop.name} className="shop-logo-circle" />
                      ) : (
                        <span className="shop-logo-placeholder"></span>
                      )}
                    </div>
                    {shop.name}
                  </div>
                  <span style={{ 
                    marginLeft: 16, 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    backgroundColor: verificationStyle.bg,
                    color: verificationStyle.color,
                    border: `1px solid ${verificationStyle.border}`
                  }}>
                    {shop.verification || 'Pending'}
                  </span>
                </button>
              )})
            )}
            {/* Add Shop: Show if shops are loaded and less than 3 exist */}
            {shops && Array.isArray(shops) && shops.length < 3 && (
              <div className="shop-modal-add-wrapper">
                <button
                  className="shop-modal-add-btn"
                  onClick={onOpenCreateShop}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  <span className="shop-modal-add-icon">+</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopListModal;
