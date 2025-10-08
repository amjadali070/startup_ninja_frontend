import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiGlobe, FiMessageSquare } from 'react-icons/fi';
import { RiShareBoxLine } from 'react-icons/ri';
import { PiImageSquareBold } from 'react-icons/pi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import LoadingSpinner from '../components/LoadingSpinner';
import AIToolCard from '../components/ai-tools/AIToolCard';
import { useAuth } from '../hooks/useAuth.tsx';
import { authService } from '../services/auth';
import { userService, type UserProfile } from '../services/user';
import { resolveProfilePictureUrl } from '../utils/profile';

// Social types/utilities removed for simplified grid

const AITools: FC = () => {
  const navigate = useNavigate();
  const { toolId } = useParams();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Social state removed

  const imageRef = useRef<HTMLDivElement | null>(null);
  const webBuilderRef = useRef<HTMLDivElement | null>(null);
  const socialRef = useRef<HTMLDivElement | null>(null);

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
        console.error('AI Tools profile fetch failed:', err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  useEffect(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      image: imageRef,
      'web-builder': webBuilderRef,
      'social-pro': socialRef,
    };

    if (!toolId) {
      return;
    }

    const sectionRef = refs[toolId];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [toolId]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('AI Tools logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const aiTools = useMemo(
    () => [
      {
        title: 'AI Chat',
        description: 'Collaborate with a smart AI assistant trained on startup best practices and industry insights.',
        icon: <FiMessageSquare className="h-8 w-8" />,
        ctaLabel: 'Start Chatting',
        ctaTo: '/ai-chat',
      },
      {
        title: 'AI Image Generator',
        description: 'Create stunning on-brand visuals, hero sections, and marketing materials with simple prompts.',
        icon: <PiImageSquareBold className="h-8 w-8" />,
        ctaLabel: 'Generate Images',
        ctaTo: '/ai-tools/image',
      },
      {
        title: 'Website Builder',
        description: 'Build professional landing pages and websites without writing a single line of code.',
        icon: <FiGlobe className="h-8 w-8" />,
        ctaLabel: 'Build Website',
        ctaTo: '/ai-tools/web-builder',
      },
      {
        title: 'Social Pro',
        description: 'Automate your social media presence with AI-generated content and strategic posting.',
        icon: <RiShareBoxLine className="h-8 w-8" />,
        ctaLabel: 'Schedule Content',
        ctaTo: "/ai-tools/social-pro",
      },
    ],
    []
  );

  if (loading) {
    return <LoadingSpinner fullscreen variant="dark" />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070C] text-white">
        <div className="w-full max-w-md rounded-lg border border-white/20 bg-white/5 p-8 text-center backdrop-blur-sm">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/60">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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

  // platform labels removed

  return (
    <div className="flex min-h-screen bg-[#07070C] text-white w-full overflow-hidden">
      <DashboardSidebar activePath="/ai-tools" />

      <div className="flex flex-1 flex-col min-w-0 max-w-full">
        <DashboardTopbar
          title="AI Tools"
          userName={displayName}
          profilePicture={resolvedProfilePicture}
          email={profile.email}
          username={profile.username}
          onLogout={handleLogout}
          onSettings={handleOpenSettings}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <section className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold text-white">AI Tools</h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Explore our collection of AI-powered tools designed to accelerate your startup journey.
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {aiTools.map((tool) => {
                const refProp =
                  tool.title === 'AI Image Generator'
                    ? imageRef
                    : tool.title === 'Website Builder'
                      ? webBuilderRef
                      : tool.title === 'Social Pro'
                        ? socialRef
                        : undefined;

                return (
                  <div key={tool.title} ref={refProp} className="flex">
                    <AIToolCard
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      ctaLabel={tool.ctaLabel}
                      ctaTo={tool.ctaTo}
                    />
                  </div>
                );
              })}
            </section>

            {/* Social Pro composer section removed; keeping page focused on tool cards */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AITools;
