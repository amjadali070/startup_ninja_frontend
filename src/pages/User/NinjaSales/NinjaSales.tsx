import { type FC, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.ts";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader.tsx";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid.tsx";
import { FiTrendingUp, FiFolder, FiAward, FiAlertCircle } from "react-icons/fi";
import PipelineSnapshot from "../../../components/ninja-sales/PipelineSnapshot.tsx";
import RevenueForecast from "../../../components/ninja-sales/RevenueForecast.tsx";
import RecentLeadActivity from "../../../components/ninja-sales/RecentLeadActivity.tsx";
import AIFollowupSuggestions from "../../../components/ninja-sales/AIFollowupSuggestions.tsx";
import TopOpportunities from "../../../components/ninja-sales/TopOpportunities.tsx";
import SalesQuickActions from "../../../components/ninja-sales/SalesQuickActions.tsx";
import SalesAdvancedModule from "../../../components/ninja-sales/SalesAdvancedModule.tsx";
import AddProjectModal from "../../../components/ninja-sales/AddProjectModal.tsx";


const NinjaSales: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    console.log("Export CSV triggered");
  };

  const dashboardStats: StatItem[] = [
    { label: "Active Leads", value: "42", change: "+12% this week", isPositive: true, icon: <FiTrendingUp className="w-5 h-5" /> },
    { label: "Pipeline Value", value: "$1.2M", change: "Target: $1.5M", icon: <FiFolder className="w-5 h-5" /> },
    { label: "Win Rate", value: "68%", progress: 68, icon: <FiAward className="w-5 h-5" /> },
    { label: "Overdue Follow-ups", value: "5", isAlert: true, change: "Requires Immediate Action", icon: <FiAlertCircle className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales"
      title="Ninja Sales Dashboard"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C]">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen">
          <NinjaSalesHeader onNewDeal={handleNewDeal} onExport={handleExport} />

          <SalesStatGrid stats={dashboardStats} />

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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-5">
              <AIFollowupSuggestions />
            </div>
            <div className="lg:col-span-5">
              <TopOpportunities />
            </div>
            <div className="lg:col-span-2">
              <SalesQuickActions />
            </div>
          </div>

          <div className="pb-10">
            <SalesAdvancedModule />
          </div>
        </div>
      </main>

      <AddProjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </DashboardLayout>
  );
};

export default NinjaSales;
