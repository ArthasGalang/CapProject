import React from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
// Simple circular loader
function CircularLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <div style={{
        width: 48,
        height: 48,
        border: '6px solid #e5e7eb',
        borderTop: '6px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Helper for status badge (same style as Dashboard)
function statusBadge(status) {
  let color = '#fef3c7', text = '#b45309';
  if (status === 'Verified') { color = '#d1fae5'; text = '#047857'; }
  if (status === 'Pending') { color = '#fef3c7'; text = '#b45309'; }
  if (status === 'Rejected') { color = '#fee2e2'; text = '#b91c1c'; }
  return (
    <span style={{ background: color, color: text, fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>{status}</span>
  );
}

const ShopManagement = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 10;
  const [shops, setShops] = React.useState([]);
  const [owners, setOwners] = React.useState({});
  const [addresses, setAddresses] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  // Filter state
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [filterOwnerIds, setFilterOwnerIds] = React.useState([]);
  const [ownerInput, setOwnerInput] = React.useState('');
  const [filterDateStart, setFilterDateStart] = React.useState('');
  const [filterDateEnd, setFilterDateEnd] = React.useState('');
  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedShop, setSelectedShop] = React.useState(null);
  // Confirmation modals
  const [confirmAction, setConfirmAction] = React.useState(null); // 'reject' | 'verify' | 'revert'
  const [confirmError, setConfirmError] = React.useState('');

  React.useEffect(() => {
    fetch('/api/shops')
      .then(res => res.json())
      .then(async shopsData => {
        setShops(Array.isArray(shopsData) ? shopsData : []);
        // Fetch owner data and address data for each shop
        const ownerMap = {};
        const addressMap = {};
        for (const shop of shopsData) {
          if (shop.UserID) {
            try {
              const res = await fetch(`/api/user/${shop.UserID}`);
              const user = await res.json();
              ownerMap[shop.ShopID] = user;
            } catch (err) {
              ownerMap[shop.ShopID] = null;
            }
          }
          if (shop.AddressID) {
            try {
              const res = await fetch(`/api/addresses/${shop.AddressID}`);
              const address = await res.json();
              addressMap[shop.ShopID] = address;
            } catch (err) {
              addressMap[shop.ShopID] = null;
            }
          }
        }
        setOwners(ownerMap);
        setAddresses(addressMap);
      })
      .catch(err => {
        console.error('Error fetching shops:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <AdminLayout>
      <div className="admin-reports-container">
        <h1 className="admin-reports-title">Shop Management</h1>
        <div className="admin-reports-subtitle">View and manage all shops</div>
        {/* Filter Bar */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', padding: '1.2rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', maxWidth: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Verification:</label>
            <div style={{ position: 'relative' }}>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '100%', appearance: 'none' }}>
                <option>All</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 18, color: '#888' }}>▼</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Owner UserID(s):</label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              minHeight: 48,
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              background: '#fff',
              padding: '6px 8px',
              gap: 6,
            }}>
              {filterOwnerIds.map((id, idx) => (
                <span key={id + idx} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#e3f0ff',
                  color: '#2563eb',
                  borderRadius: 16,
                  padding: '4px 12px',
                  fontWeight: 500,
                  fontSize: 15,
                  marginRight: 4,
                }}>
                  {id}
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#888',
                      marginLeft: 6,
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                    onClick={() => setFilterOwnerIds(filterOwnerIds.filter((_, i) => i !== idx))}
                    title="Remove"
                  >×</button>
                </span>
              ))}
              <input
                type="text"
                value={ownerInput}
                onChange={e => setOwnerInput(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && ownerInput.trim()) {
                    const inputId = ownerInput.trim();
                    // Validate UserID exists in owners
                    const found = Object.values(owners).some(owner => owner && String(owner.UserID) === inputId);
                    if (!found) {
                      setOwnerInput('');
                      e.preventDefault();
                      return;
                    }
                    if (!filterOwnerIds.includes(inputId)) {
                      setFilterOwnerIds([...filterOwnerIds, inputId]);
                    }
                    setOwnerInput('');
                    e.preventDefault();
                  } else if (e.key === 'Backspace' && !ownerInput && filterOwnerIds.length) {
                    setFilterOwnerIds(filterOwnerIds.slice(0, -1));
                  }
                }}
                placeholder="Type UserID and press Enter"
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 16,
                  flex: 1,
                  minWidth: 60,
                  background: 'transparent',
                  padding: '4px',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1.5, minWidth: 260, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Created Date Range:</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="date"
                value={filterDateStart}
                onChange={e => setFilterDateStart(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '50%' }}
                placeholder="Start date"
              />
              <span style={{ alignSelf: 'center', color: '#888', fontWeight: 600 }}>to</span>
              <input
                type="date"
                value={filterDateEnd}
                onChange={e => setFilterDateEnd(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '50%' }}
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <CircularLoader />
        ) : (
          <div className="admin-reports-table-wrapper">
            <table className="admin-reports-table">
              <thead className="admin-reports-thead">
                <tr>
                  <th className="admin-reports-th">Shop Name</th>
                  <th className="admin-reports-th">Owner</th>
                  {/* Removed Category column */}
                  <th className="admin-reports-th">Created</th>
                  <th className="admin-reports-th">Verification</th>
                  <th className="admin-reports-th">Action</th>
                </tr>
              </thead>
              <tbody className="admin-reports-tbody">
                {(() => {
                  const filtered = shops
                    .filter(shop => {
                      // Verification filter
                      if (filterStatus !== 'All' && shop.Verification !== filterStatus) return false;
                      // Owner UserID(s) chip filter
                      if (filterOwnerIds.length > 0 && !filterOwnerIds.includes(String(shop.UserID))) return false;
                      // Date range filter
                      if (filterDateStart || filterDateEnd) {
                        const shopDate = shop.created_at ? new Date(shop.created_at).toISOString().slice(0, 10) : '';
                        if (filterDateStart && shopDate < filterDateStart) return false;
                        if (filterDateEnd && shopDate > filterDateEnd) return false;
                      }
                      return true;
                    });
                  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
                  return paginated.map((shop) => (
                    <tr key={shop.ShopID} className="admin-reports-tr" onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = ''}>
                      <td className="admin-reports-td">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                          {/* Shop Logo */}
                          <img
                            src={shop.LogoImage ? `/storage/${(shop.LogoImage||'').replace(/^storage\//, '')}` : 'https://via.placeholder.com/32x32?text=Shop'}
                            alt={shop.ShopName}
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', background: '#eee', border: '2px solid #fff', boxShadow: '0 1px 4px #2563eb22' }}
                          />
                          {shop.ShopName || 'N/A'}
                        </span>
                      </td>
                      <td className="admin-reports-td">{
                        owners[shop.ShopID]
                          ? (owners[shop.ShopID].FirstName + ' ' + owners[shop.ShopID].LastName)
                          : 'N/A'
                      }</td>
                      {/* Removed Category column */}
                      <td className="admin-reports-td">{shop.created_at ? new Date(shop.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                      <td className="admin-reports-td">{
                        shop.Verification
                          ? statusBadge(shop.Verification)
                          : statusBadge('N/A')
                      }</td>
                      <td className="admin-reports-td">
                        <button className="admin-reports-view-btn" onClick={() => { setSelectedShop(shop); setModalOpen(true); }}>Details</button>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px 0', width: '100%' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentPage === 1 ? '#bbb' : '#2563eb',
                  fontSize: 28,
                  fontWeight: 700,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  marginRight: 18,
                  padding: 0,
                  lineHeight: 1
                }}
                aria-label="Previous Page"
              >&#8592;</button>
              <span style={{ fontWeight: 600, fontSize: 18, minWidth: 80, textAlign: 'center' }}>Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={(() => {
                  const filtered = shops
                    .filter(shop => {
                      if (filterStatus !== 'All' && shop.Verification !== filterStatus) return false;
                      if (filterOwnerIds.length > 0 && !filterOwnerIds.includes(String(shop.UserID))) return false;
                      if (filterDateStart || filterDateEnd) {
                        const shopDate = shop.created_at ? new Date(shop.created_at).toISOString().slice(0, 10) : '';
                        if (filterDateStart && shopDate < filterDateStart) return false;
                        if (filterDateEnd && shopDate > filterDateEnd) return false;
                      }
                      return true;
                    });
                  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                  return currentPage >= totalPages;
                })()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: (() => {
                    const filtered = shops
                      .filter(shop => {
                        if (filterStatus !== 'All' && shop.Verification !== filterStatus) return false;
                        if (filterOwnerIds.length > 0 && !filterOwnerIds.includes(String(shop.UserID))) return false;
                        if (filterDateStart || filterDateEnd) {
                          const shopDate = shop.created_at ? new Date(shop.created_at).toISOString().slice(0, 10) : '';
                          if (filterDateStart && shopDate < filterDateStart) return false;
                          if (filterDateEnd && shopDate > filterDateEnd) return false;
                        }
                        return true;
                      });
                    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                    return currentPage >= totalPages ? '#bbb' : '#2563eb';
                  })(),
                  fontSize: 28,
                  fontWeight: 700,
                  cursor: (() => {
                    const filtered = shops
                      .filter(shop => {
                        if (filterStatus !== 'All' && shop.Verification !== filterStatus) return false;
                        if (filterOwnerIds.length > 0 && !filterOwnerIds.includes(String(shop.UserID))) return false;
                        if (filterDateStart || filterDateEnd) {
                          const shopDate = shop.created_at ? new Date(shop.created_at).toISOString().slice(0, 10) : '';
                          if (filterDateStart && shopDate < filterDateStart) return false;
                          if (filterDateEnd && shopDate > filterDateEnd) return false;
                        }
                        return true;
                      });
                    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                    return currentPage >= totalPages ? 'not-allowed' : 'pointer';
                  })(),
                  marginLeft: 18,
                  padding: 0,
                  lineHeight: 1
                }}
                aria-label="Next Page"
              >&#8594;</button>
            </div>
            </table>
          </div>
        )}

      {/* Shop Details Modal */}
      {modalOpen && selectedShop && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', marginBottom: 18 }}>Shop Details</h3>
            <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
              <img
                src={selectedShop.LogoImage ? `/storage/${(selectedShop.LogoImage||'').replace(/^storage\//, '')}` : 'https://via.placeholder.com/64x64?text=Shop'}
                alt={selectedShop.ShopName}
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', background: '#eee', border: '2px solid #fff', boxShadow: '0 1px 4px #2563eb22' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 22, color: '#2563eb' }}>{selectedShop.ShopName || 'N/A'}</div>
                <div style={{ color: '#888', fontWeight: 500, fontSize: 16 }}>ShopID: {selectedShop.ShopID}</div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#888', fontWeight: 500 }}>Owner</div>
              <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 17 }}>
                {owners[selectedShop.ShopID]
                  ? (owners[selectedShop.ShopID].FirstName + ' ' + owners[selectedShop.ShopID].LastName)
                  : 'N/A'}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#888', fontWeight: 500 }}>Verification</div>
              <div>{statusBadge(selectedShop.Verification || 'N/A')}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#888', fontWeight: 500 }}>Created Date</div>
              <div style={{ color: '#222', fontWeight: 600 }}>{selectedShop.created_at ? new Date(selectedShop.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#888', fontWeight: 500 }}>Address</div>
              <div style={{ color: '#2563eb', fontWeight: 600 }}>
                {addresses[selectedShop.ShopID] ? (
                  [
                    addresses[selectedShop.ShopID].HouseNumber || addresses[selectedShop.ShopID].houseNumber,
                    addresses[selectedShop.ShopID].Street || addresses[selectedShop.ShopID].street,
                    addresses[selectedShop.ShopID].Barangay || addresses[selectedShop.ShopID].barangay,
                    addresses[selectedShop.ShopID].Municipality || addresses[selectedShop.ShopID].municipality,
                    addresses[selectedShop.ShopID].ZipCode || addresses[selectedShop.ShopID].zipcode
                  ].filter(Boolean).join(', ')
                ) : (
                  'No address available'
                )}
              </div>
            </div>
            {/* Add more shop details as needed */}

            {/* Action Buttons */}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {selectedShop.Verification === 'Pending' && (
                <>
                  <button
                    style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #ef444422' }}
                    onClick={() => setConfirmAction('reject')}
                  >Reject</button>
                  <button
                    style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #22c55e22' }}
                    onClick={() => setConfirmAction('verify')}
                  >Verify</button>
                </>
              )}
              {(selectedShop.Verification === 'Rejected' || selectedShop.Verification === 'Verified') && (
                <button
                  style={{ background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22' }}
                  onClick={() => setConfirmAction('revert')}
                >Revert</button>
              )}
            </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.12)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => { setConfirmAction(null); setConfirmError(''); }} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              {confirmAction === 'reject' && 'Confirm Reject'}
              {confirmAction === 'verify' && 'Confirm Verify'}
              {confirmAction === 'revert' && 'Confirm Revert'}
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              {confirmAction === 'reject' && 'Are you sure you want to reject this shop?'}
              {confirmAction === 'verify' && 'Are you sure you want to verify this shop?'}
              {confirmAction === 'revert' && 'Are you sure you want to revert this shop to Pending?'}
            </div>
            {confirmError && (
              <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>{confirmError}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => { setConfirmAction(null); setConfirmError(''); }}
              >Cancel</button>
              <button
                style={{ background: confirmAction === 'reject' ? '#ef4444' : confirmAction === 'verify' ? '#22c55e' : '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={async () => {
                  let newStatus = '';
                  setConfirmError('');
                  if (confirmAction === 'reject') newStatus = 'Rejected';
                  if (confirmAction === 'verify') newStatus = 'Verified';
                  if (confirmAction === 'revert') newStatus = 'Pending';
                  try {
                    const res = await fetch(`/api/shops/${selectedShop.ShopID}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ Verification: newStatus })
                    });
                    if (!res.ok) throw new Error('Failed to update shop');
                    setShops(shops => shops.map(s => s.ShopID === selectedShop.ShopID ? { ...s, Verification: newStatus } : s));
                    setSelectedShop(shop => shop ? { ...shop, Verification: newStatus } : shop);
                    setConfirmAction(null);
                  } catch (err) {
                    setConfirmError('Error: ' + (err.message || 'Failed to update shop'));
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default ShopManagement;
