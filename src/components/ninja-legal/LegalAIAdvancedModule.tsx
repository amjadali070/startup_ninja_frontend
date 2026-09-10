import { type FC } from "react";
import { HiLightningBolt } from "react-icons/hi";
import { Link } from "react-router-dom";

interface LegalAIAdvancedModuleProps {
  onNewContract: () => void;
}
const LegalAIAdvancedModule: FC<LegalAIAdvancedModuleProps> = ({ onNewContract }) => {
  return (
    <div className="relative w-full h-auto md:h-[340px] overflow-hidden rounded-[24px] border border-white/5 bg-[#121212] flex flex-col md:flex-row group font-plus-jakarta">
      {/* Content Side */}
      <div className="flex-1 p-6 lg:p-10 z-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <HiLightningBolt className="text-[#dc2626] w-4 h-4" />
          <span className="text-[10px] font-bold text-[#dc2626] tracking-widest uppercase">
            ADVANCED MODULE
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
          Strengthen Legal Integrity with <br />
          <span className="text-white">Ninja Legal AI</span>
        </h2>

        <p className="text-sm font-medium text-gray-400 mb-8 max-w-lg leading-relaxed">
          The ultimate founder's weapon for navigating the complexities of corporate law.
          Automate the mundane, master the strategic, and protect your startup's future.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            className="px-6 py-3 bg-[#dc2626] hover:bg-[#DC2626] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#dc262620] active:scale-95"
            onClick={onNewContract}
          >
            Draft New Contract
          </button>
          <Link to="/ai-tools/legal/generate" className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95">
            Contract Generation
          </Link>
          <Link to="/ai-tools/legal/analyze" className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95">
            Analyze a Contract
          </Link>
          <Link to="/ai-tools/legal/compare" className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95">
            Compare Contracts
          </Link>
        </div>
      </div>

      {/* Image Side */}
      <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 md:hidden" />
        <img
          src="/images/legal-ai-bg.png"
          alt="Ninja Legal AI Abstract"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LegalAIAdvancedModule;
