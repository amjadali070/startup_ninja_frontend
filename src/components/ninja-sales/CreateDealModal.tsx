import { type FC, useState, useEffect } from "react";
import {
  FiX, FiCalendar, FiPercent, FiArrowRight, FiClock, FiLoader, FiDollarSign,
  FiCircle, FiMessageCircle, FiUserCheck, FiSend, FiTrendingUp, FiPauseCircle,
  FiUnlock, FiCheckCircle, FiLock, FiAlertTriangle, FiZap, FiFileText, FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaSalesService } from "../../services/ninjaSales";
import IconSelect from "../IconSelect";

const DEFAULT_FORM_DATA = {
  projectName: "", description: "", pipelineStage: "new", value: "", currency: "USD",
  confidence: "50", priority: "medium", nextStep: "", competitor: "",
  forecastedCloseDate: "", urgency: "", budgetConfirmed: false,
};

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  leadId: string;
  leadName?: string;
  leadCompany?: string;
}

const CreateDealModal: FC<CreateDealModalProps> = ({ isOpen, onClose, onCreated, leadId, leadName, leadCompany }) => {
  const [formData, setFormData] = useState<typeof DEFAULT_FORM_DATA>(DEFAULT_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    if (isOpen) { setFormData(DEFAULT_FORM_DATA); setError(null); }
  }, [isOpen]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.projectName.trim()) return;
    setSaving(true);
    const res = await ninjaSalesService.createProject({
      leadId,
      name: formData.projectName,
      description: formData.description || undefined,
      pipelineStage: formData.pipelineStage || "new",
      value: formData.value ? parseFloat(formData.value) : 0,
      currency: formData.currency || "USD",
      confidence: parseInt(formData.confidence) || 50,
      priority: formData.priority || "medium",
      nextStep: formData.nextStep || undefined,
      competitor: formData.competitor || undefined,
      forecastedCloseDate: formData.forecastedCloseDate || undefined,
      urgency: formData.urgency || undefined,
      budgetConfirmed: formData.budgetConfirmed,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Deal created");
      onCreated?.();
      onClose();
    } else {
      setError({ message: res.message || "Failed to create deal" });
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all";
  const iconInputClass = "w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all";
  const selectClass = "bg-[#161618] border border-[#27272A] rounded-lg px-4 py-0 h-[46px] text-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">New Deal</h2>
            <p className="text-gray-400 text-sm mt-1">
              {leadName ? <>For <span className="text-white font-semibold">{leadName}</span>{leadCompany ? ` · ${leadCompany}` : ""}</> : "Create a deal for this lead"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"><FiX className="w-6 h-6" /></button>
        </div>
        <div className="border-t border-[#1C1C1F] mx-6" />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <FiLock className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-white leading-tight">Could not create deal</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{error.message}</p>
              </div>
              <button onClick={() => setError(null)} className="shrink-0 p-1 hover:bg-white/5 rounded-md transition-colors text-gray-500 hover:text-white self-start">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white ml-0.5">Project Name <span className="text-[#E11D48] ml-0.5">*</span></label>
            <input type="text" placeholder="e.g. Website redesign for ABC Corp" value={formData.projectName} onChange={(e) => handleChange("projectName", e.target.value)} className={inputClass} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white ml-0.5">Description</label>
            <div className="relative"><div className="absolute left-3.5 top-3.5 text-gray-500"><FiFileText className="w-4 h-4" /></div>
              <textarea rows={2} placeholder="Brief scope or description of the deal..." value={formData.description} onChange={(e) => handleChange("description", e.target.value)}
                className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none" /></div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Estimated Deal Value</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FiDollarSign className="w-4 h-4" /></div>
                <input type="text" placeholder="0.00" value={formData.value} onChange={(e) => handleChange("value", e.target.value)} className={iconInputClass} />
              </div>
            </div>
            <div className="col-span-4 space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Currency</label>
              <IconSelect value={formData.currency} onChange={v => handleChange("currency", v)} className={selectClass}
                options={["USD","EUR","GBP","CAD","AUD","INR"].map(c => ({ value: c, label: c, icon: <FiDollarSign className="w-4 h-4" /> }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Pipeline Stage <span className="text-[#E11D48] ml-0.5">*</span></label>
              <IconSelect value={formData.pipelineStage} onChange={v => handleChange("pipelineStage", v)} placeholder="Select stage" className={selectClass}
                options={[
                  { value: "new", label: "New", icon: <FiCircle className="w-4 h-4" /> },
                  { value: "contacted", label: "Contacted", icon: <FiMessageCircle className="w-4 h-4" /> },
                  { value: "qualified", label: "Qualified", icon: <FiUserCheck className="w-4 h-4" /> },
                  { value: "proposal", label: "Proposal", icon: <FiSend className="w-4 h-4" /> },
                  { value: "negotiation", label: "Negotiation", icon: <FiTrendingUp className="w-4 h-4" /> },
                  { value: "hold", label: "Hold", icon: <FiPauseCircle className="w-4 h-4" /> },
                  { value: "converted", label: "Converted", icon: <FiUnlock className="w-4 h-4" /> },
                  { value: "closed-won", label: "Closed Won", icon: <FiCheckCircle className="w-4 h-4" /> },
                  { value: "closed-lost", label: "Closed Lost", icon: <FiLock className="w-4 h-4" /> },
                ]} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Priority</label>
              <IconSelect value={formData.priority} onChange={v => handleChange("priority", v)} className={selectClass}
                options={[
                  { value: "low", label: "Low", icon: <FiArrowRight className="w-4 h-4 -rotate-45" /> },
                  { value: "medium", label: "Medium", icon: <FiArrowRight className="w-4 h-4" /> },
                  { value: "high", label: "High", icon: <FiAlertTriangle className="w-4 h-4" /> },
                  { value: "urgent", label: "Urgent", icon: <FiZap className="w-4 h-4" /> },
                ]} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Forecasted Close Date</label>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiCalendar className="w-4 h-4" /></div>
                <input type="date" value={formData.forecastedCloseDate} onChange={(e) => handleChange("forecastedCloseDate", e.target.value)} className={`${iconInputClass} [color-scheme:dark]`} /></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Urgency</label>
              <IconSelect value={formData.urgency} onChange={v => handleChange("urgency", v)} placeholder="Select timeline" className={selectClass}
                options={[{ value: "immediate", label: "Immediate", icon: <FiClock className="w-4 h-4" /> },{ value: "1-3", label: "1-3 Months", icon: <FiClock className="w-4 h-4" /> },{ value: "3-6", label: "3-6 Months", icon: <FiClock className="w-4 h-4" /> },{ value: "long-term", label: "6+ Months", icon: <FiClock className="w-4 h-4" /> }]} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Confidence Score</label>
              <IconSelect value={formData.confidence} onChange={v => handleChange("confidence", v)} className={selectClass}
                options={[{ value: "10", label: "10% - Very Low", icon: <FiPercent className="w-4 h-4" /> },{ value: "25", label: "25% - Low", icon: <FiPercent className="w-4 h-4" /> },{ value: "50", label: "50% - Moderate", icon: <FiPercent className="w-4 h-4" /> },{ value: "75", label: "75% - High", icon: <FiPercent className="w-4 h-4" /> },{ value: "90", label: "90% - Very High", icon: <FiPercent className="w-4 h-4" /> }]} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Immediate Next Step</label>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiArrowRight className="w-4 h-4" /></div>
                <input type="text" placeholder="e.g. Schedule demo" value={formData.nextStep} onChange={(e) => handleChange("nextStep", e.target.value)} className={iconInputClass} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Primary Competitor</label>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiShield className="w-4 h-4" /></div>
                <input type="text" placeholder="Who else are they talking to?" value={formData.competitor} onChange={(e) => handleChange("competitor", e.target.value)} className={iconInputClass} /></div>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" checked={formData.budgetConfirmed} onChange={(e) => handleChange("budgetConfirmed", e.target.checked)} />
                  <div className="w-5 h-5 bg-[#161618] border border-[#27272A] rounded peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all" />
                  <FiCheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-all" />
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Budget has been confirmed</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !formData.projectName.trim()}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center gap-2">
            {saving && <FiLoader className="w-4 h-4 animate-spin" />} Create Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDealModal;
