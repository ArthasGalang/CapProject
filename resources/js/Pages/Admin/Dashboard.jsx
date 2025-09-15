import React from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">
          Welcome back, Admin! Here’s an overview of your system.
        </p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h2>120</h2>
            <p>Users</p>
          </div>
          <div className="stat-card">
            <h2>35</h2>
            <p>Reports</p>
          </div>
          <div className="stat-card">
            <h2>8</h2>
            <p>Pending Tasks</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
