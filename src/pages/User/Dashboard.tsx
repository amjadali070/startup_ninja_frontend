import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { PiImageSquareBold } from "react-icons/pi";
import { FiGlobe, FiMessageSquare } from "react-icons/fi";
import { RiOrganizationChart } from "react-icons/ri";
import DashboardLayout from '../../layouts/DashboardLayout';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner.tsx';
import QuickActionCard from '../../components/dashboard/QuickActionCard.tsx';
import NinjaAssistantCard from '../../components/dashboard/NinjaAssistantCard.tsx';
import ProjectCard from '../../components/dashboard/ProjectCard.tsx';
import TokenUsageCard from '../../components/dashboard/TokenUsageCard.tsx';
import { userService } from '../../services/user.ts';

interface QuickActionConfig {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
  to?: string;
}

interface ProjectConfig {
  title: string;
  category: string;
  status: 'Draft' | 'Live' | 'Paused';
  progress: number;
  lastUpdated: string;
}

const assistantSuggestions = [
  'Want to create a pitch deck based on your last doc?',
  "Try AI Image Generator to design your brand's logo.",
  'Schedule your next social campaign with AI.',
  'Generate hero section visuals for your landing page.',
];

const projectShowcase: ProjectConfig[] = [
  {
    title: 'Startup Landing Page',
    category: 'AI Website Builder',
    status: 'Draft',
    progress: 45,
    lastUpdated: '3h ago',
  },
  {
    title: 'Pricing Page (v2)',
    category: 'AI Website Builder',
    status: 'Draft',
    progress: 45,
    lastUpdated: '3h ago',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [displayName, setDisplayName] = useState('Ninja');

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.user) {
          setDisplayName(response.user.username || response.user.email || 'Ninja');
        }
      } catch (err) {
        console.error('Dashboard display name fetch failed:', err);
      }
    };

    fetchDisplayName();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Dashboard logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const quickActions = useMemo<QuickActionConfig[]>(
    () => [
      {
        title: 'AI Chat',
        description: 'Generate content instantly with our advanced AI.',
        buttonLabel: 'Generate Content',
        icon: <FiMessageSquare className="h-12 w-12" />,
        to: '/ai-tools/chat',
      },
      {
        title: 'AI Image Generator',
        description: 'Create stunning visuals from text prompts.',
        buttonLabel: 'Generate Visual',
        icon: <PiImageSquareBold className="h-12 w-12" />,
        to: '/ai-tools/image-gen',
      },
      {
        title: 'Website Builder',
        description: 'Build professional websites with AI assistance.',
        buttonLabel: 'Build Website',
        icon: <FiGlobe className="h-12 w-12" />,
        to: '/ai-tools/web-builder',
      },
      {
        title: 'Social Pro',
        description: 'Automate and manage your social presence.',
        buttonLabel: 'Schedule Content',
        icon: <RiOrganizationChart className="h-12 w-12" />,
        to: '/ai-tools/social-pro',
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
          <WelcomeBanner name={displayName} />

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
                    <h3 className="font-plus-jakarta text-[20px] font-semibold leading-[26px] text-white sm:text-[22px] sm:leading-[28px]">Ongoing Projects</h3>
                    <p className="mt-1 font-plus-jakarta text-[13px] text-white/55">Keep track of your workspace progress in real time.</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-1 flex-col justify-start gap-6">
                  {projectShowcase.slice(0, 3).map((project) => (
                    <ProjectCard key={project.title} {...project} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex h-full w-full">
              <TokenUsageCard used={3000} limit={5000} resetInHours={12} />
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
