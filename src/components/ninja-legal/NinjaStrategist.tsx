import { type FC } from "react";
import { HiLightningBolt } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";

const NinjaStrategist: FC = () => {
  const quickActions = [
    "Review MSA",
    "Explain IP Clause",
    "Check GDPR Compliance",
    "Draft Termination Notice",
  ];

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#EF4444] p-2 rounded-lg text-white">
            <HiLightningBolt className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white tracking-wide uppercase text-sm">
            BETTER CALL NINJA
          </h3>
        </div>
        <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10 tracking-widest uppercase">
          AI ENGINE v2.4
        </span>
      </div>

      {/* Message Content */}
      <div className="p-6 flex-1 space-y-6">
        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 bg-[#1a1a1a] p-2.5 rounded-lg border border-white/5 h-fit shadow-inner">
            <BsBoxSeam className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-2xl shadow-sm">
              <p className="text-sm leading-7 text-gray-400">
                <span className="font-black text-white mr-2 tracking-tight">Strategic Advice:</span> Based on your recent MSA with 'GlobalTech Inc', I recommend tightening the IP indemnification clause in section 8.2 to limit liability caps. Would you like me to draft a revised clause?
              </p>
            </div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2">
              NINJA STRATEGIST • 2M AGO
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          {quickActions.map((action) => (
            <button
              key={action}
              className="px-5 py-2.5 text-[10px] font-extrabold text-gray-400 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/[0.05] rounded-xl transition-all uppercase tracking-wider"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white/5 border-t border-white/5">
        <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl px-4 transition-all focus-within:border-[#EF444440]">
          <textarea
            rows={1}
            placeholder="Ask Ninja Strategist anything..."
            className="flex-1 bg-transparent py-4 pr-2 text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
          />
          <button className="flex-shrink-0 w-9 h-9 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-all shadow-lg active:scale-95 flex items-center justify-center">
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NinjaStrategist;
