import { type FC, useState } from "react";
import { FiX, FiLoader, FiUser, FiMail, FiMapPin, FiDollarSign, FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiFlag, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import { ContractDetails, ninjaLegalService } from "../../services/ninja-legal";

interface Party {
  name: string;
  type: "individual" | "company";
  email?: string | null;
  address?: string | null;
}

interface FormErrors {
  contractTitle?: string;
  purpose?: string;
  parties?: string;
  termsConditions?: string;
}

interface ViewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractData?: ContractDetails;
  isLoading?: boolean;
  onContractUpdated?: () => void;
}

const ViewContractModal: FC<ViewContractModalProps> = ({
  isOpen,
  onClose,
  contractData,
  isLoading = false,
  onContractUpdated,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form states for edit mode
  const [contractTitle, setContractTitle] = useState(contractData?.contractTitle || "");
  const [purpose, setPurpose] = useState(contractData?.purpose || "");
  const [priority, setPriority] = useState(contractData?.priority || "high");
  const [contractWorth, setContractWorth] = useState(contractData?.contractWorth || "");
  const [termsConditions, setTermsConditions] = useState(contractData?.termsConditions || "");
  const [contractStatus, setContractStatus] = useState(contractData?.contractStatus || "active");
  const [expiryDate, setExpiryDate] = useState(contractData?.expiryDate?.split("T")[0] || "");
  const [parties, setParties] = useState<Party[]>(() => {
    if (!contractData?.parties) return [];
    return contractData.parties.map(p => ({
      ...p,
      email: p.email || undefined,
      address: p.address || undefined
    }));
  });
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDaysRemaining = (expiryDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const timeDiff = expiry.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const isExpiringWithin90Days = (expiryDate: string): boolean => {
    return getDaysRemaining(expiryDate) <= 90 && getDaysRemaining(expiryDate) > 0;
  };

  const isExpired = (expiryDate: string): boolean => {
    return getDaysRemaining(expiryDate) <= 0;
  };

  const addParty = () => {
    const newParty: Party = {
      name: "",
      type: "individual",
      email: "",
      address: ""
    };
    setParties([...parties, newParty]);
  };

  const removeParty = (index: number) => {
    if (parties.length > 1) {
      setParties(parties.filter((_, i) => i !== index));
    }
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    setParties(parties.map((party, i) => 
      i === index ? { ...party, [field]: value } : party
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!contractTitle.trim()) {
      newErrors.contractTitle = "Contract Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateContract = async () => {
    if (!validateForm()) return;
    if (!contractData) return;

    try {
      setIsUpdating(true);
      const response = await ninjaLegalService.updateContract(contractData._id, {
        contractTitle,
        purpose,
        priority,
        parties,
        contractWorth: contractWorth || null,
        termsConditions,
        contractStatus,
        expiryDate,
      });

      if (response.success) {
        toast.success("Contract updated successfully!");
        setIsEditMode(false);
        onContractUpdated?.();
        onClose();
      } else {
        toast.error(response.message || "Failed to update contract");
      }
    } catch (error) {
      toast.error("Failed to update contract");
    } finally {
      setIsUpdating(false);
    }
  };

  const enterEditMode = () => {
    if (contractData) {
      setContractTitle(contractData.contractTitle);
      setPurpose(contractData.purpose);
      setPriority(contractData.priority);
      setContractWorth(contractData.contractWorth || "");
      setTermsConditions(contractData.termsConditions);
      setContractStatus(contractData.contractStatus);
      setExpiryDate(contractData.expiryDate?.split("T")[0] || "");
      const partiesData = (contractData.parties || []).map(p => ({
        ...p,
        email: p.email || undefined,
        address: p.address || undefined
      }));
      setParties(partiesData);
      setIsEditMode(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-3xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-[#1C1C1F]">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isEditMode ? "Edit Contract" : "Contract Details"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isEditMode ? "Update contract information" : "View complete contract information"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                onClick={enterEditMode}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-[#E11D48]"
                title="Edit Contract"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={isEditMode ? () => setIsEditMode(false) : onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <FiLoader className="w-8 h-8 animate-spin text-[#E11D48]" />
            </div>
          ) : isEditMode ? (
            // EDIT MODE FORM
            <>
              {/* CONTRACT SETUP */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">CONTRACT SETUP</h3>
                </div>

                <div className="space-y-6">
                  {/* Contract Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white ml-0.5">
                      Contract Title <span className="text-[#E11D48] ml-0.5">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Service Agreement with Acme Corp"
                      value={contractTitle}
                      onChange={(e) => {
                        setContractTitle(e.target.value);
                        if (errors.contractTitle) setErrors({ ...errors, contractTitle: undefined });
                      }}
                      className={`w-full bg-[#161618] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.contractTitle 
                          ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" 
                          : "border-[#27272A] focus:border-[#E11D48]/50 focus:ring-[#E11D48]/20"
                      }`}
                    />
                    {errors.contractTitle && (
                      <p className="text-xs text-red-500 mt-1">{errors.contractTitle}</p>
                    )}
                  </div>

                  {/* Purpose of Contract */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white ml-0.5">
                      Purpose of Contract <span className="text-[#E11D48] ml-0.5">*</span>
                    </label>
                    <textarea 
                      placeholder="Describe the main purpose and scope of this contract..."
                      rows={3}
                      value={purpose}
                      onChange={(e) => {
                        setPurpose(e.target.value);
                        if (errors.purpose) setErrors({ ...errors, purpose: undefined });
                      }}
                      className={`w-full bg-[#161618] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                        errors.purpose
                          ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                          : "border-[#27272A] focus:border-[#E11D48]/50 focus:ring-[#E11D48]/20"
                      }`}
                    />
                    {errors.purpose && (
                      <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>
                    )}
                  </div>

                  {/* Priority & Expiry Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Priority */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white ml-0.5">Priority</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                          <FiFlag className="w-4 h-4" />
                        </div>
                        <select 
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high" | "urgent")}
                          className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                          <FiChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white ml-0.5">Expiry Date</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                          <FiCalendar className="w-4 h-4" />
                        </div>
                        <input 
                          type="date" 
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contract Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white ml-0.5">Contract Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="contract-status" 
                            value="active" 
                            checked={contractStatus === "active"}
                            onChange={(e) => setContractStatus(e.target.value as "active" | "inactive")}
                            className="peer sr-only" 
                          />
                          <div className="w-5 h-5 bg-[#161618] border border-[#27272A] rounded-full peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all" />
                          <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all" />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Active</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="contract-status" 
                            value="inactive" 
                            checked={contractStatus === "inactive"}
                            onChange={(e) => setContractStatus(e.target.value as "active" | "inactive")}
                            className="peer sr-only" 
                          />
                          <div className="w-5 h-5 bg-[#161618] border border-[#27272A] rounded-full peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all" />
                          <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all" />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* PARTIES INVOLVED */}
              <section className="space-y-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">PARTIES INVOLVED</h3>
                </div>

                <div className="space-y-4">
                  {errors.parties && (
                    <p className="text-xs text-red-500">{errors.parties}</p>
                  )}
                  {parties.map((party, index) => (
                    <div key={index} className="p-4 bg-[#101011] border border-[#27272A] rounded-lg space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/70">Party {index + 1}</span>
                        {parties.length > 1 && (
                          <button
                            onClick={() => removeParty(index)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-500/60 hover:text-red-500"
                            title="Delete party"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Party Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white ml-0.5">
                          Party Name <span className="text-[#E11D48] ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                            <FiUser className="w-4 h-4" />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Full name or organization"
                            value={party.name}
                            onChange={(e) => updateParty(index, "name", e.target.value)}
                            className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                          />
                        </div>
                      </div>

                      {/* Party Type */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white ml-0.5">
                          Party Type <span className="text-[#E11D48] ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            value={party.type}
                            onChange={(e) => updateParty(index, "type", e.target.value as "individual" | "company")}
                            className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                          >
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <FiChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Email & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white ml-0.5">Email (Optional)</label>
                          <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                              <FiMail className="w-4 h-4" />
                            </div>
                            <input 
                              type="email" 
                              placeholder="party@example.com"
                              value={party.email || ""}
                              onChange={(e) => updateParty(index, "email", e.target.value)}
                              className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white ml-0.5">Address (Optional)</label>
                          <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                              <FiMapPin className="w-4 h-4" />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Street address"
                              value={party.address || ""}
                              onChange={(e) => updateParty(index, "address", e.target.value)}
                              className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Party Button */}
                  <button
                    onClick={addParty}
                    className="w-full py-3 px-4 border border-dashed border-[#E11D48]/50 rounded-lg text-sm font-medium text-[#E11D48] hover:bg-[#E11D48]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Another Party
                  </button>
                </div>
              </section>

              {/* ADDITIONAL CONTRACT DETAILS */}
              <section className="space-y-6 pt-2 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">ADDITIONAL CONTRACT DETAILS</h3>
                </div>

                <div className="space-y-6">
                  {/* Contract Worth */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white ml-0.5">Contract Worth</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiDollarSign className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={contractWorth}
                        onChange={(e) => setContractWorth(e.target.value)}
                        min="0"
                        step="1"
                        className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white ml-0.5">Terms & Conditions</label>
                    <div className="relative">
                      <textarea 
                        placeholder="Enter contract terms, conditions, and any special clauses..."
                        rows={5}
                        value={termsConditions}
                        onChange={(e) => {
                          setTermsConditions(e.target.value);
                          if (errors.termsConditions) setErrors({ ...errors, termsConditions: undefined });
                        }}
                        className={`w-full bg-[#161618] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                          errors.termsConditions
                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                            : "border-[#27272A] focus:border-[#E11D48]/50 focus:ring-[#E11D48]/20"
                        }`}
                      />
                    </div>
                    {errors.termsConditions && (
                      <p className="text-xs text-red-500 mt-1">{errors.termsConditions}</p>
                    )}
                  </div>
                </div>
              </section>
            </>
          ) : contractData ? (
            <>
              {/* Basic Info */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 ml-0.5">Contract Title</label>
                    <p className="text-sm text-white mt-1">{contractData.contractTitle}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 ml-0.5">Priority</label>
                    <span
                      className={`inline-block text-xs font-bold px-3 py-1 rounded-md border mt-1  ml-2 ${getPriorityColor(
                        contractData.priority
                      )}`}
                    >
                      {contractData.priority.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 ml-0.5">Status</label>
                    <span
                      className={`inline-block text-xs font-bold px-3 py-1 rounded-md border mt-1 ml-2 ${
                        contractData.contractStatus === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {contractData.contractStatus.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 ml-0.5">Expiry Date</label>
                    <p className="text-sm text-white mt-1">{formatDate(contractData.expiryDate)}</p>
                  </div>
                </div>

                {/* Expiry Status Badges */}
                <div className="flex items-center gap-2 flex-wrap mt-4">
                  {isExpired(contractData.expiryDate) && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-md border bg-red-500/20 text-red-400 border-red-500/40">
                      ❌ EXPIRED
                    </span>
                  )}

                  {isExpiringWithin90Days(contractData.expiryDate) && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-md border bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse">
                      ⚠️ EXPIRING SOON
                    </span>
                  )}
                </div>
              </section>

              {/* Purpose */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">
                    Purpose
                  </h3>
                </div>
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed">{contractData.purpose}</p>
                </div>
              </section>

              {/* Parties */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">
                    Parties Involved ({contractData.parties?.length || 0})
                  </h3>
                </div>

                <div className="space-y-3">
                  {contractData.parties && contractData.parties.length > 0 ? (
                    contractData.parties.map((party, index) => (
                      <div key={index} className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#E11D48]/10 rounded-lg border border-[#E11D48]/20">
                            <FiUser className="w-4 h-4 text-[#E11D48]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{party.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {party.type === "individual" ? "Individual" : "Company"}
                            </p>

                            {(party.email || party.address) && (
                              <div className="mt-2 space-y-1.5">
                                {party.email && (
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <FiMail className="w-3 h-3" />
                                    <span>{party.email}</span>
                                  </div>
                                )}
                                {party.address && (
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <FiMapPin className="w-3 h-3" />
                                    <span>{party.address}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No parties found</p>
                  )}
                </div>
              </section>

              {/* Contract Worth */}
              {contractData.contractWorth && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                    <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">
                      Contract Worth
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#E11D48]/10 rounded-lg border border-[#E11D48]/20">
                      <FiDollarSign className="w-4 h-4 text-[#E11D48]" />
                    </div>
                    <p className="text-lg font-bold text-white">${parseInt(contractData.contractWorth).toLocaleString()}</p>
                  </div>
                </section>
              )}

              {/* Terms & Conditions */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                  <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">
                    Terms & Conditions
                  </h3>
                </div>
                <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {contractData.termsConditions}
                  </p>
                </div>
              </section>

              {/* Metadata */}
              <section className="space-y-2 pt-4 border-t border-white/[0.05]">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="text-gray-300 mt-0.5">{formatDate(contractData.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="text-gray-300 mt-0.5">{formatDate(contractData.updatedAt)}</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-sm font-medium">No contract data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-end">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(false)}
                  disabled={isUpdating}
                  className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateContract}
                  disabled={isUpdating}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Contract"
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContractModal;
