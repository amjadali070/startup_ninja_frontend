import { type FC } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import LeadsTable from "../../../components/ninja-sales/LeadsTable";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import { FiUsers, FiTrendingUp, FiTarget, FiZap } from "react-icons/fi";

const LeadsPage: FC = () => {
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

  const handleNewLead = () => {
    console.log("New Lead triggered");
  };

  const handleExport = () => {
    console.log("Export CSV triggered");
  };

  const stats: StatItem[] = [
    { label: "Total Leads", value: "2,543", icon: <FiUsers />, change: "+12.5% this month", isPositive: true },
    { label: "Conversions", value: "842", icon: <FiZap />, change: "+8.2% this month", isPositive: true },
    { label: "Pipeline Value", value: "$425,000", icon: <FiTrendingUp />, change: "+23.1% this month", isPositive: true },
    { label: "Win Rate", value: "64%", icon: <FiTarget />, change: "+4.5% this month", isPositive: true },
  ];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/leads"
      title="Leads - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C]">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen">
          {/* Header Section */}
          <NinjaSalesHeader onNewDeal={handleNewLead} onExport={handleExport} />

          <SalesStatGrid stats={stats} />

          {/* Leads Table Section */}
          <div className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">Active Sales Pipeline</h2>
            </div>
            <LeadsTable />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default LeadsPage;
