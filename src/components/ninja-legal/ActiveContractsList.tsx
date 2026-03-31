import { type FC } from "react";
import { FiBarChart2 } from "react-icons/fi";

const ActiveContractsList: FC = () => {
  const contracts = [
    {
      company: "GlobalTech Inc",
      type: "MSA",
      status: "Active",
      statusColor: "text-[#EF4444]",
      dotColor: "bg-[#EF4444]",
      value: "$120k",
    },
    {
      company: "Venture Capital X",
      type: "SAFE",
      status: "Pending",
      statusColor: "text-gray-400",
      dotColor: "bg-white",
      value: "$2.5M",
    },
    {
      company: "CloudScale LLC",
      type: "Service Agr.",
      status: "Expiring",
      statusColor: "text-amber-500",
      dotColor: "bg-amber-500",
      value: "$15k",
    },
    {
      company: "TechNova Solutions",
      type: "Employment",
      status: "Active",
      statusColor: "text-[#EF4444]",
      dotColor: "bg-[#EF4444]",
      value: "$85k",
    },
  ];

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-6 flex flex-col gap-6 h-full font-plus-jakarta">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="text-[#EF4444] bg-[#EF444410] p-2 rounded-lg border border-[#EF444420]">
            <FiBarChart2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white tracking-widest uppercase text-xs">
            ACTIVE CONTRACTS
          </h3>
        </div>
        <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          VIEW ALL
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest pb-4">
              <th className="pb-3 px-2">COMPANY</th>
              <th className="pb-3 px-2">TYPE</th>
              <th className="pb-3 px-2 text-center">STATUS</th>
              <th className="pb-3 px-2 text-right">VALUE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {contracts.map((item) => (
              <tr key={item.company} className="group hover:bg-white/5 transition-all">
                <td className="py-4 px-2">
                  <span className="text-xs font-bold text-white group-hover:text-[#EF4444] transition-colors">{item.company}</span>
                </td>
                <td className="py-4 px-2">
                  <span className="text-[10px] font-medium text-gray-500">{item.type}</span>
                </td>
                <td className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${item.dotColor}`} />
                    <span className={`text-[10px] font-bold ${item.statusColor}`}>{item.status}</span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-xs font-bold text-white">{item.value}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveContractsList;
