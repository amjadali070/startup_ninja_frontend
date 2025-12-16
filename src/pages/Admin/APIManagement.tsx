import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { SiOpenai, SiGoogle } from "react-icons/si";
import { FiCode } from "react-icons/fi";
import { adminService } from "../../services/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import APIProviderCard from "../../components/admin-dashboard/APIProviderCard";
import AddCreditModal from "../../components/admin-dashboard/AddCreditModal";

const APIManagement: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openaiData, setOpenaiData] = useState<any>(null);
  const [geminiData, setGeminiData] = useState<any>(null);
  const [openaiHistory, setOpenaiHistory] = useState<any>(null);
  const [geminiHistory, setGeminiHistory] = useState<any>(null);
  const [grapesjsHistory, setGrapesjsHistory] = useState<any>(null);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<
    "OpenAI" | "Gemini" | "GrapesJS"
  >("OpenAI");

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

      // Fetch OpenAI, Gemini, and GrapesJS data
      const [
        openaiBalanceRes,
        openaiUsageRes,
        openaiHistoryRes,
        geminiHistoryRes,
        grapesjsHistoryRes,
      ] = await Promise.all([
        adminService.getOpenAIBalance(),
        adminService.getOpenAIUsage(),
        adminService.getAPIBalanceHistory("OpenAI"),
        adminService.getAPIBalanceHistory("Gemini"),
        adminService.getAPIBalanceHistory("GrapesJS"),
      ]);

      // OpenAI data
      if (openaiBalanceRes.success && openaiBalanceRes.data) {
        const balance = openaiBalanceRes.data;
        const usage =
          openaiUsageRes.success && openaiUsageRes.data
            ? openaiUsageRes.data
            : null;

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

      // GrapesJS data
      if (grapesjsHistoryRes.success && grapesjsHistoryRes.data) {
        setGrapesjsHistory(grapesjsHistoryRes.data);
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

  const handleAddCredit = async (
    provider: "OpenAI" | "Gemini" | "GrapesJS",
    amount: number,
    notes: string
  ) => {
    try {
      const response = await adminService.addAPIBalanceCredit(
        provider,
        amount,
        notes
      );

      if (response.success) {
        toast.success(`${provider} balance credit added successfully!`);
        await fetchAPIData();
      } else {
        toast.error(response.message || "Failed to add credit");
      }
    } catch (error: any) {
      console.error("Error adding credit:", error);
      toast.error("Failed to add credit");
      throw error;
    }
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
      status: (geminiData?.status || "active") as
        | "active"
        | "inactive"
        | "error",
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
      usedBalance: openaiData?.totalCost || 0,
      balance: Math.max(0, (openaiHistory?.summary?.totalCredit || 0) - (openaiData?.totalCost || 0)),
      currency: openaiData?.currency || "USD",
      status: (openaiData?.status || "active") as
        | "active"
        | "inactive"
        | "error",
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
    {
      id: "grapesjs",
      name: "GrapesJS" as const,
      icon: FiCode,
      totalBalance: grapesjsHistory?.summary?.totalCredit || 0,
      usedBalance: grapesjsHistory?.summary?.totalUsed || 0,
      balance: grapesjsHistory?.summary?.totalRemaining || 0,
      currency: "USD",
      status: "active" as "active" | "inactive" | "error",
      totalRequests: 0,
      totalTokens: 0,
      requestsToday: 0,
      tokensToday: 0,
      costToday: 0,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      creditsCount: grapesjsHistory?.credits?.length || 0,
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
            <h1 className="text-2xl font-bold text-white mb-2">
              API Management
            </h1>
            <p className="text-sm text-white/60">
              Monitor and manage your API usage and balances
            </p>
          </div>

          {/* API Provider Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {apiProviders.map((provider) => (
              <APIProviderCard
                key={provider.id}
                {...provider}
                onAddCredit={(providerName) => {
                  setSelectedProvider(providerName);
                  setShowAddCreditModal(true);
                }}
              />
            ))}
          </div>


        </div>
      </main>

      {/* Add Credit Modal */}
      <AddCreditModal
        isOpen={showAddCreditModal}
        provider={selectedProvider}
        onClose={() => setShowAddCreditModal(false)}
        onSubmit={handleAddCredit}
      />
    </DashboardLayout>
  );
};

export default APIManagement;
