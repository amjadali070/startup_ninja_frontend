import { type FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiChevronRight } from "react-icons/fi";
import type { TopOpportunityRow } from "../../services/ninjaSales";

type Opp = TopOpportunityRow;

function formatUsd(n: number): string {
  if (!n || n < 0) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatExpected(iso?: string | null): string {
  if (!iso) return "No close date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "No close date";
  return `Expected ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function stageLabel(stage: string): string {
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface TopOpportunitiesProps {
  opportunities?: Opp[];
}

const TopOpportunities: FC<TopOpportunitiesProps> = ({ opportunities = [] }) => {
  const navigate = useNavigate();
  const rows = useMemo(() => opportunities.slice(0, 3), [opportunities]);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-8 h-full font-plus-jakarta flex flex-col gap-4 group overflow-hidden relative shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <FiStar className="text-[#EF4444] w-5 h-5 fill-[#EF4444]" />
        <h2 className="text-lg font-semibold text-white tracking-wide">Top Opportunities</h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">No open opportunities yet. Add projects to see top deals by value.</p>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {rows.map((opt) => (
            <div
              key={opt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] border border-white/[0.03] rounded-[24px] hover:border-[#EF444420] transition-all gap-6 shadow-lg group/item"
            >
              <div className="flex-1 space-y-2 min-w-0">
                <h4 className="text-[15px] font-black text-white tracking-tight leading-tight group-hover/item:text-[#EF4444] transition-colors truncate">
                  {opt.name}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{formatUsd(opt.value)}</span>
                  {opt.company ? (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest truncate max-w-[140px]">{opt.company}</span>
                    </>
                  ) : null}
                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                  <span className="text-[10px] font-black text-[#EF4444] uppercase tracking-widest">{formatExpected(opt.forecastedCloseDate)}</span>
                </div>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{stageLabel(opt.pipelineStage)}</p>
              </div>

              <div className="flex flex-col sm:items-end gap-3 min-w-[120px]">
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-[14px] font-black text-[#10B981]">{opt.confidence ?? 0}% confidence</span>
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">WIN PROBABILITY</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/ai-tools/sales/projects/${opt.id}`)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/5 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest transition-all"
                >
                  View Deal
                  <FiChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopOpportunities;
