import { type FC, useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FiArrowLeft, FiLoader, FiUser, FiEdit3, FiFolder, FiCheckCircle, FiXCircle,
  FiTarget, FiDollarSign, FiClock, FiShield, FiFilePlus,
  FiMoreVertical, FiSend, FiPhone, FiMail, FiBriefcase, FiAward,
  FiCircle, FiMessageCircle, FiUserCheck, FiTrendingUp, FiPauseCircle, FiUnlock, FiLock,
  FiRefreshCw, FiTrash2
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import { apiClient } from "../../../services/apiClient";
import { ninjaSalesService } from "../../../services/ninjaSales";
import type { Project, FollowUp, ProjectAiSuggestions } from "../../../services/ninjaSales";
import NewOutreachModal from "../../../components/ninja-sales/NewOutreachModal";
import IconSelect from "../../../components/IconSelect";
import GenerateDocModal from "../../../components/ninja-sales/GenerateDocModal";
import AlertModal from "../../../components/AlertModal";

const priorityColor: Record<string, string> = {
  urgent: "bg-red-600 text-white", high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400", low: "bg-emerald-500/20 text-emerald-400",
};

const stageLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  proposal: "Proposal", negotiation: "Negotiation",
  hold: "Hold", converted: "Converted",
  "closed-won": "Closed Won", "closed-lost": "Closed Lost",
};

const leadStatusLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", engaged: "Engaged", qualified: "Qualified",
  unqualified: "Unqualified", nurturing: "Nurturing", converted: "Converted",
  lost: "Lost", inactive: "Inactive", "do-not-contact": "Do Not Contact",
};

const leadStatusColor: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400", contacted: "bg-purple-500/10 text-purple-400",
  engaged: "bg-cyan-500/10 text-cyan-400", qualified: "bg-emerald-500/10 text-emerald-500",
  unqualified: "bg-red-500/10 text-red-400", nurturing: "bg-yellow-500/10 text-yellow-400",
  converted: "bg-emerald-500/10 text-emerald-500", lost: "bg-red-500/10 text-red-500",
  inactive: "bg-white/10 text-white/40", "do-not-contact": "bg-red-600/20 text-red-500",
};

const urgencyLabels: Record<string, string> = {
  immediate: "Immediate", "1-3": "1-3 Months", "3-6": "3-6 Months", "long-term": "6+ Months",
};

const priorityLabels: Record<string, string> = {
  low: "Low", medium: "Medium", high: "High", urgent: "Urgent",
};

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A";

const pipelineStages = ["new", "contacted", "qualified", "proposal", "negotiation", "converted", "closed-won"];

const stageOptions = [
  { value: "new", label: "New", icon: <FiCircle className="w-4 h-4" /> },
  { value: "contacted", label: "Contacted", icon: <FiMessageCircle className="w-4 h-4" /> },
  { value: "qualified", label: "Qualified", icon: <FiUserCheck className="w-4 h-4" /> },
  { value: "proposal", label: "Proposal", icon: <FiSend className="w-4 h-4" /> },
  { value: "negotiation", label: "Negotiation", icon: <FiTrendingUp className="w-4 h-4" /> },
  { value: "hold", label: "Hold", icon: <FiPauseCircle className="w-4 h-4" /> },
  { value: "converted", label: "Converted", icon: <FiUnlock className="w-4 h-4" /> },
  { value: "closed-won", label: "Closed Won", icon: <FiCheckCircle className="w-4 h-4" /> },
  { value: "closed-lost", label: "Closed Lost", icon: <FiLock className="w-4 h-4" /> },
];

const ProjectDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  /** Same rule the backend enforces for delete: only the account owner or a manager */
  const canDelete = Boolean(user && (!user.addedBy || user.teamRole === "Manager"));
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ProjectAiSuggestions | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);
  const [projectDocs, setProjectDocs] = useState<{ proposals: any[]; invoices: any[] }>({ proposals: [], invoices: [] });
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: Project }>(`/ninja-sales/projects/${id}`);
      if (res.success) setProject(res.data);
    } catch (err) { console.error("Failed to fetch project:", err); }
    setLoading(false);
  }, [id]);

  const fetchFollowUps = useCallback(async () => {
    if (!id) return;
    const res = await ninjaSalesService.getFollowUps({ projectId: id, page: 1, limit: 200 });
    if (res.success) setFollowUps(res.data);
  }, [id]);

  const loadAiSuggestions = useCallback(async () => {
    if (!id) return;
    setAiLoading(true);
    setAiError(null);
    const res = await ninjaSalesService.postProjectSuggestions(id);
    if (res.success && res.data) setAiSuggestions(res.data);
    else setAiError(res.message || "Could not load AI suggestions");
    setAiLoading(false);
  }, [id]);

  useEffect(() => { fetchProject(); fetchFollowUps(); }, [fetchProject, fetchFollowUps]);

  const fetchProjectDocs = useCallback(async () => {
    if (!id) return;
    setDocsLoading(true);
    const res = await ninjaSalesService.getProjectDocuments(id);
    if (res.success) setProjectDocs(res.data);
    setDocsLoading(false);
  }, [id]);

  useEffect(() => {
    if (project?._id) loadAiSuggestions();
  }, [project?._id, loadAiSuggestions]);

  useEffect(() => {
    if (project?._id) fetchProjectDocs();
  }, [project?._id, fetchProjectDocs]);

  const handleStageChange = async (newStage: string) => {
    if (!id || !project) return;
    const res = await ninjaSalesService.updateProject(id, { pipelineStage: newStage });
    if (res.success) setProject({ ...project, pipelineStage: newStage });
  };

  const handleLogout = async () => { try { await logout(); } catch {} finally { navigate("/login", { replace: true }); } };

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

  const lead = project?.leadId && typeof project.leadId === "object" ? project.leadId : null;
  const stageIdx = pipelineStages.indexOf(project?.pipelineStage || "new");
  const confidenceDash = 552.92 - ((project?.confidence || 0) / 100) * 552.92;

  const openGenerate = () => setIsGenerateModalOpen(true);

  const handleGenerateConfirm = async (payload: any) => {
    if (!id) return;
    setGenerating(true);
    try {
      if (payload.docType === "PROPOSAL") {
        const res = await ninjaSalesService.generateProposalFromProject(id, payload);
        if (res.success) {
          setIsGenerateModalOpen(false);
          await fetchProjectDocs();
          navigate(`/ai-tools/sales/documents/proposal/${res.data._id}`);
        }
      } else {
        const res = await ninjaSalesService.generateInvoiceFromProject(id, payload);
        if (res.success) {
          setIsGenerateModalOpen(false);
          await fetchProjectDocs();
          navigate(`/ai-tools/sales/documents/invoice/${res.data._id}`);
        }
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleFollowUp = async (fu: FollowUp) => {
    setFollowUps(prev => prev.map(f => f._id === fu._id ? { ...f, completed: !f.completed } : f));
    await ninjaSalesService.updateFollowUp(fu._id, { completed: !fu.completed });
    fetchFollowUps();
  };

  return (
    <DashboardLayout activePath="/ai-tools/sales/projects" title="Project Details - Ninja Sales" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-64"><FiLoader className="w-8 h-8 text-red-500 animate-spin" /></div>
        ) : !project ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/40">
            <p className="text-lg font-bold mb-4">Project not found</p>
            <Link to="/ai-tools/sales/projects" className="text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-widest">Back to Projects</Link>
          </div>
        ) : (
          <div className="p-4 md:p-6 lg:p-8 space-y-8 text-white pb-20">

            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
              <div className="space-y-3 w-full xl:w-auto">
                <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                  <Link to="/ai-tools/sales/projects" className="hover:text-red-500 transition-colors">Projects</Link>
                  <span>/</span><span className="text-red-500">Detail View</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white capitalize">{project.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="px-3 py-1 text-[10px] font-black rounded-md uppercase tracking-widest bg-white/10 text-white/60">{stageLabels[project.pipelineStage] || project.pipelineStage}</span>
                  <span className={`px-3 py-1 text-[10px] font-black rounded-md uppercase tracking-widest ${priorityColor[project.priority] || "bg-white/10 text-white/40"}`}>{priorityLabels[project.priority] || project.priority} Priority</span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full xl:w-auto">
                <button onClick={() => navigate("/ai-tools/sales/projects")} className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  <FiArrowLeft className="w-4 h-4" /><span>Back</span>
                </button>
                <button onClick={() => navigate(`/ai-tools/sales/projects/${id}/edit`)} className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
                  <FiEdit3 className="w-4 h-4" /><span>Edit Project</span>
                </button>
                <button onClick={openGenerate} className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  <FiFilePlus className="w-4 h-4" /><span>Generate Document</span>
                </button>
                {canDelete && (
                  <button onClick={() => setIsDeleteOpen(true)} className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <FiTrash2 className="w-4 h-4" /><span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pipeline Progress with Stage Update */}
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Pipeline Progress</h2>
                <div className="w-full sm:w-64">
                  <IconSelect value={project.pipelineStage} onChange={handleStageChange} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-0 h-10 text-sm" options={stageOptions} />
                </div>
              </div>
              <div className="flex gap-2">
                {(() => {
                  const stageBarColors: Record<string, string> = {
                    new: "bg-blue-500", contacted: "bg-purple-500", qualified: "bg-cyan-500",
                    proposal: "bg-yellow-500", negotiation: "bg-orange-500", converted: "bg-teal-500", "closed-won": "bg-emerald-500",
                  };
                  const stageTextColors: Record<string, string> = {
                    new: "text-blue-400", contacted: "text-purple-400", qualified: "text-cyan-400",
                    proposal: "text-yellow-400", negotiation: "text-orange-400", converted: "text-teal-400", "closed-won": "text-emerald-400",
                  };
                  return pipelineStages.map((s, i) => (
                    <div key={s} className="flex-1 space-y-2">
                      <div className={`h-2.5 rounded-full transition-all ${i <= stageIdx ? stageBarColors[s] || "bg-red-600" : "bg-white/[0.04]"}`} />
                      <p className={`text-[7px] font-black uppercase tracking-widest text-center ${i <= stageIdx ? stageTextColors[s] || "text-red-500" : "text-white/15"}`}>{stageLabels[s]}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Row 1: Deal Value + Confidence Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiDollarSign className="w-4 h-4 text-red-500" /></div>
                  <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Deal Value</h2>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">{project.currency || "USD"} {(project.value || 0).toLocaleString()}</p>
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Currency</p><p className="text-sm font-bold text-white/50">{project.currency || "USD"}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Forecasted Close</p><p className="text-sm font-bold text-white/50">{project.forecastedCloseDate ? formatDate(project.forecastedCloseDate) : "N/A"}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Budget</p>{project.budgetConfirmed ? <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-500"><FiCheckCircle className="w-4 h-4" /> Confirmed</span> : <span className="flex items-center gap-1.5 text-sm font-bold text-white/30"><FiXCircle className="w-4 h-4" /> Unconfirmed</span>}</div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl flex items-center gap-8 overflow-hidden">
                <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" style={{ overflow: "visible" }}><circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" /><circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="552.92" strokeDashoffset={confidenceDash} className="text-red-600" /></svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-black text-white tracking-tighter">{project.confidence || 0}</span><span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Score</span></div>
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Confidence Score</h2>
                  <div className="space-y-3">
                    <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Weighted Value</p><p className="text-xl font-black text-red-500 tracking-tighter">${Math.round(((project.value || 0) * (project.confidence || 0)) / 100).toLocaleString()}</p></div>
                    <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Win Probability</p>
                      <div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-600 rounded-full" style={{ width: `${project.confidence || 0}%` }} /></div><span className="text-xs font-black text-white/50">{project.confidence || 0}%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Project Details + Linked Lead */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiFolder className="w-4 h-4 text-red-500" /></div><h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Project Details</h2></div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div className="col-span-2 space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Project Name</p><p className="text-base font-bold text-white capitalize">{project.name}</p></div>
                  {project.description && <div className="col-span-2 space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Description</p><p className="text-sm font-medium text-white/50 leading-relaxed">{project.description}</p></div>}
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Pipeline Stage</p><span className="inline-block px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase bg-white/5 text-white/60">{stageLabels[project.pipelineStage] || project.pipelineStage}</span></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Priority</p><span className={`inline-block px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${priorityColor[project.priority] || "bg-white/5 text-white/40"}`}>{priorityLabels[project.priority] || project.priority}</span></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Urgency</p><p className="text-sm font-bold text-white/70">{project.urgency ? urgencyLabels[project.urgency] || project.urgency : "N/A"}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Forecasted Close</p><p className="text-sm font-bold text-white/70">{project.forecastedCloseDate ? formatDate(project.forecastedCloseDate) : "N/A"}</p></div>
                </div>
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Created</p><p className="text-xs font-bold text-white/40">{formatDate(project.createdAt)}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Updated</p><p className="text-xs font-bold text-white/40">{formatDate(project.updatedAt)}</p></div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiUser className="w-4 h-4 text-red-500" /></div><h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Linked Lead</h2></div>
                {lead ? (
                  <>
                    <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-white/10 flex items-center justify-center text-red-500 font-black text-sm">{lead.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                      <div>
                        <Link to={`/ai-tools/sales/leads/${lead._id}`} className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors">{lead.name}</Link>
                        <p className="text-xs text-white/30">{lead.company || "N/A"}</p>
                      </div>
                    </div>
                    {(lead as any).leadStatus && (
                      <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lead Status</p><span className={`inline-block px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${leadStatusColor[(lead as any).leadStatus] || "bg-white/5 text-white/40"}`}>{leadStatusLabels[(lead as any).leadStatus] || (lead as any).leadStatus}</span></div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3"><FiMail className="w-3.5 h-3.5 text-white/20 flex-shrink-0" /><p className="text-sm font-bold text-white/60 truncate">{lead.email || "N/A"}</p></div>
                      <div className="flex items-center gap-3"><FiPhone className="w-3.5 h-3.5 text-white/20 flex-shrink-0" /><p className="text-sm font-bold text-white/60">{lead.phone || "N/A"}</p></div>
                      <div className="flex items-center gap-3"><FiBriefcase className="w-3.5 h-3.5 text-white/20 flex-shrink-0" /><p className="text-sm font-bold text-white/60">{lead.company || "N/A"}</p></div>
                      <div className="flex items-center gap-3"><FiAward className="w-3.5 h-3.5 text-white/20 flex-shrink-0" /><p className="text-sm font-bold text-white/60">{lead.jobTitle || "N/A"}</p></div>
                    </div>
                    <Link to={`/ai-tools/sales/leads/${lead._id}`} className="inline-flex items-center gap-2 h-10 px-5 bg-red-600/10 border border-red-600/30 rounded-2xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-600/20 transition-all">View Lead Profile</Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center"><FiUser className="w-10 h-10 text-white/10 mb-4" /><p className="text-sm font-bold text-white/30">No Linked Lead</p></div>
                )}
              </div>
            </div>

            {/* Qualification + Key Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Qualification */}
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiShield className="w-4 h-4 text-red-500" /></div><h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Qualification</h2></div>
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Next Step</p><p className="text-sm font-bold text-white/70">{project.nextStep || "N/A"}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Competitor</p><p className="text-sm font-bold text-white/70">{project.competitor || "N/A"}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Budget</p>{project.budgetConfirmed ? <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-500"><FiCheckCircle className="w-4 h-4" /> Confirmed</span> : <span className="flex items-center gap-1.5 text-sm font-bold text-white/30"><FiXCircle className="w-4 h-4" /> Unconfirmed</span>}</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiTarget className="w-4 h-4 text-red-500" /></div><h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Key Metrics</h2></div>
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Days in Pipeline</p>
                    <p className="text-xl font-black text-white tracking-tighter">{Math.max(0, Math.floor((Date.now() - new Date(project.createdAt).getTime()) / 86400000))}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Days to Close</p>
                    <p className="text-xl font-black text-white tracking-tighter">{project.forecastedCloseDate ? Math.max(0, Math.floor((new Date(project.forecastedCloseDate).getTime() - Date.now()) / 86400000)) : "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Weighted Value</p>
                    <p className="text-xl font-black text-red-500 tracking-tighter">${Math.round(((project.value || 0) * (project.confidence || 0)) / 100).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-ups & AI Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Follow-ups */}
              <div className="lg:col-span-7 bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiClock className="w-4 h-4 text-red-500" /></div><h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Follow-ups</h2></div>
                  <button onClick={() => setIsFollowUpModalOpen(true)} className="h-9 px-5 bg-red-600/10 border border-red-600/30 rounded-xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-600/20 transition-all flex items-center gap-2">
                    <span>+ Add Follow-up</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {followUps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <FiClock className="w-8 h-8 text-white/10 mb-3" />
                      <p className="text-sm font-bold text-white/25">No follow-ups yet</p>
                    </div>
                  ) : followUps.map((fu) => (
                    <div key={fu._id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:bg-white/[0.01] transition-all">
                      <div className="flex items-center gap-4">
                        <div
                          onClick={() => handleToggleFollowUp(fu)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${fu.completed ? 'bg-red-600 border-red-600' : 'border-white/20 hover:border-red-500'}`}
                        >
                          {fu.completed && <FiCheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${fu.completed ? 'text-white/40 line-through' : 'text-white'}`}>{fu.title}</p>
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/30">{fu.type}</span>
                          </div>
                          <p className="text-[10px] text-white/30 mt-0.5">Due: {fu.dueDate ? new Date(fu.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${fu.urgency === "HIGH" ? "bg-red-500/10 text-red-500" : fu.urgency === "MEDIUM" ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-white/30"}`}>{fu.urgency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="lg:col-span-5 bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30"><HiSparkles className="w-6 h-6" /></div>
                    <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">AI Suggestions</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadAiSuggestions()}
                    disabled={aiLoading}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white disabled:opacity-40"
                    title="Refresh suggestions"
                  >
                    {aiLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
                  </button>
                </div>
                <div className="space-y-6 flex-1">
                  {aiLoading && !aiSuggestions && (
                    <div className="flex items-center gap-2 text-white/35 py-6">
                      <FiLoader className="w-5 h-5 animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Generating</span>
                    </div>
                  )}
                  {aiError && !aiLoading && (
                    <p className="text-xs text-white/40">{aiError}</p>
                  )}
                  <div><p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Recommended Action</p>
                    <div className="flex items-start gap-4"><div className="p-3 bg-red-600/20 border border-red-600/30 rounded-xl flex-shrink-0"><FiSend className="w-5 h-5 text-red-500" /></div><p className="text-sm font-bold text-white">{aiSuggestions?.recommendedAction || "—"}</p></div>
                  </div>
                  <div><p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Win Probability</p>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-black text-white/30 uppercase">Likelihood</span><span className="text-sm font-black text-red-500">{project.confidence || 0}%</span></div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${project.confidence || 0}%` }} /></div>
                    </div>
                  </div>
                  <div><p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Insight</p>
                    <p className="text-xs text-white/40 leading-relaxed">{aiSuggestions?.insight || "—"}</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-white/30">
                  <FiClock className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase tracking-widest">Best time to follow up: <span className="text-red-500">{aiSuggestions?.bestTimeToFollowUp || "—"}</span></span>
                </div>
              </div>
            </div>

            {/* Proposal & Invoice History */}
            <section className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8 border-b border-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiFilePlus className="w-4 h-4 text-red-500" /></div><h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Proposal & Invoice History</h2></div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  {docsLoading ? "Loading..." : `${(projectDocs.proposals?.length || 0) + (projectDocs.invoices?.length || 0)} Items`}
                </span>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[980px]">
                  <thead><tr className="bg-white/[0.01] border-b border-white/[0.03]">
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Document</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Reference</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Issued</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">{/* Due/Expiry */}Due/Expiry</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Total</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ...(projectDocs.proposals || []).map((d: any) => ({ ...d, _kind: "proposal" })),
                      ...(projectDocs.invoices || []).map((d: any) => ({ ...d, _kind: "invoice" })),
                    ]
                      .sort((a: any, b: any) => {
                        const ta = new Date(a.createdAt || a.issuedDate || 0).getTime();
                        const tb = new Date(b.createdAt || b.issuedDate || 0).getTime();
                        return tb - ta;
                      })
                      .map((doc: any) => (
                      <tr key={doc._id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl border ${doc._kind === "invoice" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/5 text-white/40"}`}>
                              <FiFilePlus className="w-4 h-4" />
                            </div>
                            <span
                              className="text-sm font-bold text-white hover:text-red-500 transition-colors cursor-pointer"
                              onClick={() => navigate(`/ai-tools/sales/documents/${doc._kind}/${doc._id}`)}
                            >
                              {`${doc.projectTitle} — ${doc._kind === "invoice" ? "Invoice" : "Proposal"} (${doc.reference})`}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${doc._kind === "invoice" ? "bg-red-500/10 text-red-500" : "bg-white/5 text-white/50"}`}>
                            {doc._kind === "invoice" ? "INVOICE" : "PROPOSAL"}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-white/40">{doc.clientName || "—"}</td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30">{doc.reference}</td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30">{doc.issuedDate ? new Date(doc.issuedDate).toLocaleDateString() : "—"}</td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30">{doc.dueDate ? new Date(doc.dueDate).toLocaleDateString() : "—"}</td>
                        <td className="px-8 py-6 text-sm font-black text-white text-right">${Number(doc.total || 0).toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${doc.status === "SENT" ? "bg-white/5 text-white/40" : "bg-red-500/10 text-red-500"}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-white/20 hover:text-white transition-colors" onClick={() => navigate(`/ai-tools/sales/documents/${doc._kind}/${doc._id}`)}>
                            <FiMoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}
      </main>

      <NewOutreachModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onCreated={() => fetchFollowUps()}
        preselectedProjectId={id}
      />

      {project && (
        <GenerateDocModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          project={project}
          defaultType="PROPOSAL"
          onConfirm={handleGenerateConfirm}
          isSubmitting={generating}
        />
      )}

      <AlertModal
        isOpen={isDeleteOpen}
        type="danger"
        action="delete"
        title="Delete this project?"
        message={`"${project?.name}" will be moved to trash, along with any linked follow-ups — recoverable from Trash. Proposals and invoices already generated for it are not affected.`}
        confirmText="Delete Project"
        loadingText="Deleting..."
        isLoading={deleting}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
};

export default ProjectDetailsPage;
