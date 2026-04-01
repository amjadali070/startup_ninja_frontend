import { type FC } from "react";
import { FiTrendingUp } from "react-icons/fi";

const RevenueForecast: FC = () => {
  const forecastData = [
    { month: "SEPT", value: 35, isEst: false },
    { month: "OCT", value: 45, isEst: false },
    { month: "NOV (EST)", value: 85, isEst: true },
    { month: "DEC", value: 55, isEst: false },
    { month: "JAN", value: 40, isEst: false },
  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-[32px] p-8 h-full font-plus-jakarta flex flex-col gap-8 group overflow-hidden relative shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <FiTrendingUp className="text-[#EF4444] w-5 h-5" />
        <h2 className="text-xl font-black text-white tracking-tight uppercase">Revenue Forecast</h2>
      </div>

      <div className="flex-1 flex items-end justify-between gap-4 py-4 min-h-[220px]">
        {forecastData.map((data, i) => (
          <div key={i} className="flex flex-col items-center gap-6 flex-1 h-full justify-end group/bar">
            {data.isEst && (
              <span className="text-[10px] font-black text-[#EF4444] uppercase tracking-widest bg-[#EF444415] px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity">$850k</span>
            )}
            <div className="relative w-full flex-1 flex flex-col justify-end">
              <div 
                className={`w-full rounded-2xl transition-all duration-1000 ease-out border border-white/5 shadow-lg group-hover/bar:brightness-110 active:scale-95 cursor-pointer ${data.isEst ? 'bg-[#EF4444] shadow-[0_0_24px_rgba(239,68,68,0.3)]' : 'bg-white/[0.03] group-hover/bar:bg-white/[0.05]'}`}
                style={{ height: `${data.value}%` }}
              />
              {data.isEst && (
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#EF444420] to-[#EF444410] blur-xl" />
              )}
            </div>
            <span 
              className={`text-[10px] font-black uppercase tracking-widest ${data.isEst ? "text-[#EF4444]" : "text-gray-500"}`}
            >
              {data.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueForecast;
