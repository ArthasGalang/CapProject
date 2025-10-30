
  
import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";
import UserAvatar from "@/Components/Admin/UserAvatar";
// Simple circular loader
  
// ...existing code...
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

export default function UserManagement() {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [showBanSuccess, setShowBanSuccess] = useState(false);
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false);
  const [showUnbanSuccess, setShowUnbanSuccess] = useState(false);
  useEffect(() => {
    // Fetch default address when modal opens
    if (modalOpen && selectedUser && selectedUser.DefaultAddress) {
      fetch(`/api/addresses/${selectedUser.DefaultAddress}`)
        .then(res => res.json())
        .then(data => {
          setDefaultAddress(data);
        })
        .catch(() => setDefaultAddress(null));
    } else {
      setDefaultAddress(null);
    }
    Promise.all([
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/shops").then((res) => res.json())
    ]).then(([userData, shopData]) => {
      setUsers(Array.isArray(userData) ? userData : [userData]);
      setShops(Array.isArray(shopData) ? shopData : []);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

    // Helper for status badge
    const statusBadge = (status) => {
      let color = '#fef3c7', text = '#b45309';
      if (status === 'Verified') { color = '#d1fae5'; text = '#047857'; }
      if (status === 'Pending') { color = '#fef3c7'; text = '#b45309'; }
      if (status === 'Banned') { color = '#fee2e2'; text = '#b91c1c'; }
      if (status === 'Offline') { color = '#e0e7ff'; text = '#3730a3'; }
      return (
        <span style={{ background: color, color: text, fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>{status}</span>
      );
    };

    // Helper for email masking
    const maskEmail = (email) => {
      if (!email) return '';
      const [name, domain] = email.split('@');
      if (!domain) return email;
      const masked = name.slice(0, 3) + '*****';
      return masked + '@' + domain;
    };

  // Local state for filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterShop, setFilterShop] = useState('All');

  // Cleanup for fetches
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    // Fetch default address when modal opens
    if (modalOpen && selectedUser && selectedUser.DefaultAddress) {
      fetch(`/api/addresses/${selectedUser.DefaultAddress}`, { signal })
        .then(res => res.json())
        .then(data => {
          setDefaultAddress(data);
        })
        .catch(() => setDefaultAddress(null));
    } else {
      setDefaultAddress(null);
    }
    Promise.all([
      fetch("/api/users", { signal }).then((res) => res.json()),
      fetch("/api/shops", { signal }).then((res) => res.json())
    ]).then(([userData, shopData]) => {
      setUsers(Array.isArray(userData) ? userData : [userData]);
      setShops(Array.isArray(shopData) ? shopData : []);
    }).finally(() => {
      setLoading(false);
    });
    return () => {
      abortControllerRef.current && abortControllerRef.current.abort();
    };
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#111827', marginBottom: '2rem' }}>User Management</h1>
        {/* Filter Bar */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', padding: '1.2rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', maxWidth: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Status:</label>
            <div style={{ position: 'relative' }}>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '100%', appearance: 'none' }}>
                <option>All</option>
                <option>Active</option>
                <option>Busy</option>
                <option>Offline</option>
                <option>Banned</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 18, color: '#888' }}>▼</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Has Shop:</label>
            <div style={{ position: 'relative' }}>
              <select value={filterShop} onChange={e => setFilterShop(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '100%', appearance: 'none' }}>
                <option>All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 18, color: '#888' }}>▼</span>
            </div>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <CircularLoader />
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', padding: '0', marginTop: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {/* Removed checkbox column header */}
                  <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>User</th>
                  <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Email</th>
                  <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Shop</th>
                  <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Joined Date</th>
                  <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Status</th>
                  <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user => {
                    // Status filter
                    if (filterStatus !== 'All' && user.Status !== filterStatus) return false;
                    // Shop filter
                    const hasShop = shops.some(shop => shop.UserID === user.UserID) ? 'Yes' : 'No';
                    if (filterShop !== 'All' && hasShop !== filterShop) return false;
                    return true;
                  })
                  .map((user, idx) => (
                  <tr key={user.UserID || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {/* Removed checkbox column cell */}
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                      <UserAvatar name={user.FirstName + ' ' + user.LastName} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 17 }}>{user.FirstName} {user.LastName}</div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>#{user.UserID}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 16 }}>{maskEmail(user.Email)}</td>
                    <td style={{ padding: '16px', fontSize: 16 }}>{shops.some(shop => shop.UserID === user.UserID) ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '16px', fontSize: 16 }}>{user.created_at ? (new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : ''}</td>
                    <td style={{ padding: '16px' }}>{statusBadge(user.Status || '')}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        style={{
                          background: '#e3f0ff',
                          color: '#2563eb',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.25rem 0.7rem',
                          fontWeight: 500,
                          fontSize: '0.92rem',
                          cursor: 'pointer',
                          boxShadow: '0 1px 4px #2563eb11'
                        }}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPinModal(true);
                        }}
                      >Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {/* Pin Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(''); }} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2563eb', marginBottom: 18 }}>Enter PIN to view details</h3>
            <input
              type="password"
              value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(''); }}
              style={{ width: '100%', padding: '0.7rem', fontSize: 18, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 12 }}
              placeholder="Enter PIN"
              autoFocus
            />
            {pinError && <div style={{ color: '#ef4444', marginBottom: 10, fontWeight: 500 }}>{pinError}</div>}
            <button
              style={{ background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22', width: '100%' }}
              onClick={() => {
                if (pinInput === '123') {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError('');
                  setModalOpen(true);
                } else {
                  setPinError('Incorrect PIN.');
                }
              }}
            >Submit</button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {modalOpen && selectedUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', marginBottom: 18 }}>User Details</h3>
            <div style={{ marginBottom: 18 }}>
              <div style={{
                background: '#f7faff',
                borderRadius: 12,
                boxShadow: '0 2px 12px #2563eb11',
                padding: '1.2rem 1.5rem',
                marginBottom: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
              }}>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#2563eb', marginBottom: 8 }}>User Info</div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 500 }}>Full Name</div>
                    <div style={{ color: '#222', fontWeight: 600, fontSize: 17 }}>{selectedUser.FirstName} {selectedUser.LastName}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 500 }}>Email</div>
                    <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 16 }}>{maskEmail(selectedUser.Email)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 500 }}>User ID</div>
                    <div style={{ color: '#222', fontWeight: 600 }}>{selectedUser.UserID}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 500 }}>Status</div>
                    <div>{statusBadge(selectedUser.Status || '')}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ color: '#888', fontWeight: 500 }}>Joined Date</div>
                  <div style={{ color: '#222', fontWeight: 600 }}>{selectedUser.created_at ? (new Date(selectedUser.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : ''}</div>
                </div>
                {selectedUser.DefaultAddress && defaultAddress && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ color: '#888', fontWeight: 500 }}>Default Address</div>
                    <div style={{ color: '#2563eb', fontWeight: 600 }}>
                      {defaultAddress.HouseNumber} {defaultAddress.Street}, {defaultAddress.Barangay}, {defaultAddress.Municipality}, {defaultAddress.ZipCode}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: 8, color: '#2563eb' }}>User's Shops</div>
              {shops.filter(shop => shop.UserID === selectedUser.UserID).length === 0 ? (
                <div style={{ color: '#888', fontWeight: 500, marginBottom: 8 }}>No shops found.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ fontWeight: 600, color: '#888', padding: '4px 8px', background: '#f7f7f7' }}>ShopID</th>
                      <th style={{ fontWeight: 600, color: '#888', padding: '4px 8px', background: '#f7f7f7' }}>ShopName</th>
                      <th style={{ fontWeight: 600, color: '#888', padding: '4px 8px', background: '#f7f7f7' }}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops.filter(shop => shop.UserID === selectedUser.UserID).map((shop, idx) => (
                      <tr key={shop.ShopID || idx}>
                        <td style={{ padding: '4px 8px', color: '#222', fontWeight: 500 }}>{shop.ShopID}</td>
                        <td style={{ padding: '4px 8px', color: '#222', fontWeight: 500 }}>{shop.ShopName}</td>
                        <td style={{ padding: '4px 8px', color: '#222', fontWeight: 500 }}>{shop.Address || `${shop.HouseNumber || ''} ${shop.Street || ''}, ${shop.Barangay || ''}, ${shop.Municipality || ''}, ${shop.ZipCode || ''}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {selectedUser.Status === 'Banned' && (
                <button
                  style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #22c55e22' }}
                  onClick={() => setShowUnbanConfirm(true)}
                >Unban</button>
              )}
              {selectedUser.Status !== 'Banned' && (
                <button
                  style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #ef444422' }}
                  onClick={() => setShowBanConfirm(true)}
                >Ban</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ban Confirmation Modal */}
      {showBanConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.08)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setShowBanConfirm(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              Confirm Ban
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              Are you sure you want to ban this user?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => setShowBanConfirm(false)}
              >Cancel</button>
              <button
                style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={async () => {
                  setShowBanConfirm(false);
                  if (!selectedUser.UserID) return;
                  try {
                    const res = await fetch(`/api/user/${selectedUser.UserID}/ban`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Banned' })
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      throw new Error('Failed to ban user: ' + errorText);
                    }
                    // Reload users from backend for sync
                    const userResp = await fetch('/api/users');
                    const userData = await userResp.json();
                    setUsers(Array.isArray(userData) ? userData : [userData]);
                    setSelectedUser(prev => prev ? { ...prev, Status: 'Banned' } : prev);
                    setShowBanSuccess(true);
                  } catch (err) {
                    alert('Error banning user: ' + err.message);
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Success Modal */}
      {showBanSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.08)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setShowBanSuccess(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              User Banned
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              The user has been banned successfully.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => setShowBanSuccess(false)}
              >OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Unban Confirmation Modal */}
      {showUnbanConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.08)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setShowUnbanConfirm(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              Confirm Unban
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              Are you sure you want to unban this user? This will set their status to Offline.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => setShowUnbanConfirm(false)}
              >Cancel</button>
              <button
                style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={async () => {
                  setShowUnbanConfirm(false);
                  if (!selectedUser.UserID) return;
                  try {
                    const res = await fetch(`/api/user/${selectedUser.UserID}/ban`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Offline' })
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      console.error('Unban failed:', errorText);
                      throw new Error('Failed to unban user: ' + errorText);
                    }
                    // Reload users from backend for sync
                    const userResp = await fetch('/api/users');
                    const userData = await userResp.json();
                    setUsers(Array.isArray(userData) ? userData : [userData]);
                    setSelectedUser(prev => prev ? { ...prev, Status: 'Offline' } : prev);
                    setShowUnbanSuccess(true);
                  } catch (err) {
                    alert('Error unbanning user: ' + err.message);
                    console.error('Unban error:', err);
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Unban Success Modal */}
      {showUnbanSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.08)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setShowUnbanSuccess(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 18 }}>
              User Unbanned
            </div>
            <div style={{ color: '#444', marginBottom: 22 }}>
              The user has been unbanned.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => setShowUnbanSuccess(false)}
              >OK</button>
            </div>
          </div>
        </div>
      )}

    </div>
  </AdminLayout>
  );
}
