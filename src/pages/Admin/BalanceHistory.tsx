import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  FiArrowLeft,
  FiCalendar,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { adminService } from "../../services/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import BalanceSummaryCards from "../../components/admin-dashboard/BalanceSummaryCards";
import BalanceHistoryTable from "../../components/admin-dashboard/BalanceHistoryTable";
import EditCreditModal from "../../components/admin-dashboard/EditCreditModal";
import AlertModal from "../../components/admin-dashboard/AlertModal";

const BalanceHistory: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { provider } = useParams<{ provider: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCredit, setEditingCredit] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCredit, setDeletingCredit] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [togglingCredit, setTogglingCredit] = useState<any>(null);
  const [isToggling, setIsToggling] = useState(false);

  const getProviderName = (provider: string | undefined) => {
    switch (provider?.toLowerCase()) {
      case "openai":
        return "OpenAI";
      case "gemini":
        return "Gemini";
      case "grapesjs":
        return "GrapesJS";
      default:
        return provider || "Unknown";
    }
  };

  const providerName = getProviderName(provider);

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
    setShowEditModal(true);
  };

  const handleEditSubmit = async (
    creditId: string,
    updates: { creditAmount: number; notes: string }
  ) => {
    try {
      const response = await adminService.updateAPIBalanceCredit(
        creditId,
        updates
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
      throw error;
    }
  };

  const handleDeleteClick = async (credit: any) => {
    setDeletingCredit(credit);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCredit) return;

    try {
      setIsDeleting(true);
      const response = await adminService.deleteAPIBalanceCredit(
        deletingCredit._id
      );

      if (response.success) {
        toast.success("Credit deleted successfully!");
        setShowDeleteModal(false);
        setDeletingCredit(null);
        await fetchBalanceHistory();
      } else {
        toast.error(response.message || "Failed to delete credit");
      }
    } catch (error: any) {
      console.error("Error deleting credit:", error);
      toast.error("Failed to delete credit");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (credit: any) => {
    setTogglingCredit(credit);
    setShowToggleModal(true);
  };

  const handleToggleConfirm = async () => {
    if (!togglingCredit) return;

    const newStatus = !togglingCredit.isActive;

    try {
      setIsToggling(true);
      const response = await adminService.updateAPIBalanceCredit(
        togglingCredit._id,
        {
          isActive: newStatus,
        }
      );

      if (response.success) {
        const action = newStatus ? "activated" : "deactivated";
        toast.success(`Credit ${action} successfully!`);
        setShowToggleModal(false);
        setTogglingCredit(null);
        await fetchBalanceHistory();
      } else {
        toast.error(response.message || "Failed to update credit");
      }
    } catch (error: any) {
      console.error("Error updating credit:", error);
      toast.error("Failed to update credit");
    } finally {
      setIsToggling(false);
    }
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
  }

  const hasCredits =
    historyData && historyData.credits && historyData.credits.length > 0;

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
            <h1 className="text-3xl font-bold text-white mb-2">
              {providerName} Balance History
            </h1>
            <p className="text-sm text-white/60">
              Comprehensive report of all balance credits and usage
            </p>
          </div>

          {!hasCredits ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-[#242424] bg-[#1A1A1A] p-12">
              <FiCalendar className="h-16 w-16 text-gray-500 mb-4" />
              <div className="text-gray-400 text-xl mb-2">
                No balance credits added yet
              </div>
              <div className="text-gray-500 text-sm mb-6">
                Start by adding your first balance credit
              </div>
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
              <BalanceSummaryCards
                totalCredit={historyData.summary.totalCredit}
                totalUsed={historyData.summary.totalUsed}
                totalRemaining={historyData.summary.totalRemaining}
                activeCredits={historyData.summary.activeCredits}
              />

              {/* Credits Table */}
              <BalanceHistoryTable
                credits={historyData.credits}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onToggleActive={handleToggleActive}
              />
            </>
          )}
        </div>
      </main>

      {/* Edit Credit Modal */}
      <EditCreditModal
        isOpen={showEditModal}
        credit={editingCredit}
        onClose={() => {
          setShowEditModal(false);
          setEditingCredit(null);
        }}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Credit Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        type="danger"
        action="delete"
        title="Delete Credit"
        message={
          deletingCredit ? (
            <>
              Are you sure you want to delete the credit of{" "}
              <span className="font-semibold text-white">
                ${deletingCredit.creditAmount.toFixed(2)}
              </span>{" "}
              added on{" "}
              <span className="font-semibold text-white">
                {new Date(deletingCredit.addedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              ? This action will mark it as deleted and exclude it from
              calculations.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Credit"
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCredit(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        loadingText="Deleting..."
      />

      {/* Toggle Credit Modal */}
      <AlertModal
        isOpen={showToggleModal}
        type={togglingCredit?.isActive ? "warning" : "success"}
        action="toggle"
        title={`${togglingCredit?.isActive ? "Deactivate" : "Activate"} Credit`}
        message={
          togglingCredit ? (
            <>
              Are you sure you want to{" "}
              {togglingCredit.isActive ? "deactivate" : "activate"} the credit
              of{" "}
              <span className="font-semibold text-white">
                ${togglingCredit.creditAmount.toFixed(2)}
              </span>{" "}
              added on{" "}
              <span className="font-semibold text-white">
                {new Date(togglingCredit.addedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              ?{" "}
              {togglingCredit.isActive
                ? "This will exclude it from balance calculations."
                : "This will include it back in balance calculations."}
            </>
          ) : (
            ""
          )
        }
        confirmText={`${
          togglingCredit?.isActive ? "Deactivate" : "Activate"
        } Credit`}
        onClose={() => {
          setShowToggleModal(false);
          setTogglingCredit(null);
        }}
        onConfirm={handleToggleConfirm}
        isLoading={isToggling}
        loadingText={`${
          togglingCredit?.isActive ? "Deactivating" : "Activating"
        }...`}
        customIcon={
          togglingCredit?.isActive ? (
            <FiToggleLeft className="h-5 w-5" />
          ) : (
            <FiToggleRight className="h-5 w-5" />
          )
        }
      />
    </DashboardLayout>
  );
};

export default BalanceHistory;
