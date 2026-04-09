import { type FC } from "react";

const ProfitLossSnapshot: FC = () => {
  const data = [
    {
      category: "Total Revenue",
      lastMonth: "$154,200",
      currentMonth: "$168,000",
      variance: "+8.9%",
      varianceColor: "text-[#10B981]",
      forecast: "$185k",
      highlight: true,
    },
    {
      category: "Cost of Goods (COGS)",
      lastMonth: "$12,100",
      currentMonth: "$13,500",
      variance: "+11.5%",
      varianceColor: "text-[#EF4444]",
      forecast: "$14k",
    },
    {
      category: "Operating Expenses",
      lastMonth: "$82,000",
      currentMonth: "$84,200",
      variance: "+2.6%",
      varianceColor: "text-amber-500",
      forecast: "$88k",
    },
    {
      category: "Net Profit/Loss",
      lastMonth: "$60,100",
      currentMonth: "$70,300",
      variance: "+16.9%",
      varianceColor: "text-[#10B981]",
      forecast: "$83k",
      highlight: true,
    },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 lg:p-10 font-plus-jakarta h-full flex flex-col gap-10">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          Profit & Loss Snapshot
        </h3>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Actuals</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Projected</span>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto px-2">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.03] text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pb-8">
              <th className="pb-6 px-4">CATEGORY</th>
              <th className="pb-6 px-4">LAST MONTH</th>
              <th className="pb-6 px-4 text-center">CURRENT MONTH</th>
              <th className="pb-6 px-4 text-center">VARIANCE</th>
              <th className="pb-6 px-4 text-right">FORECAST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {data.map((item) => (
              <tr key={item.category} className="group hover:bg-white/[0.01] transition-all">
                <td className="py-6 px-4">
                  <span className={`text-[13px] font-black tracking-tight ${item.highlight ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {item.category}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="text-sm font-bold text-gray-500 tabular-nums">{item.lastMonth}</span>
                </td>
                <td className="py-6 px-4 text-center">
                  <span className="text-sm font-black text-white tabular-nums">{item.currentMonth}</span>
                </td>
                <td className="py-6 px-4 text-center">
                  <span className={`text-[12px] font-black tracking-tighter tabular-nums ${item.varianceColor}`}>
                    {item.variance}
                  </span>
                </td>
                <td className="py-6 px-4 text-right">
                   <span className="text-sm font-bold text-gray-500 tabular-nums">{item.forecast}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitLossSnapshot;
