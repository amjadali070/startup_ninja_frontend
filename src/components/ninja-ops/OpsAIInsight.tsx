import { type FC } from "react";

const OpsAIInsight: FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-[40px] font-plus-jakarta flex flex-col shadow-2xl" style={{
      background: "radial-gradient(100% 100% at 0% 0%, #3D0505 0%, #110101 100%)"
    }}>
      {/* Top Left Glow Overlay */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#EF4444] blur-[140px] opacity-20 pointer-events-none rounded-full" />

      {/* Subtle Inner Highlight */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-12">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#EF444450] blur-md opacity-60" />
              <img src="/svg/ninja-icon.svg" alt="AI Icon" className="w-8 h-8 relative grayscale brightness-[0.5] invert" />
            </div>
            <span className="text-[12px] font-black text-[#EF4444] uppercase tracking-[0.25em]">AI STRATEGIC INSIGHT</span>
          </div>

          <h3 className="text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight">
            Engineering Velocity is peaking; potential <span className="text-white/80">burnout risk</span> in Backend Sprint 4.
          </h3>

          <p className="text-sm font-medium text-gray-400 max-w-sm leading-relaxed opacity-90">
            AI models detect sustained 14h activity cycles. Recommend reallocating 3 cross-functional leads to support critical paths by Friday.
          </p>
        </div>

        <div className="mt-12">
          <button className="px-10 py-5 bg-[#EF4444] hover:bg-[#EF4444] text-white rounded-[24px] font-black text-[13px] transition-all shadow-2xl shadow-[#E5000020] active:scale-[0.98] uppercase tracking-[0.15em]">
            Execute Realignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpsAIInsight;
