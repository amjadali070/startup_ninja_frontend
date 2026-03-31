import { type FC } from "react";
import { HiLightningBolt } from "react-icons/hi";

const FinanceAdvancedModule: FC = () => {
  return (
    <div className="relative w-full h-auto md:h-[340px] overflow-hidden rounded-[24px] border border-white/5 bg-[#121212] flex flex-col md:flex-row group font-plus-jakarta">
      {/* Content Side */}
      <div className="flex-1 p-6 lg:p-10 z-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <HiLightningBolt className="text-[#EF4444] w-4 h-4" />
          <span className="text-[10px] font-bold text-[#EF4444] tracking-widest uppercase">
            AI OPTIMIZATION
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
          Strengthen Runway with <br />
          <span className="text-white">Ninja Finance AI</span>
        </h2>

        <p className="text-sm font-medium text-gray-400 mb-8 max-w-lg leading-relaxed uppercase tracking-widest text-[10px] opacity-80 decoration-none">
          Our proprietary engine analyzes thousands of startup expense patterns to identify latent savings. Most Series A startups recover 4.2% of their burn within the first 30 days of activation.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#EF444420] active:scale-95">
            Review Recommendations
          </button>
          <button className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95">
            Generate Report
          </button>
        </div>
      </div>

      {/* Image Side */}
      <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 md:hidden" />
        <img
          src="/images/finance-ai-bg.png"
          alt="Ninja Finance AI Abstract"
          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
        />
      </div>
    </div>
  );
};

export default FinanceAdvancedModule;
