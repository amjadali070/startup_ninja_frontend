import { type FC } from "react";
import { FiUser, FiZap } from "react-icons/fi";

const AIFollowupSuggestions: FC = () => {
  const suggestions = [
    {
      name: "Sarah Jenkins",
      detail: "Last active 4h ago",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "Marcus Thorne",
      detail: "No response for 3 days",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    {
      name: "Elena Rodriguez",
      detail: "Inquiry: Enterprise Pricing",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-[32px] p-8 h-full font-plus-jakarta flex flex-col gap-4 group overflow-hidden relative shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <FiZap className="text-[#EF4444] w-5 h-5 animate-pulse" />
        <h2 className="text-xl font-black text-white tracking-tight uppercase">AI Follow-up Suggestions</h2>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        {suggestions.map((sug, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/[0.02] border border-white/[0.03] rounded-[24px] hover:border-[#EF444420] transition-all gap-6 shadow-lg group/card hover:scale-[1.02]">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-[#EF444430] blur-[12px] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <img src={sug.avatar} alt={sug.name} className="w-14 h-14 rounded-full border border-white/5 group-hover/card:border-[#EF444440] transition-colors relative z-10" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center text-white z-20 shadow-xl">
                  <FiUser className="w-3 h-3" />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-black text-white tracking-tight group-hover/card:text-[#EF4444] transition-colors">{sug.name}</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mt-1">{sug.detail}</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-[#E50000] hover:bg-[#CC0000] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#EF444420] active:scale-95 whitespace-nowrap">
              Generate Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIFollowupSuggestions;
