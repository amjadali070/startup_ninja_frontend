import { type FC } from "react";
import { FiFileText, FiClock, FiDownload, FiSend, FiRepeat } from "react-icons/fi";
import type { Proposal } from "../../services/ninjaSales";

interface RecentProposalsProps {
  proposals: Proposal[];
  onDownloadPdf: (id: string) => void;
  onSend: (id: string) => void;
  onConvertToInvoice: (id: string) => void;
}

const RecentProposals: FC<RecentProposalsProps> = ({ proposals, onDownloadPdf, onSend, onConvertToInvoice }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PAID": return "text-emerald-500 bg-emerald-500/10";
      case "SENT": return "text-red-500 bg-red-500/10";
      case "DRAFT": return "text-white/40 bg-white/5";
      default: return "";
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-black text-white/90 uppercase tracking-widest">Recent Documents</h2>
        </div>
        <button className="text-xs text-white/40 hover:text-white transition-colors underline uppercase tracking-widest font-black">View All Activity</button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.03] bg-white/[0.01]">
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Document Name</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Client</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Value</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p._id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-white/20" />
                    <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                      {p.projectTitle}
                      <span className="ml-2 text-[10px] font-black text-white/30 tracking-widest">{p.reference}</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-400">{p.clientName}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${getStatusStyle(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-white tracking-tight">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.total || 0)}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onDownloadPdf(p._id)}
                      className="text-white/20 hover:text-white transition-colors"
                      title="Download PDF"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => onSend(p._id)}
                      className="text-white/20 hover:text-white transition-colors"
                      title="Mark as sent"
                    >
                      <FiSend />
                    </button>
                    {p.docType === "PROPOSAL" && (
                      <button
                        onClick={() => onConvertToInvoice(p._id)}
                        className="text-white/20 hover:text-white transition-colors"
                        title="Generate invoice from proposal"
                      >
                        <FiRepeat />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProposals;
