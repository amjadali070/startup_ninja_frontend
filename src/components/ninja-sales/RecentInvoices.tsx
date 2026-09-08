import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiClock, FiDownload, FiSend, FiCheckCircle, FiInbox } from "react-icons/fi";
import type { Invoice } from "../../services/ninjaSales";

interface RecentInvoicesProps {
  invoices: Invoice[];
  onDownloadPdf: (id: string) => void;
  onSend: (id: string) => void;
  onMarkPaid: (id: string) => void;
}

const formatMoney = (value: number, currency?: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(value || 0);
  } catch {
    return `${currency || 'USD'} ${(value || 0).toLocaleString()}`;
  }
};

const RecentInvoices: FC<RecentInvoicesProps> = ({ invoices, onDownloadPdf, onSend, onMarkPaid }) => {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PAID": return "text-emerald-500 bg-emerald-500/10";
      case "SENT": return "text-red-500 bg-red-500/10";
      case "OVERDUE": return "text-orange-400 bg-orange-500/10";
      case "CANCELLED": return "text-white/30 bg-white/5 line-through";
      case "DRAFT": return "text-white/40 bg-white/5";
      default: return "";
    }
  };

  const openDoc = (id: string) => navigate(`/ai-tools/sales/documents/invoice/${id}`);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-black text-white/90 uppercase tracking-widest">Recent Invoices</h2>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
          <FiInbox className="w-8 h-8 text-white/10 mb-3" />
          <p className="text-sm font-bold text-white/25">No invoices yet</p>
          <p className="text-xs text-white/15 mt-1">Click "New Invoice" above to generate your first one.</p>
        </div>
      ) : (
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
            {invoices.map((inv) => (
              <tr key={inv._id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all cursor-pointer" onClick={() => openDoc(inv._id)}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-white/20" />
                    <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                      {inv.projectTitle}
                      <span className="ml-2 text-[10px] font-black text-white/30 tracking-widest">{inv.reference}</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-400">{inv.clientName}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${getStatusStyle(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-white tracking-tight">
                    {formatMoney(inv.total, inv.currency)}
                  </span>
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onDownloadPdf(inv._id)} className="text-white/20 hover:text-white transition-colors" title="Download PDF">
                      <FiDownload />
                    </button>
                    <button onClick={() => onSend(inv._id)} className="text-white/20 hover:text-white transition-colors" title="Email to client">
                      <FiSend />
                    </button>
                    {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                      <button onClick={() => onMarkPaid(inv._id)} className="text-white/20 hover:text-emerald-500 transition-colors" title="Mark as paid">
                        <FiCheckCircle />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default RecentInvoices;
