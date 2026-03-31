import { type FC } from "react";

const ExpenseBreakdown: FC = () => {
  const categories = [
    { label: "Cloud / Infrastructure", value: "35%", color: "bg-[#EF4444]" },
    { label: "Payroll", value: "45%", color: "bg-white/40" },
    { label: "Marketing", value: "12%", color: "bg-white/10" },
    { label: "Operations", value: "8%", color: "bg-white/5" },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 lg:p-8 font-plus-jakarta h-full flex flex-col gap-8">
      <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">
        Expense Breakdown
      </h3>

      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 lg:w-56 lg:h-56">
          {/* Simple Donut Visualization using Conic Gradient */}
          <div 
            className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: `conic-gradient(
                #EF4444 0% 35%,
                rgba(255,255,255,0.4) 35% 80%,
                rgba(255,255,255,0.1) 80% 92%,
                rgba(255,255,255,0.05) 92% 100%
              )`
            }}
          >
            {/* Center Hole */}
            <div className="w-[82%] h-[82%] bg-[#121212] rounded-full flex flex-col items-center justify-center shadow-inner border border-white/5">
               <span className="text-3xl font-black text-white tracking-widest">$84k</span>
               <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Total Burn</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full px-4">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${cat.color} border border-white/5 shadow-sm`} />
              <div>
                <p className="text-[9px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">
                  {cat.label}
                </p>
                <p className="text-[10px] font-black text-white">
                  {cat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
