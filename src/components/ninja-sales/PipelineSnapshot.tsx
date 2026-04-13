import { type FC, useMemo } from "react";
import { FiTarget } from "react-icons/fi";

const STAGE_LABELS: Record<string, string> = {
  new: "NEW",
  contacted: "CONTACTED",
  qualified: "QUALIFIED",
  proposal: "PROPOSAL",
  negotiation: "NEGOTIATION",
  hold: "HOLD",
  converted: "CONVERTED",
};

function formatCompactUsd(n: number): string {
  if (!n || n < 0) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

export interface PipelineStageRow {
  _id: string;
  count: number;
  value: number;
}

interface PipelineSnapshotProps {
  pipelineByStage?: PipelineStageRow[];
}

const PipelineSnapshot: FC<PipelineSnapshotProps> = ({ pipelineByStage = [] }) => {
  const stages = useMemo(() => {
    const sorted = [...pipelineByStage].sort((a, b) => (b.value || 0) - (a.value || 0));
    const top = sorted.slice(0, 4);
    const maxVal = Math.max(...top.map((s) => s.value || 0), 1);
    return top.map((s) => ({
      label: STAGE_LABELS[s._id] || s._id?.toUpperCase?.() || "STAGE",
      count: s.count ?? 0,
      value: s.value ?? 0,
      percent: Math.round(((s.value || 0) / maxVal) * 100),
    }));
  }, [pipelineByStage]);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-8 h-full font-plus-jakarta flex flex-col gap-8 group overflow-hidden relative shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <FiTarget className="text-[#EF4444] w-5 h-5" />
        <h2 className="text-lg font-semibold text-white tracking-wide">Pipeline Snapshot</h2>
      </div>

      {stages.length === 0 ? (
        <p className="text-sm text-gray-500 py-6">No open pipeline stages yet. Add projects to see value by stage.</p>
      ) : (
        <div className="flex-1 flex flex-col justify-between gap-6 py-2">
          {stages.map((stage, i) => (
            <div key={`${stage.label}-${i}`} className="flex flex-col gap-3 group/row">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stage.label}</span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-white px-2 py-1 bg-[#EF4444] rounded-md">
                    {stage.count} {stage.count === 1 ? "Deal" : "Deals"}
                  </span>
                  <span className="text-[10px] font-black text-white/60">{formatCompactUsd(stage.value)}</span>
                </div>
              </div>

              <div className="h-4 w-full bg-white/[0.02] rounded-lg overflow-hidden border border-white/[0.03]">
                <div
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#EF444440] transition-all duration-[1s] ease-in-out opacity-20 group-hover/row:opacity-40"
                  style={{ width: `${stage.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#EF444405] blur-[60px] rounded-full" />
    </div>
  );
};

export default PipelineSnapshot;
