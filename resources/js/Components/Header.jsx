import React from "react";
import { ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [showShopModal, setShowShopModal ] = React.useState(false);

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
            <a href="/account" className="header-nav-link">
              <User size={22} />
            </a>

            {/* Cart */}
            <a href="/cart" className="header-cart">
              <ShoppingCart size={22} />
              <span className="header-cart-badge">
                3
              </span>
            </a>
          </div>
        </nav>
      </header>

      {/* Shop Modal */}
      {showShopModal && (
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
