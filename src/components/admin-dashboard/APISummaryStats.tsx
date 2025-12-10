import React from "react";
import { FiDollarSign, FiActivity, FiAlertCircle } from "react-icons/fi";

interface APISummaryStatsProps {
  totalBalance: number;
  todayRequests: number;
  todayCost: number;
}

const APISummaryStats: React.FC<APISummaryStatsProps> = ({
  totalBalance,
  todayRequests,
  todayCost,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
            <FiDollarSign className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-xs text-white/60">Total Balance</div>
            <div className="text-xl font-bold text-white">
              ${totalBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
            <FiActivity className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="text-xs text-white/60">Today's Requests</div>
            <div className="text-xl font-bold text-white">{todayRequests}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
            <FiAlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="text-xs text-white/60">Today's Cost</div>
            <div className="text-xl font-bold text-white">
              ${todayCost.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APISummaryStats;
