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
        features: [
          'Draft investor updates and product briefs in minutes',
          'Summarize research, transcribe meetings, and design strategy',
          'Get real-time insights from startup playbooks and frameworks',
          'Route directly into project docs or share with teammates',
        ],
        ctaLabel: 'Start Chatting',
        ctaTo: '/ai-chat',
        popular: true,
        gradient: 'bg-gradient-to-br from-blue-500/10 via-transparent to-transparent',
      },
      {
        title: 'AI Image Generator',
        description: 'Create stunning on-brand visuals, hero sections, and marketing materials with simple prompts.',
        icon: <PiImageSquareBold className="h-8 w-8" />,
        features: [
          'Generate moodboards, social tiles, and product showcases',
          'Choose from curated startup-friendly art styles',
          'High-resolution exports optimized for web and social media',
          'Brand-consistent color palettes and design elements',
        ],
        ctaLabel: 'Generate Images',
        ctaTo: '/ai-tools/image',
        gradient: 'bg-gradient-to-br from-purple-500/10 via-transparent to-transparent',
      },
      {
        title: 'Website Builder',
        description: 'Build professional landing pages and websites without writing a single line of code.',
        icon: <FiGlobe className="h-8 w-8" />,
        features: [
          'AI-powered copy generation based on your business goals',
          'Drag-and-drop refinement with smart layout suggestions',
          'Mobile-responsive designs with conversion optimization',
          'One-click publishing to custom domains',
        ],
        ctaLabel: 'Build Website',
        ctaTo: '/ai-tools/web-builder',
        gradient: 'bg-gradient-to-br from-green-500/10 via-transparent to-transparent',
      },
      {
        title: 'Social Pro',
        description: 'Automate your social media presence with AI-generated content and strategic posting.',
        icon: <RiShareBoxLine className="h-8 w-8" />,
        features: [
          'Generate engaging posts tailored to each platform',
          'Automated scheduling across multiple social channels',
          'Trend analysis and hashtag optimization',
          'Performance analytics and content recommendations',
        ],
        ctaLabel: 'Schedule Content',
        ctaTo: "/ai-tools/social-pro",
        badge: 'Social Pro',
        gradient: 'bg-gradient-to-br from-orange-500/10 via-transparent to-transparent',
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-12 pt-6 sm:px-4 sm:pb-14 sm:pt-8 md:px-6 lg:px-8 xl:px-12 2xl:px-16 xl:pb-16">
          <div className="mx-auto flex w-full max-w-auto flex-col gap-6 sm:gap-8 md:gap-10 xl:gap-12">
            <section className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] border border-white/15 bg-gradient-to-br from-[rgba(255,59,59,0.16)] via-[#11030E] to-[#06060C] p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Enhanced background effects - responsive sizing */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,90,90,0.32),rgba(7,7,12,0)_50%)]" aria-hidden />
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-bl from-[#FF3B3B]/20 via-transparent to-transparent rounded-full blur-2xl sm:blur-3xl" aria-hidden />
              <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-tr from-[#E50000]/15 via-transparent to-transparent rounded-full blur-xl sm:blur-2xl" aria-hidden />
              
              <div className="relative z-10 flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full lg:max-w-2xl xl:max-w-3xl space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FF3B3B]/20 to-[#E50000]/20 border border-[#FF3B3B]/30 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/90 backdrop-blur-sm">
                      ⚡ Startup Ninja AI Suite
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white">
                    Launch faster with AI copilots built for{" "}
                    <span className="bg-gradient-to-r from-[#FF3B3B] to-[#E50000] bg-clip-text text-transparent">
                      founders
                    </span>
                  </h2>
                  
                  <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF3B3B]" />
                      <span className="text-xs sm:text-sm text-white/70">4 Powerful Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                      <span className="text-xs sm:text-sm text-white/70">AI-Powered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                      <span className="text-xs sm:text-sm text-white/70">No Code Required</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-auto lg:min-w-[280px] lg:max-w-[320px] xl:max-w-[360px] rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 p-4 sm:p-5 lg:p-6 text-sm text-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">🚀 Today's highlights</h3>
                  <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5 sm:gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#FF3B3B] mt-1.5 sm:mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">Generate professional brand visuals in <strong className="font-semibold text-white">under 2 minutes</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5 sm:gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#22D3EE] mt-1.5 sm:mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">Deploy pixel-perfect landing pages with <strong className="font-semibold text-white">one-click publishing</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5 sm:gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#F97316] mt-1.5 sm:mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">Automate social media presence with <strong className="font-semibold text-white">AI-driven content</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 auto-rows-fr">
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
                      features={tool.features}
                      ctaLabel={tool.ctaLabel}
                      ctaTo={tool.ctaTo}
                      badge={tool.badge}
                      popular={tool.popular}
                      gradient={tool.gradient}
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
