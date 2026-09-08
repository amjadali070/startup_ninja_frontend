import { type FC, useState } from "react";
import {
  FiX, FiMail, FiPhone, FiBriefcase, FiAward, FiLoader, FiArrowRight, FiLock,
  FiStar, FiActivity, FiUserCheck, FiUserX, FiHeart, FiThumbsUp, FiThumbsDown,
  FiPauseCircle, FiSlash, FiGlobe, FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaSalesService } from "../../services/ninjaSales";
import IconSelect from "../IconSelect";

const DEFAULT_FORM_DATA = {
  name: "", email: "", phone: "", company: "", jobTitle: "",
  source: "Other", leadStatus: "new", notes: "", decisionMaker: false,
};

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateLeadModal: FC<CreateLeadModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState<typeof DEFAULT_FORM_DATA>(DEFAULT_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    const res = await ninjaSalesService.createLead({
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      jobTitle: formData.jobTitle || undefined,
      source: formData.source || undefined,
      leadStatus: formData.leadStatus || "new",
      notes: formData.notes || undefined,
      decisionMaker: formData.decisionMaker,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Lead created");
      onCreated?.();
      onClose();
      resetForm();
    } else {
      setError({ message: res.message || "Failed to create lead" });
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
            <h2 className="text-2xl font-bold text-white tracking-tight">New Lead</h2>
            <p className="text-gray-400 text-sm mt-1">Add a lead — you can create a deal for them later</p>
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
                <p className="text-[15px] font-bold text-white leading-tight">Could not create lead</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{error.message}</p>
              </div>
              <button onClick={() => setError(null)} className="shrink-0 p-1 hover:bg-white/5 rounded-md transition-colors text-gray-500 hover:text-white self-start">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white ml-0.5">Full Name <span className="text-[#E11D48] ml-0.5">*</span></label>
            <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white ml-0.5">Email</label>
            <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiMail className="w-4 h-4" /></div>
              <input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={iconInputClass} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Phone</label>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiPhone className="w-4 h-4" /></div>
                <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={iconInputClass} /></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Company</label>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiBriefcase className="w-4 h-4" /></div>
                <input type="text" placeholder="Acme Corp" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} className={iconInputClass} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Job Title</label>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiAward className="w-4 h-4" /></div>
                <input type="text" placeholder="Product Manager" value={formData.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} className={iconInputClass} /></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Source</label>
              <IconSelect value={formData.source} onChange={v => handleChange("source", v)} className={selectClass}
                options={["LinkedIn","Website","Referral","Cold Outreach","Google Ads","Instagram","Partner","Direct","Other"].map(s => ({ value: s, label: s, icon: <FiGlobe className="w-4 h-4" /> }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white ml-0.5">Lead Status</label>
            <IconSelect value={formData.leadStatus} onChange={v => handleChange("leadStatus", v)} className={selectClass}
              options={[
                { value: "new", label: "New", icon: <FiStar className="w-4 h-4" /> },
                { value: "contacted", label: "Contacted", icon: <FiPhone className="w-4 h-4" /> },
                { value: "engaged", label: "Engaged", icon: <FiActivity className="w-4 h-4" /> },
                { value: "qualified", label: "Qualified", icon: <FiUserCheck className="w-4 h-4" /> },
                { value: "unqualified", label: "Unqualified", icon: <FiUserX className="w-4 h-4" /> },
                { value: "nurturing", label: "Nurturing", icon: <FiHeart className="w-4 h-4" /> },
                { value: "converted", label: "Converted", icon: <FiThumbsUp className="w-4 h-4" /> },
                { value: "lost", label: "Lost", icon: <FiThumbsDown className="w-4 h-4" /> },
                { value: "inactive", label: "Inactive", icon: <FiPauseCircle className="w-4 h-4" /> },
                { value: "do-not-contact", label: "Do Not Contact", icon: <FiSlash className="w-4 h-4" /> },
              ]} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white ml-0.5">Notes</label>
            <textarea rows={2} placeholder="Notes about this lead..." value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer sr-only" checked={formData.decisionMaker} onChange={(e) => handleChange("decisionMaker", e.target.checked)} />
              <div className="w-5 h-5 bg-[#161618] border border-[#27272A] rounded peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all" />
              <FiCheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-all" />
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">This person is a decision maker</span>
          </label>
        </div>

        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !formData.name.trim()}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center gap-2">
            {saving && <FiLoader className="w-4 h-4 animate-spin" />} Create Lead <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLeadModal;
