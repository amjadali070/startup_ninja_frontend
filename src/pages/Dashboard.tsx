import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
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
import LoadingSpinner from '../components/LoadingSpinner';

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
];

const ABSOLUTE_IMAGE_URL_REGEX = /^(?:https?:|data:|blob:|chrome-extension:)/i;

const resolveProfilePictureUrl = (picture?: string | null): string | null => {
  if (!picture || !picture.trim()) {
    return null;
  }

  const trimmedPicture = picture.trim();

  if (ABSOLUTE_IMAGE_URL_REGEX.test(trimmedPicture)) {
    return trimmedPicture;
  }

  const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    return trimmedPicture.startsWith('/') ? trimmedPicture : `/${trimmedPicture}`;
  }

  try {
    return new URL(trimmedPicture, baseUrl).href;
  } catch (error) {
    console.warn('Failed to build absolute profile picture URL:', error);
    const sanitizedBase = baseUrl.replace(/\/+$/, '');
    const sanitizedPath = trimmedPicture.startsWith('/') ? trimmedPicture : `/${trimmedPicture}`;
    return `${sanitizedBase}${sanitizedPath}`;
  }
};

const Dashboard: React.FC = () => {
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
        console.error('Dashboard profile fetch failed:', err);
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
      <LoadingSpinner fullscreen variant="dark" />
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
          profilePicture={resolvedProfilePicture}
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
                <TokenUsageCard used={1524} limit={5000} resetInHours={12} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
