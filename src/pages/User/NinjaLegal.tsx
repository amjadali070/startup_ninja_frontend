import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
// import ComingSoon from "../ComingSoon";

import NinjaLegalHeader from "../../components/ninja-legal/NinjaLegalHeader";
import NinjaLegalStats from "../../components/ninja-legal/NinjaLegalStats";
import NinjaStrategist from "../../components/ninja-legal/NinjaStrategist";
import ContractGeneration from "../../components/ninja-legal/ContractGeneration";
import ComplianceMonitor from "../../components/ninja-legal/ComplianceMonitor";
import ActiveContractsList from "../../components/ninja-legal/ActiveContractsList";
import LegalAIAdvancedModule from "../../components/ninja-legal/LegalAIAdvancedModule";
import AddContractModal from "../../components/ninja-legal/AddContractModal";
import ViewContractModal from "../../components/ninja-legal/ViewContractModal";
import { ContractDetails, KpiData, ninjaLegalService } from "../../services/ninja-legal";


const NinjaLegal: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractCreatedTrigger, setContractCreatedTrigger] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContractData, setSelectedContractData] = useState<ContractDetails | undefined>();
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [isKpiLoading, setIsKpiLoading] = useState(false);

  // Function to fetch KPI data
  const fetchKpis = async () => {
    setIsKpiLoading(true);
    try {
      const response = await ninjaLegalService.getContractKpis();
      if (response.success && response.data) {
        setKpiData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch KPI data:", error);
    } finally {
      setIsKpiLoading(false);
    }
  };

  // Fetch KPI data on component mount
  useEffect(() => {
    fetchKpis();
  }, []);

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
    setIsContractModalOpen(true);
  };

  const handleContractCreated = () => {
    // Trigger contracts list refresh
    setContractCreatedTrigger(prev => prev + 1);
    // Refresh KPI data
    fetchKpis();
  };

  const handleViewContract = (contractData: ContractDetails) => {
    setSelectedContractData(contractData);
    setIsViewModalOpen(true);
  };

  const handleContractUpdated = () => {
    // Trigger contracts list refresh
    setContractCreatedTrigger(prev => prev + 1);
    // Refresh KPI data
    fetchKpis();
  };

  // return <ComingSoon title="Ninja Legal" />;

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <NinjaStrategist />
            </div>
            <div className="lg:col-span-1">
              <ContractGeneration key={contractCreatedTrigger} onViewContract={handleViewContract} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div>
              <ComplianceMonitor kpiData={kpiData} isLoading={isKpiLoading} />
            </div>
            <div>
              <ActiveContractsList key={contractCreatedTrigger} onViewContract={handleViewContract} />
            </div>
          </div>

          <div className="mb-10">
            <LegalAIAdvancedModule />
          </div>

        </div>
      </main>

      <AddContractModal 
        isOpen={isContractModalOpen} 
        onClose={() => setIsContractModalOpen(false)}
        onContractCreated={handleContractCreated}
      />

      <ViewContractModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContractData(undefined);
        }}
        contractData={selectedContractData}
        isLoading={false}
        onContractUpdated={handleContractUpdated}
      />
    </DashboardLayout>
  );
  
};

export default NinjaLegal;
