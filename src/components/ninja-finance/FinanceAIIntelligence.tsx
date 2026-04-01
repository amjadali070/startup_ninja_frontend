import { type FC } from "react";
import { FiTarget, FiZap, FiSun } from "react-icons/fi";

const FinanceAIIntelligence: FC = () => {
  const insights = [
    {
      title: "Efficiency Alert",
      desc: "Switching to annual billing for AWS could save $14,200/yr.",
      icon: <FiZap className="w-3.5 h-3.5 text-[#EF4444]" />,
      color: "border-[#EF444420] bg-[#EF444405]",
      titleColor: "text-[#EF4444]",
    },
    {
      title: "Tax Optimization",
      desc: "R&D Tax credit filing window opens in 12 days. Estimated $45k return.",
      icon: <FiSun className="w-3.5 h-3.5 text-amber-500" />,
      color: "border-amber-500/20 bg-amber-500/05",
      titleColor: "text-amber-500",
    },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 lg:p-8 font-plus-jakarta h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          AI Intelligence
        </h3>
        <FiTarget className="w-4 h-4 text-[#EF4444]" />
      </div>

      <div className="flex-1 space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.title}
            className={`p-5 rounded-2xl border ${insight.color} space-y-2 group hover:bg-white/[0.02] transition-all`}
          >
            <div className="flex items-center gap-2">
              {insight.icon}
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${insight.titleColor}`}>
                {insight.title}
              </h4>
            </div>
            <p className="text-[12px] leading-relaxed text-gray-400 group-hover:text-white transition-colors">
              {insight.desc}
            </p>
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 mt-2">
        Review Full Insights
      </button>
    </div>
  );
};

export default FinanceAIIntelligence;
