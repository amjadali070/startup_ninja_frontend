import { type FC, useState, useEffect } from "react";
import { FiBarChart2, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { ninjaLegalService, ActiveContractListItem, ContractDetails } from "../../services/ninja-legal";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalContracts: number;
  totalPages: number;
}

interface ActiveContractsListProps {
  onViewContract?: (contractData: ContractDetails) => void;
}

const ActiveContractsList: FC<ActiveContractsListProps> = ({ onViewContract }) => {
  const [contracts, setContracts] = useState<ActiveContractListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 4,
    totalContracts: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingContractId, setLoadingContractId] = useState<string | null>(null);

  const fetchActiveExpiryContracts = async (page: number) => {
    try {
      setLoading(true);
      const response = await ninjaLegalService.listActiveExpiryContracts(page);
      
      if (response.success && response.data) {
        setContracts(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message || "Failed to fetch active expiry contracts");
      }
    } catch (error) {
      toast.error("Failed to fetch active expiry contracts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveExpiryContracts(1);
  }, []);

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      fetchActiveExpiryContracts(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchActiveExpiryContracts(pagination.currentPage + 1);
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
      console.error(error);
    } finally {
      setLoadingContractId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { text: "text-red-400", dot: "bg-red-400" };
      case "high":
        return { text: "text-orange-400", dot: "bg-orange-400" };
      case "medium":
        return { text: "text-yellow-400", dot: "bg-yellow-400" };
      case "low":
        return { text: "text-green-400", dot: "bg-green-400" };
      default:
        return { text: "text-gray-400", dot: "bg-gray-400" };
    }
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

  const getStatusColor = (status: string, expiryDate: string) => {
    if (isExpired(expiryDate)) {
      return { text: "text-red-400", dot: "bg-red-400", label: "EXPIRED" };
    }
    if (isExpiringWithin90Days(expiryDate)) {
      return { text: "text-yellow-400", dot: "bg-yellow-400", label: "EXPIRING" };
    }
    if (status === "active") {
      return { text: "text-green-400", dot: "bg-green-400", label: "ACTIVE" };
    }
    return { text: "text-red-400", dot: "bg-red-400", label: "INACTIVE" };
  };

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-6 flex flex-col gap-6 h-full font-plus-jakarta">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="text-[#dc2626] bg-[#dc262610] p-2 rounded-lg border border-[#dc262620]">
            <FiBarChart2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white tracking-widest uppercase text-xs">
            Active Expiry Contracts
          </h3>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="small" />
        </div>
      ) : contracts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest pb-4">
                <th className="pb-3 px-2">CONTRACT</th>
                <th className="pb-3 px-2">PRIORITY</th>
                <th className="pb-3 px-2 text-center">STATUS</th>
                <th className="pb-3 px-2 text-center">GENERATION</th>
                <th className="pb-3 px-2 text-right">VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contracts.map((contract) => {
                const priorityColors = getPriorityColor(contract.priority);
                const statusColors = getStatusColor(contract.contractStatus, contract.expiryDate);
                return (
                  <tr
                    key={contract.contractId}
                    onClick={() => handleViewContractDetails(contract.contractId)}
                    className={`group cursor-pointer hover:bg-white/5 transition-all ${loadingContractId === contract.contractId ? "opacity-50" : ""}`}
                  >
                    <td className="py-4 px-2">
                      <span className="text-xs font-bold text-white group-hover:text-[#dc2626] transition-colors line-clamp-1">
                        {contract.contractTitle}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`text-[10px] font-bold ${priorityColors.text}`}>
                        {contract.priority.charAt(0).toUpperCase() + contract.priority.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {loadingContractId === contract.contractId ? (
                          <FiLoader className="w-3 h-3 animate-spin text-[#dc2626]" />
                        ) : (
                          <div className={`w-1 h-1 rounded-full ${statusColors.dot}`} />
                        )}
                        <span className={`text-[10px] font-bold ${statusColors.text}`}>{statusColors.label}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      {contract.isReadyForGeneration ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-green-400 text-xs font-bold">✓ Ready</span>
                        </div>
                      ) : null}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-xs font-bold text-white">
                        {contract.contractWorth ? `$${parseInt(contract.contractWorth).toLocaleString()}` : "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <p className="text-xs font-medium">No active contracts found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 1}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveContractsList;
