import { type FC, useState, useEffect, useRef, useCallback } from "react";
import { 
  FiX, FiHelpCircle, FiCalendar, FiMail, FiPhone, FiBriefcase, 
  FiAward, FiPercent, FiArrowRight, FiShield, 
  FiClock, FiCheckCircle, FiLoader, FiDollarSign,
  FiStar, FiActivity, FiUserCheck, FiUserX, FiHeart, FiThumbsUp,
  FiThumbsDown, FiPauseCircle, FiSlash,
  FiCircle, FiMessageCircle, FiSend, FiTrendingUp, FiLock, FiUnlock,
  FiAlertTriangle, FiZap as FiZapIcon,
  FiFileText
} from "react-icons/fi";
import { ninjaSalesService, LeadSearchResult } from "../../services/ninjaSales";
import IconSelect from "../IconSelect";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

function getLeadInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return (name.slice(0, 2) || "??").toUpperCase();
}

function matchSubtitleLabel(results: LeadSearchResult[]): string {
  if (results.length === 0) return "";
  if (results.length > 1) return `${results.length} existing clients`;
  const first = results[0];
  const co = first.company?.trim();
  if (co) return co;
  const at = first.email.indexOf("@");
  return at > 0 ? first.email.slice(0, at) : first.email;
}

const AddProjectModal: FC<AddProjectModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", jobTitle: "", notes: "", leadStatus: "new",
    projectName: "", description: "", pipelineStage: "new", value: "", currency: "USD",
    confidence: "50", priority: "medium", nextStep: "", competitor: "",
    forecastedCloseDate: "", urgency: "", budgetConfirmed: false,
  });
  const [saving, setSaving] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<LeadSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isExistingLead, setIsExistingLead] = useState(false);
  const [possibleMatchDismissed, setPossibleMatchDismissed] = useState(false);
  const [error, setError] = useState<{ message: string; limit?: number; usage?: number; feature?: string } | null>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emailRef.current && !emailRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLeads = useCallback(async (email: string) => {
    if (email.length < 2) { setSearchResults([]); setShowDropdown(false); return; }
    setIsSearching(true);
    const res = await ninjaSalesService.searchLeadsByEmail(email);
    if (res.success) { setSearchResults(res.data); setShowDropdown(res.data.length > 0); }
    setIsSearching(false);
  }, []);

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    setSelectedLeadId(null);
    setIsExistingLead(false);
    setPossibleMatchDismissed(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLeads(value), 300);
  };

  const handleSelectLead = (lead: LeadSearchResult) => {
    setSelectedLeadId(lead._id);
    setIsExistingLead(true);
    setFormData(prev => ({ ...prev, name: lead.name, email: lead.email, phone: lead.phone || "", company: lead.company || "", jobTitle: lead.jobTitle || "" }));
    setShowDropdown(false);
    setSearchResults([]);
    setPossibleMatchDismissed(false);
  };

  const handleDismissPossibleMatch = () => {
    setPossibleMatchDismissed(true);
    setShowDropdown(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "", email: "", phone: "", company: "", jobTitle: "", notes: "", leadStatus: "new",
      projectName: "", description: "", pipelineStage: "new", value: "", currency: "USD",
      confidence: "50", priority: "medium", nextStep: "", competitor: "",
      forecastedCloseDate: "", urgency: "", budgetConfirmed: false,
    });
    setSelectedLeadId(null); setIsExistingLead(false); setSearchResults([]); setPossibleMatchDismissed(false); setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.projectName.trim()) return;
    setSaving(true);
    const res = await ninjaSalesService.createProject({
      leadId: selectedLeadId || undefined,
      leadData: !selectedLeadId ? {
        name: formData.name, email: formData.email || undefined,
        phone: formData.phone || undefined, company: formData.company || undefined,
        jobTitle: formData.jobTitle || undefined, notes: formData.notes || undefined,
        leadStatus: formData.leadStatus || "new",
      } : undefined,
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
      onCreated?.(); 
      onClose(); 
      resetForm(); 
    } else {
      setError({ 
        message: res.message || "Failed to create project",
        limit: (res as any).limit,
        usage: (res as any).usage,
        feature: (res as any).feature
      });
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all";
  const iconInputClass = "w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all";
  const selectClass = "bg-[#161618] border border-[#27272A] rounded-lg px-4 py-0 h-[46px] text-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">New Lead & Project</h2>
            <p className="text-gray-400 text-sm mt-1">Add a new lead or select an existing one, then create a project deal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"><FiX className="w-6 h-6" /></button>
        </div>
        <div className="border-t border-[#1C1C1F] mx-6" />

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <FiLock className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-white leading-tight">Subscription Limit Reached</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  {error.message}
                </p>
                <button 
                  onClick={() => window.location.href = '/settings'}
                  className="mt-3 text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  Upgrade Plan to Continue <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button onClick={() => setError(null)} className="shrink-0 p-1 hover:bg-white/5 rounded-md transition-colors text-gray-500 hover:text-white self-start">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SECTION 1: CLIENT INFORMATION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">Client Information</h3>
              {isExistingLead && <span className="ml-auto px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-black text-emerald-500 uppercase tracking-widest">Existing Lead</span>}
            </div>
            <div className="space-y-6">
              <div className="space-y-2" ref={emailRef}>
                <label className="text-xs font-semibold text-white ml-0.5">Email <span className="text-[#E11D48] ml-0.5">*</span><span className="text-gray-500 text-[10px] ml-2 font-normal">Type to search existing leads</span></label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiMail className="w-4 h-4" /></div>
                  <input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => handleEmailChange(e.target.value)} onFocus={() => { if (searchResults.length > 0 && !possibleMatchDismissed) setShowDropdown(true); }} className={`${iconInputClass} pr-10`} />
                  {isSearching && <div className="absolute right-3.5 top-1/2 -translate-y-1/2"><FiLoader className="w-4 h-4 text-gray-500 animate-spin" /></div>}
                  {showDropdown && searchResults.length > 0 && !possibleMatchDismissed && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] shadow-2xl overflow-hidden max-h-[min(70vh,420px)] flex flex-col">
                      <div className="p-4 pb-3 border-b border-amber-200/60">
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200/80 flex items-center justify-center shrink-0">
                            <FiAlertTriangle className="w-5 h-5 text-amber-600" aria-hidden />
                          </div>
                          <div className="min-w-0 pt-0.5">
                            <p className="text-[15px] font-bold text-amber-950 leading-tight">Possible match found</p>
                            <p className="text-[13px] text-amber-900/80 mt-1 leading-snug">
                              {searchResults.length === 1
                                ? <>We found an existing client matching &quot;{matchSubtitleLabel(searchResults)}&quot;.</>
                                : <>We found {searchResults.length} existing clients matching your search.</>}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-3 space-y-3 overflow-y-auto custom-scrollbar">
                        {searchResults.map((lead) => (
                          <div
                            key={lead._id}
                            className="flex items-center gap-3 rounded-lg border border-[#FDE68A] bg-[#E5E7EB] px-3 py-3 shadow-sm"
                          >
                            <div
                              className="w-11 h-11 rounded-lg bg-[#FEF3C7] border border-amber-200/90 flex items-center justify-center shrink-0 text-[13px] font-bold text-amber-950 tabular-nums"
                              aria-hidden
                            >
                              {getLeadInitials(lead.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{lead.name}</p>
                              <p className="text-[12px] text-slate-600 truncate">{lead.email}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSelectLead(lead)}
                              className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#D97706] hover:bg-[#B45309] transition-colors shadow-sm"
                            >
                              Use This
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 pb-4 pt-0 flex justify-center">
                        <button
                          type="button"
                          onClick={handleDismissPossibleMatch}
                          className="text-[13px] font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950 transition-colors"
                        >
                          Create new anyway
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Full Name <span className="text-[#E11D48] ml-0.5">*</span></label>
                <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} disabled={isExistingLead} className={`${inputClass} ${isExistingLead ? 'opacity-60 cursor-not-allowed' : ''}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Phone</label>
                  <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiPhone className="w-4 h-4" /></div>
                    <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} disabled={isExistingLead} className={`${iconInputClass} ${isExistingLead ? 'opacity-60 cursor-not-allowed' : ''}`} /></div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Company</label>
                  <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiBriefcase className="w-4 h-4" /></div>
                    <input type="text" placeholder="Acme Corp" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} disabled={isExistingLead} className={`${iconInputClass} ${isExistingLead ? 'opacity-60 cursor-not-allowed' : ''}`} /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Job Title</label>
                  <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><FiAward className="w-4 h-4" /></div>
                    <input type="text" placeholder="Product Manager" value={formData.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} disabled={isExistingLead} className={`${iconInputClass} ${isExistingLead ? 'opacity-60 cursor-not-allowed' : ''}`} /></div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Client Notes</label>
                  <input type="text" placeholder="Notes about the client..." value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} className={inputClass} />
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

              {isExistingLead && (
                <button onClick={() => { setSelectedLeadId(null); setIsExistingLead(false); }} className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors">
                  Clear selection &mdash; enter new lead instead
                </button>
              )}
            </div>
          </section>

          {/* SECTION 2: DEAL DETAILS */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">Deal Details</h3>
            </div>
            <div className="space-y-6">
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
                      { value: "urgent", label: "Urgent", icon: <FiZapIcon className="w-4 h-4" /> },
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
            </div>
          </section>

          {/* SECTION 3: QUALIFICATION */}
          <section className="space-y-6 pt-2 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">Qualification</h3>
            </div>
            <div className="space-y-6">
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
          </section>
        </div>

        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-medium transition-colors"><FiHelpCircle className="w-4 h-4" /><span>How do leads & projects work?</span></button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !formData.name.trim() || !formData.projectName.trim()}
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center gap-2">
              {saving && <FiLoader className="w-4 h-4 animate-spin" />} Create Lead & Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
