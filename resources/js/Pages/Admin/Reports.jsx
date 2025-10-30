import React from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";
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

// Helper for status badge
function statusBadge(status) {
  let color = '#fef3c7', text = '#b45309';
  if (status === 'Verified') { color = '#d1fae5'; text = '#047857'; }
  if (status === 'Pending') { color = '#fef3c7'; text = '#b45309'; }
  if (status === 'Rejected') { color = '#fee2e2'; text = '#b91c1c'; }
  if (status === 'Resolved') { color = '#e0f2fe'; text = '#0369a1'; }
  if (status === 'Open') { color = '#f3f4f6'; text = '#374151'; }
  return (
    <span style={{ background: color, color: text, fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>{status}</span>
  );
}

export default function Reports() {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  // Filter state
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [filterType, setFilterType] = React.useState('All');
  const [filterDate, setFilterDate] = React.useState('All Time');
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 10;
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        // Collect unique user IDs from reports (possible field names)
        const userIds = Array.from(new Set(list.map(r => r.UserID || r.ReporterID || r.User_id).filter(Boolean)));
        // Fetch user info for each id in parallel
        const idToName = {};
        await Promise.all(userIds.map(async (id) => {
          try {
            const ures = await fetch(`/api/user/${id}`);
            if (!ures.ok) return;
            const udata = await ures.json();
            if (udata && (udata.FirstName || udata.LastName)) {
              idToName[id] = `${udata.FirstName || ''}${udata.FirstName && udata.LastName ? ' ' : ''}${udata.LastName || ''}`.trim();
            }
          } catch (e) {
            // ignore
          }
        }));
        // Inject reporter name into each report object
        const enhanced = list.map(r => {
          const reporterId = r.UserID || r.ReporterID || r.User_id;
          const reporterName = reporterId ? idToName[reporterId] : null;
          return {
            ...r,
            ReporterName: reporterName || r.ReporterName || r.Reporter || null,
          };
        });
        setReports(enhanced);
      } catch (err) {
        console.error('Failed to load reports', err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  return (
    <AdminLayout>
  <div className="admin-reports-container">
        <h1 className="admin-reports-title">Reports</h1>
        <div className="admin-reports-subtitle">Review and manage user and product reports</div>
        {/* Filter Bar */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', padding: '1.2rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', maxWidth: '100%' }}>
          {/* Dropdown with arrow for Status */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Status:</label>
            <div style={{ position: 'relative' }}>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '100%', appearance: 'none' }}>
                <option>All</option>
                <option>Pending</option>
                <option>In Review</option>
                <option>Resolved</option>
                <option>Rejected</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 18, color: '#888' }}>▼</span>
            </div>
          </div>
          {/* Dropdown with arrow for Type */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Type:</label>
            <div style={{ position: 'relative' }}>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '100%', appearance: 'none' }}>
                <option>All</option>
                <option>User</option>
                <option>Shop</option>
                <option>Product</option>
                <option>Order</option>
                <option>Other</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 18, color: '#888' }}>▼</span>
            </div>
          </div>
          {/* Dropdown with arrow for Date */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 200, position: 'relative' }}>
            <label style={{ color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Date:</label>
            <div style={{ position: 'relative' }}>
              <select value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 16, width: '100%', appearance: 'none' }}>
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 18, color: '#888' }}>▼</span>
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
                  <th className="admin-reports-th">Reporter</th>
                  <th className="admin-reports-th">Type</th>
                  <th className="admin-reports-th">Reason</th>
                  <th className="admin-reports-th">Date</th>
                  <th className="admin-reports-th">Status</th>
                  <th className="admin-reports-th">Action</th>
                </tr>
              </thead>
              <tbody className="admin-reports-tbody">
                {(() => {
                  const filtered = reports
                    .filter(rep => {
                      // Status filter
                      if (filterStatus !== 'All' && rep.ReportStatus !== filterStatus) return false;
                      // Type filter
                      const type = rep.Type || rep.ReportType || rep.Category || rep.ReportedType || rep.TargetType || 'N/A';
                      if (filterType !== 'All' && type !== filterType) return false;
                      // Date filter
                      if (filterDate !== 'All Time' && rep.created_at) {
                        const reportDate = new Date(rep.created_at);
                        const now = new Date();
                        if (filterDate === 'Today') {
                          if (reportDate.toDateString() !== now.toDateString()) return false;
                        } else if (filterDate === 'This Week') {
                          const weekStart = new Date(now);
                          weekStart.setDate(now.getDate() - now.getDay());
                          const weekEnd = new Date(weekStart);
                          weekEnd.setDate(weekStart.getDate() + 6);
                          if (reportDate < weekStart || reportDate > weekEnd) return false;
                        } else if (filterDate === 'This Month') {
                          if (reportDate.getMonth() !== now.getMonth() || reportDate.getFullYear() !== now.getFullYear()) return false;
                        } else if (filterDate === 'This Year') {
                          if (reportDate.getFullYear() !== now.getFullYear()) return false;
                        }
                      }
                      return true;
                    });
                  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
                  return paginated.map((rep) => (
                    <tr key={rep.ReportID} className="admin-reports-tr" onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = ''}>
                      <td className="admin-reports-td">{
                        rep.FirstName && rep.LastName
                          ? rep.FirstName + ' ' + rep.LastName
                          : (rep.ReporterName || rep.Reporter || rep.UserName || rep.BuyerName || rep.FullName || rep.Name || rep.CreatedBy || 'N/A')
                      }</td>
                      <td className="admin-reports-td">{
                        rep.Type || rep.ReportType || rep.Category || rep.ReportedType || rep.TargetType || 'N/A'
                      }</td>
                      <td className="admin-reports-td">{
                        rep.Reason || rep.ReasonText || rep.Description || rep.Details || rep.Message || rep.Content || 'N/A'
                      }</td>
                      <td className="admin-reports-td">{rep.created_at ? new Date(rep.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                      <td className="admin-reports-td">{statusBadge(rep.ReportStatus || 'N/A')}</td>
                      <td className="admin-reports-td">
                        <button className="admin-reports-view-btn" onClick={() => { setSelectedReport(rep); setModalOpen(true); }}>Details</button>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '24px auto 0 auto', width: 'fit-content' }}>
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
                  const filtered = reports
                    .filter(rep => {
                      if (filterStatus !== 'All' && rep.ReportStatus !== filterStatus) return false;
                      const type = rep.Type || rep.ReportType || rep.Category || rep.ReportedType || rep.TargetType || 'N/A';
                      if (filterType !== 'All' && type !== filterType) return false;
                      if (filterDate !== 'All Time' && rep.created_at) {
                        const reportDate = new Date(rep.created_at);
                        const now = new Date();
                        if (filterDate === 'Today') {
                          if (reportDate.toDateString() !== now.toDateString()) return false;
                        } else if (filterDate === 'This Week') {
                          const weekStart = new Date(now);
                          weekStart.setDate(now.getDate() - now.getDay());
                          const weekEnd = new Date(weekStart);
                          weekEnd.setDate(weekStart.getDate() + 6);
                          if (reportDate < weekStart || reportDate > weekEnd) return false;
                        } else if (filterDate === 'This Month') {
                          if (reportDate.getMonth() !== now.getMonth() || reportDate.getFullYear() !== now.getFullYear()) return false;
                        } else if (filterDate === 'This Year') {
                          if (reportDate.getFullYear() !== now.getFullYear()) return false;
                        }
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
                    const filtered = reports
                      .filter(rep => {
                        if (filterStatus !== 'All' && rep.ReportStatus !== filterStatus) return false;
                        const type = rep.Type || rep.ReportType || rep.Category || rep.ReportedType || rep.TargetType || 'N/A';
                        if (filterType !== 'All' && type !== filterType) return false;
                        if (filterDate !== 'All Time' && rep.created_at) {
                          const reportDate = new Date(rep.created_at);
                          const now = new Date();
                          if (filterDate === 'Today') {
                            if (reportDate.toDateString() !== now.toDateString()) return false;
                          } else if (filterDate === 'This Week') {
                            const weekStart = new Date(now);
                            weekStart.setDate(now.getDate() - now.getDay());
                            const weekEnd = new Date(weekStart);
                            weekEnd.setDate(weekStart.getDate() + 6);
                            if (reportDate < weekStart || reportDate > weekEnd) return false;
                          } else if (filterDate === 'This Month') {
                            if (reportDate.getMonth() !== now.getMonth() || reportDate.getFullYear() !== now.getFullYear()) return false;
                          } else if (filterDate === 'This Year') {
                            if (reportDate.getFullYear() !== now.getFullYear()) return false;
                          }
                        }
                        return true;
                      });
                    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                    return currentPage >= totalPages ? '#bbb' : '#2563eb';
                  })(),
                  fontSize: 28,
                  fontWeight: 700,
                  cursor: (() => {
                    const filtered = reports
                      .filter(rep => {
                        if (filterStatus !== 'All' && rep.ReportStatus !== filterStatus) return false;
                        const type = rep.Type || rep.ReportType || rep.Category || rep.ReportedType || rep.TargetType || 'N/A';
                        if (filterType !== 'All' && type !== filterType) return false;
                        if (filterDate !== 'All Time' && rep.created_at) {
                          const reportDate = new Date(rep.created_at);
                          const now = new Date();
                          if (filterDate === 'Today') {
                            if (reportDate.toDateString() !== now.toDateString()) return false;
                          } else if (filterDate === 'This Week') {
                            const weekStart = new Date(now);
                            weekStart.setDate(now.getDate() - now.getDay());
                            const weekEnd = new Date(weekStart);
                            weekEnd.setDate(weekStart.getDate() + 6);
                            if (reportDate < weekStart || reportDate > weekEnd) return false;
                          } else if (filterDate === 'This Month') {
                            if (reportDate.getMonth() !== now.getMonth() || reportDate.getFullYear() !== now.getFullYear()) return false;
                          } else if (filterDate === 'This Year') {
                            if (reportDate.getFullYear() !== now.getFullYear()) return false;
                          }
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
          </div>
        )}
      {/* Report Details Modal */}
      {modalOpen && selectedReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', marginBottom: 18 }}>Report Details</h3>
            {/* Show all available fields in a list for full details */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 8 }}>Full Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(selectedReport)
                  .filter(([key]) => key !== 'AdminResponse' && key !== 'created_at' && key !== 'updated_at')
                  .map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', gap: 12 }}>
                      <span style={{ minWidth: 120, color: '#2563eb', fontWeight: 500 }}>{key}</span>
                      <span style={{ color: '#222', fontWeight: 500 }}>
                        {key === 'ReportStatus' ? statusBadge(value || 'N/A') : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Admin Response at the bottom, hidden if Pending */}
            {selectedReport.ReportStatus !== 'Pending' && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 8 }}>Admin Response</div>
                {selectedReport.ReportStatus === 'In Review' ? (
                  <textarea
                    style={{ width: '100%', minHeight: 60, fontSize: 16, borderRadius: 8, border: '1px solid #e5e7eb', padding: '0.7rem', resize: 'vertical' }}
                    placeholder="Enter admin response..."
                    value={selectedReport.AdminResponse || ''}
                    onChange={e => setSelectedReport({ ...selectedReport, AdminResponse: e.target.value })}
                  />
                ) : (
                  selectedReport.AdminResponse ? (
                    <div style={{ color: '#222', fontWeight: 500, background: '#f3f4f6', borderRadius: 8, padding: 12, fontSize: 15 }}>{selectedReport.AdminResponse}</div>
                  ) : (
                    <div style={{ color: '#888', fontStyle: 'italic' }}>No response provided.</div>
                  )
                )}
              </div>
            )}
            {/* Status action buttons */}
            <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              {selectedReport.ReportStatus === 'Pending' && (
                <button
                  style={{ background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22' }}
                  onClick={async () => {
                    // Update status to In Review
                    try {
                      const res = await fetch(`/api/reports/${selectedReport.ReportID}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ReportStatus: 'In Review' })
                      });
                      if (!res.ok) throw new Error('Failed to update status');
                      setSelectedReport({ ...selectedReport, ReportStatus: 'In Review' });
                      // Also update in main reports list
                      setReports(reports => reports.map(r => r.ReportID === selectedReport.ReportID ? { ...r, ReportStatus: 'In Review' } : r));
                    } catch (err) {
                      alert('Error updating status: ' + err.message);
                    }
                  }}
                >Review Report</button>
              )}
              {selectedReport.ReportStatus === 'In Review' && (
                <>
                  <button
                    style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #ef444422' }}
                    onClick={async () => {
                      // Update status to Rejected and post admin response
                      try {
                        const res = await fetch(`/api/reports/${selectedReport.ReportID}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ReportStatus: 'Rejected', AdminResponse: selectedReport.AdminResponse || '' })
                        });
                        if (!res.ok) throw new Error('Failed to update status');
                        setSelectedReport({ ...selectedReport, ReportStatus: 'Rejected' });
                        setReports(reports => reports.map(r => r.ReportID === selectedReport.ReportID ? { ...r, ReportStatus: 'Rejected', AdminResponse: selectedReport.AdminResponse || '' } : r));
                      } catch (err) {
                        alert('Error updating status: ' + err.message);
                      }
                    }}
                  >Reject</button>
                  <button
                    style={{ background: '#10b981', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #10b98122' }}
                    onClick={async () => {
                      // Update status to Resolved and post admin response
                      try {
                        const res = await fetch(`/api/reports/${selectedReport.ReportID}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ReportStatus: 'Resolved', AdminResponse: selectedReport.AdminResponse || '' })
                        });
                        if (!res.ok) throw new Error('Failed to update status');
                        setSelectedReport({ ...selectedReport, ReportStatus: 'Resolved' });
                        setReports(reports => reports.map(r => r.ReportID === selectedReport.ReportID ? { ...r, ReportStatus: 'Resolved', AdminResponse: selectedReport.AdminResponse || '' } : r));
                      } catch (err) {
                        alert('Error updating status: ' + err.message);
                      }
                    }}
                  >Resolve</button>
                </>
              )}
            </div>
            {/* Raw data removed for cleaner modal */}
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
