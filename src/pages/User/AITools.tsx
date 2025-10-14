import { useEffect, useMemo, useRef, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiGlobe, FiMessageSquare } from 'react-icons/fi';
import { RiShareBoxLine } from 'react-icons/ri';
import { PiImageSquareBold } from 'react-icons/pi';
import DashboardLayout from '../../layouts/DashboardLayout';
import AIToolCard from '../../components/ai-tools/AIToolCard.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { authService } from '../../services/auth.ts';

// Social types/utilities removed for simplified grid

const AITools: FC = () => {
  const navigate = useNavigate();
  const { toolId } = useParams();
  const { logout } = useAuth();

  // Social state removed

  const imageRef = useRef<HTMLDivElement | null>(null);
  const webBuilderRef = useRef<HTMLDivElement | null>(null);
  const socialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
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
        ctaTo: '/ai-tools/chat',
      },
      {
        title: 'AI Image Generator',
        description: 'Create stunning on-brand visuals, hero sections, and marketing materials with simple prompts.',
        icon: <PiImageSquareBold className="h-8 w-8" />,
        ctaLabel: 'Generate Images',
        ctaTo: '/ai-tools/image-gen',
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

  return (
    <DashboardLayout 
      activePath="/ai-tools" 
      title="AI Tools"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-white">AI Tools</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore our collection of AI-powered tools designed to accelerate your startup journey.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aiTools.map((tool: any) => {
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
    </DashboardLayout>
  );
};

export default AITools;
