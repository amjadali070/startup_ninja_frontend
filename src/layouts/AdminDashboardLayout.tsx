import React from "react";
import {
  FaUsers,
  FaUserCheck,
  FaMoneyBillWave,
  FaWallet,
  FaRobot,
  FaBalanceScale,
  FaShareAlt,
  FaGlobe,
  FaImage,
  FaBriefcase,
  FaClipboardList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "../hooks/useAdminData";
import LoadingSpinner from "../components/LoadingSpinner";
import AdminKpiStatCard from "../components/admin-dashboard/AdminKpiStatCard";
import AdminServiceUsageCard from "../components/admin-dashboard/AdminServiceUsageCard";
import AdminInsightLineChart from "../components/admin-dashboard/AdminInsightLineChart";
import AdminInsightBarChart from "../components/admin-dashboard/AdminInsightBarChart";

const AdminDashboardLayout: React.FC = () => {
  const { stats, loading, error } = useAdminDashboard();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner fullscreen variant="dark" />;
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-400 text-lg">Error: {error}</div>
        </div>
      </div>
    );
  }

  const topKpiIcons: Record<string, React.ElementType> = {
    "total-users": FaUsers,
    "active-users": FaUserCheck,
    "month-revenue": FaMoneyBillWave,
    "total-revenue": FaMoneyBillWave,
    "api-balance": FaWallet,
    "active-subscriptions": FaClipboardList,
  };
  const serviceIcons: Record<string, React.ElementType> = {
    "ai-chat": FaRobot,
    "ninja-sales": FaBriefcase,
    "image-generation": FaImage,
    "ai-legal": FaBalanceScale,
    "social-media": FaShareAlt,
    "website-builder": FaGlobe,
  };
  const heroKpis = stats?.kpis?.slice(0, 4) || [];
  const subscriptionsByPlan = stats?.insights?.subscriptionsByPlan || [];
  const servicesVolume =
    stats?.services?.map((service) => ({
      label: service.name,
      value: service.metrics.reduce((sum, metric) => sum + metric.value, 0),
    })) || [];
  const totalHealthServices = stats?.serviceHealth?.length || 0;
  const healthyServices =
    stats?.serviceHealth?.filter((service) => service.status === "healthy").length || 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {!stats ? (
        <div className="text-white/70">No dashboard data available.</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {heroKpis.map((kpi) => (
              <div
                key={kpi.id}
                className="cursor-pointer"
                onClick={() =>
                  kpi.id.includes("revenue")
                    ? navigate("/admin-dashboard/plans")
                    : navigate("/admin-dashboard/users")
                }
              >
                <AdminKpiStatCard
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.subtitle}
                  format={kpi.format}
                  icon={topKpiIcons[kpi.id]}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <AdminInsightLineChart
              title="Revenue Trend"
              subtitle="Net subscription revenue over last 6 months"
              points={stats.insights.revenueByMonth}
              valuePrefix="$"
            />
            <AdminInsightLineChart
              title="User Growth"
              subtitle="New users over last 14 days"
              points={stats.insights.usersByDay}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <AdminInsightBarChart
              title="Subscription Plan Mix"
              subtitle="Distribution across active subscription plans"
              points={subscriptionsByPlan}
            />
            <AdminInsightBarChart
              title="Service Activity Mix"
              subtitle="Relative activity volume by service"
              points={servicesVolume}
            />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131313] via-[#101010] to-[#0B0B0B] p-4 lg:p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-white/50 uppercase">System Observability</p>
                <h3 className="text-sm font-semibold text-white mt-1">Service Health</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] tracking-widest uppercase text-white/70">
                  {healthyServices}/{totalHealthServices} Healthy
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] tracking-widest uppercase text-emerald-200">
                  Live
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              {stats.serviceHealth.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3.5 backdrop-blur-[1px] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_30px_-26px_rgba(255,255,255,0.45)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{service.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        service.status === "healthy"
                          ? "bg-emerald-400/15 text-emerald-200 border border-emerald-300/30"
                          : "bg-amber-400/15 text-amber-200 border border-amber-300/30"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed">{service.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {stats.services.map((service) => (
              <div
                key={service.id}
                className="cursor-pointer"
                onClick={() =>
                  service.id === "ninja-sales"
                    ? navigate("/admin-dashboard/users")
                    : navigate("/admin-dashboard/api-management")
                }
              >
                <AdminServiceUsageCard
                  name={service.name}
                  metrics={service.metrics}
                  icon={serviceIcons[service.id]}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardLayout;
