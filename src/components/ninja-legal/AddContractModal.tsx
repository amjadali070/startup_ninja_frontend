import { type FC, useState } from "react";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiUser,
  FiMail,
  FiMapPin,
  FiDollarSign,
  FiFlag,
  FiCalendar,
  FiLoader,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaLegalService, ContractDetails, DOCUMENT_TYPES } from "../../services/ninja-legal";
import IconSelect from "../IconSelect";

interface Party {
  name: string;
  type: "individual" | "company";
  email?: string;
  address?: string;
}

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContractCreated?: (contract: ContractDetails) => void;
}

interface FormErrors {
  contractTitle?: string;
  purpose?: string;
  parties?: string;
  termsConditions?: string;
  expiryDate?: string;
}

// One year out — a sensible default contract term, and pre-filling it means the form is
// submittable without the user needing to touch a field that has no natural default.
function defaultExpiryDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

const AddContractModal: FC<AddContractModalProps> = ({ isOpen, onClose, onContractCreated }) => {
  const [contractTitle, setContractTitle] = useState("");
  const [documentType, setDocumentType] = useState("general");
  const [purpose, setPurpose] = useState("");
  const [priority, setPriority] = useState("medium");
  const [contractWorth, setContractWorth] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [contractStatus, setContractStatus] = useState("active");
  const [expiryDate, setExpiryDate] = useState(defaultExpiryDate());
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [parties, setParties] = useState<Party[]>([
    {
      name: "",
      type: "individual",
      email: "",
      address: ""
    },
  ]);

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

    if (!expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    }

    // if (!purpose.trim()) {
    //   newErrors.purpose = "Purpose of Contract is required";
    // }

    // const invalidParties = parties.filter(party => !party.name.trim());
    // if (invalidParties.length > 0) {
    //   newErrors.parties = "All parties must have a name";
    // }

    // if (!termsConditions.trim()) {
    //   newErrors.termsConditions = "Terms & Conditions are required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateContract = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const formData = {
      contractTitle,
      documentType,
      purpose,
      priority,
      parties: parties.map(party => ({
        name: party.name,
        type: party.type,
        email: party.email || null,
        address: party.address || null
      })),
      contractWorth: contractWorth || null,
      termsConditions,
      contractStatus,
      expiryDate,
    };

    // console.log("Contract Data:", formData);
    console.table(formData);

    try {
      const response:any = await ninjaLegalService.createContract(formData);
      if (response.success) {
        console.log("Contract created successfully!", response.data);
        toast.success(response.message || "Contract created successfully!");

        // Trigger the parent component to refresh contracts list and activate chat
        if (onContractCreated && response.data) {
          onContractCreated(response.data);
        }

        setTimeout(() => {
          setContractTitle("");
          setDocumentType("general");
          setPurpose("");
          setPriority("medium");
          setContractWorth("");
          setTermsConditions("");
          setContractStatus("active");
          setExpiryDate(defaultExpiryDate());
          setParties([
            {
              name: "",
              type: "individual",
              email: "",
              address: ""
            },
            
          ]);
          setErrors({});
          setIsLoading(false);
          onClose();
        }, 1500);
      } else {
        toast.error(response.message || "Failed to create contract");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error creating contract:", error);
      toast.error(error?.message || "Failed to create contract. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form on close to sample data
    setContractTitle("");
    setDocumentType("general");
    setPurpose("");
    setPriority("medium");
    setContractWorth("");
    setTermsConditions("");
    setContractStatus("active");
    setExpiryDate(defaultExpiryDate());
    setParties([
            {
              name: "",
              type: "individual",
              email: "",
              address: ""
            },
            
          ]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create New Contract</h2>
            <p className="text-gray-400 text-sm mt-1">Set up a new legal contract with all necessary details</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="border-t border-[#1C1C1F] mx-6" />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
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

              {/* Document Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Document Type
                </label>
                <IconSelect
                  value={documentType}
                  onChange={setDocumentType}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 h-[46px] text-sm focus:outline-none focus:ring-1 focus:border-[#E11D48]/50 focus:ring-[#E11D48]/20 transition-all"
                  options={DOCUMENT_TYPES.map((dt) => ({ value: dt.id, label: dt.label, icon: <FiFileText className="w-4 h-4" /> }))}
                />
                <p className="text-[11px] text-gray-500">Shapes the sections AI generates — e.g. an NDA focuses on confidentiality, a Privacy Policy on data handling.</p>
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
                  <IconSelect
                    value={priority}
                    onChange={setPriority}
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 h-[46px] text-sm focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    options={[
                      { value: "low", label: "Low Priority", icon: <FiFlag className="w-4 h-4" /> },
                      { value: "medium", label: "Medium Priority", icon: <FiFlag className="w-4 h-4" /> },
                      { value: "high", label: "High Priority", icon: <FiFlag className="w-4 h-4" /> },
                      { value: "urgent", label: "Urgent", icon: <FiFlag className="w-4 h-4" /> },
                    ]}
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">
                    Expiry Date <span className="text-[#E11D48] ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => {
                        setExpiryDate(e.target.value);
                        if (errors.expiryDate) setErrors({ ...errors, expiryDate: undefined });
                      }}
                      className={`w-full bg-[#161618] border rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none transition-all [color-scheme:dark] ${
                        errors.expiryDate
                          ? "border-red-500/50 focus:border-red-500/50"
                          : "border-[#27272A] focus:border-[#E11D48]/50"
                      }`}
                    />
                  </div>
                  {errors.expiryDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>
                  )}
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
                    <IconSelect
                      value={party.type}
                      onChange={(v) => updateParty(index, "type", v as "individual" | "company")}
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 h-[46px] text-sm focus:outline-none focus:border-[#E11D48]/50 transition-all"
                      options={[
                        { value: "individual", label: "Individual", icon: <FiUser className="w-4 h-4" /> },
                        { value: "company", label: "Company", icon: <FiBriefcase className="w-4 h-4" /> },
                      ]}
                    />
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
                        onChange={(e) => setContractStatus(e.target.value)}
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
                        onChange={(e) => setContractStatus(e.target.value)}
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-end">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateContract}
              disabled={isLoading}
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Contract"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContractModal;
