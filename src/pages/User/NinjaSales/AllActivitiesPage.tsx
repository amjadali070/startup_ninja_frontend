import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import ActivitiesTable from "../../../components/ninja-sales/ActivitiesTable";
import { ninjaSalesService } from "../../../services/ninjaSales";

const AllActivitiesPage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activityStats, setActivityStats] = useState({
    total: 0,
    calls: 0,
    emails: 0,
    meetings: 0,
  });

  useEffect(() => {
    const fetchActivityStats = async () => {
      const [totalRes, callsRes, emailsRes, meetingsRes] = await Promise.all([
        ninjaSalesService.getActivities({ page: 1, limit: 1 }),
        ninjaSalesService.getActivities({ page: 1, limit: 1, type: "CALL" }),
        ninjaSalesService.getActivities({ page: 1, limit: 1, type: "EMAIL" }),
        ninjaSalesService.getActivities({ page: 1, limit: 1, type: "MEETING" }),
      ]);

      setActivityStats({
        total: totalRes.pagination?.total || 0,
        calls: callsRes.pagination?.total || 0,
        emails: emailsRes.pagination?.total || 0,
        meetings: meetingsRes.pagination?.total || 0,
      });
    };
    fetchActivityStats();
  }, [refreshKey]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Sales logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const stats: StatItem[] = [
    { label: "Total Activities", value: activityStats.total.toLocaleString(), icon: <FiActivity />, isPositive: true },
    { label: "Calls Logged", value: String(activityStats.calls), icon: <FiPhone />, change: "All-time", isPositive: true },
    { label: "Emails Logged", value: String(activityStats.emails), icon: <FiMail />, change: "All-time", isPositive: true },
    { label: "Meetings Logged", value: String(activityStats.meetings), icon: <FiCalendar />, change: "All-time", isPositive: true },
  ];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/leads"
      title="Sales Activities - Ninja Sales"
      onLogout={handleLogout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C]">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen pb-10">
          <NinjaSalesHeader
            title="Activity Management"
            subtitle="Track every lead interaction with complete activity history."
            newButtonText="Refresh"
            newButtonIcon={<FiActivity className="h-4 w-4" />}
            onNewDeal={() => setRefreshKey((k) => k + 1)}
          />

          <SalesStatGrid stats={stats} />

          <div className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">All Sales Activities</h2>
            </div>
            <ActivitiesTable refreshKey={refreshKey} />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AllActivitiesPage;
