// Sidebar.jsx
import React from "react";
import { apiUrl } from '@js/config/api';
import { Home, Users, Flag, Mail, Settings, LogOut, Store } from "lucide-react";

export default function Sidebar({ isOpen }) {
  const [showMessagesModal, setShowMessagesModal] = React.useState(false);
  const [userID1, setUserID1] = React.useState('');
  const [userID2, setUserID2] = React.useState('');
  const [chatLog, setChatLog] = React.useState([]);
  const [loadingChat, setLoadingChat] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/user-management', label: 'User Management', icon: Users },
    { href: '/admin/shop-management', label: 'Shop Management', icon: Store },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  return (
    <>
      <aside className={`sidebar${isOpen ? ' open' : ' collapsed'}`}>
        <div className="sidebar-header">
          {isOpen ? (
            <>
              <span style={{ fontWeight: 800, fontSize: 28, color: '#2563eb', letterSpacing: 1, marginBottom: 8 }}>NegoGen T.</span>
              <span className="admin-badge">ADMIN</span>
            </>
          ) : (
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <span style={{ color: '#2563eb', fontSize: 28 }}><Home /></span>
            </span>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                {label === 'Messages' ? (
                  <a
                    onClick={(e) => { e.preventDefault(); setShowMessagesModal(true); }}
                    className={`nav-link${path.startsWith(href) ? ' active' : ''}`}
                    title={!isOpen ? label : undefined}
                    style={{ justifyContent: isOpen ? 'flex-start' : 'center', cursor: 'pointer' }}
                  >
                    <Icon className="icon" />
                    {isOpen && <span className="nav-label">{label}</span>}
                  </a>
                ) : (
                  <a
                    href={href}
                    className={`nav-link${path.startsWith(href) ? ' active' : ''}`}
                    title={!isOpen ? label : undefined}
                    style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}
                  >
                    <Icon className="icon" />
                    {isOpen && <span className="nav-label">{label}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      <div className="sidebar-footer">
        <a href="/logout" className="logout-link" title={!isOpen ? 'Logout' : undefined} style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}>
          <LogOut className="icon" />
          {isOpen && <span className="nav-label">Logout</span>}
        </a>
      </div>
    </aside>

      {/* Messages Modal */}
      {showMessagesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 2rem', minWidth: 600, maxWidth: 900, maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => { setShowMessagesModal(false); setShowChat(false); setChatLog([]); setUserID1(''); setUserID2(''); }} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', marginBottom: 18 }}>Messages</h3>
            
            {!showChat ? (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 8 }}>User ID 1:</label>
                  <input
                    type="text"
                    value={userID1}
                    onChange={e => setUserID1(e.target.value)}
                    placeholder="Enter first user ID"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 8 }}>User ID 2:</label>
                  <input
                    type="text"
                    value={userID2}
                    onChange={e => setUserID2(e.target.value)}
                    placeholder="Enter second user ID"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!userID1.trim() || !userID2.trim()) {
                      alert('Please enter both user IDs');
                      return;
                    }
                    setLoadingChat(true);
                    try {
                      const response = await fetch(`api/usermessages/between/${userID1}/${userID2}`);
                      const data = await response.json();
                      setChatLog(Array.isArray(data) ? data : []);
                      setShowChat(true);
                    } catch (err) {
                      alert('Failed to fetch chat log: ' + err.message);
                      setChatLog([]);
                    }
                    setLoadingChat(false);
                  }}
                  disabled={loadingChat || !userID1.trim() || !userID2.trim()}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: 16, cursor: loadingChat ? 'not-allowed' : 'pointer', width: '100%' }}
                >
                  {loadingChat ? 'Loading...' : 'View Chat Log'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: '#f9fafb', borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, color: '#374151' }}>Chat between User {userID1} and User {userID2}</div>
                  <button
                    onClick={() => { setShowChat(false); setChatLog([]); setUserID1(''); setUserID2(''); }}
                    style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
                  >
                    Back
                  </button>
                </div>
                
                {chatLog.length === 0 ? (
                  <div style={{ color: '#888', fontSize: 16, textAlign: 'center', padding: '2rem' }}>No messages found between these users.</div>
                ) : (
                  <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    {chatLog.map((msg, idx) => (
                      <div key={msg.UserMessageID || idx} style={{ marginBottom: 16, padding: '12px 16px', background: msg.SenderID === parseInt(userID1) ? '#e3f0ff' : '#f3f4f6', borderRadius: 10, borderLeft: `4px solid ${msg.SenderID === parseInt(userID1) ? '#2563eb' : '#6b7280'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, color: '#2563eb', fontSize: 14 }}>
                            {msg.SenderFirstName && msg.SenderLastName ? `${msg.SenderFirstName} ${msg.SenderLastName}` : `User ${msg.SenderID}`}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: 13 }}>{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</span>
                        </div>
                        <div style={{ color: '#374151', fontSize: 15, lineHeight: 1.5 }}>{msg.MessageBody}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

