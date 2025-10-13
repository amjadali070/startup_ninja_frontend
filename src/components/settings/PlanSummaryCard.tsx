import type { FC } from 'react';

const panelCardClass =
  'rounded-3xl border border-white/10 bg-[#0E0E18] p-6 sm:p-7 lg:p-8 shadow-[0_20px_45px_rgba(6,7,12,0.55)]';

export type PlanSummary = {
  name: string;
  renewalDate: string;
  status: string;
  tokensUsed: number;
  tokensLimit: number;
  creditsUsed: number;
  creditsLimit: number;
};

interface PlanSummaryCardProps {
  plan: PlanSummary;
  onViewBillingHistory?: () => void;
}

const PlanSummaryCard: FC<PlanSummaryCardProps> = ({ plan, onViewBillingHistory }) => {
  const tokenUsagePercent = Math.min(100, Math.round((plan.tokensUsed / Math.max(plan.tokensLimit, 1)) * 100));
  const creditUsagePercent = Math.min(100, Math.round((plan.creditsUsed / Math.max(plan.creditsLimit, 1)) * 100));

  return (
    <section className={`${panelCardClass} border-white/15 bg-gradient-to-br from-[#161626] via-[#0E0E18] to-[#0D0D15]`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24rem] text-white/60">Plan summary</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{plan.name}</h3>
      <p className="mt-1 text-sm text-white/60">{plan.renewalDate}</p>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18rem] text-white/55">
            <span>AI tokens</span>
            <span>
              {plan.tokensUsed.toLocaleString()} / {plan.tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F97316] via-[#FB7185] to-[#F43F5E]"
              style={{ width: tokenUsagePercent + '%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18rem] text-white/55">
            <span>Design credits</span>
            <span>
              {plan.creditsUsed} / {plan.creditsLimit}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#6366F1] to-[#A855F7]"
              style={{ width: creditUsagePercent + '%' }}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewBillingHistory}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
      >
        View billing history
      </button>
    </section>
  );
};

export default PlanSummaryCard;
