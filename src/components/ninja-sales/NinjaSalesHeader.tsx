import { type FC } from "react";
import { FiPlus, FiDownload } from "react-icons/fi";

interface NinjaSalesHeaderProps {
  onNewDeal?: () => void;
  onExport?: () => void;
}

const NinjaSalesHeader: FC<NinjaSalesHeaderProps> = ({ onNewDeal, onExport }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-[#121212] p-8 lg:p-10 border border-white/[0.03] shadow-2xl">
      {/* Background abstract effect */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#EF444408] to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Ninja Sales</h1>
            <div className="px-2.5 py-1 bg-[#EF444415] border border-[#EF444425] rounded-lg">
              <span className="text-[10px] font-black text-[#EF4444] uppercase tracking-widest">AI REVENUE ENGINE</span>
            </div>
          </div>
          <p className="text-gray-400 font-medium text-sm lg:text-base">The Revenue Engine — Accelerating your pipeline with predictive intelligence.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-2xl text-[11px] font-black text-gray-300 uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
          
          <button 
            onClick={onNewDeal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] hover:brightness-110 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_12px_32px_rgba(229,0,0,0.3)] active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default NinjaSalesHeader;
