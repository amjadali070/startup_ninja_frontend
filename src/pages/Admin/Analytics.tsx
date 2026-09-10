import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTrendingUp, FiTrendingDown, FiDollarSign, FiRepeat, FiPercent, FiZap, FiCreditCard } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/admin";
import type { ProductAnalytics } from "../../types/admin";
import AdminKpiStatCard from "../../components/admin-dashboard/AdminKpiStatCard";
import AdminInsightLineChart from "../../components/admin-dashboard/AdminInsightLineChart";
import AdminInsightBarChart from "../../components/admin-dashboard/AdminInsightBarChart";

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const Analytics: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ProductAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminService.getProductAnalytics(days).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <DashboardLayout
      activePath="/admin-dashboard/analytics"
      title="Product Analytics"
      onLogout={handleLogout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold">Product Analytics</h1>
              <p className="text-white/40 text-sm mt-1">Signups, engagement, retention, and revenue — computed from real activity and billing data.</p>
            </div>
            <div className="flex items-center gap-2">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    days === opt.value
                      ? "bg-red-600/10 border-red-600/50 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading || !data ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Revenue KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                <AdminKpiStatCard title="MRR" value={data.revenue.mrr} format="currency" icon={FiDollarSign} />
                <AdminKpiStatCard title="ARR" value={data.revenue.arr} format="currency" icon={FiTrendingUp} />
                <AdminKpiStatCard title="ARPU" value={data.revenue.arpu} format="currency" icon={FiUsers} />
                <AdminKpiStatCard
                  title="Paying Subscriptions"
                  value={data.revenue.payingSubscriptions}
                  icon={FiRepeat}
                />
              </div>

              {/* Growth KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                <AdminKpiStatCard
                  title={`Churn (${data.churn.days}d)`}
                  value={data.churn.churnRatePercent != null ? `${data.churn.churnRatePercent}%` : "—"}
                  subtitle={`${data.churn.cancelledInWindow} of ${data.churn.activeAtStart} subs`}
                  icon={FiTrendingDown}
                />
                <AdminKpiStatCard
                  title={`Trial-to-Paid (${data.conversion.days}d)`}
                  value={data.conversion.conversionRatePercent != null ? `${data.conversion.conversionRatePercent}%` : "—"}
                  subtitle={`${data.conversion.converted} of ${data.conversion.cohortSize} signups`}
                  icon={FiPercent}
                />
                <AdminKpiStatCard
                  title="Refunds"
                  value={data.refunds.count}
                  subtitle={data.refunds.totalRefunded > 0 ? `$${data.refunds.totalRefunded.toLocaleString()} refunded` : undefined}
                  icon={FiDollarSign}
                />
                <AdminKpiStatCard
                  title="Signups (range)"
                  value={data.signups.reduce((s, p) => s + p.signups, 0)}
                  icon={FiUsers}
                />
              </div>

              {/* Activation & paid users */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                <AdminKpiStatCard
                  title={`Activated (${data.activation.activationWindowDays}d)`}
                  value={data.activation.activationRatePercent != null ? `${data.activation.activationRatePercent}%` : "—"}
                  subtitle={`${data.activation.activated} of ${data.activation.cohortSize} signups`}
                  icon={FiZap}
                />
                <AdminKpiStatCard
                  title="Paid Users"
                  value={data.paidUsers.paidUsers}
                  subtitle={data.paidUsers.paidPercent != null ? `${data.paidUsers.paidPercent}% of all users` : undefined}
                  icon={FiCreditCard}
                />
              </div>

              {/* Feature usage & adoption */}
              <AdminInsightBarChart
                title="Feature Adoption"
                subtitle={`Distinct users per feature, last ${days} days`}
                points={data.featureUsage.map((f) => ({ label: f.label, value: f.distinctUsers }))}
              />

              {/* Trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <AdminInsightLineChart
                  title="Signups"
                  subtitle={`Daily new accounts, last ${days} days`}
                  points={data.signups.map((s) => ({ label: s.date.slice(5), value: s.signups }))}
                />
                <AdminInsightLineChart
                  title="Daily Active Users"
                  subtitle={`Real logins per day, last ${days} days`}
                  points={data.dauMau.map((d) => ({ label: d.date.slice(5), value: d.dau }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <AdminInsightLineChart
                  title="Monthly Active Users"
                  subtitle="Distinct logged-in users, trailing 30 days"
                  points={data.dauMau.map((d) => ({ label: d.date.slice(5), value: d.mau }))}
                />
                <div className="bg-[#151515] border border-[#242424] rounded-xl p-5">
                  <h3 className="text-white text-sm uppercase tracking-[0.2em] font-semibold">Retention Cohorts</h3>
                  <p className="text-xs text-gray-400 mt-1">Weekly signup cohorts — % who logged back in later</p>
                  {data.retention.length === 0 ? (
                    <p className="text-xs text-gray-500 mt-4">No cohorts old enough to measure in this range yet</p>
                  ) : (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-400 text-left">
                            <th className="pb-2 pr-4 font-medium">Cohort week</th>
                            <th className="pb-2 pr-4 font-medium">Size</th>
                            <th className="pb-2 pr-4 font-medium">Day 7</th>
                            <th className="pb-2 font-medium">Day 30</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.retention.map((c) => (
                            <tr key={c.cohortWeekStart} className="border-t border-white/5">
                              <td className="py-2 pr-4 text-white">{c.cohortWeekStart}</td>
                              <td className="py-2 pr-4 text-white/70">{c.cohortSize}</td>
                              <td className="py-2 pr-4 text-white/70">{c.day7Retention != null ? `${c.day7Retention}%` : "—"}</td>
                              <td className="py-2 text-white/70">{c.day30Retention != null ? `${c.day30Retention}%` : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Refunds table */}
              <div className="bg-[#151515] border border-[#242424] rounded-xl p-5">
                <h3 className="text-white text-sm uppercase tracking-[0.2em] font-semibold">Refunds</h3>
                <p className="text-xs text-gray-400 mt-1">Last {Math.max(days, 90)} days</p>
                {data.refunds.refunds.length === 0 ? (
                  <p className="text-xs text-gray-500 mt-4">No refunds recorded in this window.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 text-left">
                          <th className="pb-2 pr-4 font-medium">Date</th>
                          <th className="pb-2 pr-4 font-medium">User</th>
                          <th className="pb-2 pr-4 font-medium">Amount</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.refunds.refunds.map((r) => (
                          <tr key={r._id} className="border-t border-white/5">
                            <td className="py-2 pr-4 text-white/70">{formatDate(r.createdAt)}</td>
                            <td className="py-2 pr-4 text-white">{r.userId?.email || "—"}</td>
                            <td className="py-2 pr-4 text-white/70">${Math.abs(r.amount).toLocaleString()}</td>
                            <td className="py-2 text-white/70">{r.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Analytics;
