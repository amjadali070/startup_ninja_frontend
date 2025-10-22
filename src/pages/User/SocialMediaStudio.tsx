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
import '../../utils/testPostUpdates'; // Import test utilities

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
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0D0D0D]">
        <PostProvider>
          {/* Mobile-first responsive container with optimized spacing */}
          <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-2 xs:py-3 sm:py-4 md:py-6">
            <div className="w-full max-w-full mx-auto">
              {/* Hero section with responsive spacing */}
              <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                <SocialMediaHeading/>
              </div>
              
              {/* Main content area with responsive grid layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10">
                {/* Left column - Create Post section */}
                <div className="xl:col-span-2 min-w-0 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  <div className="border rounded-xl xs:rounded-2xl border-white/10 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 bg-[#151515]">
                    {/* Header with responsive typography */}
                    <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                      <h1 className="text-white text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold font-plus-jakarta leading-tight">
                        Create Post
                      </h1>
                    </div>

                    {/* Platform selection with improved mobile layout */}
                    <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                      <h3 className="text-white text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-3 xs:mb-4 sm:mb-5 font-plus-jakarta">
                        Select Platforms to publish or schedule the posts.
                      </h3>
                      <PlatformTags />
                    </div>

                    {/* Content creation components with responsive spacing */}
                    <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
                      <WritePostContent />
                      <FileUpload />
                    </div>
                  </div>

                  {/* Scheduling section with responsive layout */}
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
                    <SchedulingOption />
                    <ScheduledPostsList />
                  </div>
                </div>

                {/* Right column - Preview and Accounts */}
                <div className="xl:col-span-1 min-w-0 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
                  {/* Sticky positioning for desktop, normal flow for mobile */}
                  <div className="xl:sticky xl:top-6 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
                    <PostPreview />
                    <AccountsCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PostProvider>
      </main>
    </DashboardLayout>
  );
};

export default SocialMediaStudio;