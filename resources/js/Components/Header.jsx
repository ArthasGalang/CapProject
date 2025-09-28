import React from "react";
import { ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [showShopModal, setShowShopModal] = React.useState(false);

  return (
    <>
      <header className="w-full shadow-md bg-white">
        <nav className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Left: Logo */}
          <a href="/" className="text-2xl font-bold text-gray-800 cursor-pointer">
            NegoGen T.
          </a>

          {/* Middle: Search Bar */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 outline-none text-sm"
              />
              <button className="px-4 bg-gray-100 hover:bg-gray-200">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right: Nav Items */}
          <div className="flex items-center space-x-6">
            <button type="button" className="text-gray-700 hover:text-gray-900 text-sm" onClick={() => setShowShopModal(true)}>
              Shop
            </button>
            <a
              href="/contact"
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              Contact
            </a>

            {/* User */}
            <a href="/account" className="text-gray-700 hover:text-gray-900">
              <User size={22} />
            </a>

            {/* Cart */}
            <a href="/cart" className="relative text-gray-700 hover:text-gray-900">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </a>
          </div>
        </nav>
      </header>

      {/* Shop Modal */}
      {showShopModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '1.2rem', width: 340, minHeight: 340, boxShadow: '0 4px 32px rgba(44,204,113,0.15)', padding: '2.2rem 1.5rem 2rem 1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={() => setShowShopModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-gray-dark)', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Shops</h2>
            {/* Shop 1 */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '0.8rem', border: '2px solid var(--color-primary)', width: '100%', padding: '1.1rem 1rem', fontWeight: 600, fontSize: '1.15rem', marginBottom: '1.2rem', boxShadow: '0 2px 8px rgba(44,204,113,0.07)', cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#28b864ff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
              onClick={() => { window.location.href = '/shop'; }}
            >
              <div style={{ width: 38, height: 38, background: '#fff', borderRadius: '0.5rem', marginRight: '0.7rem' }}></div>
              Shop 1
            </button>
            {/* Add Shop */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', color: 'var(--color-primary)', borderRadius: '0.8rem', border: '2px solid var(--color-primary)', width: '90%', padding: '1.1rem 1rem', fontWeight: 600, fontSize: '1.3rem', boxShadow: '0 2px 8px rgba(44,204,113,0.07)', cursor: 'pointer', transition: 'background 0.2s', justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                <span style={{ fontSize: '1.5rem', marginRight: '0.7rem' }}>+</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
