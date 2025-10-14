import { useCallback, useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';
import { ImFileText } from 'react-icons/im';
import { PiBrainLight } from "react-icons/pi";
import DashboardLayout from '../../layouts/DashboardLayout';
import AIChatUpgradeBanner from '../../components/ai-chat/AIChatUpgradeBanner.tsx';
import AIChatHeroTitle from '../../components/ai-chat/AIChatHeroTitle.tsx';
import AIChatComposer from '../../components/ai-chat/AIChatComposer.tsx';
import AIChatQuickActionCard from '../../components/ai-chat/AIChatQuickActionCard.tsx';
import AIChatFooterNotice from '../../components/ai-chat/AIChatFooterNotice.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { authService } from '../../services/auth.ts';

const quickActions = [
  {
    title: 'Summarize Text',
    description: 'Turn long articles into easy summaries.',
    icon: <ImFileText className="h-6 w-6" />,
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
    icon: <PiBrainLight className="h-6 w-6" />,
    prompt: 'Answer the question: How can early-stage startups validate their product idea quickly with limited resources?',
  },
];

const AIChat: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(0);
  const usageLimit = 2000;

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

  return (
    <DashboardLayout 
      activePath="/ai-tools/chat" 
      title="Ninja Chat"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto px-4 pb-14 pt-8 sm:px-6 md:px-10 xl:px-14 xl:pb-16">
        <div className="mx-auto flex w-full max-w-[1035.667px] flex-col gap-[32px] sm:gap-[36px] min-h-[648.667px]">
          <div className="w-full">
            <AIChatUpgradeBanner />
          </div>
          <AIChatHeroTitle />
          <AIChatComposer
            prompt={prompt}
            onPromptChange={(value) => setPrompt(value)}
            onSubmit={handleComposerSubmit}
            isGenerating={isGenerating}
            tokenUsage={tokenUsage}
            usageLimit={usageLimit}
            className="w-full"
          />

          <section className="grid w-full gap-[24px] md:grid-cols-2 lg:grid-cols-3">
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

          <div className="w-full">
            <AIChatFooterNotice />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AIChat;
