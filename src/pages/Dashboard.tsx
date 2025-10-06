import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiImageSquareBold } from "react-icons/pi";
import { FiGlobe, FiMessageSquare } from "react-icons/fi";
import { RiOrganizationChart } from "react-icons/ri";
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import NinjaAssistantCard from '../components/dashboard/NinjaAssistantCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import TokenUsageCard from '../components/dashboard/TokenUsageCard';
import { authService } from '../services/auth';
import { userService, UserProfile } from '../services/user';

interface QuickActionConfig {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
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
  {
    title: 'Social Calendar',
    category: 'Social Pro',
    status: 'Live',
    progress: 68,
    lastUpdated: '1h ago',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.user) {
          setProfile(response.user);
        } else {
          setError(response.message || 'Unable to load profile.');
        }
      } catch (err) {
        console.error('Dashboard profile fetch failed:', err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
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
      },
      {
        title: 'AI Image Generator',
        description: 'Create stunning visuals from text prompts.',
        buttonLabel: 'Generate Visual',
        icon: <PiImageSquareBold className="h-12 w-12" />,
      },
      {
        title: 'Website Builder',
        description: 'Build professional websites with AI assistance.',
        buttonLabel: 'Build Website',
      icon: <FiGlobe className="h-12 w-12" />,
      },
      {
        title: 'Social Pro',
        description: 'Automate and manage your social presence.',
        buttonLabel: 'Schedule Content',
        icon: <RiOrganizationChart className="h-12 w-12" />,
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070C] text-white">
        <div className="flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF4D4D]" />
          Preparing your workspace…
        </div>
      </div>
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

  const displayName = profile.username || profile.email || 'Ninja';

  return (
    <div className="flex min-h-screen bg-[#07070C] text-white">
      <DashboardSidebar activePath="/dashboard" />

      <div className="flex-1">
        <DashboardTopbar
          userName={displayName}
          profilePicture={profile.profilePicture}
          email={profile.email}
          username={profile.username}
          onLogout={handleLogout}
          onSettings={handleOpenSettings}
        />

        <main className="flex-1 px-6 pb-16 md:px-10 xl:px-14">
          <div className="space-y-10">
            <WelcomeBanner name={displayName} />

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => (
                <QuickActionCard key={action.title} {...action} />
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.9fr)]">
              <NinjaAssistantCard suggestions={assistantSuggestions} />

              <div className="rounded-3xl border border-white/5 bg-[linear-gradient(155deg,rgba(19,19,30,0.95)_0%,rgba(12,12,20,0.95)_100%)] p-6 xl:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Ongoing Projects</h3>
                    <p className="mt-1 text-sm text-white/50">Keep track of your workspace progress in real time.</p>
                  </div>
                  <button
                    type="button"
                    className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 lg:inline-flex"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  {projectShowcase.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                  ))}
                </div>
              </div>

              <TokenUsageCard used={1524} limit={5000} resetInHours={12} />
            </section>

            <section className="rounded-3xl border border-white/5 bg-[linear-gradient(160deg,rgba(25,26,38,0.95)_0%,rgba(16,16,24,0.95)_100%)] p-6 xl:p-7 text-sm text-white/70">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Secure &amp; Authenticated</h3>
                  <p className="mt-2 max-w-xl leading-relaxed">
                    You&apos;re viewing a protected area powered by your JWT. All requests are automatically authenticated via our
                    <span className="mx-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">apiClient</span>
                    interceptor.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10"
                >
                  Log out
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
