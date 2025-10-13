import { useEffect, useMemo, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import PlatformTags from '../components/social-media/PlatformTags';
import WritePostContent from '../components/social-media/WritePostContent';
import FileUpload from '../components/social-media/FileUpload';
import SchedulingOption from '../components/social-media/SchedulingOption';
import PostPreview from '../components/social-media/PostPreview';
import ConnectedAccounts from '../components/social-media/ConnectedAccounts';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth.tsx';
import { authService } from '../services/auth';
import { userService, type UserProfile } from '../services/user';
import { resolveProfilePictureUrl } from '../utils/profile';
import SocialMediaHeading from '../components/social-media/SocialMediaHeading.tsx';
import { PostProvider } from '../components/social-media/PostContext';

const SocialMediaStudio: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedProfilePicture = useMemo(() => {
    const fallbackUser = authService.getUser?.() ?? null;
    const fallbackPicture = fallbackUser?.profilePicture ?? fallbackUser?.picture ?? null;
    return resolveProfilePictureUrl(profile?.profilePicture ?? fallbackPicture);
  }, [profile?.profilePicture]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLoading(false);
      navigate('/login', { replace: true });
      return;
    }

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
        console.error('Social Media Studio profile fetch failed:', err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Social Media Studio logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

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
    <div className="flex min-h-screen text-white">
      <DashboardSidebar activePath="/ai-tools/social-pro" />

      <div className="flex flex-1 flex-col">
        <DashboardTopbar
          title="Social Media Studio"
          userName={displayName}
          profilePicture={resolvedProfilePicture}
          email={profile.email}
          username={profile.username}
          onLogout={handleLogout}
          onSettings={handleOpenSettings}
        />

        <main className="flex-1 overflow-y-auto">
          <PostProvider>
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="mb-6">
                  <SocialMediaHeading/>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:items-start">
                <div className="flex-1 lg:flex-[2] space-y-4 md:space-y-6 border rounded-lg border-white/10 p-6 lg:p-6 bg-[#151515]">
                  <div>
                    <h1 className="text-white text-xl md:text-2xl font-bold mb-4 md:mb-6 font-plus-jakarta">
                      Create Post
                    </h1>
                  </div>

                  <div>
                      <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-plus-jakarta">
                      Select Platforms
                    </h3>
                    <PlatformTags />
                  </div>

                  <WritePostContent />

                  <FileUpload />

                  <SchedulingOption />
                </div>

                <div className="flex-1 lg:flex-[1] space-y-4 md:space-y-6 lg:h-full">
                  <PostPreview />

                  <ConnectedAccounts />
                </div>
              </div>
            </div>
          </PostProvider>
        </main>
      </div>
    </div>
  );
};

export default SocialMediaStudio;