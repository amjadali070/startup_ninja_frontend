import React from "react";
import { FiDollarSign, FiTrendingUp, FiActivity } from "react-icons/fi";

interface BalanceSummaryCardsProps {
  totalCredit: number;
  totalUsed: number;
  totalRemaining: number;
  activeCredits: number;
}

const BalanceSummaryCards: React.FC<BalanceSummaryCardsProps> = ({
  totalCredit,
  totalUsed,
  totalRemaining,
  activeCredits,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
            <FiDollarSign className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Credits Added</div>
            <div className="text-2xl font-bold text-green-400">
              ${totalCredit.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
            <FiTrendingUp className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Used</div>
            <div className="text-2xl font-bold text-red-400">
              ${totalUsed.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
            <FiDollarSign className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Remaining Balance</div>
            <div className="text-2xl font-bold text-white">
              ${totalRemaining.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#1A1A1A] p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <FiActivity className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Active Credits</div>
            <div className="text-2xl font-bold text-white">{activeCredits}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummaryCards;
