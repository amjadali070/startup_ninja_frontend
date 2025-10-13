import type { FC } from 'react';
const panelCardClass =
  'rounded-3xl border border-white/10 bg-[#0E0E18] p-6 sm:p-7 lg:p-8 shadow-[0_20px_45px_rgba(6,7,12,0.55)]';

export interface SupportCardProps {
  onContactSupport?: () => void;
}

const SupportCard: FC<SupportCardProps> = ({ onContactSupport }) => {
  return (
    <section className={panelCardClass}>
      <p className="text-xs font-semibold uppercase tracking-[0.18rem] text-white/50">Need a hand?</p>
      <h3 className="mt-3 text-xl font-semibold text-white">We’re here to help</h3>
      <p className="mt-2 text-sm text-white/60">
        Chat with our success team for onboarding, integrations, and custom deployment support.
      </p>
      <button
        type="button"
        onClick={onContactSupport}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#6366F1] px-5 py-2.5 text-xs font-semibold text-black shadow-[0_18px_42px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5"
      >
        Contact support
      </button>
    </section>
  );
};

export default SupportCard;
