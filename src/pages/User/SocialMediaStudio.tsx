import { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PlatformTags from '../../components/social-media/PlatformTags.tsx';
import WritePostContent from '../../components/social-media/WritePostContent.tsx';
import FileUpload from '../../components/social-media/FileUpload.tsx';
import SchedulingOption from '../../components/social-media/SchedulingOption.tsx';
import ScheduledPostsList from '../../components/social-media/ScheduledPostsList.tsx';
import PostPreview from '../../components/social-media/PostPreview.tsx';
import AccountsCard from '../../components/social-media/AccountsCard.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { authService } from '../../services/auth.ts';
import SocialMediaHeading from '../../components/social-media/SocialMediaHeading.tsx';
import { PostProvider } from '../../components/social-media/PostContext.tsx';

const SocialMediaStudio: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

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

  return (
    <DashboardLayout 
      activePath="/ai-tools/social-pro" 
      title="Social Media Studio"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
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
                    Select Platforms to publish or schedule the posts.
                  </h3>
                  <PlatformTags />
                </div>

                <WritePostContent />

                <FileUpload />

                <SchedulingOption />
                <ScheduledPostsList />
              </div>

              <div className="flex-1 lg:flex-[1] space-y-4 md:space-y-6 lg:h-full">
                <PostPreview />

                <AccountsCard />
              </div>
            </div>
          </div>
        </PostProvider>
      </main>
    </DashboardLayout>
  );
};

export default SocialMediaStudio;