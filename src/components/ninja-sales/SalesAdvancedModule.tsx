import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import { ninjaSalesService } from "../../services/ninjaSales";

const SalesAdvancedModule: FC = () => {
  const navigate = useNavigate();
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await ninjaSalesService.postDashboardInsight();
      if (cancelled) return;
      if (res.success && res.data?.insight) setInsight(res.data.insight);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full h-auto md:h-[340px] overflow-hidden rounded-[24px] border border-white/5 bg-[#121212] flex flex-col md:flex-row group font-plus-jakarta shadow-2xl">
      <div className="flex-1 p-6 lg:p-10 z-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <FiZap className="text-[#EF4444] w-4 h-4 fill-[#EF4444]" />
          <span className="text-[10px] font-bold text-[#EF4444] tracking-widest uppercase">
            NINJA INTELLIGENCE ACTIVE
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
          Accelerate Outreach with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B3B] to-[#E50000]">
            Ninja Sales AI
          </span>
        </h2>

        <p className="text-sm font-medium text-gray-400 mb-8 max-w-lg leading-relaxed">
          Our assistant uses your live pipeline and follow-ups to suggest next actions and outreach. Keep data in Ninja Sales for the best recommendations.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => navigate("/ai-tools/sales/follow-ups")}
            className="px-6 py-3 bg-[#E50000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#EF444420] active:scale-95 uppercase tracking-widest"
          >
            Open follow-ups
          </button>
          <button
            type="button"
            onClick={() => navigate("/ai-tools/sales/proposals")}
            className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95 uppercase tracking-widest"
          >
            Proposals
          </button>
        </div>
      </div>

      <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 md:hidden" />
        <img
          src="/images/sales-ai-bg.png"
          alt=""
          className="w-full h-full object-cover brightness-75"
        />

        <div
          className={`absolute bottom-6 right-6 z-20 w-64 p-5 bg-[#0D0D11]/90 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-2xl transition-opacity duration-500 ${
            insight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3 text-[8px] font-black tracking-widest uppercase">
            <span className="text-[#EF4444]">AI INSIGHT</span>
            <span className="text-gray-500">Just Now</span>
          </div>
          <p className="text-[11px] text-gray-200 font-bold leading-relaxed italic">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesAdvancedModule;
