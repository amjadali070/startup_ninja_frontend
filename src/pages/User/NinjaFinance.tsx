import { type FC } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import NinjaFinanceHeader from "../../components/ninja-finance/NinjaFinanceHeader";
import NinjaFinanceStats from "../../components/ninja-finance/NinjaFinanceStats";
import CashflowTrend from "../../components/ninja-finance/CashflowTrend";
import ExpenseBreakdown from "../../components/ninja-finance/ExpenseBreakdown";
import RecentExpenses from "../../components/ninja-finance/RecentExpenses";
import FinanceAIIntelligence from "../../components/ninja-finance/FinanceAIIntelligence";
import BudgetVsActual from "../../components/ninja-finance/BudgetVsActual";
import ProfitLossSnapshot from "../../components/ninja-finance/ProfitLossSnapshot";
import FinanceAdvancedModule from "../../components/ninja-finance/FinanceAdvancedModule";

const NinjaFinance: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Finance logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const handleConnectBank = () => {
    console.log("Connect Bank modal triggered");
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/finance"
      title="Ninja Finance"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#121212]">
        <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-white min-h-screen">
          <NinjaFinanceHeader onConnectBank={handleConnectBank} />

          <NinjaFinanceStats />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-8">
              <CashflowTrend />
            </div>
            <div className="lg:col-span-4">
              <ExpenseBreakdown />
            </div>
          </div>

          {/* Middle Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <RecentExpenses />
            </div>
            <div className="lg:col-span-1">
              <FinanceAIIntelligence />
            </div>
            <div className="lg:col-span-1">
              <BudgetVsActual />
            </div>
          </div>

          {/* P&L Snapshot Section */}
          <div className="mb-8">
            <ProfitLossSnapshot />
          </div>

          {/* Advanced AI Module Section */}
          <div className="pb-10">
            <FinanceAdvancedModule />
          </div>

        </div>
      </main>
    </DashboardLayout>
  );
};

export default NinjaFinance;
