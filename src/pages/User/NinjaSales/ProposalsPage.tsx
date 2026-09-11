import { type FC, useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import SavedTemplates from "../../../components/ninja-sales/SavedTemplates";
import RecentProposals from "../../../components/ninja-sales/RecentProposals";
import GenerateDocModal from "../../../components/ninja-sales/GenerateDocModal";
import { FiTrendingUp, FiTarget, FiEdit3, FiZap, FiPlus, FiFilter, FiSend, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import { ninjaSalesService, Proposal } from "../../../services/ninjaSales";
import IconSelect from "../../../components/IconSelect";

const ProposalsPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const loadProposals = useCallback(async () => {
    setLoading(true);
    const res = await ninjaSalesService.getProposals({ page, limit, status: statusFilter || undefined });
    if (res.success) {
      setProposals(res.data);
      setTotal(res.pagination?.total || res.data.length);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { loadProposals(); }, [loadProposals]);

  const handleDownloadPdf = async (id: string) => {
    const res = await ninjaSalesService.downloadProposalPdf(id);
    if (!res.success || !res.blob) {
      toast.error(res.message || "Failed to download PDF");
      return;
    }
    const url = URL.createObjectURL(res.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.filename || `proposal_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (id: string) => {
    const res = await ninjaSalesService.sendProposal(id);
    if (res.success) {
      toast.success(res.message || "Proposal sent");
      await loadProposals();
    } else {
      toast.error(res.message || "Failed to send proposal");
    }
  };

  const handleConvertToInvoice = async (id: string) => {
    const res = await ninjaSalesService.convertProposalToInvoice(id);
    if (res.success) {
      toast.success("Invoice generated from proposal");
      await loadProposals();
    } else {
      toast.error(res.message || "Failed to generate invoice");
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
      const res = await ninjaSalesService.generateProposalFromProject(payload.projectId, payload);
      if (res.success) {
        toast.success("Proposal generated");
        setIsGenerateModalOpen(false);
        await loadProposals();
        navigate(`/ai-tools/sales/documents/proposal/${res.data._id}`);
      } else {
        toast.error(res.message || "Failed to generate proposal");
      }
    } finally {
      setGenerating(false);
    }
  };

  const stats: StatItem[] = useMemo(() => {
    const activeCount = proposals.filter((p) => p.status !== "CANCELLED").length;
    const avgValue = proposals.length > 0 ? proposals.reduce((s, p) => s + (p.total || 0), 0) / proposals.length : 0;
    const draftCount = proposals.filter((p) => p.status === "DRAFT").length;
    const decided = proposals.filter((p) => p.status === "PAID" || p.status === "CANCELLED").length;
    const won = proposals.filter((p) => p.status === "PAID").length;
    const conversionRate = decided > 0 ? Math.round((won / decided) * 100) : 0;
    return [
      { label: "Total Proposals", value: String(total), icon: <FiEdit3 />, change: `${activeCount} not cancelled`, isPositive: true },
      { label: "Avg. Deal Value", value: `$${Math.round(avgValue).toLocaleString()}`, icon: <FiTrendingUp />, change: "This page", isPositive: true },
      { label: "Drafts", value: String(draftCount), icon: <FiZap />, change: "Not yet sent", isPositive: true },
      { label: "Conversion Rate", value: `${conversionRate}%`, icon: <FiTarget />, change: `${won} of ${decided} decided`, isPositive: true },
    ];
  }, [proposals, total]);

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/proposals"
      title="Proposals - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-12 max-w-auto mx-auto text-white pb-20">

          <NinjaSalesHeader
            title="Proposals"
            subtitle="Generate, send and track proposals for your deals."
            newButtonText="New Proposal"
            newButtonIcon={<FiPlus className="h-4 w-4" />}
            onNewDeal={() => setIsGenerateModalOpen(true)}
          />

          <SalesStatGrid stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-0">
            <div className="xl:col-span-4">
              <SavedTemplates />
            </div>
            <div className="xl:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <IconSelect
                  value={statusFilter}
                  onChange={(v) => { setStatusFilter(v); setPage(1); }}
                  className="bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/40"
                  options={[
                    { value: "", label: "All Statuses", icon: <FiFilter className="w-4 h-4" /> },
                    { value: "DRAFT", label: "Draft", icon: <FiEdit3 className="w-4 h-4" /> },
                    { value: "SENT", label: "Sent", icon: <FiSend className="w-4 h-4" /> },
                    { value: "PAID", label: "Paid", icon: <FiCheckCircle className="w-4 h-4" /> },
                    { value: "OVERDUE", label: "Overdue", icon: <FiAlertTriangle className="w-4 h-4" /> },
                    { value: "CANCELLED", label: "Cancelled", icon: <FiXCircle className="w-4 h-4" /> },
                  ]}
                />
              </div>

              {loading ? (
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-16 text-center text-white/40">Loading proposals...</div>
              ) : (
                <RecentProposals
                  proposals={proposals}
                  onDownloadPdf={handleDownloadPdf}
                  onSend={handleSend}
                  onConvertToInvoice={handleConvertToInvoice}
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

        </div>
      </main>

      <GenerateDocModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        defaultType="PROPOSAL"
        onConfirm={handleGenerateConfirm}
        isSubmitting={generating}
      />
    </DashboardLayout>
  );
};

export default ProposalsPage;
