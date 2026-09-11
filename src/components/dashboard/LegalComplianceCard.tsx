import { useState, useEffect, type FC } from "react";
import { FiFileText, FiShield, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import { ninjaLegalService, type DashboardData } from "../../services/ninja-legal";

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
};

const LegalComplianceCard: FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ninjaLegalService.getContractDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch legal dashboard", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const stats = data
    ? [
        {
          label: "ACTIVE CONTRACTS",
          value: data.activeContracts.total.toString(),
          subtext: `+${data.activeContracts.thisMonth} this month`,
          subtextColor: "text-[#FF6C6C]",
          icon: <FiFileText className="h-4 w-4" />,
        },
        {
          // Same underlying number as Ninja Legal's "Contract Completeness" card — it tracks
          // whether contract records have their core fields filled in, not the GDPR/security/
          // HIPAA wording review from the Compliance Scan page. Labeled to match so the two
          // dashboards don't appear to disagree about "compliance".
          label: "COMPLETENESS",
          value: `${data.complianceHealth.complianceScore}%`,
          subtext: `${data.complianceHealth.completeContracts}/${data.complianceHealth.totalContracts} complete`,
          subtextColor: "text-blue-400",
          icon: <FiShield className="h-4 w-4" />,
          progress: data.complianceHealth.complianceScore,
        },
        {
          label: "CONTRACT VALUE",
          value: formatCurrency(data.contractValue.totalContractWorth),
          subtext: `${data.contractValue.noOfContractsThatHasWorth} of ${data.contractValue.totalActiveContractNO} contracts`,
          subtextColor: "text-emerald-400",
          icon: <FiDollarSign className="h-4 w-4" />,
        },
        {
          label: "RENEWALS DUE",
          value: data.upcomingRenewals.toString(),
          subtext: data.upcomingRenewals > 0 ? "Action Required" : "All Clear",
          subtextColor: data.upcomingRenewals > 0 ? "text-[#FF6C6C]" : "text-emerald-400",
          icon: <FiAlertCircle className="h-4 w-4" />,
          isAlert: data.upcomingRenewals > 0,
        },
      ]
    : [];

  return (
    <div className="group relative h-full w-full">
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full w-full flex-col rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-[#2A2A2A] group-hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)] sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3B3B]/20 to-[#B91C1C]/10 sm:h-9 sm:w-9">
            <FiShield className="h-5 w-5 text-[#FF3B3B] sm:h-6 sm:w-6" />
          </div>
          <h2 className="font-plus-jakarta text-base font-bold text-white sm:text-lg">
            Legal & Compliance
          </h2>
        </div>

        {/* Divider */}
        <div className="mb-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border border-[#2A2A2A] bg-white/[0.02] p-3 sm:p-4">
                <div className="mb-3 h-3 w-20 animate-pulse rounded bg-white/5" />
                <div className="h-7 w-12 animate-pulse rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group/item relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 transition-all duration-200 hover:border-[#333333] hover:from-white/[0.06] hover:to-white/[0.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] sm:p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-plus-jakarta text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/40">
                    {stat.label}
                  </span>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      stat.isAlert
                        ? "bg-[#FF3B3B]/15 text-[#FF3B3B] animate-pulse"
                        : "bg-[#FF3B3B]/10 text-[#FF3B3B]"
                    }`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <h3 className="font-plus-jakarta text-xl font-black leading-none text-white sm:text-2xl">
                  {stat.value}
                </h3>

                {stat.progress !== undefined ? (
                  <div className="mt-3">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#B91C1C] shadow-[0_0_8px_rgba(255,59,59,0.4)] transition-all duration-[1.5s] ease-out"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                    <p className={`mt-1.5 font-plus-jakarta text-[10px] font-bold ${stat.subtextColor}`}>
                      {stat.subtext}
                    </p>
                  </div>
                ) : (
                  <p className={`mt-2 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider ${stat.subtextColor}`}>
                    {stat.subtext}
                  </p>
                )}

                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover/item:translate-x-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="font-plus-jakarta text-sm text-white/50">No legal data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalComplianceCard;
