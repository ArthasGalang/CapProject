import React from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";

export default function Reports() {
  const [reports, setReports] = React.useState([]);
  React.useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        console.log('Fetched reports:', data);
      });
  }, []);

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
                <th className="admin-reports-th">Reason</th>
                <th className="admin-reports-th">Date</th>
                <th className="admin-reports-th">Status</th>
                <th className="admin-reports-th">Action</th>
              </tr>
            </thead>
            <tbody className="admin-reports-tbody">
              {reports.map((rep) => (
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
                  <td className="admin-reports-td">{statusBadge(rep.Status || rep.status)}</td>
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
