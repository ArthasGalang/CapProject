import React, { useEffect, useState } from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";
import UserAvatar from "@/Components/Admin/UserAvatar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
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
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Role</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Joined Date</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Status</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 16 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}><input type="checkbox" /></td>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                    <UserAvatar name={user.name} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 17 }}>{user.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>#{user.code || `PHR-100${idx+1}`}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 18, letterSpacing: 2 }}>
                    {'*'.repeat(14)}
                  </td>
                  <td style={{ padding: '16px', fontSize: 16 }}>{user.role || (idx === 0 ? 'Seller' : 'Buyer')}</td>
                  <td style={{ padding: '16px', fontSize: 16 }}>{user.created_at ? (new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : (idx === 0 ? 'Apr 8, 2025' : 'Apr 7, 2025')}</td>
                  <td style={{ padding: '16px' }}>{statusBadge(user.status || (idx === 0 ? 'Pending' : 'Verified'))}</td>
                  <td style={{ padding: '16px' }}>
                    <ActionButton icon={<svg width="16" height="16" fill="#fff" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" /></svg>} color="#2563eb" title="Approve" />
                    <ActionButton icon={<svg width="16" height="16" fill="#fff" viewBox="0 0 20 20"><path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>} color="#2563eb" title="Reject" />
                    <ActionButton icon={<svg width="16" height="16" fill="#fff" viewBox="0 0 20 20"><path d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 2a5 5 0 110 10A5 5 0 0110 5zm0 2a3 3 0 100 6 3 3 0 000-6z" /></svg>} color="#2563eb" title="View" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
