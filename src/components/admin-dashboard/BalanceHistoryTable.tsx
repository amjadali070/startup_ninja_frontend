import React from "react";
import {
  FiEdit3,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

interface BalanceCredit {
  _id: string;
  creditAmount: number;
  usedAmount: number;
  remainingAmount: number;
  requestsUsed: number;
  tokensUsed: number;
  status: string;
  addedAt: string;
  notes?: string;
  addedBy?: {
    username?: string;
    email: string;
  };
  updatedBy?: {
    username?: string;
    email: string;
  };
  deletedBy?: {
    username?: string;
    email: string;
  };
  deletedAt?: string;
  isDeleted?: boolean;
  isActive: boolean;
}

interface BalanceHistoryTableProps {
  credits: BalanceCredit[];
  onEdit: (credit: BalanceCredit) => void;
  onDelete: (credit: BalanceCredit) => void;
  onToggleActive: (credit: BalanceCredit) => void;
}

const BalanceHistoryTable: React.FC<BalanceHistoryTableProps> = ({
  credits,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (credit: BalanceCredit) => {
    // Priority: deleted > isActive false > depleted > active
    let displayStatus = credit.status;

    if (credit.isDeleted || credit.status === "deleted") {
      displayStatus = "deleted";
    } else if (!credit.isActive) {
      displayStatus = "inactive";
    }

    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      depleted: "bg-red-500/20 text-red-400 border-red-500/30",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      updated: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      deleted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };

    const icons = {
      active: <FiCheckCircle className="h-3 w-3" />,
      depleted: <FiXCircle className="h-3 w-3" />,
      inactive: <FiXCircle className="h-3 w-3" />,
      updated: <FiEdit3 className="h-3 w-3" />,
      deleted: <FiTrash2 className="h-3 w-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${
          styles[displayStatus as keyof typeof styles] || styles.inactive
        }`}
      >
        {icons[displayStatus as keyof typeof icons]}
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] overflow-hidden">
      <div className="p-6 border-b border-[#242424]">
        <h2 className="text-xl font-bold text-white">Credit History</h2>
        <p className="text-sm text-gray-400 mt-1">
          Detailed breakdown of all balance credits
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0D0D0D] border-b border-[#242424]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                Date Added
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">
                Credit Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">
                Used
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">
                Remaining
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">
                Usage %
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">
                Requests
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">
                Tokens
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-white/80">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-white/80">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {credits.map((credit) => {
              const usagePercent =
                (credit.usedAmount / credit.creditAmount) * 100;
              const isDeleted = credit.isDeleted || credit.status === "deleted";

              return (
                <tr
                  key={credit._id}
                  className={`hover:bg-[#151515] transition-colors ${
                    isDeleted ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium">
                      {formatDate(credit.addedAt)}
                    </div>
                    {credit.notes && (
                      <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                        {credit.notes}
                      </div>
                    )}
                    {credit.addedBy && (
                      <div className="text-xs text-gray-500 mt-1">
                        Added by:{" "}
                        {credit.addedBy.username || credit.addedBy.email}
                      </div>
                    )}
                    {credit.updatedBy && (
                      <div className="text-xs text-blue-400/80 mt-1">
                        Updated by:{" "}
                        {credit.updatedBy.username || credit.updatedBy.email}
                      </div>
                    )}
                    {credit.deletedBy && (
                      <div className="text-xs text-orange-400/80 mt-1">
                        Deleted by:{" "}
                        {credit.deletedBy.username || credit.deletedBy.email} on{" "}
                        {formatDate(credit.deletedAt!)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-semibold text-green-400">
                      +${credit.creditAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-red-400">
                      ${credit.usedAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-semibold text-white">
                      ${credit.remainingAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-white/80">
                      {usagePercent.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-white/80">
                      {credit.requestsUsed.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-white/80">
                      {(credit.tokensUsed / 1000).toFixed(1)}K
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(credit)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {!isDeleted && (
                        <>
                          <button
                            onClick={() => onEdit(credit)}
                            className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all"
                            title="Edit credit"
                          >
                            <FiEdit3 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onDelete(credit)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                            title="Delete credit"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onToggleActive(credit)}
                            className={`p-2 rounded-lg transition-all ${
                              credit.isActive
                                ? "text-yellow-400 hover:bg-yellow-500/20"
                                : "text-green-400 hover:bg-green-500/20"
                            }`}
                            title={
                              credit.isActive
                                ? "Deactivate credit"
                                : "Activate credit"
                            }
                          >
                            {credit.isActive ? (
                              <FiToggleRight className="h-5 w-5" />
                            ) : (
                              <FiToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                        </>
                      )}
                      {isDeleted && (
                        <span className="text-xs text-gray-500">Deleted</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceHistoryTable;
