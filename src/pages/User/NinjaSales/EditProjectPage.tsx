import { type FC, useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FiArrowLeft, FiLoader, FiSave, FiFlag,
  FiCheckCircle, FiArrowRight, FiShield, FiCalendar,
  FiClock, FiPercent, FiFolder, FiDollarSign, FiFileText, FiTrash2
} from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaSalesService } from "../../../services/ninjaSales";
import { apiClient } from "../../../services/apiClient";
import type { Project } from "../../../services/ninjaSales";
import IconSelect from "../../../components/IconSelect";
import AlertModal from "../../../components/AlertModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Field: FC<{ label: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
  <div className="space-y-2.5">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">{label}</label>
    {icon ? (
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">{icon}</div>
        {children}
      </div>
    ) : children}
  </div>
);

const EditProjectPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  /** Same rule the backend enforces for delete: only the account owner or a manager */
  const canDelete = Boolean(user && (!user.addedBy || user.teamRole === "Manager"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadId, setLeadId] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", pipelineStage: "new", value: 0, currency: "USD",
    priority: "medium", confidence: 50, nextStep: "", competitor: "",
    urgency: "", budgetConfirmed: false, forecastedCloseDate: "",
  });

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: Project }>(`/ninja-sales/projects/${id}`);
      if (res.success && res.data) {
        const p = res.data;
        setForm({
          name: p.name || "", description: p.description || "",
          pipelineStage: p.pipelineStage || "new", value: p.value || 0,
          currency: p.currency || "USD", priority: p.priority || "medium",
          confidence: p.confidence || 50, nextStep: p.nextStep || "",
          competitor: p.competitor || "", urgency: p.urgency || "",
          budgetConfirmed: p.budgetConfirmed || false,
          forecastedCloseDate: p.forecastedCloseDate ? p.forecastedCloseDate.split("T")[0] : "",
        });
        const lead = typeof p.leadId === "object" ? p.leadId : null;
        if (lead) { setLeadName(lead.name || "Unknown"); setLeadId(lead._id); }
      }
    } catch {}
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!id || !form.name.trim()) return;
    setSaving(true);
    const res = await ninjaSalesService.updateProject(id, {
      ...form, value: Number(form.value), confidence: Number(form.confidence),
      forecastedCloseDate: form.forecastedCloseDate || undefined,
      urgency: form.urgency || undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Deal updated");
      navigate(`/ai-tools/sales/projects/${id}`);
    } else {
      toast.error(res.message || "Could not save deal changes");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const res = await ninjaSalesService.deleteProject(id);
    setDeleting(false);
    if (res.success) {
      toast.success("Project moved to trash");
      navigate("/ai-tools/sales/projects");
    } else {
      toast.error(res.message || "Could not delete project");
      setIsDeleteOpen(false);
    }
  };

  const handleLogout = async () => { try { await logout(); } catch {} finally { navigate("/login", { replace: true }); } };

  const inputBase = "w-full h-12 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 transition-all";
  const withIcon = `${inputBase} pl-12 pr-4`;
  const selectStyle = "bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-0 h-12 text-sm";

  return (
    <DashboardLayout activePath="/ai-tools/sales/projects" title="Edit Project - Ninja Sales" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
        ) : (
          <div className="p-4 md:p-6 lg:p-8 text-white pb-20 space-y-8">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <Link to={`/ai-tools/sales/projects/${id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
                  <FiArrowLeft className="w-3.5 h-3.5" /> Back to Project Details
                </Link>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Edit Project</h1>
                {leadName && <p className="text-sm text-white/40 flex items-center gap-2">Linked to <Link to={`/ai-tools/sales/leads/${leadId}`} className="text-red-500 font-bold hover:text-red-400 transition-colors">{leadName}</Link></p>}
              </div>
              <div className="flex items-center gap-3">
                {canDelete && (
                  <button onClick={() => setIsDeleteOpen(true)} className="h-12 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2.5">
                    <FiTrash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <button onClick={() => navigate(`/ai-tools/sales/projects/${id}`)} className="h-12 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">Cancel</button>
                <button onClick={handleSubmit} disabled={saving || !form.name.trim()}
                  className="h-12 px-8 bg-red-600 hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/20 transition-all disabled:opacity-40 flex items-center gap-2.5">
                  {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left: Deal Info */}
              <div className="xl:col-span-5">
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl space-y-7">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiFolder className="w-4 h-4 text-red-500" /></div>
                    <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Deal Information</h2>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Project Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} className={`${inputBase} px-5`} placeholder="Website redesign" />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Description</label>
                    <div className="relative"><div className="absolute left-4 top-3.5 text-white/20"><FiFileText className="w-4 h-4" /></div>
                      <textarea rows={1} value={form.description} onChange={e => handleChange("description", e.target.value)} placeholder="Brief scope of the deal..."
                        className={`${inputBase} pl-12 pr-4 py-3 h-auto resize-none`} /></div>
                  </div>

                  <div className="grid grid-cols-8 gap-5">
                    <div className="col-span-5">
                      <Field label="Estimated Deal Value" icon={<FiDollarSign className="w-4 h-4" />}><input type="number" min={0} value={form.value} onChange={e => handleChange("value", parseInt(e.target.value) || 0)} className={withIcon} /></Field>
                    </div>
                    <div className="col-span-3">
                      <Field label="Currency">
                        <IconSelect value={form.currency} onChange={v => handleChange("currency", v)} className={selectStyle}
                          options={["USD","EUR","GBP","CAD","AUD","INR"].map(c => ({ value: c, label: c, icon: <FiDollarSign className="w-4 h-4" /> }))} />
                      </Field>
                    </div>
                  </div>

                  <Field label="Forecasted Close Date" icon={<FiCalendar className="w-4 h-4" />}>
                    <input type="date" value={form.forecastedCloseDate} onChange={e => handleChange("forecastedCloseDate", e.target.value)} className={`${withIcon} [color-scheme:dark]`} />
                  </Field>
                </div>
              </div>

              {/* Right: Pipeline + Qualification stacked */}
              <div className="xl:col-span-7 space-y-6">
                {/* Pipeline Card */}
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl space-y-7">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiFlag className="w-4 h-4 text-red-500" /></div>
                    <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Pipeline</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="Pipeline Stage">
                      <IconSelect value={form.pipelineStage} onChange={v => handleChange("pipelineStage", v)} className={selectStyle}
                        options={[
                          { value: "new", label: "New", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "contacted", label: "Contacted", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "qualified", label: "Qualified", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "proposal", label: "Proposal", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "negotiation", label: "Negotiation", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "hold", label: "Hold", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "converted", label: "Converted", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "closed-won", label: "Closed Won", icon: <FiFlag className="w-4 h-4" /> },
                          { value: "closed-lost", label: "Closed Lost", icon: <FiFlag className="w-4 h-4" /> },
                        ]} />
                    </Field>
                    <Field label="Priority">
                      <IconSelect value={form.priority} onChange={v => handleChange("priority", v)} className={selectStyle}
                        options={[["low","Low"],["medium","Medium"],["high","High"],["urgent","Urgent"]].map(([v,l]) => ({ value: v, label: l, icon: <FiFlag className="w-4 h-4" /> }))} />
                    </Field>
                    <Field label="Urgency">
                      <IconSelect value={form.urgency} onChange={v => handleChange("urgency", v)} placeholder="Select timeline" className={selectStyle}
                        options={[{ value: "", label: "None", icon: <FiClock className="w-4 h-4" /> },{ value: "immediate", label: "Immediate", icon: <FiClock className="w-4 h-4" /> },{ value: "1-3", label: "1-3 Months", icon: <FiClock className="w-4 h-4" /> },{ value: "3-6", label: "3-6 Months", icon: <FiClock className="w-4 h-4" /> },{ value: "long-term", label: "6+ Months", icon: <FiClock className="w-4 h-4" /> }]} />
                    </Field>
                  </div>
                </div>

                {/* Qualification Card */}
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl space-y-5">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiShield className="w-4 h-4 text-red-500" /></div>
                    <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Qualification</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Confidence Score" icon={<FiPercent className="w-4 h-4" />}><input type="number" min={0} max={100} value={form.confidence} onChange={e => handleChange("confidence", parseInt(e.target.value) || 0)} className={withIcon} /></Field>
                    <Field label="Immediate Next Step" icon={<FiArrowRight className="w-4 h-4" />}><input type="text" value={form.nextStep} onChange={e => handleChange("nextStep", e.target.value)} className={withIcon} placeholder="Schedule demo" /></Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Primary Competitor" icon={<FiShield className="w-4 h-4" />}><input type="text" value={form.competitor} onChange={e => handleChange("competitor", e.target.value)} className={withIcon} placeholder="Who else is bidding?" /></Field>
                    <div className="flex items-end">
                  <label className="w-full flex items-center gap-3 cursor-pointer group bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 hover:border-red-500/20 transition-all h-12">
                    <div className="relative flex items-center justify-center"><input type="checkbox" className="peer sr-only" checked={form.budgetConfirmed} onChange={e => handleChange("budgetConfirmed", e.target.checked)} /><div className="w-5 h-5 bg-white/[0.03] border border-white/10 rounded-lg peer-checked:bg-red-600 peer-checked:border-red-600 transition-all" /><FiCheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-all" /></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-wider group-hover:text-white/70 transition-colors">Budget Confirmed</span>
                  </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AlertModal
        isOpen={isDeleteOpen}
        type="danger"
        action="delete"
        title="Delete this project?"
        message={`"${form.name}" will be moved to trash, along with any linked follow-ups — recoverable from Trash. Proposals and invoices already generated for it are not affected.`}
        confirmText="Delete Project"
        loadingText="Deleting..."
        isLoading={deleting}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
};

export default EditProjectPage;
