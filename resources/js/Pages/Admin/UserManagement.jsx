            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #ef444422' }}
                onClick={async () => {
                  if (!selectedUser.UserID) return;
                  try {
                    const res = await fetch(`/api/user/${selectedUser.UserID}/ban`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Banned' })
                    });
                    if (!res.ok) throw new Error('Failed to ban user');
                    // Update local state
                    setUsers(users => users.map(u => u.UserID === selectedUser.UserID ? { ...u, Status: 'Banned' } : u));
                    setSelectedUser({ ...selectedUser, Status: 'Banned' });
                    alert('User has been banned.');
                  } catch (err) {
                    alert('Error banning user: ' + err.message);
                  }
                }}
              >Ban</button>
            </div>
import React, { useEffect, useState } from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";
import UserAvatar from "@/Components/Admin/UserAvatar";

export default function UserManagement() {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched user:', data);
        setUsers(Array.isArray(data) ? data : [data]);
      });
    fetch("/api/shops")
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched shops:', data);
        setShops(Array.isArray(data) ? data : []);
      });
  }, []);

  // Helper for status badge
  const statusBadge = (status) => {
    let color = '#fef3c7', text = '#b45309';
    if (status === 'Verified') { color = '#d1fae5'; text = '#047857'; }
    if (status === 'Pending') { color = '#fef3c7'; text = '#b45309'; }
    if (status === 'Banned') { color = '#fee2e2'; text = '#b91c1c'; }
    return (
      <span style={{ background: color, color: text, fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>{status}</span>
    );
  };

  // Helper for action icons
  const ActionButton = ({ icon, color, onClick, title }) => (
    <button onClick={onClick} title={title} style={{ background: color, border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 6, cursor: 'pointer' }}>
      {icon}
    </button>
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#111827', marginBottom: '2rem' }}>User Management</h1>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', padding: '2rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', maxWidth: '100%' }}>
          {/* ...existing filter bar code... */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200 }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Status:</label>
            <select style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16 }}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Banned</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200 }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Role:</label>
            <select style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16 }}>
              <option>All</option>
              <option>Admin</option>
              <option>User</option>
              <option>Moderator</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200 }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Date:</label>
            <select style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16 }}>
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', padding: '0', marginTop: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}></th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>User</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Email</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Shop</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Joined Date</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Status</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.UserID || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}><input type="checkbox" /></td>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                    <UserAvatar name={user.FirstName + ' ' + user.LastName} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 17 }}>{user.FirstName} {user.LastName}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>#{user.UserID}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 16 }}>
                    {(() => {
                      if (!user.Email) return '';
                      const [name, domain] = user.Email.split('@');
                      if (!domain) return user.Email;
                      const masked = name.slice(0, 3) + '*****';
                      return masked + '@' + domain;
                    })()}
                  </td>
                  <td style={{ padding: '16px', fontSize: 16 }}>
                    {shops.some(shop => shop.UserID === user.UserID) ? 'Yes' : 'No'}
                  </td>
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
                        setModalOpen(true);
                      }}
                    >Details</button>
                  </td>
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
                    <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 16 }}>{(() => {
                      if (!selectedUser.Email) return '';
                      const [name, domain] = selectedUser.Email.split('@');
                      if (!domain) return selectedUser.Email;
                      const masked = name.slice(0, 3) + '*****';
                      return masked + '@' + domain;
                    })()}</div>
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
                      <tr key={idx}>
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
              <button
                style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #ef444422' }}
                onClick={async () => {
                  if (!selectedUser.UserID) return;
                  try {
                    const res = await fetch(`/api/user/${selectedUser.UserID}/ban`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Banned' })
                    });
                    if (!res.ok) throw new Error('Failed to ban user');
                    // Update local state
                    setUsers(users => users.map(u => u.UserID === selectedUser.UserID ? { ...u, Status: 'Banned' } : u));
                    setSelectedUser({ ...selectedUser, Status: 'Banned' });
                    alert('User has been banned.');
                  } catch (err) {
                    alert('Error banning user: ' + err.message);
                  }
                }}
              >Ban</button>
            </div>
          </div>
        </div>
      )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
