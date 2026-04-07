import { type FC } from "react";
import { FiSend, FiEdit3, FiCopy, FiCheckCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const AIOutreachAssistant: FC = () => {
  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl h-full flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-500/20 p-2 rounded-xl">
          <HiSparkles className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">AI Suggested Message</h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Recipient:</span>
            <span className="text-lg font-black text-white uppercase tracking-tight">Alex Mercer</span>
          </div>
          <span className="bg-red-600 text-[10px] font-black text-white px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-red-600/20">
            High Intent
          </span>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex-1 relative group hover:border-red-500/20 transition-all">
          <div className="absolute top-4 left-4">
            <span className="bg-red-600/20 border border-red-500/30 text-[9px] font-black text-red-500 px-2 py-0.5 rounded-md uppercase tracking-widest">
              Draft V1.4
            </span>
          </div>
          
          <div className="mt-10 text-gray-400 text-sm leading-relaxed font-medium overflow-y-auto max-h-[300px] scrollbar-hide">
            <p className="mb-4">"Hi Alex,</p>
            <p className="mb-4">Hope your week is going well. I was just reviewing the Cognitive Flow AI integration specs we discussed last Tuesday.</p>
            <p className="mb-4">Based on our conversation, I've drafted a refined deployment timeline that addresses your concerns about the Q3 rollout.</p>
            <p>Do you have 10 minutes tomorrow afternoon to quickly sync on this? I want to ensure we're perfectly aligned before the board review."</p>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black transition-all shadow-xl shadow-red-600/20 active:scale-95 group">
            <FiSend className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span className="uppercase tracking-widest">Send Now</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black transition-all text-white/70">
              <FiEdit3 className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Edit Draft</span>
            </button>
            <button className="h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black transition-all text-white/70">
              <FiCopy className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Copy</span>
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Why this message?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-white/50 leading-relaxed font-medium">Urgency matched to lead's board review cycle.</p>
            </div>
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-white/50 leading-relaxed font-medium">Reference to previous Q3 rollout concern builds trust.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOutreachAssistant;
