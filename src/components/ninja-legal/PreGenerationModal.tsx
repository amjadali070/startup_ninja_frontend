import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ninjaLegalService, ContractListItem } from "../../services/ninja-legal";
import LoadingSpinner from "../LoadingSpinner";
import { FiChevronDown, FiUpload, FiFileText, FiCalendar } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

interface PreGenerationModalProps {
  onGenerationComplete: (data: any, isPreloaded?: boolean) => void;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
  generatedContract?: any;
  onGenerateNew?: () => void;
  initialContractId?: string;
}

export const PreGenerationModal = ({
  onGenerationComplete,
  isLoading,
  onLoadingChange,
  generatedContract,
  onGenerateNew,
  initialContractId,
}: PreGenerationModalProps) => {
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [footerText, setFooterText] = useState<string>("");
  const [loadingContracts, setLoadingContracts] = useState(true);

  // Fetch available contracts
  useEffect(() => {
    fetchContracts();
  }, []);

  // Check if selected contract has been generated before
  useEffect(() => {
    if (selectedContractId) {
      checkGeneratedContract(selectedContractId);
    }
  }, [selectedContractId]);

  // Populate form fields when contract is loaded
  useEffect(() => {
    if (generatedContract) {
      // Fill in the start date
      setStartDate(generatedContract.startDate);
      
      // Fill in the header logo if it exists
      if (generatedContract.headerLogo) {
        setHeaderLogo(generatedContract.headerLogo);
      }
      
      // Fill in the footer text if it exists
      if (generatedContract.footerText) {
        setFooterText(generatedContract.footerText);
      }
    }
  }, [generatedContract]);

  useEffect(() => {
    if (initialContractId && !selectedContractId) {
      setSelectedContractId(initialContractId);
    }
  }, [initialContractId, selectedContractId]);

  const checkGeneratedContract = async (contractId: string) => {
    try {
      const response = await ninjaLegalService.getLatestGeneratedContract(contractId);
      if (response.success && response.data) {
        // Found a previously generated contract
        onGenerationComplete(response.data, true);
        toast.success("Loaded previously generated contract!");
      }
    } catch (err) {
      // No previously generated contract, that's fine
      console.log("No previous generation found");
    }
  };

  const fetchContracts = async () => {
    setLoadingContracts(true);
    try {
      const response = await ninjaLegalService.listContracts(1, "active");
      if (response.success && response.data) {
        setContracts(response.data);
      } else {
        toast.error(response.message || "Failed to load contracts");
      }
    } catch (err) {
      toast.error("Error loading contracts");
    } finally {
      setLoadingContracts(false);
    }
  };

  const handleHeaderLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHeaderLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateOrView = async () => {
    // If contract already generated, show it
    if (generatedContract) {
      toast.success("Contract already generated. Scroll down to view it!");
      return;
    }

    if (!selectedContractId) {
      toast.error("Please select a contract");
      return;
    }

    if (!startDate) {
      toast.error("Please select an effective start date");
      return;
    }

    onLoadingChange(true);
    try {
      const response = await ninjaLegalService.generateContractSections(
        selectedContractId,
        {
          startDate,
          headerLogo,
          footerText: footerText || null,
        }
      );

      if (response.success && response.data) {
        onGenerationComplete(response.data, false);
      } else {
        toast.error(response.message || "Failed to generate contract sections");
      }
    } catch (err: any) {
      toast.error(err.message || "Error generating contract sections");
    } finally {
      onLoadingChange(false);
    }
  };

//   const handleGenerateNewVersion = async () => {
//     if (!selectedContractId) {
//       toast.error("Please select a contract");
//       return;
//     }

//     if (!startDate) {
//       toast.error("Please select an effective start date");
//       return;
//     }

//     onLoadingChange(true);
//     try {
//       const response = await ninjaLegalService.generateContractSections(
//         selectedContractId,
//         {
//           startDate,
//           headerLogo,
//           footerText: footerText || null,
//         }
//       );

//       if (response.success && response.data) {
//         onGenerationComplete(response.data, false);
//         toast.success("Contract updated with new version!");
//       } else {
//         toast.error(response.message || "Failed to generate contract sections");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Error generating contract sections");
//     } finally {
//       onLoadingChange(false);
//     }
//   };

  return (
    <div className="space-y-6">
      {/* Header Section with Visual Divider */}
      <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/20 to-red-600/10 border border-red-600/20 flex items-center justify-center">
                <FiFileText className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white">Contract Setup</h2>
            </div>
            <p className="text-white/50 text-sm mt-1">Configure generation parameters</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0" />
      </div>

      {/* Step 1: Contract Selection */}
      <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 space-y-6 shadow-2xl group hover:border-white/[0.05] transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5">
            <span className="text-sm font-black text-white">1</span>
          </div>
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Select Contract Template
          </label>
        </div>

        {loadingContracts ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative group">
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl px-6 pr-12 text-sm font-black text-white appearance-none transition-all outline-none cursor-pointer"
              >
                <option value="" className="bg-[#121212]">-- Select a Contract --</option>
                {contracts.map((contract) => (
                  <option key={contract.contractId} value={contract.contractId} className="bg-[#121212]">
                    {contract.contractTitle} ({contract.contractStatus})
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none transition-transform group-hover:text-white/30" />
            </div>
            
            {selectedContractId && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Selected Contract</p>
                <p className="text-sm font-black text-white mt-2">
                  {contracts.find(c => c.contractId === selectedContractId)?.contractTitle}
                </p>
              </div>
            )}
          </div>
        )}

        {contracts.length === 0 && !loadingContracts && (
          <p className="text-white/40 text-sm px-4 py-6 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
            No active contracts. Create one to get started.
          </p>
        )}
      </div>

      {/* Step 2: Effective Start Date */}
      <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 space-y-6 shadow-2xl group hover:border-white/[0.05] transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5">
            <span className="text-sm font-black text-white">2</span>
          </div>
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Effective Start Date
          </label>
        </div>

        <div className="relative group">
          <FiCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 pointer-events-none" />
          <input
            type="date"
            value={startDate ? new Date(startDate).toISOString().split("T")[0] : ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-14 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl pl-14 pr-6 text-sm font-black text-white
                       transition-all outline-none cursor-pointer focus:border-red-500/50"
          />
        </div>

        {startDate && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Contract Effective</p>
            <p className="text-sm font-black text-white mt-2">
              {new Date(startDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        )}
      </div>

      {/* Step 3: Branding Options */}
      <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 space-y-6 shadow-2xl group hover:border-white/[0.05] transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5">
            <span className="text-sm font-black text-white">3</span>
          </div>
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Branding (Optional)
          </label>
        </div>

        {/* Header Logo Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Header Logo</label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleHeaderLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="w-full h-14 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl px-6 
                         text-sm font-black text-white cursor-pointer transition-all outline-none flex items-center justify-center gap-2 active:scale-95"
            >
              <FiUpload className="w-4 h-4" />
              {headerLogo ? "✓ Logo Selected" : "Upload Logo"}
            </label>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-white/0 via-white/5 to-white/0" />

        {/* Footer Text */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Footer Text</label>
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="e.g., Company details, address, legal notice..."
            rows={3}
            className="w-full bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl p-4 text-sm font-medium text-white placeholder-white/20 transition-all outline-none resize-none focus:border-red-500/50"
          />
          <p className="text-[9px] text-white/30">Optional: Add footer text to appear at the bottom of your contract</p>
        </div>
      </div>

      {/* Divider Section */}
      <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

      {/* Generate Button with Animation */}
      <button
        onClick={handleGenerateOrView}
        disabled={isLoading || (!generatedContract && (!selectedContractId || !startDate))}
        className={`relative w-full h-16 text-white rounded-3xl flex items-center justify-center gap-3 font-black transition-all shadow-xl active:scale-95 group overflow-hidden ${
          generatedContract 
            ? "bg-white/10 hover:bg-white/20 shadow-white/10" 
            : "bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-red-600/20"
        }`}
      >
        {/* Animated background effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse ${
          generatedContract ? "bg-gradient-to-r from-white/0 via-white/20 to-white/0" : "bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0"
        }`} />
        
        <HiSparkles className={`w-6 h-6 relative ${!generatedContract ? "animate-bounce" : ""}`} />
        <span className="uppercase tracking-[0.2em] text-sm relative">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse mx-0.5" />
              Generating...
              <span className="w-1 h-1 bg-white rounded-full animate-pulse mx-0.5" />
            </span>
          ) : generatedContract ? (
            "View Generated Contract"
          ) : (
            "Generate Contract Sections"
          )}
        </span>
      </button>

      {/* Generate New Button (shown when contract is generated) */}
      {generatedContract && onGenerateNew && (
        <button
          onClick={onGenerateNew}
          className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95"
        >
          Generate New Version
        </button>
      )}
    </div>
  );
};

export default PreGenerationModal;
