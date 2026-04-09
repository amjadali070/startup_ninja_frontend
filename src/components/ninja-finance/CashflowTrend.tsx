import { type FC } from "react";
import { FiChevronDown } from "react-icons/fi";

const CashflowTrend: FC = () => {
  const months = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 35 },
    { name: "Apr", value: 85 },
    { name: "May", value: 100, highlight: true },
    { name: "Jun", value: 55 },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 lg:p-8 font-plus-jakarta h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          Cashflow Trend
        </h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-md text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
          Last 6 Months
          <FiChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 flex items-end justify-between gap-4 min-h-[180px] lg:min-h-[220px] px-2">
        {months.map((month) => (
          <div key={month.name} className="flex-1 flex flex-col items-center gap-4 group">
            <div className="relative w-full flex items-end justify-center h-[200px]">
               {/* Bar background (track) */}
               <div className="absolute inset-x-2 md:inset-x-4 inset-y-0 bg-white/[0.02] rounded-t-lg transition-all" />
               
               {/* Actual Bar */}
               <div 
                 className={`absolute inset-x-2 md:inset-x-4 bottom-0 opacity-80 group-hover:opacity-100 transition-all rounded-t-lg ${
                   month.highlight ? "bg-[#EF4444]" : "bg-white/10"
                 }`}
                 style={{ height: `${month.value}%` }}
               >
                 {/* Visual effect for the highlighed bar */}
                 {month.highlight && (
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                 )}
               </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">
              {month.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashflowTrend;
