import { type FC } from "react";
import { FiTarget } from "react-icons/fi";

const PipelineSnapshot: FC = () => {
  const stages = [
    { label: "QUALIFIED", count: 12, value: "$140k", percent: 85 },
    { label: "DEMO", count: 8, value: "$320k", percent: 65 },
    { label: "PROPOSAL", count: 5, value: "$450k", percent: 45 },
    { label: "CLOSING", count: 2, value: "$298k", percent: 25 },
  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-8 h-full font-plus-jakarta flex flex-col gap-8 group overflow-hidden relative shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <FiTarget className="text-[#EF4444] w-5 h-5" />
        <h2 className="text-lg font-semibold text-white tracking-wide">Pipeline Snapshot</h2>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-6 py-2">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col gap-3 group/row">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stage.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-white px-2 py-1 bg-[#EF4444] rounded-md">{stage.count} Deals</span>
                <span className="text-[10px] font-black text-white/60">{stage.value}</span>
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

      {/* Decorative Glow */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#EF444405] blur-[60px] rounded-full" />
    </div>
  );
};

export default PipelineSnapshot;
