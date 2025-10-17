import { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CreateImages from '../../components/ai-image-gen/CreateImages.tsx';
import RecentImages from '../../components/ai-image-gen/RecentImages.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { authService } from '../../services/auth.ts';

const AIImageGen: FC = () => {
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
      console.error('AI Image Gen logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  return (
    <DashboardLayout 
      activePath="/ai-tools/image-gen" 
      title="AI Image Generator"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6">
            <div className="mb-6">
            <CreateImages />
          </div>
          
          {/* Recent Images Section */}
          <div className="w-full">
            <RecentImages />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AIImageGen;