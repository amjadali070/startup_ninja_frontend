import type { FC } from 'react';

export type PlanSummary = {
  name: string;
  renewalDate: string;
  status: string;
  tokensUsed: number;
  tokensLimit: number;
  creditsUsed: number;
  creditsLimit: number;
};

interface SettingsHeaderProps {
  planSummary: PlanSummary;
  onUpgradePlan?: () => void;
}

const SettingsHeader: FC<SettingsHeaderProps> = ({ planSummary, onUpgradePlan }) => {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Account & workspace settings</h2>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className={` rounded-2xl border border-white/10 bg-[#0E0E18] p-6 lg:p-4 shadow-[0_20px_45px_rgba(6,7,12,0.55)] sm:p-3 bg-white/5`}> 
          <p className="text-xs uppercase tracking-[0.24rem] text-white/50">Current plan</p>
          <p className="mt-1 font-plus-jakarta text-md font-bold text-white">{planSummary.name}</p>
        </div>
        <button
          type="button"
          onClick={onUpgradePlan}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(229,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          Upgrade plan
        </button>
      </div>
    </header>
  );
};

export default SettingsHeader;
