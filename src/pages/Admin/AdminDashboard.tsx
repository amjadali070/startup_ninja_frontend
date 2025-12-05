import React, { useCallback } from "react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout.tsx";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
    }
  }, [logout]);

  const handleOpenSettings = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

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
