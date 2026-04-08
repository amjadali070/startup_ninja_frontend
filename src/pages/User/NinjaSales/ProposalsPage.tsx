import { type FC, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import ProposalEditor from "../../../components/ninja-sales/ProposalEditor";
import SavedTemplates from "../../../components/ninja-sales/SavedTemplates";
import RecentProposals from "../../../components/ninja-sales/RecentProposals";
import { FiTrendingUp, FiTarget, FiZap, FiEdit3 } from "react-icons/fi";
import NewProposalModal from "../../../components/ninja-sales/NewProposalModal";

const ProposalsPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false);

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

  const handleNewProposal = () => {
    setIsNewProposalModalOpen(true);
  };

  const handleExport = () => {
    console.log("Export PDF triggered");
  };

  const stats: StatItem[] = [
    { label: "Active Proposals", value: "18", icon: <FiEdit3 />, change: "4 Pending Review", isPositive: true },
    { label: "Avg. Deal Value", value: "$12,450", icon: <FiTrendingUp />, change: "+12% vs last month", isPositive: true },
    { label: "Drafted (This Week)", value: "08", icon: <FiZap />, change: "High Velocity", isPositive: true },
    { label: "Conversion Rate", value: "32%", icon: <FiTarget />, change: "Targeting 40%", isPositive: true },
  ];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/proposals"
      title="Proposal Editor - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-12 max-w-auto mx-auto text-white pb-20">

          <NinjaSalesHeader
            title="Proposal Editor"
            subtitle="Intelligent Document Engine — Build high-conversion proposals in seconds."
            newButtonText="Send Proposal"
            onNewDeal={handleNewProposal}
            onExport={handleExport}
          />

          <SalesStatGrid stats={stats} />

          {/* Main Editor Section */}
          <section className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              <h2 className="text-xl font-bold tracking-tight">Live Document Editor</h2>
            </div>
            <ProposalEditor />
          </section>

          {/* Bottom Section: Templates & Recent */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-8 border-t border-white/5 pb-20">
            <div className="xl:col-span-4">
              <SavedTemplates />
            </div>
            <div className="xl:col-span-8">
              <RecentProposals />
            </div>
          </div>

        </div>
      </main>

      <NewProposalModal 
        isOpen={isNewProposalModalOpen} 
        onClose={() => setIsNewProposalModalOpen(false)} 
      />
    </DashboardLayout>
  );
};

export default ProposalsPage;
