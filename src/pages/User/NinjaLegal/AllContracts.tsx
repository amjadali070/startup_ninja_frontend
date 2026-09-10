import { type FC, useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FiSearch, FiExternalLink, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import {
  ninjaLegalService,
  ContractListItem,
  ContractDetails,
  PaginationInfo,
  documentTypeLabel,
} from "../../../services/ninja-legal";
import ViewContractModal from "../../../components/ninja-legal/ViewContractModal";
import LegalPageBanner from "../../../components/ninja-legal/LegalPageBanner";
import LoadingSpinner from "../../../components/LoadingSpinner";

const STATUS_FILTERS: { id: "all" | "active" | "inactive"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

// A calendar date picked in a date input (stored as UTC midnight) has no real
// time-of-day — render its UTC components, not the viewer's local zone, or it
// can roll back a day for anyone west of UTC (e.g. "Dec 31" shows as "Dec 30").
const formatExpiryDate = (value?: string | null): string => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { timeZone: "UTC" });
};

const AllContracts: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ currentPage: 1, pageSize: 4, totalContracts: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingContractId, setLoadingContractId] = useState<string | null>(null);
  const [selectedContractData, setSelectedContractData] = useState<ContractDetails | undefined>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchContracts = useCallback(async (page: number) => {
    setLoading(true);
    const response = await ninjaLegalService.listContracts(page, statusFilter);
    if (response.success) {
      setContracts(response.data);
      setPagination(response.pagination);
    } else {
      toast.error(response.message || "Failed to fetch contracts");
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchContracts(1);
  }, [fetchContracts]);

  const handleViewContract = async (contractId: string) => {
    setLoadingContractId(contractId);
    const response = await ninjaLegalService.getContractDetails(contractId);
    setLoadingContractId(null);
    if (response.success && response.data) {
      setSelectedContractData(response.data);
      setIsViewModalOpen(true);
    } else {
      toast.error(response.message || "Failed to fetch contract details");
    }
  };

  // Search is applied to the currently-loaded page — the backend's listing endpoint doesn't
  // support full-text search, so this filters what's already fetched rather than pretending
  // to search across every contract.
  const visibleContracts = contracts.filter((c) => {
    if (!search.trim()) return true;
    const needle = search.trim().toLowerCase();
    return (
      c.contractTitle.toLowerCase().includes(needle) ||
      c.contractStatus.toLowerCase().includes(needle) ||
      c.priority.toLowerCase().includes(needle) ||
      documentTypeLabel(c.documentType).toLowerCase().includes(needle)
    );
  });

  return (
    <DashboardLayout
      activePath="/ai-tools/legal/all-contracts"
      title="All Contracts"
      onLogout={logout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-4">
          <div className="w-full max-w-auto mx-auto space-y-6 text-white pb-8">
          <LegalPageBanner
            title="All Contracts"
            subtitle="Repository of all generated legal documents and active agreements"
            action={{ label: "New Contract", onClick: () => navigate("/ai-tools/legal"), icon: <FiPlus className="w-4 h-4" /> }}
          />

          {/* Filters & Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EF4444] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search this page by title, status, priority, or document type..."
                className="w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#EF444420] transition-all"
              />
            </div>
            <div className="md:col-span-4 flex gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`flex-1 rounded-2xl px-4 py-4 flex items-center justify-center text-xs font-black uppercase tracking-widest transition-all border ${
                    statusFilter === f.id
                      ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
                      : "bg-[#121212] border-white/5 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.03] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <th className="py-6 px-8">Title</th>
                    <th className="py-6 px-6">Type</th>
                    <th className="py-6 px-6">Status</th>
                    <th className="py-6 px-6">Priority</th>
                    <th className="py-6 px-6">Expiry</th>
                    <th className="py-6 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : visibleContracts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
                        {contracts.length === 0 ? "No contracts found" : "No contracts match your search"}
                      </td>
                    </tr>
                  ) : (
                    visibleContracts.map((contract) => (
                      <tr key={contract.contractId} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6 px-8">
                          <span className="text-sm font-black text-white group-hover:text-[#EF4444] transition-colors tracking-tight">{contract.contractTitle}</span>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{documentTypeLabel(contract.documentType)}</span>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${contract.contractStatus === "active" ? "bg-[#10B981]" : "bg-gray-500"}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${contract.contractStatus === "active" ? "text-[#10B981]" : "text-gray-400"}`}>
                              {contract.contractStatus}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{contract.priority}</span>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-sm font-medium text-gray-500">
                            {formatExpiryDate(contract.expiryDate)}
                          </span>
                        </td>
                        <td className="py-6 px-8 text-right">
                          <button
                            onClick={() => handleViewContract(contract.contractId)}
                            disabled={loadingContractId === contract.contractId}
                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 disabled:opacity-50"
                            title="View contract"
                          >
                            {loadingContractId === contract.contractId ? (
                              <LoadingSpinner />
                            ) : (
                              <FiExternalLink className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-8 py-5 border-t border-white/[0.03]">
                <button
                  onClick={() => fetchContracts(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchContracts(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </main>

      <ViewContractModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContractData(undefined);
        }}
        contractData={selectedContractData}
        isLoading={false}
        onContractUpdated={() => fetchContracts(pagination.currentPage)}
        onContractDeleted={() => fetchContracts(pagination.currentPage)}
      />
    </DashboardLayout>
  );
};

export default AllContracts;
