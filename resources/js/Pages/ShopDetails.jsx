import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import ReportProductButton from "@/Components/ReportProductButton";
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';

const placeholderLogo = 'https://via.placeholder.com/80x80?text=Logo';
const placeholderBanner = 'https://via.placeholder.com/1200x240?text=Banner';

const ShopDetails = ({ shopId }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shopId && typeof window !== 'undefined') {
      // Try to get shopId from URL
      const match = window.location.pathname.match(/\/eshop\/(\d+)\//);
      if (match) shopId = match[1];
    }
    if (!shopId) return;
    setLoading(true);
    fetch(`/api/shops/${shopId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch shop details');
        return res.json();
      })
      .then(data => {
        setShop(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [shopId]);

  if (loading) return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="details" shopId={shopId} />
          <div style={{ flex: 1 }}>
            <div style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, border: '4px solid #e0f7ef', borderTop: '4px solid #22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <span style={{ color: '#1b8a44', marginTop: 12, fontWeight: 500, fontSize: 15, display: 'block' }}>Loading...</span>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
  if (error) return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="details" shopId={shopId} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>Error: {error}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
  if (!shop) return null;

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="details" shopId={shopId} />
          <div style={{ flex: 1 }}>
            <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', position: 'relative' }}>
              {/* Report button at top right of main card */}
              <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 2 }}>
                <ReportProductButton productId={shop.ShopID || shopId} />
              </div>
              <div style={{ width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', marginBottom: 32, background: '#f2fff6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={shop.BannerImage || placeholderBanner} alt="Shop Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(44,204,113,0.08)' }}>
                  <img src={shop.Logo || placeholderLogo} alt="Shop Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 800, color: '#1b5e20', marginBottom: 6 }}>
                    <span>{shop.ShopName || 'Shop Name'}</span>
                    <ReportProductButton productId={shop.ShopID || shopId} />
                  </div>
                  <div style={{ color: '#888', fontSize: 16 }}>{shop.Description || 'No description provided.'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShopDetails;
