import { type FC, useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import LeadsTable from "../../../components/ninja-sales/LeadsTable";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import { FiUsers, FiTrendingUp, FiTarget, FiZap } from "react-icons/fi";
import AddProjectModal from "../../../components/ninja-sales/AddProjectModal";
import { apiClient } from "../../../services/apiClient";

const LeadsPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [leadStats, setLeadStats] = useState({ totalLeads: 0, conversions: 0, leadsValue: 0, winRate: 0 });

  const fetchLeadStats = async () => {
    try {
      const res = await apiClient.get<{ success: boolean; data: typeof leadStats }>('/ninja-sales/leads/stats');
      if (res.success) setLeadStats(res.data);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchLeadStats(); }, [refreshKey]);

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
    setIsAddModalOpen(true);
  };

  const formatValue = (v: number) =>
    v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;

  const stats: StatItem[] = [
    { label: "Total Leads", value: leadStats.totalLeads.toLocaleString(), icon: <FiUsers />, isPositive: true },
    { label: "Conversions", value: String(leadStats.conversions), icon: <FiZap />, change: "Closed Won", isPositive: true },
    { label: "Leads Value", value: formatValue(leadStats.leadsValue), icon: <FiTrendingUp />, change: "Sum of all projects", isPositive: true },
    { label: "Win Rate", value: `${leadStats.winRate}%`, icon: <FiTarget />, progress: leadStats.winRate },
  ];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/leads"
      title="Leads Management - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C]">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen pb-10">
          
          <NinjaSalesHeader 
            title="Lead Management" 
            subtitle="Intelligent Lead Tracking — Managing your potential revenue growth."
            onNewDeal={handleNewLead} 
          />

          <SalesStatGrid stats={stats} />

          {/* Leads Table Section */}
          <div className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">Active Sales Pipeline</h2>
            </div>
            <LeadsTable refreshKey={refreshKey} />
          </div>
        </div>
      </main>

      <AddProjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => setRefreshKey(k => k + 1)}
      />
    </DashboardLayout>
  );
};

export default LeadsPage;
