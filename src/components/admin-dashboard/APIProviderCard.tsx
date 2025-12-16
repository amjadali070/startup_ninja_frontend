import React from "react";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import { FiPlus, FiCalendar, FiActivity, FiTrendingUp } from "react-icons/fi";

interface APIProviderCardProps {
  id: string;
  name: "OpenAI" | "Google Gemini" | "GrapesJS";
  icon: IconType;
  totalBalance: number;
  usedBalance: number;
  balance: number;
  currency: string;
  status: "active" | "inactive" | "error";
  totalRequests: number;
  totalTokens: number;
  requestsToday: number;
  tokensToday: number;
  costToday: number;
  color: string;
  creditsCount: number;
  onAddCredit: (provider: "OpenAI" | "Gemini" | "GrapesJS") => void;
}

const GenericProviderCard: React.FC<APIProviderCardProps> = ({
  id,
  name,
  icon: Icon,
  totalBalance,
  usedBalance,
  balance,
  status,
  totalRequests,
  totalTokens,
  requestsToday,
  tokensToday,
  costToday,
  color,
  creditsCount,
  onAddCredit,
}) => {
  const navigate = useNavigate();
  const providerId =
    id === "openai" ? "OpenAI" : id === "gemini" ? "Gemini" : "GrapesJS";

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#242424] bg-[#1A1A1A] p-6 transition-all duration-300 hover:bg-[#151515]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  status === "active" ? "bg-green-500" : "bg-red-500"
                } animate-pulse`}
              />
              <span className="text-xs text-gray-400 capitalize">{status}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-400 mb-1">
                Remaining Balance
              </div>
              <div className="text-2xl font-bold text-white">
                ${balance.toFixed(2)}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              of ${totalBalance.toFixed(2)} total
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onAddCredit(providerId)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-all duration-200 text-sm font-medium"
        >
          <FiPlus className="h-4 w-4" />
          Add Credit
        </button>
        <button
          onClick={() => navigate(`/admin-dashboard/balance-history/${id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#242424] text-gray-300 hover:bg-[#151515] transition-all duration-200 text-sm font-medium"
        >
          <FiCalendar className="h-4 w-4" />
          View History ({creditsCount})
        </button>
      </div>

      {/* Balance Progress Bar */}
      {totalBalance > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Balance Usage</span>
            <span>{((usedBalance / totalBalance) * 100).toFixed(1)}% used</span>
          </div>
          <div className="relative h-2 rounded-full bg-[#0D0D0D] overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
              style={{
                width: `${Math.min((usedBalance / totalBalance) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Used: ${usedBalance.toFixed(2)}</span>
            <span>Remaining: ${balance.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg bg-[#0D0D0D] p-3 border border-[#242424]">
          <div className="flex items-center gap-2 mb-1">
            <FiActivity className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">Total Requests</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {totalRequests.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg bg-[#0D0D0D] p-3 border border-[#242424]">
          <div className="flex items-center gap-2 mb-1">
            <FiTrendingUp className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">Total Tokens</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {(totalTokens / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>

      {/* Today's Usage */}
      <div className="rounded-lg bg-[#0D0D0D] p-4 border border-[#242424]">
        <div className="text-xs font-semibold text-gray-300 mb-3">
          Today's Usage
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-gray-400 mb-1">Requests</div>
            <div className="text-sm font-semibold text-white">
              {requestsToday}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Tokens</div>
            <div className="text-sm font-semibold text-white">
              {(tokensToday / 1000).toFixed(1)}K
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Cost</div>
            <div className="text-sm font-semibold text-white">
              ${costToday.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericProviderCard;
