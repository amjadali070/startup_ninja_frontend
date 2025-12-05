import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FiDollarSign, FiActivity, FiTrendingUp, FiAlertCircle, FiPlus, FiX, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { SiOpenai, SiGoogle } from "react-icons/si";
import { adminService } from "../../services/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const APIManagement: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openaiData, setOpenaiData] = useState<any>(null);
  const [geminiData, setGeminiData] = useState<any>(null);
  const [openaiHistory, setOpenaiHistory] = useState<any>(null);
  const [geminiHistory, setGeminiHistory] = useState<any>(null);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"OpenAI" | "Gemini">("OpenAI");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNotes, setCreditNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const fetchAPIData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both OpenAI and Gemini data
      const [
        openaiBalanceRes,
        openaiUsageRes,
        openaiHistoryRes,
        geminiHistoryRes,
      ] = await Promise.all([
        adminService.getOpenAIBalance(),
        adminService.getOpenAIUsage(),
        adminService.getAPIBalanceHistory("OpenAI"),
        adminService.getAPIBalanceHistory("Gemini"),
      ]);

      // OpenAI data
      if (openaiBalanceRes.success && openaiBalanceRes.data) {
        const balance = openaiBalanceRes.data;
        const usage = openaiUsageRes.success && openaiUsageRes.data ? openaiUsageRes.data : null;

        setOpenaiData({
          ...balance,
          ...usage,
        });
      }

      if (openaiHistoryRes.success && openaiHistoryRes.data) {
        setOpenaiHistory(openaiHistoryRes.data);
      }

      // Gemini data
      if (geminiHistoryRes.success && geminiHistoryRes.data) {
        setGeminiHistory(geminiHistoryRes.data);
        // Set gemini data from history
        const historyData = geminiHistoryRes.data as any;
        setGeminiData({
          totalBalance: historyData.summary?.totalCredit || 0,
          usedBalance: historyData.summary?.totalUsed || 0,
          currentBalance: historyData.summary?.totalRemaining || 0,
          currency: "USD",
          status: "active",
        });
      }
    } catch (err: any) {
      console.error("Error fetching API data:", err);
      setError(err.message || "Failed to fetch API data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIData();
  }, []);

  const handleAddCredit = async () => {
    if (!creditAmount || parseFloat(creditAmount) <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    try {
      setSubmitting(true);
      const response = await adminService.addAPIBalanceCredit(
        selectedProvider,
        parseFloat(creditAmount),
        creditNotes
      );

      if (response.success) {
        toast.success(`${selectedProvider} balance credit added successfully!`);
        setShowAddCreditModal(false);
        setCreditAmount("");
        setCreditNotes("");
        await fetchAPIData();
      } else {
        toast.error(response.message || "Failed to add credit");
      }
    } catch (error: any) {
      console.error("Error adding credit:", error);
      toast.error("Failed to add credit");
    } finally {
      setSubmitting(false);
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
    };

    const icons = {
      active: <FiCheckCircle className="h-3 w-3" />,
      depleted: <FiXCircle className="h-3 w-3" />,
      inactive: <FiXCircle className="h-3 w-3" />,
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
        title="API Management"
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
        title="API Management"
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

  const apiProviders = [
    {
      id: "gemini",
      name: "Google Gemini" as const,
      icon: SiGoogle,
      totalBalance: geminiHistory?.summary?.totalCredit || 0,
      usedBalance: geminiHistory?.summary?.totalUsed || 0,
      balance: geminiHistory?.summary?.totalRemaining || 0,
      currency: "USD",
      status: (geminiData?.status || "active") as "active" | "inactive" | "error",
      totalRequests: 0,
      totalTokens: 0,
      requestsToday: 0,
      tokensToday: 0,
      costToday: 0,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      creditsCount: geminiHistory?.credits?.length || 0,
    },
    {
      id: "openai",
      name: "OpenAI" as const,
      icon: SiOpenai,
      totalBalance: openaiHistory?.summary?.totalCredit || 0,
      usedBalance: openaiHistory?.summary?.totalUsed || 0,
      balance: openaiHistory?.summary?.totalRemaining || 0,
      currency: openaiData?.currency || "USD",
      status: (openaiData?.status || "active") as "active" | "inactive" | "error",
      totalRequests: openaiData?.totalRequests || 0,
      totalTokens: openaiData?.totalTokens || 0,
      requestsToday: openaiData?.requestsToday || 0,
      tokensToday: openaiData?.tokensToday || 0,
      costToday: openaiData?.costToday || 0,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      creditsCount: openaiHistory?.credits?.length || 0,
    },
  ];

  return (
    <DashboardLayout
      activePath="/admin-dashboard/api-management"
      title="API Management"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">API Management</h1>
            <p className="text-sm text-white/60">Monitor and manage your API usage and balances</p>
          </div>

          {/* API Provider Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {apiProviders.map((provider) => {
              const Icon = provider.icon;
              const providerId = provider.id === "openai" ? "OpenAI" : "Gemini";
              
              return (
                <div
                  key={provider.id}
                  className="relative overflow-hidden rounded-xl border border-[#242424] bg-[#1A1A1A] p-6 transition-all duration-300 hover:bg-[#151515]"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${provider.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2 w-2 rounded-full ${provider.status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                          <span className="text-xs text-gray-400 capitalize">{provider.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Remaining Balance</div>
                          <div className="text-2xl font-bold text-white">
                            ${provider.balance.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          of ${provider.totalBalance.toFixed(2)} total
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        setSelectedProvider(providerId);
                        setShowAddCreditModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-all duration-200 text-sm font-medium"
                    >
                      <FiPlus className="h-4 w-4" />
                      Add Credit
                    </button>
                    <button
                      onClick={() => navigate(`/admin-dashboard/balance-history/${provider.id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#242424] text-gray-300 hover:bg-[#151515] transition-all duration-200 text-sm font-medium"
                    >
                      <FiCalendar className="h-4 w-4" />
                      View History ({provider.creditsCount})
                    </button>
                  </div>

                  {/* Balance Progress Bar */}
                  {provider.totalBalance > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Balance Usage</span>
                        <span>{((provider.usedBalance / provider.totalBalance) * 100).toFixed(1)}% used</span>
                      </div>
                      <div className="relative h-2 rounded-full bg-[#0D0D0D] overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${provider.color} transition-all duration-500`}
                          style={{ width: `${Math.min((provider.usedBalance / provider.totalBalance) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>Used: ${provider.usedBalance.toFixed(2)}</span>
                        <span>Remaining: ${provider.balance.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg bg-[#0D0D0D] p-3 border border-[#242424]">
                      <div className="flex items-center gap-2 mb-1">
                        <FiActivity className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Total Requests</span>
                      </div>
                      <div className="text-lg font-semibold text-white">{provider.totalRequests.toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg bg-[#0D0D0D] p-3 border border-[#242424]">
                      <div className="flex items-center gap-2 mb-1">
                        <FiTrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Total Tokens</span>
                      </div>
                      <div className="text-lg font-semibold text-white">{(provider.totalTokens / 1000000).toFixed(2)}M</div>
                    </div>
                  </div>

                  {/* Today's Usage */}
                  <div className="rounded-lg bg-[#0D0D0D] p-4 border border-[#242424]">
                    <div className="text-xs font-semibold text-gray-300 mb-3">Today's Usage</div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Requests</div>
                        <div className="text-sm font-semibold text-white">{provider.requestsToday}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Tokens</div>
                        <div className="text-sm font-semibold text-white">{(provider.tokensToday / 1000).toFixed(1)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Cost</div>
                        <div className="text-sm font-semibold text-white">${provider.costToday.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <FiDollarSign className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-white/60">Total Balance</div>
                  <div className="text-xl font-bold text-white">
                    ${(apiProviders.reduce((sum, p) => sum + p.balance, 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                  <FiActivity className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-white/60">Today's Requests</div>
                  <div className="text-xl font-bold text-white">
                    {apiProviders.reduce((sum, p) => sum + p.requestsToday, 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <div className="text-xs text-white/60">Today's Cost</div>
                  <div className="text-xl font-bold text-white">
                    ${apiProviders.reduce((sum, p) => sum + p.costToday, 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Credit Modal */}
      {showAddCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 rounded-2xl border border-[#242424] bg-[#1A1A1A] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add {selectedProvider} Credit</h2>
              <button
                onClick={() => setShowAddCreditModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-[#0D0D0D] hover:text-white transition-all"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credit Amount (USD)
                </label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="Enter amount (e.g., 100.00)"
                  className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] border border-[#242424] text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-all"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={creditNotes}
                  onChange={(e) => setCreditNotes(e.target.value)}
                  placeholder="Add notes about this credit..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] border border-[#242424] text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-all resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddCreditModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#242424] text-gray-300 hover:bg-[#0D0D0D] transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCredit}
                  disabled={submitting || !creditAmount || parseFloat(creditAmount) <= 0}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding..." : "Add Credit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D15] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedProvider} Balance History</h2>
                <p className="text-sm text-white/60 mt-1">Track your credit additions and usage over time</p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {(() => {
              const history = selectedProvider === "OpenAI" ? openaiHistory : geminiHistory;
              
              if (!history || !history.credits || history.credits.length === 0) {
                return (
                  <div className="p-12 text-center">
                    <div className="text-white/60 text-lg">No balance credits added yet</div>
                    <div className="text-white/40 text-sm mt-2">Click "Add Credit" to add your first balance credit</div>
                  </div>
                );
              }

              return (
                <>
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/5">
                    <div>
                      <div className="text-xs text-white/60 mb-1">Total Credits Added</div>
                      <div className="text-2xl font-bold text-green-400">
                        ${history.summary.totalCredit.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">Total Used</div>
                      <div className="text-2xl font-bold text-red-400">
                        ${history.summary.totalUsed.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">Remaining Balance</div>
                      <div className="text-2xl font-bold text-white">
                        ${history.summary.totalRemaining.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#0D0D15] border-b border-white/10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-white/80">Date Added</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-white/80">Credit Amount</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-white/80">Used</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-white/80">Remaining</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-white/80">Requests</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-white/80">Tokens</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-white/80">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {history.credits.map((credit: any) => (
                          <tr key={credit._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm text-white">{formatDate(credit.addedAt)}</div>
                              {credit.notes && (
                                <div className="text-xs text-white/60 mt-1">{credit.notes}</div>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default APIManagement;
