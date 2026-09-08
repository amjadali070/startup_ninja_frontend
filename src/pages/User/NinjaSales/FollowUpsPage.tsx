import { type FC, useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import FollowUpTable from "../../../components/ninja-sales/FollowUpTable";
import AIOutreachAssistant from "../../../components/ninja-sales/AIOutreachAssistant";
import RemindersBanner from "../../../components/ninja-sales/RemindersBanner";
import { FiCalendar, FiAlertTriangle, FiClock, FiCheckCircle } from "react-icons/fi";
import NewOutreachModal from "../../../components/ninja-sales/NewOutreachModal";
import { ninjaSalesService } from "../../../services/ninjaSales";
import type { FollowUpStats } from "../../../services/ninjaSales";

const FollowUpsPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [isNewOutreachModalOpen, setIsNewOutreachModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [followUpCounts, setFollowUpCounts] = useState<FollowUpStats>({
    today: 0,
    overdue: 0,
    upcoming: 0,
    completed: 0,
    total: 0,
  });

  const fetchFollowUpStats = useCallback(async () => {
    const res = await ninjaSalesService.getFollowUpStats();
    if (res.success) setFollowUpCounts(res.data);
  }, []);

  useEffect(() => { fetchFollowUpStats(); }, [fetchFollowUpStats, refreshKey]);

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
    { label: "Due Today", value: String(followUpCounts.today), icon: <FiClock className="w-5 h-5 text-red-500" />, isPositive: false, change: followUpCounts.today > 0 ? "Priority" : "All clear", warning: followUpCounts.today > 0 },
    { label: "Overdue", value: String(followUpCounts.overdue), icon: <FiAlertTriangle className="w-5 h-5 text-red-500 shadow-sm" />, isPositive: false, change: followUpCounts.overdue > 0 ? "Action Needed" : "All clear", warning: followUpCounts.overdue > 0 },
    { label: "Upcoming", value: String(followUpCounts.upcoming), icon: <FiCalendar className="w-5 h-5 text-white" />, isPositive: true, change: "Next 7 days" },
    { label: "Completed", value: String(followUpCounts.completed), icon: <FiCheckCircle className="w-5 h-5 text-white" />, isPositive: true, change: "Done" },
  ];

  const tabs = ["All", "Today", "Overdue", "Upcoming", "Completed"];

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

          <RemindersBanner />

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
              <FollowUpTable key={activeTab} filter={activeTab} refreshKey={refreshKey} />
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
        onCreated={() => setRefreshKey(k => k + 1)}
      />
    </DashboardLayout>
  );
};

export default FollowUpsPage;
