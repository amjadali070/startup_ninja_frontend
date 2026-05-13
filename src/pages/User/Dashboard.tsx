import { useMemo, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { PiImageSquareBold } from "react-icons/pi";
import { FiGlobe, FiMessageSquare, FiFileText, FiTrendingUp } from "react-icons/fi";
import { RiOrganizationChart } from "react-icons/ri";
import DashboardLayout from "../../layouts/DashboardLayout";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner.tsx";
import QuickActionCard from "../../components/dashboard/QuickActionCard.tsx";
import NinjaAssistantCard from "../../components/dashboard/NinjaAssistantCard.tsx";
import ProjectCard from "../../components/dashboard/ProjectCard.tsx";
import TokenUsageCard from "../../components/dashboard/TokenUsageCard.tsx";
import SalesPipelineCard from "../../components/dashboard/SalesPipelineCard.tsx";
import LegalComplianceCard from "../../components/dashboard/LegalComplianceCard.tsx";
import RecentActivityCard from "../../components/dashboard/RecentActivityCard.tsx";
import SocialInsightsCard from "../../components/dashboard/SocialInsightsCard.tsx";
import { userService, type TokenUsage } from "../../services/user.ts";
import WebBuilderService, {
  type WebsiteProject,
} from "../../services/web-builder/WebBuilderService.ts";

interface QuickActionConfig {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
  to?: string;
}

const assistantSuggestions = [
  "Help me write a compelling value proposition for my startup",
  "Generate 10 creative marketing ideas for a new product launch",
  "What are the key metrics I should track for my SaaS business?",
  "Write a professional email to potential investors",
];

// Helper function to get relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
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
            .filter((project) => project.status === 0) // status 0 = draft
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
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
        icon: <FiMessageSquare className="h-5 w-5" />,
        to: "/ai-tools/chat",
      },
      {
        title: "AI Image Gen",
        description: "Create stunning visuals from text prompts.",
        buttonLabel: "Generate Visual",
        icon: <PiImageSquareBold className="h-5 w-5" />,
        to: "/ai-tools/image-gen",
      },
      {
        title: "Web Builder",
        description: "Build professional websites with AI assistance.",
        buttonLabel: "Build Website",
        icon: <FiGlobe className="h-5 w-5" />,
        to: "/ai-tools/web-builder",
      },
      {
        title: "Social Pro",
        description: "Automate and manage your social presence.",
        buttonLabel: "Schedule Post",
        icon: <RiOrganizationChart className="h-5 w-5" />,
        to: "/ai-tools/social-pro",
      },
      {
        title: "Ninja Legal",
        description: "AI-powered legal document generation.",
        buttonLabel: "Draft Document",
        icon: <FiFileText className="h-5 w-5" />,
        to: "/ai-tools/legal",
      },
      {
        title: "Ninja Sales",
        description: "AI outreach and smart CRM management.",
        buttonLabel: "View Pipeline",
        icon: <FiTrendingUp className="h-5 w-5" />,
        to: "/ai-tools/sales",
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
      <main className="flex-1 mt-4 px-4 pb-12 sm:mt-6 sm:px-6 md:px-8 lg:px-10 xl:px-14 sm:pb-16">
        <div className="space-y-4 sm:space-y-6">
          <WelcomeBanner name={user.username || user.email || "Ninja"} />

          {/* Quick Actions Grid */}
          <section className="grid gap-3 sm:gap-4 grid-cols-2 min-[640px]:grid-cols-3 xl:grid-cols-6">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </section>

          {/* Main Content Grid - Single column until large tablet, then 2 cols, then 3 cols on xl */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)_minmax(300px,360px)] xl:items-stretch xl:pb-2">
            {/* Ninja Assistant Card */}
            <div className="flex h-full w-full min-h-[280px] sm:min-h-[320px]">
              <NinjaAssistantCard suggestions={assistantSuggestions} />
            </div>

            {/* Ongoing Projects Card */}
            <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#2A2A2A] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)] sm:p-6 lg:p-8 min-h-[280px] sm:min-h-[320px]">
              <div className="pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-plus-jakarta text-lg font-semibold leading-tight text-white sm:text-[20px] sm:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                      Ongoing Projects
                    </h3>
                    <p className="mt-1 font-plus-jakarta text-xs text-white/55 sm:text-[13px]">
                      Keep track of your workspace progress in real time.
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-1 flex-col justify-start gap-4 sm:gap-6">
                  {loadingProjects ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-white/50 text-sm">
                        Loading projects...
                      </div>
                    </div>
                  ) : recentProjects.length > 0 ? (
                    recentProjects.map((project: WebsiteProject) => (
                      <ProjectCard
                        key={project._id}
                        websiteId={project._id}
                        title={project.websiteTitle || "Untitled Project"}
                        status={project.publishedLink ? "Live" : "Draft"}
                        lastUpdated={getRelativeTime(project.updatedAt)}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-white/60 text-sm">
                        No draft projects yet
                      </p>
                      <button
                        onClick={() => navigate("/ai-tools/web-builder")}
                        className="mt-4 text-xs text-[#FF3B3B] hover:text-[#E50000] transition-colors"
                      >
                        Create your first website →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Token Usage Card */}
            <div className="flex h-full w-full min-h-[280px] sm:min-h-[320px]">
              {loadingTokens ? (
                <div className="flex h-full w-full items-center justify-center rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
                  <div className="text-white/50 text-sm">Loading...</div>
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

          {/* Insights Grid */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 items-stretch">
            <SalesPipelineCard />
            <LegalComplianceCard />
          </section>

          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-[2fr_1fr]">
            <RecentActivityCard />
            <SocialInsightsCard />
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
