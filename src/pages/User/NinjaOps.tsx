import { type FC } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
import ComingSoon from "../ComingSoon";

/*
import NinjaOpsHeader from "../../components/ninja-ops/NinjaOpsHeader";
import NinjaOpsStats from "../../components/ninja-ops/NinjaOpsStats";
import TaskProgressTrend from "../../components/ninja-ops/TaskProgressTrend";
import PerformanceLeaders from "../../components/ninja-ops/PerformanceLeaders";
import OpsAIInsight from "../../components/ninja-ops/OpsAIInsight";
import DepartmentKPIs from "../../components/ninja-ops/DepartmentKPIs";
import WorkloadBalance from "../../components/ninja-ops/WorkloadBalance";
import OpsAdvancedModule from "../../components/ninja-ops/OpsAdvancedModule";
*/

const NinjaOps: FC = () => {
  // const navigate = useNavigate();
  // const { logout } = useAuth();

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (err) {
  //     console.error("Ops logout failed:", err);
  //   } finally {
  //     navigate("/login", { replace: true });
  //   }
  // };

  // const handleOpenSettings = () => {
  //   navigate("/settings");
  // };

  /*
  const handleNewInitiative = () => {
    console.log("New Initiative triggered");
  };

  const handleExport = () => {
    console.log("Export CSV triggered");
  };
  */

  return <ComingSoon title="Ninja Ops" />;

  /*
  return (
    <DashboardLayout
      activePath="/ai-tools/ops"
      title="Ninja Ops"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta">
        <div className="p-4 lg:p-8 space-y-8 max-w-full mx-auto text-white min-h-screen">
          <NinjaOpsHeader onNewInitiative={handleNewInitiative} onExport={handleExport} />
          
          <NinjaOpsStats />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-8">
              <TaskProgressTrend />
            </div>
            <div className="lg:col-span-4">
              <PerformanceLeaders />
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#EF4444] blur-[200px] opacity-[0.05] pointer-events-none rounded-full z-0" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              <div className="lg:col-span-4">
                <OpsAIInsight />
              </div>
              <div className="lg:col-span-4">
                <DepartmentKPIs />
              </div>
              <div className="lg:col-span-4">
                <WorkloadBalance />
              </div>
            </div>
          </div>

          <div className="pb-10">
            <OpsAdvancedModule />
          </div>

        </div>
      </main>
    </DashboardLayout>
  );
  */
};

export default NinjaOps;
