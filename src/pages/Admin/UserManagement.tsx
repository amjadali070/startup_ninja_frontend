import React from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserManagementTable from '../../components/admin-dashboard/UserManagementTable';
import { authService } from '../../services/auth.ts';

const UserManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const userData = {
        user: {
          userId: user?.id || '',
        }
      };
      await authService.logout(userData);
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  return (
    <DashboardLayout 
      activePath="/admin-dashboard/users" 
      title="User Management"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <UserManagementTable />
        </div>
      </main>
    </DashboardLayout>
  );
};

export default UserManagement;
