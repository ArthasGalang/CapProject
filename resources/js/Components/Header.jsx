import React from "react";
import CreateShop from "./CreateShop";
import { ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [showShopModal, setShowShopModal ] = React.useState(false);
  const [showCreateShop, setShowCreateShop] = React.useState(false);
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);
  // Get user ID from localStorage
  let userId = null;
  try {
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    userId = userData && (userData.UserID || userData.id);
  } catch (e) {
    userId = null;
  }

  return (
    <>
      <header className="header">
        <nav className="header-nav">
          {/* Left: Logo */}
          <a href="/" className="header-logo">
            NegoGen T.
          </a>

          {/* Middle: Search Bar */}
          <div className="header-search-container">
            <div className="header-search">
              <input
                type="text"
                placeholder="Search products..."
                className="header-search-input"
              />
              <button className="header-search-button">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right: Nav Items */}
          <div className="header-nav-items">
            <a
              href="/browse"
              className="header-nav-link"
            >
              Browse
            </a>
            <button type="button" className="header-nav-link" onClick={() => setShowShopModal(true)}>
              Your Shops
            </button>


            {/* User */}
            {/* User Dropdown */}
            <div style={{position: 'relative', display: 'inline-block'}}>
              <button
                type="button"
                className="header-nav-link"
                style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
                onClick={() => setShowAccountMenu(v => !v)}
              >
                <User size={22} />
              </button>
              {typeof window !== 'undefined' && showAccountMenu && (
                <div style={{position: 'absolute', right: 0, top: '2.5rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', minWidth: 140, zIndex: 100, padding: '0.5rem 0'}}>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'}}
                    onClick={() => { setShowAccountMenu(false); window.location.href = '/account'; }}
                  >Account</button>
                  <div style={{height: 1, background: '#eee', margin: '0.2rem 0'}}></div>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', color: 'red'}}
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                  >Logout</button>
                </div>
              )}
            </div>

            {/* Cart and User ID */}
            <a href="/cart" className="header-cart">
              <ShoppingCart size={22} />
              <span className="header-cart-badge">3</span>
            </a>
            {userId && (
              <span className="header-user-id" style={{marginLeft: '0.7rem', fontWeight: 'bold', color: 'var(--color-primary)'}}>ID: {userId}</span>
            )}
          </div>
        </nav>
      </header>

      {/* Create Shop Modal (rendered above shop modal) */}
      {showCreateShop && (
        <CreateShop onClose={() => setShowCreateShop(false)} />
      )}
      {/* Shop Modal */}
      {showShopModal && !showCreateShop && (
        <div className="shop-modal-overlay">
          <div className="shop-modal">
            <button onClick={() => setShowShopModal(false)} className="shop-modal-close">&times;</button>
            <h2 className="shop-modal-title">Shops</h2>
            {/* Shop 1 */}
            <button
              className="shop-modal-shop-btn"
              onMouseEnter={e => (e.currentTarget.style.background = '#28b864ff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
              onClick={() => { window.location.href = '/shop'; }}
            >
              <div className="shop-modal-shop-icon"></div>
              Shop 1
            </button>
            {/* Add Shop */}
            <div className="shop-modal-add-wrapper">
              <button
                className="shop-modal-add-btn"
                onClick={() => setShowCreateShop(true)}
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
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
