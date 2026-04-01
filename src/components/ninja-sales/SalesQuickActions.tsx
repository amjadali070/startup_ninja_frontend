import { type FC } from "react";
import { FiPlus, FiFileText, FiCreditCard } from "react-icons/fi";

const SalesQuickActions: FC = () => {
  const actions = [
    { label: "PROPOSAL", icon: <FiFileText className="w-5 h-5" /> },
    { label: "INVOICE", icon: <FiCreditCard className="w-5 h-5" /> },
    { label: "NEW LEAD", icon: <FiPlus className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <h2 className="text-xl font-black text-white tracking-tight uppercase px-2 mb-2">Quick Actions</h2>
      <div className="flex-1 flex flex-col gap-5">
        {actions.map((action, i) => (
          <button 
            key={i} 
            className="flex-1 group flex flex-col items-center justify-center gap-4 bg-[#121212] border border-white/[0.03] rounded-[32px] p-6 hover:bg-[#161616] hover:border-[#EF444420] transition-all shadow-xl active:scale-95"
          >
            <div className="bg-[#EF444410] p-4 rounded-2xl border border-[#EF444415] shadow-lg text-[#EF4444] transition-transform duration-300 group-hover:scale-110">
              {action.icon}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SalesQuickActions;
