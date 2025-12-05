import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiXCircle, FiDollarSign, FiActivity, FiTrendingUp, FiEdit3, FiTrash2, FiX, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { adminService } from "../../services/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const BalanceHistory: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { provider } = useParams<{ provider: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCredit, setEditingCredit] = useState<any>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const providerName = provider === "openai" ? "OpenAI" : "Gemini";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const fetchBalanceHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getAPIBalanceHistory(providerName);

      if (response.success && response.data) {
        setHistoryData(response.data);
      } else {
        setError(response.message || "Failed to fetch balance history");
      }
    } catch (err: any) {
      console.error("Error fetching balance history:", err);
      setError(err.message || "Failed to fetch balance history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceHistory();
  }, [provider]);

  const handleEditClick = (credit: any) => {
    setEditingCredit(credit);
    setEditAmount(credit.creditAmount.toString());
    setEditNotes(credit.notes || "");
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    try {
      setSubmitting(true);
      const response = await adminService.updateAPIBalanceCredit(
        editingCredit._id,
        {
          creditAmount: parseFloat(editAmount),
          notes: editNotes,
        }
      );

      if (response.success) {
        toast.success("Credit updated successfully!");
        setShowEditModal(false);
        setEditingCredit(null);
        await fetchBalanceHistory();
      } else {
        toast.error(response.message || "Failed to update credit");
      }
    } catch (error: any) {
      console.error("Error updating credit:", error);
      toast.error("Failed to update credit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (credit: any) => {
    if (!confirm(`Are you sure you want to delete this credit of $${credit.creditAmount.toFixed(2)}? This action will mark it as deleted and exclude it from calculations.`)) {
      return;
    }

    try {
      const response = await adminService.deleteAPIBalanceCredit(credit._id);

      if (response.success) {
        toast.success("Credit deleted successfully!");
        await fetchBalanceHistory();
      } else {
        toast.error(response.message || "Failed to delete credit");
      }
    } catch (error: any) {
      console.error("Error deleting credit:", error);
      toast.error("Failed to delete credit");
    }
  };

  const handleToggleActive = async (credit: any) => {
    const newStatus = !credit.isActive;
    const action = newStatus ? "activate" : "deactivate";

    if (!confirm(`Are you sure you want to ${action} this credit of $${credit.creditAmount.toFixed(2)}?`)) {
      return;
    }

    try {
      const response = await adminService.updateAPIBalanceCredit(
        credit._id,
        {
          isActive: newStatus,
        }
      );

      if (response.success) {
        toast.success(`Credit ${action}d successfully!`);
        await fetchBalanceHistory();
      } else {
        toast.error(response.message || `Failed to ${action} credit`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing credit:`, error);
      toast.error(`Failed to ${action} credit`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${styles[status as keyof typeof styles] || styles.inactive}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout
        activePath="/admin-dashboard/api-management"
        title={`${providerName} Balance History`}
        onLogout={handleLogout}
        onSettings={handleOpenSettings}
      >
        <main className="flex-1 overflow-y-auto">
          <LoadingSpinner fullscreen variant="dark" />
        </main>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        activePath="/admin-dashboard/api-management"
        title={`${providerName} Balance History`}
        onLogout={handleLogout}
        onSettings={handleOpenSettings}
      >
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-red-400 text-lg">Error: {error}</div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  };

  const hasCredits = historyData && historyData.credits && historyData.credits.length > 0;

  return (
    <DashboardLayout
      activePath="/admin-dashboard/api-management"
      title={`${providerName} Balance History`}
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin-dashboard/api-management")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft className="h-5 w-5" />
              Back to API Management
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{providerName} Balance History</h1>
            <p className="text-sm text-white/60">Comprehensive report of all balance credits and usage</p>
          </div>

          {!hasCredits ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-[#242424] bg-[#1A1A1A] p-12">
              <FiCalendar className="h-16 w-16 text-gray-500 mb-4" />
              <div className="text-gray-400 text-xl mb-2">No balance credits added yet</div>
              <div className="text-gray-500 text-sm mb-6">Start by adding your first balance credit</div>
              <button
                onClick={() => navigate("/admin-dashboard/api-management")}
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all"
              >
                Add Credit
              </button>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                      <FiDollarSign className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Total Credits Added</div>
                      <div className="text-2xl font-bold text-green-400">
                        ${historyData.summary.totalCredit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                      <FiTrendingUp className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Total Used</div>
                      <div className="text-2xl font-bold text-red-400">
                        ${historyData.summary.totalUsed.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                      <FiDollarSign className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Remaining Balance</div>
                      <div className="text-2xl font-bold text-white">
                        ${historyData.summary.totalRemaining.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                      <FiActivity className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Active Credits</div>
                      <div className="text-2xl font-bold text-white">
                        {historyData.summary.activeCredits}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credits Table */}
              <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] overflow-hidden">
                <div className="p-6 border-b border-[#242424]">
                  <h2 className="text-xl font-bold text-white">Credit History</h2>
                  <p className="text-sm text-gray-400 mt-1">Detailed breakdown of all balance credits</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0D0D0D] border-b border-[#242424]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">Date Added</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">Credit Amount</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">Used</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">Remaining</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">Usage %</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">Requests</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80">Tokens</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80">Status</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                      {historyData.credits.map((credit: any) => {
                        const usagePercent = (credit.usedAmount / credit.creditAmount) * 100;
                        const isDeleted = credit.isDeleted || credit.status === "deleted";
                        
                        return (
                          <tr key={credit._id} className={`hover:bg-[#151515] transition-colors ${isDeleted ? 'opacity-50' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="text-sm text-white font-medium">{formatDate(credit.addedAt)}</div>
                              {credit.notes && (
                                <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">{credit.notes}</div>
                              )}
                              {credit.addedBy && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Added by: {credit.addedBy.username || credit.addedBy.email}
                                </div>
                              )}
                              {credit.updatedBy && (
                                <div className="text-xs text-blue-400/80 mt-1">
                                  Updated by: {credit.updatedBy.username || credit.updatedBy.email}
                                </div>
                              )}
                              {credit.deletedBy && (
                                <div className="text-xs text-orange-400/80 mt-1">
                                  Deleted by: {credit.deletedBy.username || credit.deletedBy.email} on {formatDate(credit.deletedAt)}
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
                              {getStatusBadge(credit.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {!isDeleted && (
                                  <>
                                    <button
                                      onClick={() => handleEditClick(credit)}
                                      className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all"
                                      title="Edit credit"
                                    >
                                      <FiEdit3 className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(credit)}
                                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                                      title="Delete credit"
                                    >
                                      <FiTrash2 className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleActive(credit)}
                                      className={`p-2 rounded-lg transition-all ${
                                        credit.isActive
                                          ? 'text-yellow-400 hover:bg-yellow-500/20'
                                          : 'text-green-400 hover:bg-green-500/20'
                                      }`}
                                      title={credit.isActive ? "Deactivate credit" : "Activate credit"}
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
            </>
          )}
        </div>
      </main>

      {/* Edit Credit Modal */}
      {showEditModal && editingCredit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 rounded-2xl border border-[#242424] bg-[#1A1A1A] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Credit</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-[#0D0D0D] hover:text-white transition-all"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Credit Amount (USD)
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="Enter amount (e.g., 100.00)"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes about this credit..."
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#242424] text-gray-300 hover:bg-[#0D0D0D] transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={submitting || !editAmount || parseFloat(editAmount) <= 0}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Updating..." : "Update Credit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BalanceHistory;
