import { type FC } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import NinjaSalesHeader from "../../components/ninja-sales/NinjaSalesHeader";
import NinjaSalesStats from "../../components/ninja-sales/NinjaSalesStats";
import PipelineSnapshot from "../../components/ninja-sales/PipelineSnapshot";
import RevenueForecast from "../../components/ninja-sales/RevenueForecast.tsx";
import RecentLeadActivity from "../../components/ninja-sales/RecentLeadActivity";
import AIFollowupSuggestions from "../../components/ninja-sales/AIFollowupSuggestions";
import TopOpportunities from "../../components/ninja-sales/TopOpportunities";
import SalesQuickActions from "../../components/ninja-sales/SalesQuickActions";
import SalesAdvancedModule from "../../components/ninja-sales/SalesAdvancedModule";

const NinjaSales: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Sales logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const handleNewDeal = () => {
    console.log("New Deal triggered");
  };

  const handleExport = () => {
    console.log("Export CSV triggered");
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/sales"
      title="Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C]">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen">
          {/* Header Section */}
          <NinjaSalesHeader onNewDeal={handleNewDeal} onExport={handleExport} />
          
          {/* Main Key Stats Row */}
          <NinjaSalesStats />

          {/* Analytics Layer 1 Grid: 3-column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-4">
              <PipelineSnapshot />
            </div>
            <div className="lg:col-span-4">
              <RevenueForecast />
            </div>
            <div className="lg:col-span-4">
              <RecentLeadActivity />
            </div>
          </div>

          {/* AI Insights Layer 2 Grid: Specialized layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-4">
              <AIFollowupSuggestions />
            </div>
            <div className="lg:col-span-5">
              <TopOpportunities />
            </div>
            <div className="lg:col-span-3">
              <SalesQuickActions />
            </div>
          </div>

          {/* Bottom Module: Advanced AI Outreach */}
          <div className="pb-10">
            <SalesAdvancedModule />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default NinjaSales;
