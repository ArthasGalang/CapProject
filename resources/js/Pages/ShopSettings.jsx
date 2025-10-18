import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';

const ShopSettings = ({ shopId }) => {
  const handleDeleteShop = async () => {
    if (!shopId) {
      alert('No shop selected.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this shop? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/shops/${shopId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Shop deleted successfully.');
        window.location.href = '/';
      } else {
        alert('Failed to delete shop.');
      }
    } catch (err) {
      alert('Error deleting shop.');
    }
  };

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="settings" />
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
              <h1 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem', marginBottom: '1.2rem' }}>Shop Settings</h1>
              <button
                style={{ background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '0.7rem', fontWeight: 600, fontSize: '1.1rem', padding: '0.8rem 2.2rem', cursor: 'pointer' }}
                onClick={handleDeleteShop}
              >
                Delete Shop
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShopSettings;
