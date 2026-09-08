import { type FC, useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import RecentInvoices from "../../../components/ninja-sales/RecentInvoices";
import GenerateDocModal from "../../../components/ninja-sales/GenerateDocModal";
import { FiTrendingUp, FiTarget, FiClock, FiPlus, FiDollarSign } from "react-icons/fi";
import { ninjaSalesService, Invoice } from "../../../services/ninjaSales";

const InvoicesPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    const res = await ninjaSalesService.getInvoices({ page, limit, status: statusFilter || undefined });
    if (res.success) {
      setInvoices(res.data);
      setTotal(res.pagination?.total || res.data.length);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { loadInvoices(); }, [loadInvoices]);

  const handleDownloadPdf = async (id: string) => {
    const res = await ninjaSalesService.downloadInvoicePdf(id);
    if (!res.success || !res.blob) {
      toast.error(res.message || "Failed to download PDF");
      return;
    }
    const url = URL.createObjectURL(res.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.filename || `invoice_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (id: string) => {
    const res = await ninjaSalesService.sendInvoice(id);
    if (res.success) {
      toast.success(res.message || "Invoice sent");
      await loadInvoices();
    } else {
      toast.error(res.message || "Failed to send invoice");
    }
  };

  const handleMarkPaid = async (id: string) => {
    const res = await ninjaSalesService.markInvoicePaid(id);
    if (res.success) {
      toast.success("Invoice marked as paid");
      await loadInvoices();
    } else {
      toast.error(res.message || "Failed to mark invoice as paid");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Sales logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => navigate("/settings");

  const handleGenerateConfirm = async (payload: any) => {
    setGenerating(true);
    try {
      const res = await ninjaSalesService.generateInvoiceFromProject(payload.projectId, payload);
      if (res.success) {
        toast.success("Invoice generated");
        setIsGenerateModalOpen(false);
        await loadInvoices();
        navigate(`/ai-tools/sales/documents/invoice/${res.data._id}`);
      } else {
        toast.error(res.message || "Failed to generate invoice");
      }
    } finally {
      setGenerating(false);
    }
  };

  const stats: StatItem[] = useMemo(() => {
    const paidTotal = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + (i.total || 0), 0);
    const outstandingTotal = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((s, i) => s + (i.total || 0), 0);
    const overdueCount = invoices.filter((i) => i.status === "OVERDUE").length;
    const paidCount = invoices.filter((i) => i.status === "PAID").length;
    return [
      { label: "Total Invoices", value: String(total), icon: <FiTrendingUp />, change: `${paidCount} paid`, isPositive: true },
      { label: "Paid (This Page)", value: `$${Math.round(paidTotal).toLocaleString()}`, icon: <FiDollarSign />, change: "Collected", isPositive: true },
      { label: "Outstanding", value: `$${Math.round(outstandingTotal).toLocaleString()}`, icon: <FiClock />, change: "Sent, not yet paid", isPositive: outstandingTotal === 0 },
      { label: "Overdue", value: String(overdueCount), icon: <FiTarget />, warning: overdueCount > 0, change: overdueCount > 0 ? "Needs follow-up" : "All clear" },
    ];
  }, [invoices, total]);

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/invoices"
      title="Invoices - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-12 max-w-auto mx-auto text-white pb-20">

          <NinjaSalesHeader
            title="Invoices"
            subtitle="Generate, send and collect payment on your invoices."
            newButtonText="New Invoice"
            newButtonIcon={<FiPlus className="h-4 w-4" />}
            onNewDeal={() => setIsGenerateModalOpen(true)}
          />

          <SalesStatGrid stats={stats} />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/40"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-16 text-center text-white/40">Loading invoices...</div>
            ) : (
              <RecentInvoices
                invoices={invoices}
                onDownloadPdf={handleDownloadPdf}
                onSend={handleSend}
                onMarkPaid={handleMarkPaid}
              />
            )}

            {total > limit && (
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.06] text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Prev
                </button>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Page {page} / {Math.ceil(total / limit)}
                </span>
                <button
                  onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
                  disabled={page * limit >= total}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.06] text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <GenerateDocModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        defaultType="INVOICE"
        onConfirm={handleGenerateConfirm}
        isSubmitting={generating}
      />
    </DashboardLayout>
  );
};

export default InvoicesPage;
