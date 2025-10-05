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
    if (status === 'Open') return <span className="admin-reports-status admin-reports-status-open">Open</span>;
    return <span className="admin-reports-status admin-reports-status-closed">Closed</span>;
  };

  return (
    <AdminLayout>
      <div className="admin-reports-container">
        <h1 className="admin-reports-title">Reports</h1>
        <div className="admin-reports-subtitle">Review and manage user and product reports</div>
        <div className="admin-reports-table-wrapper">
          <table className="admin-reports-table">
            <thead className="admin-reports-thead">
              <tr>
                <th className="admin-reports-th">Reporter</th>
                <th className="admin-reports-th">Type</th>
                <th className="admin-reports-th">Subject</th>
                <th className="admin-reports-th">Date</th>
                <th className="admin-reports-th">Status</th>
                <th className="admin-reports-th">Action</th>
              </tr>
            </thead>
            <tbody className="admin-reports-tbody">
              {reports.map((rep) => (
                <tr key={rep.id} className="admin-reports-tr" onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = ''}>
                  <td className="admin-reports-td">{rep.reporter}</td>
                  <td className="admin-reports-td">{rep.type}</td>
                  <td className="admin-reports-td">{rep.subject}</td>
                  <td className="admin-reports-td">{rep.date}</td>
                  <td className="admin-reports-td">{statusBadge(rep.status)}</td>
                  <td className="admin-reports-td">
                    <button className="admin-reports-view-btn">View</button>
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
