import { type FC } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import LeadsTable from "../../../components/ninja-sales/LeadsTable";
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

  const stats = [
    { label: "Total Leads", value: "2,543", icon: <FiUsers />, trend: "+12.5%", color: "text-blue-500" },
    { label: "Conversions", value: "842", icon: <FiZap />, trend: "+8.2%", color: "text-purple-500" },
    { label: "Pipeline Value", value: "$425,000", icon: <FiTrendingUp />, trend: "+23.1%", color: "text-green-500" },
    { label: "Win Rate", value: "64%", icon: <FiTarget />, trend: "+4.5%", color: "text-red-500" },
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

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative bg-[#121212] border border-white/[0.03] rounded-2xl p-8 hover:bg-[#161616] transition-all hover:border-[#EF444420] shadow-xl overflow-hidden"
              >
                {/* Subtle icon glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF444405] blur-[40px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
                    <div className="bg-[#EF444410] p-3 rounded-2xl border border-[#EF444415] shadow-lg text-[#EF4444]">
                      {stat.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight mb-2 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      {stat.trend} this month
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
