import type { FC } from 'react';
const panelCardClass =
  'rounded-3xl border border-white/10 bg-[#0E0E18] p-6 sm:p-7 lg:p-8 shadow-[0_20px_45px_rgba(6,7,12,0.55)]';
const sectionHeadingClass = 'font-plus-jakarta text-lg font-semibold text-white sm:text-xl';

export type IntegrationOption = {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  badge?: string;
  beta?: boolean;
};

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

interface IntegrationsListProps {
  integrations: IntegrationOption[];
  onAction: (integration: IntegrationOption) => void;
}

const SOCIAL_INTEGRATIONS: Array<IntegrationOption & { icon: JSX.Element }> = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect your Facebook page to publish posts and sync analytics.',
    category: 'Social',
    connected: false,
    icon: <FaFacebookF className="h-6 w-6 text-[#1877F2]" />,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Share images and stories, and manage your Instagram business account.',
    category: 'Social',
    connected: false,
    icon: <FaInstagram className="h-6 w-6 text-[#E4405F]" />,
  },
  {
    id: 'twitter',
    name: 'X/Twitter',
    description: 'Post tweets, threads, and monitor engagement on X/Twitter.',
    category: 'Social',
    connected: false,
    icon: <FaTwitter className="h-6 w-6 text-[#1DA1F2]" />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Publish articles, updates, and connect with your professional network.',
    category: 'Social',
    connected: false,
    icon: <FaLinkedinIn className="h-6 w-6 text-[#0A66C2]" />,
  },
];

const IntegrationsList: FC<IntegrationsListProps> = ({ onAction }) => {
  const handleAction = (integration: IntegrationOption) => () => {
    onAction?.(integration);
  };

  return (
    <section className={panelCardClass}>
      <div className="border-b border-white/5 pb-5">
        <h3 className={sectionHeadingClass}>Connected integrations</h3>
        <p className="mt-1 text-sm text-white/60">Plug Startup Ninja into the tools that power your team.</p>
      </div>

      <div className="mt-6 space-y-5">
        {SOCIAL_INTEGRATIONS.map((integration) => (
          <div
            key={integration.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/2 p-4 transition hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                {integration.icon}
                <p className="font-plus-jakarta text-sm font-semibold text-white">{integration.name}</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18rem] text-white/60">
                  {integration.category}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/55 sm:max-w-3xl">{integration.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.18rem] ${integration.connected ? 'text-[#34D399]' : 'text-white/40'}`}>
                {integration.connected ? 'Connected' : 'Not connected'}
              </span>
              <button
                type="button"
                onClick={handleAction(integration)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  integration.connected
                    ? 'border border-white/20 text-white/80 hover:border-white/40 hover:text-white'
                    : 'bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A] text-white shadow-[0_16px_38px_rgba(37,99,235,0.35)] hover:-translate-y-0.5'
                }`}
              >
                {integration.connected ? 'Manage' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IntegrationsList;
