import { type FC } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FiSearch, FiFilter, FiDownload, FiExternalLink, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const AllContracts: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const contracts = [
    { id: 1, company: "GlobalTech Inc", type: "MSA", status: "Active", date: "2024-03-20", value: "$120k" },
    { id: 2, company: "Venture Capital X", type: "SAFE", status: "Pending", date: "2024-03-18", value: "$2.5M" },
    { id: 3, company: "CloudScale LLC", type: "Service Agr.", status: "Expiring", date: "2024-03-15", value: "$15k" },
    { id: 4, company: "TechNova Solutions", type: "Employment", status: "Active", date: "2024-03-12", value: "$85k" },
    { id: 5, company: "DataFlow Systems", type: "NDA", status: "Closed", date: "2024-02-28", value: "$0" },
    { id: 6, company: "BioHealth Group", type: "IP Transfer", status: "Active", date: "2024-02-15", value: "$500k" },
  ];

  return (
    <DashboardLayout onLogout={logout}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#0D0D0D]">
        <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto text-white min-h-screen">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase">All Contracts</h1>
              <p className="text-gray-500 text-sm mt-1 font-bold uppercase tracking-widest leading-loose">
                Repository of all generated legal documents and active agreements
              </p>
            </div>
            <button 
              onClick={() => navigate("/ai-tools/legal")}
              className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 uppercase tracking-wider flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              New Contract
            </button>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EF4444] transition-colors" />
              <input 
                type="text"
                placeholder="Search by company, type, or status..."
                className="w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#EF444420] transition-all"
              />
            </div>
            <div className="md:col-span-4 flex gap-4">
              <button className="flex-1 bg-[#121212] border border-white/5 rounded-2xl px-6 flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-gray-400">
                <FiFilter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex-1 bg-[#121212] border border-white/5 rounded-2xl px-6 flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-gray-400">
                Export Data
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.03] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <th className="py-6 px-8">Company</th>
                    <th className="py-6 px-6">Type</th>
                    <th className="py-6 px-6">Status</th>
                    <th className="py-6 px-6">Date Generated</th>
                    <th className="py-6 px-6">Value</th>
                    <th className="py-6 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 px-8">
                        <span className="text-sm font-black text-white group-hover:text-[#EF4444] transition-colors tracking-tight">{contract.company}</span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{contract.type}</span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            contract.status === "Active" ? "bg-[#10B981]" : 
                            contract.status === "Pending" ? "bg-white" : 
                            "bg-amber-500"
                          }`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            contract.status === "Active" ? "text-[#10B981]" : 
                            contract.status === "Pending" ? "text-gray-400" : 
                            "text-amber-500"
                          }`}>{contract.status}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-sm font-medium text-gray-500">{contract.date}</span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-sm font-black text-white">{contract.value}</span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5">
                            <FiDownload className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5">
                            <FiExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AllContracts;
