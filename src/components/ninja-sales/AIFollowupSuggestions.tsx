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
    {
      name: "Elena Rodriguez",
      detail: "Inquiry: Enterprise Pricing",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },

  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-4 sm:p-6 h-full font-plus-jakarta flex flex-col gap-4 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <FiZap className="text-[#EF4444] w-5 h-5 flex-shrink-0 animate-pulse" />
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide leading-tight">
          AI Follow-up Suggestions
        </h2>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 sm:gap-4 min-w-0">
        {suggestions.map((sug, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 sm:p-5 bg-white/[0.03] border border-white/[0.04] rounded-2xl hover:border-[#EF444430] transition-all group/card min-w-0"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={sug.avatar}
                alt={sug.name}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/10 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center z-10 border-2 border-[#121212]">
                <FiUser className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            {/* Name + detail — min-w-0 here is critical */}
            <div className="flex flex-col min-w-0 flex-1">
              <h4 className="text-sm font-black text-white truncate group-hover/card:text-[#EF4444] transition-colors">
                {sug.name}
              </h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate mt-0.5">
                {sug.detail}
              </p>
            </div>

            {/* Button — flex-shrink-0 stops it from being squished */}
            <button className="flex-shrink-0 px-3 sm:px-4 py-2.5 bg-[#E50000] hover:bg-[#CC0000] text-white rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap">
              Generate Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIFollowupSuggestions;