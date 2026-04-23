import { type FC, useState, useEffect } from "react";
import { FiFileText, FiChevronRight, FiInfo, FiLoader, FiChevronLeft, FiZap } from "react-icons/fi";
import { ninjaLegalService, ContractDetails } from "../../services/ninja-legal";
import { ContractListItem, PaginationInfo } from "../../services/ninja-legal";
import toast from "react-hot-toast";

interface ContractWithStatus extends ContractListItem {
  isReadyForGeneration?: boolean;
}

interface ContractGenerationProps {
  onViewContract?: (contractData: ContractDetails) => void;
}

const ContractGeneration: FC<ContractGenerationProps> = ({ onViewContract }) => {
  const [contracts, setContracts] = useState<ContractWithStatus[]>([]);
  const [loadingContractId, setLoadingContractId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 4,
    totalContracts: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchContracts = async (page: number) => {
    try {
      setLoading(true);
      const response = await ninjaLegalService.listContracts(page, statusFilter);
      
      if (response.success && response.data) {
        setContracts(response.data as ContractWithStatus[]);
        setPagination(response.pagination);
      } else {
        toast.error(response.message || "Failed to fetch contracts");
      }
    } catch (error) {
      toast.error("Failed to fetch contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts(1);
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    fetchContracts(1);
  }, [statusFilter]);

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      fetchContracts(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchContracts(pagination.currentPage + 1);
    }
  };

  const handleViewContractDetails = async (contractId: string) => {
    try {
      setLoadingContractId(contractId);
      const response = await ninjaLegalService.getContractDetails(contractId);
      
      if (response.success && response.data) {
        onViewContract?.(response.data);
      } else {
        toast.error(response.message || "Failed to fetch contract details");
      }
    } catch (error) {
      toast.error("Failed to fetch contract details");
    } finally {
      setLoadingContractId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (expiryDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const timeDiff = expiry.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const isExpiringWithin90Days = (expiryDate: string): boolean => {
    return getDaysRemaining(expiryDate) <= 90 && getDaysRemaining(expiryDate) > 0;
  };

  const isExpired = (expiryDate: string): boolean => {
    return getDaysRemaining(expiryDate) <= 0;
  };

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-6 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-[#dc2626] bg-[#dc262610] p-2 rounded-lg border border-[#dc262620]">
          <FiFileText className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-white tracking-widest uppercase text-xs">
          CONTRACTS
        </h3>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4 border-b border-white/[0.08]">
        <button
          onClick={() => setStatusFilter("all")}
          className={`pb-2 text-xs font-medium transition-all ${
            statusFilter === "all"
              ? "text-white border-b-2 border-[#dc2626]"
              : "text-gray-500 border-b-2 border-transparent hover:text-gray-400"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`pb-2 text-xs font-medium transition-all ${
            statusFilter === "active"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-500 border-b-2 border-transparent hover:text-gray-400"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("inactive")}
          className={`pb-2 text-xs font-medium transition-all ${
            statusFilter === "inactive"
              ? "text-red-400 border-b-2 border-red-400"
              : "text-gray-500 border-b-2 border-transparent hover:text-gray-400"
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Contracts List - Fixed height for 4 contracts */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <FiLoader className="w-5 h-5 animate-spin text-[#dc2626]" />
            </div>
          ) : contracts.length > 0 ? (
            contracts.map((contract) => (
              <button
                key={contract.contractId}
                onClick={() => handleViewContractDetails(contract.contractId)}
                disabled={loadingContractId === contract.contractId}
                className="w-full group flex items-center justify-between p-3 bg-gradient-to-r from-white/[0.02] to-white/[0.01] hover:from-white/[0.06] hover:to-white/[0.03] border border-white/[0.08] hover:border-[#dc2626]/40 rounded-xl transition-all text-left backdrop-blur-sm disabled:opacity-50"
              >
                <div className="flex-1 min-w-0">
                  {/* Contract Title */}
                  <h4 className="text-xs font-bold text-white mb-2 group-hover:text-[#dc2626] transition-colors line-clamp-1">
                    {contract.contractTitle}
                  </h4>
                  
                  {/* Badges Row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Status Badge */}
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                        contract.contractStatus === "active"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {contract.contractStatus === "active" ? "●" : "○"} {contract.contractStatus.toUpperCase()}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-md border transition-all ${getPriorityColor(
                        contract.priority
                      )}`}
                    >
                      {contract.priority.toUpperCase()}
                    </span>

                    {/* Generation Ready Badge */}
                    {contract.isReadyForGeneration ? (
                      <span className="flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-md border bg-green-500/20 text-green-400 border-green-500/40">
                        <FiZap className="w-2.5 h-2.5" />
                        READY
                      </span>
                    ) : null}

                    {isExpired(contract.expiryDate) && (
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-md border bg-red-500/20 text-red-400 border-red-500/40">
                        ❌ EXPIRED
                      </span>
                    )}

                    {isExpiringWithin90Days(contract.expiryDate) && (
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-md border bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse">
                        ⚠️ EXPIRING SOON
                      </span>
                    )}

                    {/* Expiry Date */}
                    <span className="text-[8px] text-gray-500 font-semibold ml-auto whitespace-nowrap">
                      {formatDate(contract.expiryDate)}
                    </span>
                  </div>
                </div>

                {/* Chevron Icon */}
                <div className="ml-2 flex-shrink-0">
                  {loadingContractId === contract.contractId ? (
                    <FiLoader className="w-3.5 h-3.5 text-[#dc2626] animate-spin" />
                  ) : (
                    <FiChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#dc2626] group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-xs font-medium">No contracts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/[0.05]">
          <button
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: pagination.totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => fetchContracts(index + 1)}
                className={`w-5 h-5 text-[9px] font-bold rounded-lg transition-all ${
                  pagination.currentPage === index + 1
                    ? "bg-[#dc2626] text-white scale-100"
                    : "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Pro Tip */}
      <div className="bg-gradient-to-r from-amber-500/[0.05] to-orange-500/[0.05] border border-amber-500/[0.2] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
            <FiInfo className="w-2.5 h-2.5 text-amber-400" />
          </div>
          <p className="text-[9px] font-bold text-amber-400 tracking-[0.15em] uppercase">
            Tip
          </p>
        </div>
        <p className="text-[10px] leading-5 text-gray-400 font-medium">
          View full details, manage parties & track compliance by clicking any contract.
        </p>
      </div>
    </div>
  );
};

export default ContractGeneration;
