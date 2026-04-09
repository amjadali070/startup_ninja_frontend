import { type FC } from "react";
import { HiLightningBolt } from "react-icons/hi";

const OpsAdvancedModule: FC = () => {
  return (
    <div className="relative w-full h-auto md:h-[340px] overflow-hidden rounded-[24px] border border-white/5 bg-[#121212] flex flex-col md:flex-row group font-plus-jakarta">
      {/* Content Side */}
      <div className="flex-1 p-6 lg:p-10 z-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <HiLightningBolt className="text-[#EF4444] w-4 h-4" />
          <span className="text-[10px] font-bold text-[#EF4444] tracking-widest uppercase">
            ADVANCED MODULE
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
          Strengthen Team Execution with <br />
          <span className="text-white">Ninja Ops AI</span>
        </h2>

        <p className="text-sm font-medium text-gray-400 mb-8 max-w-lg leading-relaxed uppercase tracking-widest text-[10px] opacity-80 decoration-none">
          Harness predictive analytics to identify performance bottlenecks before they impact your runway. Scale your organizational health with surgical precision.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-4 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-2xl font-black text-[11px] transition-all shadow-xl shadow-[#EF444430] active:scale-95 uppercase tracking-[0.2em]">
            Review Org Health
          </button>
          <button className="px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.05] rounded-2xl font-black text-[11px] transition-all active:scale-95 uppercase tracking-[0.2em]">
            Manage Team
          </button>
        </div>
      </div>

      {/* Image Side */}
      <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 md:hidden" />
        <img
          src="/images/ops-ai-bg.png"
          alt="Ninja Ops AI Abstract"
          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
        />
      </div>
    </div>
  );
};

export default OpsAdvancedModule;
