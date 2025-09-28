// Sidebar.jsx
import React from "react";
import { Home, Users, Flag, Mail, Settings, LogOut } from "lucide-react";

export default function Sidebar({ isOpen }) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/user-management', label: 'User Management', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  return (
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
              <a
                href={href}
                className={`nav-link${path.startsWith(href) ? ' active' : ''}`}
                title={!isOpen ? label : undefined}
                style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}
              >
                <Icon className="icon" />
                {isOpen && <span className="nav-label">{label}</span>}
              </a>
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
  );
}
