import React, { useState } from "react";
import Header from '@/Components/Admin/Header';
import Sidebar from '@/Components/Admin/Sidebar';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      {/* Header and main content shift together */}
      <div
        className={`admin-content${isSidebarOpen ? " sidebar-pushed" : ""}`}
        style={{ transition: 'margin-left 0.3s ease', minHeight: '100vh', background: '#f5f6fa' }}
      >
        <Header onToggleSidebar={toggleSidebar} />
        {children}
      </div>
    </div>
  );
}
