import React from "react";
import CreateShop from "./CreateShop";
import LoginRegister from "./LoginRegister";
import { ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [showShopModal, setShowShopModal ] = React.useState(false);
  const [showCreateShop, setShowCreateShop] = React.useState(false);
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);
  const [showBrowseMenu, setShowBrowseMenu] = React.useState(false);
  const browseRef = React.useRef(null);
  const accountRef = React.useRef(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setShowBrowseMenu(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  let userId = null;
  try {
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    userId = userData && (userData.UserID || userData.id);
  } catch (e) {
    userId = null;
  }

  // Shops state
  const [shops, setShops] = React.useState([]);
  // User addresses state
  const [userAddresses, setUserAddresses] = React.useState([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState('');

  // Fetch shops for userId when shop modal opens
  React.useEffect(() => {
    if (showShopModal && userId) {
      fetch(`http://127.0.0.1:8000/api/shops?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          // Map backend shop data to expected frontend format
          const mapped = Array.isArray(data)
            ? data
                .filter(shop => shop.UserID == userId)
                .map(shop => ({
                  id: shop.ShopID || shop.id,
                  name: shop.ShopName || shop.name,
                  logoUrl: shop.LogoImage || shop.logoUrl,
                }))
            : [];
          setShops(mapped);
        })
        .catch(() => setShops([]));
    }
    if (!showShopModal) {
      setShops([]);
    }
  }, [showShopModal, userId]);

  // Fetch addresses for current user on mount
  React.useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:8000/api/user/${userId}/addresses`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setUserAddresses(data);
        })
        .catch(() => setUserAddresses([]));
    } else {
      setUserAddresses([]);
    }
  }, [userId]);

  // On mount, check if userId exists in DB
  React.useEffect(() => {
    if (!userId) return;
    // Replace with your actual API endpoint
    fetch(`/api/check-user/${userId}`)
      .then(res => res.json())
      .then(data => {
        // Optionally handle user not found, but do NOT clear localStorage or reload here
      })
      .catch(() => {
        // Optionally handle error, but do NOT clear localStorage or reload here
      });
  }, []);

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
            <div ref={browseRef} style={{position: 'relative', display: 'inline-block'}}>
              <button
                type="button"
                className="header-nav-link"
                style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
                onClick={() => setShowBrowseMenu(v => !v)}
              >
                Browse
              </button>
              {typeof window !== 'undefined' && showBrowseMenu && (
                <div style={{position: 'absolute', left: 0, top: '2.5rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', minWidth: 140, zIndex: 100, padding: '0.5rem 0'}}>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'}}
                    onClick={() => { setShowBrowseMenu(false); window.location.href = '/browse'; }}
                  >Products</button>
                  <div style={{height: 1, background: '#eee', margin: '0.2rem 0'}}></div>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'}}
                    onClick={() => { setShowBrowseMenu(false); window.location.href = '/browse-shops'; }}
                  >Shops</button>
                </div>
              )}
            </div>
            {userId && (
              <button type="button" className="header-nav-link" onClick={() => setShowShopModal(true)}>
                Your Shops
              </button>
            )}


            {/* User */}
            {/* User Dropdown */}
            <div ref={accountRef} style={{position: 'relative', display: 'inline-block'}}>
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
                  {userId ? (
                    <button
                      style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', color: 'red'}}
                      onClick={() => { localStorage.clear(); window.location.reload(); }}
                    >Logout</button>
                  ) : (
                    <button
                      style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', color: 'green'}}
                      onClick={() => { setShowLoginModal(true); }}
                    >Login</button>
                  )}
                </div>
              )}
            </div>

            {/* Cart and User ID */}
            <a href="/cart" className="header-cart">
              <ShoppingCart size={22} />
              <span className="header-cart-badge">3</span>
            </a>
            <span className="header-user-id" style={{marginLeft: '0.7rem', fontWeight: 'bold', color: 'var(--color-primary)'}}>
              ID: {userId ? userId : 'No Login'}
            </span>
            {/* Address Dropdown removed from header. Now only handled inside CreateShop modal. */}
          </div>
          {showLoginModal && (
            <LoginRegister onClose={() => setShowLoginModal(false)} />
          )}
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
            {/* User Shops */}
            {shops.filter(shop => shop.name && shop.name.trim()).length === 0 ? (
              <div style={{textAlign: 'center', margin: '1.2rem 0', color: '#888'}}>No shops found.</div>
            ) : (
              shops.filter(shop => shop.name && shop.name.trim()).map(shop => (
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
                >
                  <div className="shop-modal-shop-icon">
                    {shop.logoUrl ? (
                      <img src={shop.logoUrl} alt={shop.name} style={{width: 32, height: 32, borderRadius: '50%'}} />
                    ) : (
                      <span style={{width: 32, height: 32, display: 'inline-block', background: '#eee', borderRadius: '50%'}}></span>
                    )}
                  </div>
                  {shop.name}
                </button>
              ))
            )}
            {/* Add Shop: Only show if shops are loaded and less than 3 exist */}
            {shops && Array.isArray(shops) && shops.length < 3 && shops.length > 0 && (
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
