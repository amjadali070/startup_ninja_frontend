import { type FC } from "react";
import { FiShield } from "react-icons/fi";

const ComplianceMonitor: FC = () => {
  const complianceItems = [
    {
      title: "GDPR Assessment",
      subtitle: "Last checked: 3 hours ago",
      status: "PASSING",
      statusColor: "text-[#10B981] bg-[#10B98110] border-[#10B98120]", // Success green for passing
    },
    {
      title: "SOC2 Type II",
      subtitle: "Monitoring continuous controls",
      status: "ACTIVE",
      statusColor: "text-[#EF4444] bg-[#EF444410] border-[#EF444420]", // Theme red for active
    },
    {
      title: "HIPAA Baseline",
      subtitle: "Self-assessment in progress",
      status: "PENDING",
      statusColor: "text-gray-400 bg-white/5 border-white/10", // Gray for pending
    },
  ];

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-6 flex flex-col gap-6 h-full font-plus-jakarta">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#EF4444] bg-[#EF444410] p-2 rounded-lg border border-[#EF444420]">
            <FiShield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white tracking-widest uppercase text-xs">
            COMPLIANCE MONITOR
          </h3>
        </div>
        <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          VIEW AUDIT LOGS
        </button>
      </div>

      <div className="space-y-3">
        {complianceItems.map((item, index) => (
          <div
            key={item.title}
            className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-xl group hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-1.5 h-1.5 rounded-full ${index === 0 ? "bg-[#10B981]" : index === 1 ? "bg-[#EF4444]" : "bg-white/40"
                  }`}
              />
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                <p className="text-[10px] text-gray-500">{item.subtitle}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${item.statusColor}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceMonitor;
