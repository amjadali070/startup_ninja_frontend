import { type FC } from "react";
import { FiTrendingUp } from "react-icons/fi";

const BudgetVsActual: FC = () => {
  const budgets = [
    { label: "R&D / Product", value: 110, color: "bg-[#EF4444]" },
    { label: "G&A / Operations", value: 82, color: "bg-white/40" },
    { label: "Sales & Marketing", value: 65, color: "bg-white/10" },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 lg:p-8 font-plus-jakarta h-full flex flex-col gap-8">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          Budget vs Actual
        </h3>
        <FiTrendingUp className="w-4 h-4 text-gray-500" />
      </div>

      <div className="flex-1 space-y-10 px-2 flex flex-col justify-center pb-4">
        {budgets.map((budget) => (
          <div key={budget.label} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {budget.label}
              </h4>
              <span className={`text-[11px] font-black tracking-tighter ${budget.value > 100 ? 'text-[#EF4444]' : 'text-white'}`}>
                {budget.value}%
              </span>
            </div>
            
            {/* Progress Bar Track */}
            <div className="relative h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
               <div 
                 className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 delay-200 ${budget.color}`}
                 style={{ width: `${Math.min(budget.value, 100)}%` }}
               />
               {budget.value > 100 && (
                 <div className="absolute inset-y-0 right-0 w-2 bg-[#EF4444] animate-pulse" />
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetVsActual;
