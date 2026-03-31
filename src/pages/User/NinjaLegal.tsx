import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import NinjaLegalHeader from "../../components/ninja-legal/NinjaLegalHeader";
import NinjaLegalStats from "../../components/ninja-legal/NinjaLegalStats";
import NinjaStrategist from "../../components/ninja-legal/NinjaStrategist";
import ContractGeneration from "../../components/ninja-legal/ContractGeneration";
import ComplianceMonitor from "../../components/ninja-legal/ComplianceMonitor";
import ActiveContractsList from "../../components/ninja-legal/ActiveContractsList";
import LegalAIAdvancedModule from "../../components/ninja-legal/LegalAIAdvancedModule";

const NinjaLegal: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Legal logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const handleNewContract = () => {
    // This will eventually open a modal or navigate to a creation page
    console.log("Starting a new contract...");
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/legal"
      title="Ninja Legal"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 text-white min-h-screen">
          <NinjaLegalHeader onNewContract={handleNewContract} />

          <NinjaLegalStats />

          {/* AI Strategist and Contract Generation Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <NinjaStrategist />
            </div>
            <div className="lg:col-span-1">
              <ContractGeneration />
            </div>
          </div>

          {/* Compliance monitor and Active Contracts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div>
              <ComplianceMonitor />
            </div>
            <div>
              <ActiveContractsList />
            </div>
          </div>

          {/* Advanced AI Module Section */}
          <div className="mb-10">
            <LegalAIAdvancedModule />
          </div>

        </div>
      </main>
    </DashboardLayout>
  );
};

export default NinjaLegal;
