// Sidebar.jsx
import React from "react";
import { Home, Users, Flag, Mail, Settings, LogOut } from "lucide-react";

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src="/images/logo.png" alt="Logo" className="sidebar-logo" />
        <span className="admin-badge">ADMIN</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li><a href="#" className="nav-link active"><Home className="icon" />Dashboard</a></li>
          <li><a href="#" className="nav-link"><Users className="icon" />User Management</a></li>
          <li><a href="#" className="nav-link"><Flag className="icon" />Reports</a></li>
          <li><a href="#" className="nav-link"><Mail className="icon" />Messages</a></li>
          <li><a href="#" className="nav-link"><Settings className="icon" />Settings</a></li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="logout-link"><LogOut className="icon" />Logout</a>
      </div>
    </aside>
  );
}
