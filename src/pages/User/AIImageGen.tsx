import { useEffect, type FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import CreateImages from "../../components/ai-image-gen/CreateImages.tsx";
import RecentImages from "../../components/ai-image-gen/RecentImages.tsx";
import { useAuth } from "../../hooks/useAuth.tsx";
import { authService } from "../../services/auth.ts";

const AIImageGen: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("AI Image Gen logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => !prev);
  }, []);

  return (
    <DashboardLayout
      activePath="/ai-tools/image-gen"
      title="Imagenative Image"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="mb-6">
            <CreateImages onImageGenerated={triggerRefresh} />
          </div>

          {/* Recent Images Section */}
          <div className="w-full">
            <RecentImages shouldRefresh={refreshTrigger} />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AIImageGen;
