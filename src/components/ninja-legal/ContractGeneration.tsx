import { type FC } from "react";
import { FiFileText, FiChevronRight, FiInfo } from "react-icons/fi";

const ContractGeneration: FC = () => {
  const contractTypes = [
    { title: "Founder Agreement", subtitle: "Vesting schedules & IP transfer" },
    { title: "Standard NDA", subtitle: "Mutual non-disclosure protocol" },
    { title: "Service Agreement", subtitle: "Contractor & Vendor templates" },
    { title: "Privacy Policy", subtitle: "GDPR & CCPA compliant draft" },
  ];

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-6 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-[#dc2626] bg-[#dc262610] p-2 rounded-lg border border-[#dc262620]">
          <FiFileText className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-white tracking-widest uppercase text-xs">
          CONTRACT GENERATION
        </h3>
      </div>

      {/* Contract List */}
      <div className="flex flex-col gap-3 flex-1">
        {contractTypes.map((type) => (
          <button
            key={type.title}
            className="group flex items-center justify-between p-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] rounded-2xl transition-all text-left"
          >
            <div>
              <h4 className="text-sm font-black text-white mb-1 group-hover:text-[#dc2626] transition-colors">{type.title}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{type.subtitle}</p>
            </div>
            <FiChevronRight className="w-4 h-4 text-white-600 group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="bg-[#dc2626]/[0.03] border border-[#dc2626]/[0.1] rounded-2xl p-5 space-y-3 mt-auto">
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
             <FiInfo className="w-3 h-3 text-amber-500" />
           </div>
           <p className="text-[10px] font-black text-amber-500 tracking-[0.2em] uppercase">PRO TIP</p>
        </div>
        <p className="text-[11px] leading-6 text-gray-500 font-medium tracking-tight">
          Generated documents are automatically synced with your Cloud Storage and Ninja compliance monitor.
        </p>
      </div>
    </div>
  );
};

export default ContractGeneration;
