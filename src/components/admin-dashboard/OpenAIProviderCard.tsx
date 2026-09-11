import React from "react";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import { FiPlus, FiCalendar, FiActivity, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import LoadingSpinner from "../LoadingSpinner";

interface OpenAIProviderCardProps {
  id: string;
  name: "OpenAI";
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
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  loading?: boolean;
}

const OpenAIProviderCard: React.FC<OpenAIProviderCardProps> = ({
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
  startDate,
  endDate,
  onDateRangeChange,
  loading = false,
}) => {
  const navigate = useNavigate();
  const providerId = "OpenAI";
  
  // Internal handlers to simplify partial updates
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onDateRangeChange) {
          onDateRangeChange(e.target.value, endDate || new Date().toISOString().split('T')[0]);
      }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onDateRangeChange) {
          onDateRangeChange(startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], e.target.value);
      }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#242424] bg-[#1A1A1A] transition-all duration-300 hover:bg-[#151515] hover:border-gray-800 shadow-xl group">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1px] transition-all duration-300">
          <LoadingSpinner size="small" />
        </div>
      )}

      {/* Decorative Gradient Background */}
      <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${color} opacity-[0.03] blur-xl rounded-full translate-x-10 -translate-y-10 group-hover:opacity-[0.06] transition-opacity`} />

      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-green-900/20 shrink-0`}>
              <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`h-2 w-2 rounded-full ${status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"} animate-pulse`} />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{status}</span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right ml-16 sm:ml-0">
             <div className="inline-block px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#333] mb-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Available Credits</span>
             </div>
             <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
               ${balance.toFixed(2)}
             </div>
             <div className="text-xs font-medium text-gray-500 mt-1">
               Total Initial: <span className="text-gray-400">${totalBalance.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Real-time Usage Date Range Picker */}
        <div className="mb-6 bg-[#242424]/30 rounded-lg p-3 border border-[#2a2a2a]">
           <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="text-green-500 h-3.5 w-3.5" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage Timeframe</span>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#0D0D0D] p-2 sm:p-1 rounded-md border border-[#333]">
             <div className="relative w-full sm:flex-1">
               <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-medium">From</span>
               <input 
                 type="date" 
                 className="w-full bg-transparent text-xs font-bold text-gray-200 border-none rounded py-1 pl-10 pr-1 focus:ring-0 focus:outline-none cursor-pointer"
                 value={startDate}
                 defaultValue={!startDate ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
                 max={new Date().toISOString().split('T')[0]}
                 aria-label="Start Date"
                 style={{ colorScheme: "dark" }}
                 onClick={(e) => e.currentTarget.showPicker()}
                 onChange={handleStartChange}
               />
             </div>
             
             <div className="text-gray-600 rotate-90 sm:rotate-0">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M5 12h14M12 5l7 7-7 7" />
               </svg>
             </div>

             <div className="relative w-full sm:flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-medium">To</span>
               <input 
                 type="date" 
                 className="w-full bg-transparent text-xs font-bold text-gray-200 border-none rounded py-1 pl-8 pr-1 focus:ring-0 focus:outline-none cursor-pointer"
                 value={endDate}
                 defaultValue={!endDate ? new Date().toISOString().split('T')[0] : undefined}
                 max={new Date().toISOString().split('T')[0]}
                 aria-label="End Date"
                 style={{ colorScheme: "dark" }}
                 onClick={(e) => e.currentTarget.showPicker()}
                 onChange={handleEndChange}
               />
             </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onAddCredit(providerId)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/10 border border-green-600/20 text-green-400 hover:bg-green-600/20 hover:border-green-600/40 transition-all duration-200 text-sm font-semibold group/btn"
          >
            <FiPlus className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            Add Credits
          </button>
          <button
            onClick={() => navigate(`/admin-dashboard/balance-history/${id}`)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#242424] border border-[#333] text-gray-300 hover:bg-[#2a2a2a] hover:border-[#444] transition-all duration-200 text-sm font-semibold"
          >
            <FiCalendar className="h-4 w-4" />
            History ({creditsCount})
          </button>
        </div>

        {/* Balance Progress Bar */}
        {totalBalance > 0 && (
          <div className="mb-6 bg-[#242424]/30 rounded-xl p-4 border border-[#2a2a2a]">
            <div className="flex items-center justify-between text-xs font-medium text-gray-400 mb-3">
              <span>Credit Utilization</span>
              <span className={((usedBalance / totalBalance) * 100) > 80 ? "text-red-400" : "text-gray-400"}>
                  {((usedBalance / totalBalance) * 100).toFixed(1)}% used
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-[#111] overflow-hidden mb-3 shadow-inner">
              <div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min((usedBalance / totalBalance) * 100, 100)}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-2 sm:gap-0">
               <div className="flex items-center gap-1.5 container-fluid w-full sm:w-auto">
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                  <span className="text-gray-500">Spent: <span className="text-gray-300 font-medium">${usedBalance.toFixed(2)}</span></span>
               </div>
               <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <span className="text-gray-500">Remaining: <span className="text-white font-medium">${balance.toFixed(2)}</span></span>
               </div>
            </div>
          </div>
        )}

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-[#0D0D0D] p-3.5 border border-[#242424] hover:border-green-900/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-[#1a1a1a] border border-[#333]">
                <FiActivity className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-gray-400">Total Requests</span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight ml-1">
              {totalRequests.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-[#0D0D0D] p-3.5 border border-[#242424] hover:border-green-900/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-[#1a1a1a] border border-[#333]">
                 <FiTrendingUp className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-gray-400">Total Tokens</span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight ml-1">
              {(totalTokens / 1000000).toFixed(2)}<span className="text-sm font-normal text-gray-500 ml-0.5">M</span>
            </div>
          </div>
        </div>

        {/* Today's Usage Section */}
        <div className="rounded-xl bg-[#0D0D0D] p-4 border border-[#242424] relative overflow-hidden">
           {/* Subtle glow effect */}
           <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/5 blur-2xl rounded-full pointer-events-none"></div>
           
           <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-green-500 rounded-full"></div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Today's Activity</h4>
           </div>
           
           <div className="grid grid-cols-3 gap-4 divide-x divide-[#242424]">
             <div className="text-center pr-2">
               <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Requests</div>
               <div className="text-sm font-bold text-white">{requestsToday}</div>
             </div>
             <div className="text-center px-2">
               <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Tokens</div>
               <div className="text-sm font-bold text-white">{(tokensToday / 1000).toFixed(1)}K</div>
             </div>
             <div className="text-center pl-2">
               <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Est. Cost</div>
               <div className="text-sm font-bold text-green-400 flex items-center justify-center gap-0.5">
                  <FiDollarSign className="h-3 w-3" />
                  {costToday.toFixed(4)}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAIProviderCard;
