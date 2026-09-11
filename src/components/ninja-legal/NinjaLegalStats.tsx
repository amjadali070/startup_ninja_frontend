import { type FC } from "react";
import { DashboardData } from "../../services/ninja-legal";

interface NinjaLegalStatsProps {
  dashboardData?: DashboardData | null;
  isLoading?: boolean;
}

const NinjaLegalStats: FC<NinjaLegalStatsProps> = ({ dashboardData, isLoading = false }) => {
  // Default data when dashboard data is not available
  const defaultData: DashboardData = {
    activeContracts: {
      total: 0,
      thisMonth: 0,
    },
    complianceHealth: {
      complianceScore: 0,
      completeContracts: 0,
      totalContracts: 0,
    },
    contractValue: {
      totalActiveContractNO: 0,
      thisMonthContractWorth: 0,
      thisMonthContractWorthNo: 0,
      totalContractWorth: 0,
      noOfContractsThatHasWorth: 0,
    },
    upcomingRenewals: 0,
  };

  const data = dashboardData || defaultData;

  // Format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const stats = [
    {
      label: "ACTIVE CONTRACTS",
      value: data.activeContracts.total.toString(),
      subtext: `+${data.activeContracts.thisMonth} this month`,
      subtextColor: "text-[#dc2626]",
    },
    {
      // Measures whether contract records have their core fields filled in (title, type,
      // status, a valid expiry) — it is record completeness, not a GDPR/security/HIPAA
      // compliance result. That real check lives on the Compliance Scan page; naming this
      // "Compliance Health" made the two look like the same metric when they aren't.
      label: "CONTRACT COMPLETENESS",
      value: `${data.complianceHealth.complianceScore}%`,
      hasBadge: false,
      hasAccent: true,
      details: `${data.complianceHealth.completeContracts}/${data.complianceHealth.totalContracts} complete`,
      detailsColor: "text-blue-400",
      isCompact: true,
    },
    {
      label: "CONTRACT VALUE",
      value: formatCurrency(data.contractValue.totalContractWorth),
      subtext: `${data.contractValue.noOfContractsThatHasWorth} of ${data.contractValue.totalActiveContractNO} contracts`,
      subtextColor: "text-green-400",
      details: `This Month: ${formatCurrency(data.contractValue.thisMonthContractWorth)}`,
      detailsColor: "text-yellow-400",
      isCompact: true,
    },
    {
      label: "UPCOMING RENEWALS",
      value: data.upcomingRenewals.toString(),
      subtext: "ACTION REQUIRED",
      isStatus: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-plus-jakarta">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#dc262630] transition-all animate-pulse"
          >
            <div className="h-3 bg-gray-700 rounded w-24 mb-4" />
            <div className="h-8 bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-plus-jakarta">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-[#121212] border border-white/5 rounded-2xl flex flex-col justify-between group hover:border-[#dc262630] transition-all ${stat.isCompact ? "p-4" : "p-6"}`}
        >
          <div>
            <p className={`font-extrabold text-gray-500 tracking-[0.1em] uppercase ${stat.isCompact ? "text-[8px]" : "text-[10px]"}`}>
              {stat.label}
            </p>
          </div>

          <div className={`flex items-end justify-between ${stat.isCompact ? "mt-1 gap-2" : "mt-4"}`}>
            <h3 className={` font-black text-white leading-none ${stat.isCompact ? "text-3xl " : "text-3xl "}`}>
              {stat.value}
            </h3>

            {stat.subtext && !stat.isStatus && (
              <p className={`font-bold ${stat.isCompact ? "text-[9px] text-right" : "text-[11px] mb-1"} ${stat.subtextColor}`}>
                {stat.subtext}
              </p>
            )}

            {stat.hasAccent && (
              <div className="w-12 h-1 bg-[#dc2626] rounded-full mb-1 ml-4" />
            )}

            {stat.isStatus && (
              <span className="bg-[#dc262626] text-[#dc2626] text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider mb-1">
                {stat.subtext}
              </span>
            )}
          </div>

          {stat.details && (
            <div className={`font-semibold ${stat.detailsColor} ${stat.isCompact ? "text-[8px] mt-1 pt-1" : "text-[10px] mt-3 pt-3 border-t border-white/10"}`}>
              {stat.details}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NinjaLegalStats;
