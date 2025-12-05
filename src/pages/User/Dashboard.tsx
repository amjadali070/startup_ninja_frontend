import { useMemo, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { PiImageSquareBold } from "react-icons/pi";
import { FiGlobe, FiMessageSquare } from "react-icons/fi";
import { RiOrganizationChart } from "react-icons/ri";
import DashboardLayout from "../../layouts/DashboardLayout";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner.tsx";
import QuickActionCard from "../../components/dashboard/QuickActionCard.tsx";
import NinjaAssistantCard from "../../components/dashboard/NinjaAssistantCard.tsx";
import ProjectCard from "../../components/dashboard/ProjectCard.tsx";
import TokenUsageCard from "../../components/dashboard/TokenUsageCard.tsx";
import { userService, type TokenUsage } from "../../services/user.ts";
import WebBuilderService, { type WebsiteProject } from "../../services/web-builder/WebBuilderService.ts";

interface QuickActionConfig {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
  to?: string;
}

const assistantSuggestions = [
  "Want to create a pitch deck based on your last doc?",
  "Try AI Image Generator to design your brand's logo.",
  "Schedule your next social campaign with AI.",
  "Generate hero section visuals for your landing page.",
];

// Helper function to get relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [recentProjects, setRecentProjects] = useState<WebsiteProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchTokenUsage = async () => {
      try {
        const response = await userService.getTokenUsage();
        if (response.success && response.data) {
          setTokenUsage(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch token usage:", error);
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchTokenUsage();
  }, []);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      if (!user?.id) {
        setLoadingProjects(false);
        return;
      }

      try {
        const response = await WebBuilderService.getUserWebsites(user.id);
        if (response.success && response.data) {
          // Filter draft projects and get the 2 most recent
          const draftProjects = response.data
            .filter(project => project.status === 0) // status 0 = draft
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 2);
          
          setRecentProjects(draftProjects);
        }
      } catch (error) {
        console.error("Failed to fetch recent projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchRecentProjects();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Dashboard logout failed:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const quickActions = useMemo<QuickActionConfig[]>(
    () => [
      {
        title: "AI Chat",
        description: "Generate content instantly with our advanced AI.",
        buttonLabel: "Generate Content",
        icon: <FiMessageSquare className="h-12 w-12" />,
        to: "/ai-tools/chat",
      },
      {
        title: "AI Image Generator",
        description: "Create stunning visuals from text prompts.",
        buttonLabel: "Generate Visual",
        icon: <PiImageSquareBold className="h-12 w-12" />,
        to: "/ai-tools/image-gen",
      },
      {
        title: "Website Builder",
        description: "Build professional websites with AI assistance.",
        buttonLabel: "Build Website",
        icon: <FiGlobe className="h-12 w-12" />,
        to: "/ai-tools/web-builder",
      },
      {
        title: "Social Pro",
        description: "Automate and manage your social presence.",
        buttonLabel: "Schedule Content",
        icon: <RiOrganizationChart className="h-12 w-12" />,
        to: "/ai-tools/social-pro",
      },
    ],
    []
  );

  return (
    <DashboardLayout
      activePath="/dashboard"
      title="Dashboard"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 mt-6 px-6 pb-16 md:px-10 xl:px-14">
        <div className="space-y-6">
          <WelcomeBanner name={user.username || user.email || "Ninja"} />

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </section>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[360px_minmax(0,1fr)_360px] xl:items-stretch xl:pb-2">
            <div className="flex h-full w-full">
              <NinjaAssistantCard suggestions={assistantSuggestions} />
            </div>

            <div className="relative flex h-full flex-col overflow-hidden rounded-[12px] border-[1.6px] border-[#242424] p-6 shadow-[0px_8px_30px_rgba(0,0,0,0.45)] sm:p-8">
              <div className="pointer-events-none absolute inset-0 rounded-[12px] border-[1.6px] border-transparent" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-plus-jakarta text-[20px] font-semibold leading-[26px] text-white sm:text-[22px] sm:leading-[28px]">
                      Ongoing Projects
                    </h3>
                    <p className="mt-1 font-plus-jakarta text-[13px] text-white/55">
                      Keep track of your workspace progress in real time.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-1 flex-col justify-start gap-6">
                  {loadingProjects ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-white/50">Loading projects...</div>
                    </div>
                  ) : recentProjects.length > 0 ? (
                    recentProjects.map((project: WebsiteProject) => (
                      <ProjectCard
                        key={project._id}
                        websiteId={project._id}
                        title={project.websiteTitle || 'Untitled Project'}
                        status={project.publishedLink ? 'Live' : 'Draft'}
                        lastUpdated={getRelativeTime(project.updatedAt)}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-white/60 text-sm">No draft projects yet</p>
                      <button
                        onClick={() => navigate('/ai-tools/web-builder')}
                        className="mt-4 text-xs text-[#FF3B3B] hover:text-[#E50000]"
                      >
                        Create your first website →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-full w-full">
              {loadingTokens ? (
                <div className="flex h-full w-full items-center justify-center rounded-[12px] border-[1.33px] border-[#191919] bg-[#0D0D0D]">
                  <div className="text-white/50">Loading...</div>
                </div>
              ) : tokenUsage ? (
                <TokenUsageCard 
                  used={tokenUsage.chatTokensUsed} 
                  limit={tokenUsage.chatTokensLimit} 
                  resetInHours={tokenUsage.resetInHours} 
                />
              ) : (
                <TokenUsageCard used={0} limit={10000} resetInHours={24} />
              )}
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
