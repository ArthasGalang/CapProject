import React, { useState, useEffect } from "react";
import { FaUser, FaCheck, FaClipboardList, FaEnvelope } from "react-icons/fa";
import AdminLayout from "@/Components/Admin/AdminLayout";
import axios from "axios";
import UserAvatar from "@/Components/Admin/UserAvatar";





function Dashboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
      
  }, []);

  return (
    <AdminLayout>
      <div className="dbHeader">
        <h1>Dashboard Overview</h1>
      </div>
      <div className="dbCardContainer">


        <div className="dbCard">
          <div className="dbCardIcon">
            <FaUser />
          </div>
          <div>
            <div className="dbCardLabel">Total Users</div>
            <div className="dbCardValue">{users.length}</div>
          </div>
        </div>

        <div className="dbCard">
          <div className="dbCardIcon">
            <FaCheck />
          </div>
          <div>
            <div className="dbCardLabel">Pending Verifications</div>
            <div className="dbCardValue">27</div>
          </div>
        </div>

                <div className="dbCard">
          <div className="dbCardIcon">
            <FaClipboardList />
          </div>
          <div>
            <div className="dbCardLabel">Open Reports</div>
            <div className="dbCardValue">27</div>
          </div>
        </div>

                <div className="dbCard">
          <div className="dbCardIcon">
            <FaEnvelope />
          </div>
          <div>
            <div className="dbCardLabel">Unread Messages</div>
            <div className="dbCardValue">27</div>
          </div>
        </div>
      </div>

      <div className="dbColumnsContainer">
        <div className="dbColumn">
          <div className="dbTableCard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="dbTableCardHeader">Recent User Registrations</div>
              <a href="/admin/user-management" style={{ color: '#2563eb', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>View All</a>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>User</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Date</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Status</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Top 5 users, placeholder values for demo */}
                {[
                  { name: 'Anjie Co', date: 'Apr 8, 2025', status: 'Pending' },
                  { name: 'Jhaycee Bocarile', date: 'Apr 7, 2025', status: 'Verified' },
                  { name: 'Jan Galang', date: 'Apr 7, 2025', status: 'Pending' },
                  { name: 'Rence Cababan', date: 'Apr 6, 2025', status: 'Rejected' },
                ].map((user, idx) => (
                  <tr key={user.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UserAvatar name={user.name} />
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{user.date}</td>
                    <td style={{ padding: '14px 12px' }}>
                      {user.status === 'Pending' && <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Pending</span>}
                      {user.status === 'Verified' && <span style={{ background: '#d1fae5', color: '#047857', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Verified</span>}
                      {user.status === 'Rejected' && <span style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Rejected</span>}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {user.status === 'Pending' ? (
                        <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>Verify</button>
                      ) : (
                        <button style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dbColumn">
          <div className="dbTableCard">
            <div className="dbTableCardHeader">Recent Reports</div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Reporter</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Type</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Subject</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Date</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Status</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder values for demo */}
                {[
                  { reporter: 'Anjie Co', type: 'Product', subject: 'Fake item', date: 'Sep 25, 2025', status: 'Open' },
                  { reporter: 'Jhaycee Bocarile', type: 'User', subject: 'Spam', date: 'Sep 24, 2025', status: 'Closed' },
                  { reporter: 'Rence Cababan', type: 'Order', subject: 'Late delivery', date: 'Sep 23, 2025', status: 'Open' },
                  { reporter: 'Jan Galang', type: 'Product', subject: 'Wrong description', date: 'Sep 22, 2025', status: 'Closed' },
                ].map((rep, idx) => (
                  <tr key={rep.reporter + idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 500 }}>{rep.reporter}</td>
                    <td style={{ padding: '14px 12px' }}>{rep.type}</td>
                    <td style={{ padding: '14px 12px' }}>{rep.subject}</td>
                    <td style={{ padding: '14px 12px' }}>{rep.date}</td>
                    <td style={{ padding: '14px 12px' }}>
                      {rep.status === 'Open' && <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Open</span>}
                      {rep.status === 'Closed' && <span style={{ background: '#d1fae5', color: '#047857', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Closed</span>}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </AdminLayout>
  );
}

export default Dashboard;