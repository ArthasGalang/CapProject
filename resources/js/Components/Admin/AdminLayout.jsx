import React, { useState } from "react";
import Header from '@/Components/Admin/Header';
import Sidebar from '@/Components/Admin/Sidebar';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
