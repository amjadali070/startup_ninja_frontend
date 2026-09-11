import { type FC, useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FiArrowLeft, FiLoader, FiSave, FiMail, FiPhone, FiBriefcase,
  FiAward, FiCheckCircle, FiTarget, FiZap, FiUser, FiActivity,
  FiStar, FiUserCheck, FiUserX, FiHeart, FiThumbsUp, FiThumbsDown,
  FiPauseCircle, FiSlash, FiFilter, FiTrash2, FiDollarSign, FiArrowRight, FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaSalesService } from "../../../services/ninjaSales";
import type { SelectOption } from "../../../components/IconSelect";
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

const EditLeadPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  /** Same rule the backend enforces for delete: only the account owner or a manager */
  const canDelete = Boolean(user && (!user.addedBy || user.teamRole === "Manager"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", jobTitle: "",
    source: "Other", assignedToUserId: "", campaign: "", notes: "",
    decisionMaker: false, leadStatus: "new",
    estimatedValue: "", nextAction: "", lastContactAt: "",
  });
  const [assigneeOptions, setAssigneeOptions] = useState<SelectOption[]>([]);
  /** When the saved assignee is no longer on the team roster, keep their id selectable until changed */
  const [assigneeGhostLabel, setAssigneeGhostLabel] = useState<string | null>(null);

  const fetchLead = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const res = await ninjaSalesService.getLeadById(id);
    if (res.success && res.data) {
      const l = res.data;
      setAssigneeGhostLabel(
        l.assignedToUserId
          ? l.assignee?.fullname || l.assignedTo || null
          : null
      );
      setForm({
        name: l.name || "", email: l.email || "", phone: l.phone || "",
        company: l.company || "", jobTitle: l.jobTitle || "",
        source: l.source || "Other",
        assignedToUserId: l.assignedToUserId ? String(l.assignedToUserId) : "",
        campaign: l.campaign || "", notes: l.notes || "",
        decisionMaker: l.decisionMaker || false, leadStatus: l.leadStatus || "new",
        estimatedValue: l.estimatedValue ? String(l.estimatedValue) : "",
        nextAction: l.nextAction || "",
        lastContactAt: l.lastContactAt ? new Date(l.lastContactAt).toISOString().slice(0, 10) : "",
      });
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await ninjaSalesService.getTeamAssignees();
      if (cancelled || !res.success || !res.data) return;
      const members = res.data.members || [];
      const opts: SelectOption[] = [
        { value: "", label: "Unassigned", icon: <FiFilter className="w-4 h-4" /> },
        ...members.map((m) => ({
          value: m._id,
          label: m.isOwner ? `${m.fullname} (Owner)` : m.fullname,
          icon: <FiUser className="w-4 h-4" />,
        })),
      ];
      setAssigneeOptions(opts);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mergedAssigneeOptions = useMemo(() => {
    const unassignedOpt: SelectOption = {
      value: "",
      label: "Unassigned",
      icon: <FiFilter className="w-4 h-4" />,
    };
    const base =
      assigneeOptions.length > 0 ? assigneeOptions : [unassignedOpt];
    const uid = form.assignedToUserId;
    if (!uid || base.some((o) => o.value === uid)) return base;
    return [
      ...base,
      {
        value: uid,
        label: assigneeGhostLabel
          ? `${assigneeGhostLabel} (not in current team)`
          : "Previous assignee (not in current team)",
        icon: <FiUser className="w-4 h-4" />,
      },
    ];
  }, [assigneeOptions, form.assignedToUserId, assigneeGhostLabel]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!id || !form.name.trim()) return;
    setSaving(true);
    const res = await ninjaSalesService.updateLead(id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      jobTitle: form.jobTitle,
      source: form.source,
      leadStatus: form.leadStatus,
      campaign: form.campaign,
      notes: form.notes,
      decisionMaker: form.decisionMaker,
      assignedToUserId: form.assignedToUserId === "" ? null : form.assignedToUserId,
      estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : 0,
      nextAction: form.nextAction,
      lastContactAt: form.lastContactAt ? new Date(form.lastContactAt).toISOString() : undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Lead updated");
      navigate(`/ai-tools/sales/leads/${id}`);
    } else {
      toast.error(res.message || "Could not save lead changes");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const res = await ninjaSalesService.deleteLead(id);
    setDeleting(false);
    if (res.success) {
      const n = res.data?.cascaded?.projects || 0;
      toast.success(n > 0 ? `Lead and ${n} linked project${n === 1 ? "" : "s"} moved to trash` : "Lead moved to trash");
      navigate("/ai-tools/sales/leads");
    } else {
      toast.error(res.message || "Could not delete lead");
      setIsDeleteOpen(false);
    }
  };

  const handleLogout = async () => { try { await logout(); } catch {} finally { navigate("/login", { replace: true }); } };

  const inputBase = "w-full h-12 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 transition-all";
  const withIcon = `${inputBase} pl-12 pr-4`;
  const selectStyle = "bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-0 h-12 text-sm";

  return (
    <DashboardLayout activePath="/ai-tools/sales/leads" title="Edit Lead - Ninja Sales" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
        ) : (
          <div className="p-4 md:p-6 lg:p-8 text-white pb-20 space-y-8">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <Link to={`/ai-tools/sales/leads/${id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
                  <FiArrowLeft className="w-3.5 h-3.5" /> Back to Lead Details
                </Link>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Edit Lead</h1>
                <p className="text-sm text-white/40">{form.name || "Untitled"} {form.company ? `at ${form.company}` : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                {canDelete && (
                  <button onClick={() => setIsDeleteOpen(true)} className="h-12 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2.5">
                    <FiTrash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <button onClick={() => navigate(`/ai-tools/sales/leads/${id}`)} className="h-12 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">Cancel</button>
                <button onClick={handleSubmit} disabled={saving || !form.name.trim()}
                  className="h-12 px-8 bg-red-600 hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/20 transition-all disabled:opacity-40 flex items-center gap-2.5">
                  {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left: Contact Info */}
              <div className="xl:col-span-6">
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl space-y-7">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiUser className="w-4 h-4 text-red-500" /></div>
                    <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Contact Information</h2>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} className={`${inputBase} px-5`} placeholder="John Doe" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Email" icon={<FiMail className="w-4 h-4" />}><input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} className={withIcon} placeholder="john@example.com" /></Field>
                    <Field label="Phone" icon={<FiPhone className="w-4 h-4" />}><input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} className={withIcon} placeholder="+1 555 000-0000" /></Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Company" icon={<FiBriefcase className="w-4 h-4" />}><input type="text" value={form.company} onChange={e => handleChange("company", e.target.value)} className={withIcon} placeholder="Acme Corp" /></Field>
                    <Field label="Job Title" icon={<FiAward className="w-4 h-4" />}><input type="text" value={form.jobTitle} onChange={e => handleChange("jobTitle", e.target.value)} className={withIcon} placeholder="Product Manager" /></Field>
                  </div>

                  <Field label="Assigned To (team)">
                    <IconSelect
                        value={
                          form.assignedToUserId &&
                          mergedAssigneeOptions.some((o) => o.value === form.assignedToUserId)
                            ? form.assignedToUserId
                            : ""
                        }
                        onChange={(v) => handleChange("assignedToUserId", v)}
                        options={mergedAssigneeOptions}
                        placeholder="Unassigned"
                        className={`${selectStyle} w-full`}
                      />
                    <p className="text-[10px] text-white/25 mt-1.5 leading-relaxed">
                      Only your account owner and managers can assign leads. The list includes you (owner) and members added under Team Management.
                    </p>
                  </Field>
                </div>
              </div>

              {/* Right: Acquisition & Notes */}
              <div className="xl:col-span-6 space-y-6">
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl space-y-7">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiTarget className="w-4 h-4 text-red-500" /></div>
                    <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Acquisition</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Inbound Channel">
                      <IconSelect value={form.source} onChange={v => handleChange("source", v)} className={selectStyle}
                        options={["LinkedIn","Website","Referral","Cold Outreach","Google Ads","Instagram","Partner","Direct","Other"].map(s => ({ value: s, label: s, icon: <FiTarget className="w-4 h-4" /> }))} />
                    </Field>
                    <Field label="Lead Status">
                      <IconSelect value={form.leadStatus} onChange={v => handleChange("leadStatus", v)} className={selectStyle}
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
                    </Field>
                  </div>
                  <Field label="Campaign Attribution" icon={<FiZap className="w-4 h-4" />}><input type="text" value={form.campaign} onChange={e => handleChange("campaign", e.target.value)} className={withIcon} placeholder="Q2 Growth Campaign" /></Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Estimated Value" icon={<FiDollarSign className="w-4 h-4" />}><input type="text" value={form.estimatedValue} onChange={e => handleChange("estimatedValue", e.target.value)} className={withIcon} placeholder="0.00" /></Field>
                    <Field label="Last Contact" icon={<FiCalendar className="w-4 h-4" />}><input type="date" value={form.lastContactAt} onChange={e => handleChange("lastContactAt", e.target.value)} className={`${withIcon} [color-scheme:dark]`} /></Field>
                  </div>
                  <Field label="Next Action" icon={<FiArrowRight className="w-4 h-4" />}><input type="text" value={form.nextAction} onChange={e => handleChange("nextAction", e.target.value)} className={withIcon} placeholder="e.g. Follow up on pricing questions" /></Field>

                  <label className="flex items-center gap-3 cursor-pointer group bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 hover:border-red-500/20 transition-all">
                    <div className="relative flex items-center justify-center"><input type="checkbox" className="peer sr-only" checked={form.decisionMaker} onChange={e => handleChange("decisionMaker", e.target.checked)} /><div className="w-5 h-5 bg-white/[0.03] border border-white/10 rounded-lg peer-checked:bg-red-600 peer-checked:border-red-600 transition-all" /><FiCheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-all" /></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-wider group-hover:text-white/70 transition-colors">This contact is a Decision Maker</span>
                  </label>
                </div>

                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl space-y-5">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiActivity className="w-4 h-4 text-red-500" /></div>
                    <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Notes</h2>
                  </div>
                  <textarea rows={5} value={form.notes} onChange={e => handleChange("notes", e.target.value)} placeholder="Internal notes about this lead..."
                    className={`${inputBase} px-5 py-4 h-auto resize-none`} />
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
        title="Delete this lead?"
        message={`"${form.name}" will be moved to trash, along with any linked projects, tasks and follow-ups — all recoverable from Trash. Proposals and invoices already generated for this lead are not affected.`}
        confirmText="Delete Lead"
        loadingText="Deleting..."
        isLoading={deleting}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
};

export default EditLeadPage;
