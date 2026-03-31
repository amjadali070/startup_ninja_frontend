import { type FC } from "react";
import { FiDownload, FiPlus } from "react-icons/fi";

interface NinjaFinanceHeaderProps {
  onConnectBank?: () => void;
  onExport?: () => void;
}

const NinjaFinanceHeader: FC<NinjaFinanceHeaderProps> = ({ onConnectBank, onExport }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 font-plus-jakarta">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Ninja Finance</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 leading-loose opacity-80">
          The Control Center • Real-time liquidity surveillance
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.05] rounded-xl transition-all font-black text-[10px] uppercase tracking-wider"
        >
          <FiDownload className="w-3.5 h-3.5" />
          Export CSV
        </button>
        <button
          onClick={onConnectBank}
          className="flex items-center gap-2 px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl transition-all shadow-lg shadow-[#EF444420] active:scale-95 font-black text-[10px] uppercase tracking-wider"
        >
          <FiPlus className="w-3.5 h-3.5" />
          Connect Bank
        </button>
      </div>
    </div>
  );
};

export default NinjaFinanceHeader;
