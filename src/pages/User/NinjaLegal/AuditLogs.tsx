import { type FC } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FiCheckCircle, FiShield, FiAlertTriangle, FiArrowLeft, FiRefreshCcw, FiLayers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const AuditLogs: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const auditLogs = [
    { id: 1, event: "GDPR Compliance Scan", status: "Passed", date: "2024-03-20 14:30", type: "Privacy", icon: <FiShield className="text-green-400" /> },
    { id: 2, event: "SOC2 Control Check", status: "Passed", date: "2024-03-20 12:15", type: "Security", icon: <FiCheckCircle className="text-green-400" /> },
    { id: 3, event: "HIPAA Preliminary Audit", status: "Pending", date: "2024-03-19 16:45", type: "Regulatory", icon: <FiLayers className="text-[#EF4444]" /> },
    { id: 4, event: "IP Indemnification Review", status: "Warning", date: "2024-03-19 10:20", type: "Legal Strategy", icon: <FiAlertTriangle className="text-amber-500" /> },
    { id: 5, event: "CCPA Policy Generation", status: "Passed", date: "2024-03-18 09:10", type: "Privacy", icon: <FiCheckCircle className="text-green-400" /> },
  ];

  return (
    <DashboardLayout onLogout={logout}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#0D0D0D]">
        <div className="p-6 lg:p-10 space-y-8 max-w-[1200px] mx-auto text-white min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/ai-tools/legal")}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight uppercase">Compliance Audit Logs</h1>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  History of all automated compliance checks and strategic legal audits.
                </p>
              </div>
            </div>
            <button className="px-6 py-3 bg-[#EF444410] hover:bg-[#EF444420] text-[#EF4444] border border-[#EF444420] rounded-xl font-black text-xs transition-all flex items-center gap-2 uppercase tracking-wider">
              <FiRefreshCcw className="w-4 h-4" />
              Re-run All Scans
            </button>
          </div>

          {/* Timeline Style Logs */}
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div 
                key={log.id}
                className="bg-[#121212] border border-white/[0.03] p-6 rounded-3xl flex items-center justify-between group hover:border-[#EF444420] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/[0.05] group-hover:bg-[#EF444410] group-hover:border-[#EF444420] transition-all">
                    {log.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-black text-white group-hover:text-[#EF4444] transition-colors">{log.event}</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-white/5 rounded-full text-gray-500 uppercase tracking-widest leading-loose">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{log.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                      log.status === "Passed" ? "text-[#10B981]" : 
                      log.status === "Warning" ? "text-amber-500" : 
                      "text-[#EF4444]"
                    }`}>{log.status}</p>
                    <div className="flex justify-end gap-1">
                      <div className={`w-1 h-1 rounded-full ${
                        log.status === "Passed" ? "bg-[#10B981]" : 
                        log.status === "Warning" ? "bg-amber-500" : 
                        "bg-[#EF4444]"
                      }`} />
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AuditLogs;
