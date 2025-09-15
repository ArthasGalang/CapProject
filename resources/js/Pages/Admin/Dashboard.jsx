import React from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="dbHeader">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="dbCardContainer">
        <div className="dbCard">
          Total Users

        </div>
        <div className="dbCard">
          Pending Verifications

        </div>
        <div className="dbCard">
          Open Reports

        </div>
        <div className="dbCard">
          Unread Messages

        </div>
      </div>


    </AdminLayout>
  );
}
