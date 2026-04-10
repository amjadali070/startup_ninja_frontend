import { type FC, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import FollowUpTable from "../../../components/ninja-sales/FollowUpTable";
import AIOutreachAssistant from "../../../components/ninja-sales/AIOutreachAssistant";
import { FiTrendingUp, FiAlertTriangle, FiClock, FiCheckCircle } from "react-icons/fi";
import NewOutreachModal from "../../../components/ninja-sales/NewOutreachModal";

const FollowUpsPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [isNewOutreachModalOpen, setIsNewOutreachModalOpen] = useState(false);

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

  const handleNewOutreach = () => {
    setIsNewOutreachModalOpen(true);
  };

  const stats: StatItem[] = [
    { label: "Due Today", value: "1", icon: <FiClock className="w-5 h-5 text-red-500" />, isPositive: false, change: "4 Priority", warning: true },
    { label: "Overdue", value: "05", icon: <FiAlertTriangle className="w-5 h-5 text-red-500 shadow-sm" />, isPositive: false, change: "Action Needed", warning: true },
    { label: "High-Value", value: "$1.2M", icon: <FiTrendingUp className="w-5 h-5 text-white" />, isPositive: true, change: "Total Pipeline" },
    { label: "Awaiting Response", value: "28", icon: <FiCheckCircle className="w-5 h-5 text-white" />, isPositive: true, change: "Pending Update" },
  ];

  const tabs = ["All", "Today", "Overdue", "No Response", "High Value", "Proposal Sent"];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/follow-ups"
      title="Follow-up Center - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-8 max-w-auto mx-auto text-white pb-20">
          
          <NinjaSalesHeader 
            title="Follow-up Center" 
            subtitle="Intelligent Outreach Assistant" 
            newButtonText="New Outreach" 
            onNewDeal={handleNewOutreach} 
          />

          <SalesStatGrid stats={stats} />

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-3 pb-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeTab === tab 
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20 active:scale-95" 
                    : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-8">
              <FollowUpTable filter={activeTab} />
            </div>
            <div className="xl:col-span-4 h-full sticky top-8">
              <AIOutreachAssistant />
            </div>
          </div>
        </div>
      </main>

      <NewOutreachModal 
        isOpen={isNewOutreachModalOpen} 
        onClose={() => setIsNewOutreachModalOpen(false)} 
      />
    </DashboardLayout>
  );
};

export default FollowUpsPage;
