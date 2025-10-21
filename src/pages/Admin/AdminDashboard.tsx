import React from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.tsx';
import { authService } from '../../services/auth.ts';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const userData = {
        user: {
          userId: user?.id || '',
        }
      }
      await authService.logout(userData);
      logout();
      // navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
      // navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
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