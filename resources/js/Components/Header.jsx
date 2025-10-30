import React from "react";
import CreateShop from "./CreateShop";
import ShopListModal from "./ShopListModal";
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
  const [shopsLoading, setShopsLoading] = React.useState(false);
  // Track if we should reload shops after shop creation
  const [shouldReloadShops, setShouldReloadShops] = React.useState(false);
  // Cart items count state
  const [cartCount, setCartCount] = React.useState(0);
  const [cartLoading, setCartLoading] = React.useState(false);
  // User addresses state
  const [userAddresses, setUserAddresses] = React.useState([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState('');

  // Fetch shops for userId when shop modal opens or after shop creation
  React.useEffect(() => {
    if ((showShopModal && userId) || shouldReloadShops) {
      setShopsLoading(true);
      fetch(`http://127.0.0.1:8000/api/shops?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          const mapped = Array.isArray(data)
            ? data
                .filter(shop => shop.UserID == userId)
                .map(shop => ({
                  id: shop.ShopID || shop.id,
                  name: shop.ShopName || shop.name,
                  logoUrl: shop.LogoImage ? `/storage/${shop.LogoImage.replace(/^storage\//, '')}` : shop.logoUrl,
                }))
            : [];
          setShops(mapped);
          setShopsLoading(false);
        })
        .catch(() => {
          setShops([]);
          setShopsLoading(false);
        });
      if (shouldReloadShops) setShouldReloadShops(false);
    }
    if (!showShopModal) {
      setShops([]);
      setShopsLoading(false);
    }
  }, [showShopModal, userId, shouldReloadShops]);

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

  // Fetch cart items count for user
  const fetchCartCount = React.useCallback(() => {
    if (!userId) {
      setCartCount(0);
      return;
    }
    setCartLoading(true);
    const token = localStorage.getItem('authToken');
    const url = `/api/user/${userId}/cart-items/count`;
    fetch(url, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        // Accept either { count: N } or a numeric response or an array
        let count = 0;
        if (data == null) count = 0;
        else if (typeof data === 'number') count = data;
        else if (Array.isArray(data)) count = data.length;
        else if (typeof data === 'object' && data.count != null) count = Number(data.count) || 0;
        setCartCount(count);
        setCartLoading(false);
      })
      .catch(() => {
        setCartCount(0);
        setCartLoading(false);
      });
  }, [userId]);

  // Call once when userId changes
  React.useEffect(() => {
    if (!userId) {
      setCartCount(0);
      return;
    }
    fetchCartCount();
  }, [userId, fetchCartCount]);

  // Listen for cart-updated events so we can refresh the count live
  React.useEffect(() => {
    window.addEventListener('cart-updated', fetchCartCount);
    return () => {
      window.removeEventListener('cart-updated', fetchCartCount);
    };
  }, [fetchCartCount]);

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
                <div style={{position: 'absolute', right: 0, top: '2.5rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', minWidth: 160, zIndex: 100, padding: '0.5rem 0'}}>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'}}
                    onClick={() => { setShowAccountMenu(false); window.location.href = '/account'; }}
                  >Account</button>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'}}
                    onClick={() => { setShowAccountMenu(false); window.location.href = '/account/orders'; }}
                  >Orders</button>
                  <button
                    style={{width: '100%', background: 'none', border: 'none', padding: '0.7rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'}}
                    onClick={() => { setShowAccountMenu(false); window.location.href = '/account/addresses'; }}
                  >Addresses</button>
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
            <a href="/cart" className="header-cart" style={{position: 'relative', display: 'inline-flex', alignItems: 'center'}}>
              <ShoppingCart size={22} />
              {/* Show badge only when cartCount > 0 */}
              {cartCount > 0 && (
                <span
                  className="header-cart-badge"
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: '0.65rem',
                    lineHeight: '1',
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 9999,
                  }}
                >{cartCount}</span>
              )}
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
        <CreateShop 
          onClose={() => setShowCreateShop(false)}
          onShopCreated={() => {
            setShowCreateShop(false);
            setShouldReloadShops(true);
          }}
        />
      )}
      {/* Shop Modal */}
      <ShopListModal
        open={showShopModal && !showCreateShop}
        onClose={() => setShowShopModal(false)}
        onOpenCreateShop={() => setShowCreateShop(true)}
        shops={shops}
        shopsLoading={shopsLoading}
      />
    </>
  );
};

export default Header;
