import { useState } from "react";
import { FiZap, FiArrowLeft, FiCheckCircle, FiEdit3 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import PreGenerationModal from "../../../components/ninja-legal/PreGenerationModal";
import GeneratedContractPreview from "../../../components/ninja-legal/GeneratedContractPreview.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout";

interface GeneratedContract {
  generatedContractId: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>;
  startDate: string;
  headerLogo?: string | null;
  footerText?: string | null;
}

interface GenerateContractLocationState {
  contractId?: string;
  contractTitle?: string;
}

export const ContractGenerationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [generatedContract, setGeneratedContract] = useState<GeneratedContract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const routeState = location.state as GenerateContractLocationState | null;

  const handleGenerationComplete = (data: GeneratedContract, isPreloaded: boolean = false) => {
    setGeneratedContract(data);
    setIsPreloaded(isPreloaded);
  };

  const handleStartNewGeneration = () => {
    setGeneratedContract(null);
    setIsPreloaded(false);
  };

  const handleBackToDashboard = () => {
    navigate("/ai-tools/legal");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <DashboardLayout onLogout={handleLogout}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-8 max-w-auto mx-auto text-white pb-20">
          {/* Hero Header Section */}
          <div className="space-y-6">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToDashboard}
                className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 active:scale-95"
              >
                <FiArrowLeft className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-lg" />
                    <FiZap className="w-8 h-8 text-red-500 relative" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white">Contract Generation</h1>
                    <p className="text-white/50 text-sm mt-1">AI-powered contract generation with live preview</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-8 flex-1">
                {/* Step 1: Setup */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    generatedContract ? "bg-red-600/20 text-red-500" : "bg-red-600 text-white"
                  }`}>
                    1
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Setup</span>
                </div>

                {/* Arrow 1 */}
                <div className={`flex-1 h-1 rounded-full transition-all ${
                  generatedContract ? "bg-red-600/30" : "bg-white/10"
                }`} />

                {/* Step 2: Generate */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    generatedContract ? "bg-red-600/20 text-red-500" : "bg-white/10 text-white/50"
                  }`}>
                    {generatedContract ? <FiCheckCircle className="w-5 h-5" /> : "2"}
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Generate</span>
                </div>

                {/* Arrow 2 */}
                <div className={`flex-1 h-1 rounded-full transition-all ${
                  generatedContract ? "bg-red-600/30" : "bg-white/10"
                }`} />

                {/* Step 3: Review */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    generatedContract ? "bg-red-600/20 text-red-500" : "bg-white/10 text-white/50"
                  }`}>
                    3
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Review</span>
                </div>

                {/* Arrow 3 */}
                <div className={`flex-1 h-1 rounded-full transition-all ${
                  generatedContract ? "bg-red-600/30" : "bg-white/10"
                }`} />

                {/* Step 4: Export */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    generatedContract ? "bg-red-600/20 text-red-500" : "bg-white/10 text-white/50"
                  }`}>
                    4
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Export</span>
                </div>
              </div>
            </div>

            {/* Info Cards Row */}
            {generatedContract && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Sections Count */}
                <div className="bg-gradient-to-br from-red-600/10 to-red-600/5 border border-red-600/20 rounded-2xl p-4 group transition-all hover:border-red-600/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest">Sections</p>
                      <p className="text-2xl font-black text-red-500 mt-1">{generatedContract.sections.length}</p>
                    </div>
                    <FiEdit3 className="w-8 h-8 text-red-600/20 group-hover:text-red-600/40 transition-all" />
                  </div>
                </div>

                {/* Effective Date */}
                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 group transition-all hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Effective Date</p>
                      <p className="text-lg font-black text-white mt-1">{new Date(generatedContract.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all flex items-center justify-center">
                      <FiZap className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 group transition-all hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Logo</p>
                      <p className="text-lg font-black text-white mt-1">{generatedContract.headerLogo ? "✓ Added" : "—"}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all flex items-center justify-center">
                      <HiSparkles className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 group transition-all hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-black text-white">{isPreloaded ? "Loaded" : "Generated"}</p>
                        {isPreloaded && <span className="text-[8px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded font-black uppercase">Cached</span>}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Grid: Side-by-Side Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch min-h-[70vh]">
            {/* Left Panel: Controls */}
            <div className="xl:col-span-4 flex flex-col">
              <PreGenerationModal
                onGenerationComplete={handleGenerationComplete}
                isLoading={isLoading}
                onLoadingChange={setIsLoading}
                generatedContract={generatedContract}
                onGenerateNew={handleStartNewGeneration}
                initialContractId={routeState?.contractId}
              />
            </div>

            {/* Right Panel: Live Preview */}
            <div className="xl:col-span-8 flex flex-col">
              {generatedContract ? (
                <GeneratedContractPreview
                  generatedContract={generatedContract}
                  onGenerateNew={handleStartNewGeneration}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-white/[0.03] to-white/0 border border-white/5 rounded-3xl overflow-hidden relative group transition-all hover:border-white/10">
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="text-center relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FiZap className="w-10 h-10 text-red-500 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <p className="text-white font-black text-lg tracking-tight">Generate a Contract</p>
                    <p className="text-white/40 text-sm mt-2">Fill in the setup form to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ContractGenerationPage;
