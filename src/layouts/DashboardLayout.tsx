import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import { useAuth } from '../hooks/useAuth';
import { userService, type UserProfile } from '../services/user';
import { resolveProfilePictureUrl } from '../utils/profile';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  title?: string;
  onLogout: () => Promise<void> | void;
  onSettings?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activePath, 
  title = 'Dashboard',
  onLogout,
  onSettings 
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedProfilePicture = useMemo(() => {
    return resolveProfilePictureUrl(profile?.profilePicture ?? null);
  }, [profile?.profilePicture]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.user) {
          setProfile(response.user);
        } else {
          if (response.message === 'User not found') {
            await logout();
            navigate('/login', { replace: true });
          }
          setError(response.message || 'Unable to load profile.');
        }
      } catch (err) {
        console.error('Dashboard layout profile fetch failed:', err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  if (loading) {
    return <LoadingSpinner fullscreen variant="dark" />;
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

  const displayName = profile.username || profile.email || 'Ninja';

  return (
    <div className="flex min-h-screen bg-[#07070C] text-white">
      <DashboardSidebar activePath={activePath} userData={profile} />
      <div className="flex-1">
        <DashboardTopbar
          title={title}
          userName={displayName}
          profilePicture={resolvedProfilePicture}
          email={profile.email}
          username={profile.username}
          onLogout={onLogout}
          onSettings={onSettings}
        />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;