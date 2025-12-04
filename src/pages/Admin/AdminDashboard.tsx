import React from "react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout.tsx";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  return (
    <DashboardLayout
      activePath="/admin-dashboard"
      title="Admin Dashboard"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1">
        <AdminDashboardLayout />
      </main>
    </DashboardLayout>
  );
};

export default AdminDashboard;
