import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { authService } from '../../services/auth.ts';
import { userService, UserProfile } from '../../services/user.ts';
import { resolveProfilePictureUrl } from '../../utils/profile.ts';
import TopBarAdminDashboard from '../../components/admin-dashboard/TopBarAdminDashboard.tsx';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const adminBadges = [
    { label: 'Models', value: 'Healthy', color: 'green' as const },
    { label: 'Queue', value: 245, color: 'yellow' as const },
    { label: 'API', value: '89%', color: 'green' as const },
  ];

  const handleLogout = async () => {
    try {
      const userData = {
        user: {
          userId: profile?.id || '',
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setLoading(true);
        const userProfileResponse = await userService.getProfile();
        if (userProfileResponse.success && userProfileResponse.user) {
          setProfile(userProfileResponse.user);
        } else {
          throw new Error(userProfileResponse.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const resolvedProfilePicture = profile?.profilePicture 
    ? resolveProfilePictureUrl(profile.profilePicture)
    : undefined;

  if (loading) {
    return (
      <LoadingSpinner fullscreen variant="dark" />
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070C] text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D0D15] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/60">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] text-sm font-semibold text-white shadow-[0_12px_32px_rgba(229,0,0,0.35)]"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const displayName = profile.username || profile.email || 'Admin';

  return (
    <DashboardLayout 
      activePath="/admin-dashboard" 
      title="Admin Dashboard"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <TopBarAdminDashboard
        title="Admin Dashboard"
        userName={displayName}
        profilePicture={resolvedProfilePicture}
        email={profile.email}
        username={profile.username}
        onLogout={handleLogout}
        onSettings={handleOpenSettings}
        statusBadges={adminBadges}
      />

      <main className="flex-1">
        <AdminDashboardLayout />
      </main>
    </DashboardLayout>
  );
};

export default AdminDashboard;