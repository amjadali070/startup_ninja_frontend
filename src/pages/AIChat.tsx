import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiFileText, FiHelpCircle } from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import AIChatUpgradeBanner from '../components/ai-chat/AIChatUpgradeBanner';
import AIChatHeroTitle from '../components/ai-chat/AIChatHeroTitle';
import AIChatComposer from '../components/ai-chat/AIChatComposer';
import AIChatQuickActionCard from '../components/ai-chat/AIChatQuickActionCard';
import AIChatFooterNotice from '../components/ai-chat/AIChatFooterNotice';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth.tsx';
import { authService } from '../services/auth';
import { userService, type UserProfile } from '../services/user';
import { resolveProfilePictureUrl } from '../utils/profile';

const quickActions = [
  {
    title: 'Summarize Text',
    description: 'Turn long articles into easy summaries.',
    icon: <FiFileText className="h-6 w-6" />,
    prompt:
      "Summarize the following text into bullet points highlighting key takeaways and action items:\n\n[Paste your text here]",
  },
  {
    title: 'Creative Writing',
    description: 'Generate stories, blog posts, or fresh content ideas in seconds.',
    icon: <FiEdit3 className="h-6 w-6" />,
    prompt:
      "Write a creative short story about a tenacious startup founder who overcomes an unexpected challenge using AI. Focus on emotion and vivid details.",
  },
  {
    title: 'Answer Questions',
    description: 'Ask me anything—from facts to advice—and get instant answers.',
    icon: <FiHelpCircle className="h-6 w-6" />,
    prompt: 'Answer the question: How can early-stage startups validate their product idea quickly with limited resources?',
  },
];

const AIChat: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(0);
  const usageLimit = 2000;

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
        console.error('AI Chat profile fetch failed:', err);
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
    } catch (err) {
      console.error('AI Chat logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const handleComposerSubmit = useCallback(async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return false;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const estimatedTokens = Math.max(18, Math.round(trimmedPrompt.length / 4));

      setTokenUsage((previous) => Math.min(previous + estimatedTokens, usageLimit));
      setPrompt('');
      return true;
    } catch (submissionError) {
      console.error('AI chat prompt submission failed:', submissionError);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, usageLimit]);

  const handleQuickAction = useCallback((template: string) => {
    setPrompt(template);
  }, []);

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

  return (
    <div className="flex min-h-screen bg-[#07070C] text-white">
      <DashboardSidebar activePath="/ai-tools/chat" />

      <div className="flex flex-1 flex-col">
        <DashboardTopbar
          title="Ninja Chat"
          userName={displayName}
          profilePicture={resolvedProfilePicture}
          email={profile.email}
          username={profile.username}
          onLogout={handleLogout}
          onSettings={handleOpenSettings}
        />

        <main className="flex-1 overflow-y-auto px-6 pb-16 md:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-6xl">
            <AIChatUpgradeBanner />
            <AIChatHeroTitle />
            <AIChatComposer
              prompt={prompt}
              onPromptChange={(value) => setPrompt(value)}
              onSubmit={handleComposerSubmit}
              isGenerating={isGenerating}
              tokenUsage={tokenUsage}
              usageLimit={usageLimit}
            />

            <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((action) => (
                <AIChatQuickActionCard
                  key={action.title}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onClick={() => handleQuickAction(action.prompt)}
                />
              ))}
            </section>

            <AIChatFooterNotice />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIChat;
