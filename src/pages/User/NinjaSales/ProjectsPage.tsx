import { type FC, useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import ProjectsTable from "../../../components/ninja-sales/ProjectsTable";
import { FiBriefcase, FiTrendingUp, FiDollarSign, FiAward } from "react-icons/fi";
import AddProjectModal from "../../../components/ninja-sales/AddProjectModal";
import { ninjaSalesService, Project } from "../../../services/ninjaSales";

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toLocaleString()}`;
};

const ProjectsPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statsProjects, setStatsProjects] = useState<Project[]>([]);

  const fetchStats = useCallback(async () => {
    const res = await ninjaSalesService.getProjects({ limit: 1000 });
    if (res.success) setStatsProjects(res.data);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats, refreshKey]);

  const handleLogout = async () => { try { await logout(); } catch {} finally { navigate("/login", { replace: true }); } };
  const handleNewDeal = () => setIsAddModalOpen(true);

  const totalProjects = statsProjects.length;
  const activeProjects = statsProjects.filter(p => !["closed-won", "closed-lost"].includes(p.pipelineStage)).length;
  const totalValue = statsProjects.reduce((sum, p) => sum + (p.value || 0), 0);
  const wonProjects = statsProjects.filter(p => p.pipelineStage === "closed-won").length;

  const stats: StatItem[] = [
    { label: "Total Projects", value: String(totalProjects), icon: <FiBriefcase />, change: `${totalProjects} total deals`, isPositive: true },
    { label: "Active Projects", value: String(activeProjects), icon: <FiTrendingUp />, change: `${totalProjects ? Math.round((activeProjects / totalProjects) * 100) : 0}% of total`, isPositive: true },
    { label: "Total Value", value: formatCurrency(totalValue), icon: <FiDollarSign />, change: "Combined pipeline", isPositive: true },
    { label: "Won Projects", value: String(wonProjects), icon: <FiAward />, change: `${totalProjects ? Math.round((wonProjects / totalProjects) * 100) : 0}% win rate`, isPositive: true },
  ];

  return (
    <DashboardLayout activePath="/ai-tools/sales/projects" title="Projects Management - Ninja Sales" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C]">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen pb-10">
          <NinjaSalesHeader title="Project Management" subtitle="Track and manage all your active deals and projects." newButtonText="New Deal" onNewDeal={handleNewDeal} onExport={() => console.log("Export")} />
          <SalesStatGrid stats={stats} />

          <div className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">All Projects</h2>
            </div>
            <ProjectsTable refreshKey={refreshKey} />
          </div>
        </div>
      </main>

      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onCreated={() => setRefreshKey(k => k + 1)} />
    </DashboardLayout>
  );
};

export default ProjectsPage;
