import React from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";

export default function Reports() {
  // Sample data
  const reports = [
    { id: 1, reporter: 'Anjie Co', type: 'Product', subject: 'Fake item', date: 'Sep 25, 2025', status: 'Open' },
    { id: 2, reporter: 'Jhaycee Bocarile', type: 'User', subject: 'Spam', date: 'Sep 24, 2025', status: 'Closed' },
    { id: 3, reporter: 'Rence Cababan', type: 'Order', subject: 'Late delivery', date: 'Sep 23, 2025', status: 'Open' },
    { id: 4, reporter: 'Jan Galang', type: 'Product', subject: 'Wrong description', date: 'Sep 22, 2025', status: 'Closed' },
  ];

  const statusBadge = (status) => {
    if (status === 'Open') return <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 500, fontSize: 13, borderRadius: 6, padding: '3px 12px' }}>Open</span>;
    return <span style={{ background: '#d1fae5', color: '#047857', fontWeight: 500, fontSize: 13, borderRadius: 6, padding: '3px 12px' }}>Closed</span>;
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2.5rem 2rem 0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.5rem' }}>Reports</h1>
        <div style={{ color: '#6b7280', marginBottom: '2rem' }}>Review and manage user and product reports</div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.07)', padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Reporter</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Type</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Subject</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Date</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((rep) => (
                <tr key={rep.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }} onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{rep.reporter}</td>
                  <td style={{ padding: '16px' }}>{rep.type}</td>
                  <td style={{ padding: '16px' }}>{rep.subject}</td>
                  <td style={{ padding: '16px' }}>{rep.date}</td>
                  <td style={{ padding: '16px' }}>{statusBadge(rep.status)}</td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>View</button>
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
