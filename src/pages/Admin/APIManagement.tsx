import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { SiOpenai, SiGoogle } from "react-icons/si";
import { FiCode } from "react-icons/fi";
import { adminService } from "../../services/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import GenericProviderCard from "../../components/admin-dashboard/APIProviderCard";
import OpenAIProviderCard from "../../components/admin-dashboard/OpenAIProviderCard";
import GeminiProviderCard from "../../components/admin-dashboard/GeminiProviderCard";
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

  const [openAIDateRange, setOpenAIDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [geminiDateRange, setGeminiDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [openAILoading, setOpenAILoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  const fetchOpenAIUsage = async (start?: string, end?: string) => {
      setOpenAILoading(true);
      const startDateStr = start || openAIDateRange.startDate;
      const endDateStr = end || openAIDateRange.endDate;

      const startTime = Math.floor(new Date(startDateStr).getTime() / 1000);
      const endTime = Math.floor(new Date(endDateStr).setHours(23, 59, 59, 999) / 1000);

      try {
        const openaiUsageRes = await adminService.getOpenAIUsage({ startTime, endTime });

        if (openaiUsageRes.success && openaiUsageRes.data) {
             setOpenaiData((prev: any) => ({
                 ...prev,
                 ...openaiUsageRes.data,
             }));
        }
      } catch (err) {
        console.error("Failed to fetch specific OpenAI usage", err);
      } finally {
        setOpenAILoading(false);
      }
  };

  const fetchGeminiUsage = async (start?: string, end?: string) => {
      setGeminiLoading(true);
      const startDateStr = start || geminiDateRange.startDate;
      const endDateStr = end || geminiDateRange.endDate;

      const startTime = Math.floor(new Date(startDateStr).getTime() / 1000);
      const endTime = Math.floor(new Date(endDateStr).setHours(23, 59, 59, 999) / 1000);

      try {
        const geminiUsageRes = await adminService.getGeminiUsage({ startTime, endTime });

        if (geminiUsageRes.success && geminiUsageRes.data) {
             setGeminiData((prev: any) => ({
                 ...prev,
                 ...geminiUsageRes.data,
             }));
        }
      } catch (err) {
        console.error("Failed to fetch specific Gemini usage", err);
      } finally {
        setGeminiLoading(false);
      }
  };

  const handleOpenAIDateRangeChange = (start: string, end: string) => {
      setOpenAIDateRange({ startDate: start, endDate: end });
      fetchOpenAIUsage(start, end);
  };

  const handleGeminiDateRangeChange = (start: string, end: string) => {
      setGeminiDateRange({ startDate: start, endDate: end });
      fetchGeminiUsage(start, end);
  };

  const fetchAPIData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startTime = Math.floor(new Date(openAIDateRange.startDate).getTime() / 1000);
      const endTime = Math.floor(new Date(openAIDateRange.endDate).setHours(23, 59, 59, 999) / 1000);
      
      const gStartTime = Math.floor(new Date(geminiDateRange.startDate).getTime() / 1000);
      const gEndTime = Math.floor(new Date(geminiDateRange.endDate).setHours(23, 59, 59, 999) / 1000);

      const [
        openaiBalanceRes,
        openaiUsageRes,
        geminiBalanceRes,
        geminiUsageRes,
        openaiHistoryRes,
        geminiHistoryRes,
        grapesjsHistoryRes,
      ] = await Promise.all([
        adminService.getOpenAIBalance(),
        adminService.getOpenAIUsage({ startTime, endTime }),
        adminService.getGeminiBalance(),
        adminService.getGeminiUsage({ startTime: gStartTime, endTime: gEndTime }),
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
      if (geminiBalanceRes.success && geminiBalanceRes.data) {
         const balance = geminiBalanceRes.data;
         const usage = 
           geminiUsageRes.success && geminiUsageRes.data
             ? geminiUsageRes.data
             : null;
             
        setGeminiData({
           ...balance,
           ...usage,
        });
      }

      if (geminiHistoryRes.success && geminiHistoryRes.data) {
        setGeminiHistory(geminiHistoryRes.data);
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
      totalBalance: geminiData?.totalBalance || 0,
      usedBalance: geminiData?.usedBalance || 0,
      balance: geminiData?.currentBalance || 0,
      currency: "USD",
      status: (geminiData?.status || "active") as
        | "active"
        | "inactive"
        | "error",
      totalRequests: geminiData?.totalRequests || 0,
      totalTokens: geminiData?.totalTokens || 0,
      requestsToday: geminiData?.requestsToday || 0,
      tokensToday: geminiData?.tokensToday || 0,
      costToday: geminiData?.costToday || 0,
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
            {apiProviders.map((provider) => {
              if (provider.id === "openai") {
                 return (
                  <OpenAIProviderCard
                    key={provider.id}
                    {...provider}
                    name="OpenAI"
                    onAddCredit={(providerName) => {
                      setSelectedProvider(providerName);
                      setShowAddCreditModal(true);
                    }}
                    startDate={openAIDateRange.startDate}
                    endDate={openAIDateRange.endDate}
                    onDateRangeChange={handleOpenAIDateRangeChange}
                    loading={openAILoading}
                  />
                 );
              }
              if (provider.id === "gemini") {
                 return (
                  <GeminiProviderCard
                    key={provider.id}
                    {...provider}
                    name="Google Gemini"
                    onAddCredit={(providerName) => {
                      setSelectedProvider(providerName);
                      setShowAddCreditModal(true);
                    }}
                    startDate={geminiDateRange.startDate}
                    endDate={geminiDateRange.endDate}
                    onDateRangeChange={handleGeminiDateRangeChange}
                    loading={geminiLoading}
                  />
                 );
              }
              return (
                <GenericProviderCard
                  key={provider.id}
                  {...provider}
                  onAddCredit={(providerName: any) => {
                    setSelectedProvider(providerName);
                    setShowAddCreditModal(true);
                  }}
                />
              );
            })}
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
