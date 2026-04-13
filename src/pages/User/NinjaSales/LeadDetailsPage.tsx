import { type FC, useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FiEdit3, FiFilePlus, FiSend, FiMoreVertical,
  FiCheckCircle, FiClock, FiInfo, FiPlus, FiTrash2, FiLoader,
  FiRefreshCw, FiFilter, FiFolder, FiUser,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import NewTaskModal from "../../../components/ninja-sales/NewTaskModal";
import IconSelect from "../../../components/IconSelect";
import type { SelectOption } from "../../../components/IconSelect";
import {
  ninjaSalesService,
  Lead,
  SalesTask,
  SalesActivity,
  Project,
  FollowUp,
  LeadAiSuggestions,
} from "../../../services/ninjaSales";

const LeadDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [timelineFilter, setTimelineFilter] = useState("ALL");
  const [isCopied, setIsCopied] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<SalesTask[]>([]);
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjectValue, setTotalProjectValue] = useState(0);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SalesTask | null>(null);
  const [leadFollowUps, setLeadFollowUps] = useState<FollowUp[]>([]);

  const [aiScopeProjectId, setAiScopeProjectId] = useState<string>("");
  const [leadAi, setLeadAi] = useState<LeadAiSuggestions | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchLead = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const res = await ninjaSalesService.getLeadById(id);
    if (res.success) {
      setLead(res.data);
      const leadProjects: Project[] = (res.data as any).projects || [];
      setProjects(leadProjects);
      if ((res.data as any).totalProjectValue) setTotalProjectValue((res.data as any).totalProjectValue);

      if (leadProjects.length > 0) {
        const fuRes = await ninjaSalesService.getFollowUps({ page: 1, limit: 500 });
        if (fuRes.success) {
          const projectIds = new Set(leadProjects.map(p => p._id));
          setLeadFollowUps(fuRes.data.filter(fu => projectIds.has(fu.projectId)));
        }
      } else {
        setLeadFollowUps([]);
      }
    }
    setLoading(false);
  }, [id]);

  const fetchTasks = useCallback(async () => {
    if (!id) return;
    const res = await ninjaSalesService.getTasks({ leadId: id });
    if (res.success) {
      setTasks(res.data);
    }
  }, [id]);

  const fetchActivities = useCallback(async () => {
    if (!id) return;
    const res = await ninjaSalesService.getActivities({ leadId: id });
    if (res.success) setActivities(res.data);
  }, [id]);

  useEffect(() => {
    fetchLead();
    fetchTasks();
    fetchActivities();
  }, [fetchLead, fetchTasks, fetchActivities]);

  useEffect(() => {
    setAiScopeProjectId("");
  }, [id]);

  const aiScopeOptions: SelectOption[] = useMemo(() => {
    const base: SelectOption[] = [
      { value: "", label: "All projects", icon: <FiFilter className="w-4 h-4" /> },
    ];
    const rest = projects.map((p) => ({
      value: p._id,
      label: p.name,
      icon: <FiFolder className="w-4 h-4" />,
    }));
    return [...base, ...rest];
  }, [projects]);

  const loadLeadAi = useCallback(async () => {
    if (!id) return;
    setAiLoading(true);
    setAiError(null);
    const res = await ninjaSalesService.postLeadSuggestions({
      leadId: id,
      ...(aiScopeProjectId ? { projectId: aiScopeProjectId } : {}),
    });
    if (res.success && res.data) setLeadAi(res.data);
    else setAiError(res.message || "Could not load AI suggestions");
    setAiLoading(false);
  }, [id, aiScopeProjectId]);

  useEffect(() => {
    if (loading || !lead) return;
    loadLeadAi();
  }, [loading, lead, loadLeadAi]);

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    setTasks(tasks.map(t => t._id === taskId ? { ...t, completed: !t.completed } : t));
    await ninjaSalesService.updateTask(taskId, { completed: !task.completed });
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t._id !== taskId));
    await ninjaSalesService.deleteTask(taskId);
  };

  const handleAddTask = async (newTask: { title: string; description: string; priority: string; dueDate: string }) => {
    if (!id) return;
    const res = await ninjaSalesService.createTask({
      leadId: id,
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority || undefined,
      dueDate: newTask.dueDate || undefined,
    });
    if (res.success) {
      setTasks([...tasks, res.data]);
    }
    setIsTaskModalOpen(false);
  };

  const typeMap: Record<string, string> = {
    CALL: "CALLS", EMAIL: "EMAILS", MEETING: "CALLS",
    NOTE: "EMAILS", STAGE_CHANGE: "EMAILS", PROPOSAL: "EMAILS", TASK: "EMAILS", OTHER: "EMAILS",
  };

  const filteredTimeline = activities
    .map((a, i) => ({
      t: a.title,
      desc: a.description || "",
      time: a.time || "",
      active: i === 0,
      type: typeMap[a.type] || "EMAILS",
    }))
    .filter(item => timelineFilter === "ALL" || item.type === timelineFilter)
    .slice(0, 6);

  const handleCopyDraft = () => {
    const text = leadAi?.draftSnippet?.trim();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Sales logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/leads"
      title="Lead Details - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <FiLoader className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : (
        <div className="p-4 md:p-6 lg:p-8 space-y-8 md:space-y-12 max-w-auto mx-auto text-white pb-20">
          
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-3 w-full xl:w-auto">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <Link to="/ai-tools/sales/leads" className="hover:text-red-500 transition-colors">Leads</Link> 
                <span>/</span> 
                <span className="text-red-500">Detail View</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">{lead?.company || lead?.name || "Lead Details"}</h1>
                
              </div>
              <p className="text-base md:text-lg font-medium text-white/50">Sales Lead</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex items-center gap-3 w-full xl:w-auto">
              <button
                onClick={() => navigate(`/ai-tools/sales/leads/${id}/edit`)}
                className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <FiEdit3 className="w-4 h-4" />
                <span>Edit Lead</span>
              </button>
              <button 
                onClick={() => navigate('/ai-tools/sales/proposals')}
                className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <FiFilePlus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
              <button 
                onClick={() => navigate('/ai-tools/sales/proposals')}
                className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
                <FiSend className="w-4 h-4" />
                <span>Generate Proposal</span>
              </button>
            </div>
          </div>

          {/* Core Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Lead Overview */}
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Lead Overview</h2>
                 <FiInfo className="w-4 h-4 text-white/20" />
               </div>
               
               <div className="grid grid-cols-2 gap-y-6 md:gap-y-7">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Full Name</p>
                   <p className="text-sm font-bold text-white">{lead?.name || "N/A"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Email</p>
                   <p className="text-sm font-bold text-red-500 truncate">{lead?.email || "N/A"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Phone</p>
                   <p className="text-sm font-bold text-white/70">{lead?.phone || "N/A"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Company</p>
                   <p className="text-sm font-bold text-white">{lead?.company || "N/A"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Job Title</p>
                   <p className="text-sm font-bold text-white/70">{lead?.jobTitle || "N/A"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Source</p>
                   <p className="text-sm font-bold text-white/70">{lead?.source || "N/A"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Assigned To</p>
                   <p className="text-sm font-bold text-white/70 flex items-center gap-2 min-w-0">
                     <FiUser className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                     <span className="truncate">
                       {lead?.assignee?.fullname || lead?.assignedTo?.trim() || "Unassigned"}
                     </span>
                   </p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lead Status</p>
                   <span className={`inline-block px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${
                     (lead?.leadStatus || "new") === "new" ? "bg-blue-500/10 text-blue-400" :
                     (lead?.leadStatus) === "contacted" ? "bg-purple-500/10 text-purple-400" :
                     (lead?.leadStatus) === "engaged" ? "bg-cyan-500/10 text-cyan-400" :
                     (lead?.leadStatus) === "qualified" ? "bg-emerald-500/10 text-emerald-400" :
                     (lead?.leadStatus) === "unqualified" ? "bg-orange-500/10 text-orange-400" :
                     (lead?.leadStatus) === "nurturing" ? "bg-yellow-500/10 text-yellow-400" :
                     (lead?.leadStatus) === "converted" ? "bg-emerald-500/10 text-emerald-500" :
                     (lead?.leadStatus) === "lost" ? "bg-red-500/10 text-red-400" :
                     (lead?.leadStatus) === "inactive" ? "bg-white/10 text-white/40" :
                     (lead?.leadStatus) === "do-not-contact" ? "bg-red-600/20 text-red-500" :
                     "bg-white/5 text-white/40"
                   }`}>
                     {lead?.leadStatus || "New"}
                   </span>
                 </div>
               </div>

               <div className="mt-7 pt-5 border-t border-white/5 grid grid-cols-2 gap-y-5">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total Value</p>
                   <p className="text-xl font-black text-white tracking-tighter">${totalProjectValue > 0 ? (totalProjectValue >= 1000 ? Math.round(totalProjectValue / 1000) + "k" : totalProjectValue) : "0"}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Decision Maker</p>
                   <p className={`text-sm font-bold ${lead?.decisionMaker ? "text-emerald-500" : "text-white/30"}`}>{lead?.decisionMaker ? "Yes" : "No"}</p>
                 </div>
               </div>

               {lead?.notes && (
                 <div className="mt-5 pt-5 border-t border-white/5 space-y-1.5">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Notes</p>
                   <p onClick={() => setIsNotesOpen(true)} className="text-xs font-medium text-white/50 leading-relaxed line-clamp-2 cursor-pointer hover:text-white/70 transition-colors">{lead.notes}</p>
                   {lead.notes.length > 100 && <button onClick={() => setIsNotesOpen(true)} className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors">Read more</button>}
                 </div>
               )}
            </div>

            {/* Confidence Score */}
            {(() => {
              const latestProject = projects.length > 0 ? projects[0] : null;
              const score = latestProject?.confidence || 0;
              const dashOffset = 552.92 - (score / 100) * 552.92;
              const activeCount = projects.filter(p => !["closed-won","closed-lost"].includes(p.pipelineStage)).length;
              const wonCount = projects.filter(p => p.pipelineStage === "closed-won").length;
              const avgConfidence = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.confidence || 0), 0) / projects.length) : 0;
              return (
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-8 left-8">
                    <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Confidence Score</h2>
                  </div>

                  <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mt-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                      <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.92" strokeDashoffset={dashOffset} className="text-red-600 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{score}</span>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Score</span>
                    </div>
                  </div>

                  {latestProject ? (
                    <button className="mt-6 h-10 px-6 bg-red-600/10 border border-red-600/30 rounded-full text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                      <Link to={`/ai-tools/sales/projects/${latestProject._id}`}>{latestProject.name}</Link>
                    </button>
                  ) : (
                    <p className="mt-6 text-[10px] font-black text-white/20 uppercase tracking-widest">No projects yet</p>
                  )}

                  <div className="w-full mt-6 pt-5 border-t border-white/5 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-black text-white tracking-tighter">{projects.length}</p>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-emerald-500 tracking-tighter">{activeCount}</p>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">Active</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-red-500 tracking-tighter">{wonCount}</p>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">Won</p>
                    </div>
                  </div>

                  <div className="w-full mt-4 pt-4 border-t border-white/5 flex items-center justify-between px-1">
                    <div>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Avg Confidence</p>
                      <p className="text-sm font-black text-white/60 mt-0.5">{avgConfidence}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Pipeline Value</p>
                      <p className="text-sm font-black text-white/60 mt-0.5">${totalProjectValue > 0 ? (totalProjectValue >= 1000 ? Math.round(totalProjectValue / 1000) + "k" : totalProjectValue) : "0"}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Tasks & Reminders */}
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:col-span-2 lg:col-span-1">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Tasks & Reminders</h2>
                 <button onClick={() => setIsTaskModalOpen(true)} className="text-red-500 hover:text-red-400 transition-all"><FiPlus className="w-5 h-5" /></button>
               </div>
               
               <div className="space-y-4 flex-1 flex flex-col">
                 {tasks.length === 0 && (
                   <div className="flex flex-col items-center justify-center text-center flex-1">
                     <FiCheckCircle className="w-8 h-8 text-white/10 mb-3" />
                     <p className="text-sm font-bold text-white/25">No tasks available</p>
                     <p className="text-[10px] text-white/15 mt-1">Click + to add a new task</p>
                   </div>
                 )}
                 {tasks.map((task) => (
                   <div key={task._id} className={`p-4 rounded-2xl border transition-all group/task cursor-pointer ${task.completed ? 'bg-white/[0.03] border-white/5' : 'bg-transparent border-white/5 hover:bg-white/[0.01]'}`}
                     onClick={() => setSelectedTask(task)}>
                     <div className="flex items-start justify-between gap-4">
                       <div className="flex items-start gap-4 flex-1">
                          <div 
                            onClick={(e) => { e.stopPropagation(); handleToggleTask(task._id); }}
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${task.completed ? 'bg-red-600 border-red-600' : 'border-white/20 hover:border-red-500'}`}
                          >
                             {task.completed && <FiCheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className={`text-sm font-bold tracking-tight transition-all ${task.completed ? 'text-white/40 line-through' : 'text-white'}`}>{task.title}</p>
                            <p className="text-[10px] font-medium text-white/20 tracking-widest">
                              {task.dueDate ? new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "No due date"}
                              {task.priority && <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-500' : task.priority === 'low' ? 'bg-white/5 text-white/30' : 'bg-orange-500/10 text-orange-500'}`}>{task.priority}</span>}
                            </p>
                          </div>
                       </div>
                       <button
                         onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
                         className="text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover/task:opacity-100 p-1"
                         title="Delete Task"
                       >
                         <FiTrash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Middle Row: Timeline & AI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Activity Timeline */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl relative">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                 <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Activity Timeline</h2>
                 <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1 gap-1 w-full sm:w-auto">
                    {["ALL", "CALLS", "EMAILS"].map(f => (
                      <button key={f} onClick={() => setTimelineFilter(f)} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timelineFilter === f ? 'bg-red-600 text-white shadow-lg' : 'text-white/20 hover:text-white/40'}`}>
                        {f}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-10 md:space-y-12 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                 {filteredTimeline.map((act, i) => (
                   <div key={i} className="relative pl-10 group">
                      <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-4 border-[#121212] z-10 transition-all ${act.active ? 'bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10 group-hover:bg-white/20'}`} />
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                        <div className="space-y-2 max-w-md">
                          <h4 className="text-sm font-black text-white capitalize tracking-tight group-hover:text-red-500 transition-colors">{act.t}</h4>
                          <p className="text-xs text-white/40 leading-relaxed font-medium">{act.desc}</p>
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap pt-1">{act.time}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Ninja AI Suggestions */}
            <div className="lg:col-span-5 bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[400px]">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />

               <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                      <HiSparkles className="w-6 h-6" />
                   </div>
                   <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Ninja AI Suggestions</h2>
                 </div>
                 <button
                   type="button"
                   onClick={() => loadLeadAi()}
                   disabled={aiLoading || loading}
                   className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white disabled:opacity-40"
                   title="Refresh suggestions"
                 >
                   {aiLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
                 </button>
               </div>

               {projects.length > 0 && (
                 <div className="mb-6 space-y-1.5">
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Focus</p>
                   <IconSelect
                     value={aiScopeProjectId && aiScopeOptions.some((o) => o.value === aiScopeProjectId) ? aiScopeProjectId : ""}
                     onChange={setAiScopeProjectId}
                     options={aiScopeOptions}
                     placeholder="All projects"
                     className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 w-full h-[46px] text-sm"
                   />
                   <p className="text-[10px] text-white/35 leading-relaxed">
                     Choose one project or all projects to shape the AI context for this lead.
                   </p>
                 </div>
               )}

               {aiLoading && (
                 <div className="flex items-center gap-2 text-white/35 py-8">
                   <FiLoader className="w-5 h-5 animate-spin" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Generating</span>
                 </div>
               )}

               {!aiLoading && aiError && (
                 <p className="text-xs text-white/45 py-4">{aiError}</p>
               )}

               {!aiLoading && !aiError && leadAi && (
               <div className="space-y-8 flex-1">
                 <div>
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Next Action</p>
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-xl flex-shrink-0">
                        <FiFilePlus className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-base font-black text-white tracking-tight leading-snug">{leadAi.recommendedAction || "—"}</p>
                   </div>
                 </div>

                 {leadAi.insight ? (
                   <div>
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Insight</p>
                     <p className="text-xs text-white/50 leading-relaxed font-medium">{leadAi.insight}</p>
                   </div>
                 ) : null}

                 <div>
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Drafting Assistant</p>
                   <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 relative group">
                      <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <p className="text-sm text-gray-400 leading-relaxed font-medium relative z-10">
                        {leadAi.draftSnippet ? leadAi.draftSnippet : "—"}
                      </p>
                   </div>
                 </div>
               </div>
               )}

               {!aiLoading && !aiError && leadAi && (
               <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-2 text-white/40">
                   <FiClock className="w-4 h-4 flex-shrink-0" />
                   <span className="text-[10px] font-black uppercase tracking-widest">
                     Best time to follow up: <span className="text-red-500">{leadAi.bestTimeToFollowUp || "—"}</span>
                   </span>
                 </div>
                 <button
                   type="button"
                   onClick={handleCopyDraft}
                   disabled={!leadAi.draftSnippet?.trim()}
                   className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                   {isCopied ? "Copied!" : "Copy Draft"}
                 </button>
               </div>
               )}
            </div>
          </div>

          {/* Follow-ups Section */}
          <section className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center"><FiClock className="w-4 h-4 text-red-500" /></div>
                <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em]">Follow-ups</h2>
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{leadFollowUps.length} {leadFollowUps.length === 1 ? "Item" : "Items"}</span>
            </div>
            {leadFollowUps.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-center">
                <FiClock className="w-8 h-8 text-white/10 mb-3" />
                <p className="text-sm font-bold text-white/25">No follow-ups for this lead's projects</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leadFollowUps.map((fu) => (
                  <div key={fu._id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:bg-white/[0.01] transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${fu.completed ? "bg-emerald-500" : fu.urgency === "HIGH" ? "bg-red-500" : fu.urgency === "MEDIUM" ? "bg-orange-500" : "bg-white/20"}`} />
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${fu.completed ? "text-white/40 line-through" : "text-white"}`}>{fu.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Link to={`/ai-tools/sales/projects/${fu.projectId}`} className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors truncate">{fu.projectName}</Link>
                          <span className="text-[10px] text-white/20">·</span>
                          <span className="text-[10px] text-white/30">{fu.dueDate ? new Date(fu.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${fu.urgency === "HIGH" ? "bg-red-500/10 text-red-500" : fu.urgency === "MEDIUM" ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-white/30"}`}>{fu.urgency}</span>
                      {fu.completed && <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">Done</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Projects Section */}
          <section className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-sm font-black text-white/90 uppercase tracking-[0.2em]">Projects</h2>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{projects.length} {projects.length === 1 ? "Project" : "Projects"}</span>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Project Name</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Value</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Priority</th>
                    <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-white/30 text-sm">No projects yet for this lead.</td></tr>
                  ) : projects.map((proj) => (
                    <tr key={proj._id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <Link to={`/ai-tools/sales/projects/${proj._id}`} className="text-sm font-black text-white capitalize tracking-tight hover:text-red-500 transition-colors">
                          {proj.name}
                        </Link>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-white tracking-tight">${(proj.value || 0).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${proj.priority === 'high' || proj.priority === 'urgent' ? 'bg-red-500/10 text-red-500' : proj.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-white/40'}`}>
                          {proj.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${
                          proj.pipelineStage === 'new' ? 'bg-blue-500/10 text-blue-400' :
                          proj.pipelineStage === 'contacted' ? 'bg-purple-500/10 text-purple-400' :
                          proj.pipelineStage === 'qualified' ? 'bg-emerald-500/10 text-emerald-400' :
                          proj.pipelineStage === 'proposal' ? 'bg-yellow-500/10 text-yellow-400' :
                          proj.pipelineStage === 'negotiation' ? 'bg-orange-500/10 text-orange-400' :
                          proj.pipelineStage === 'hold' ? 'bg-white/10 text-white/40' :
                          proj.pipelineStage === 'converted' ? 'bg-cyan-500/10 text-cyan-400' :
                          proj.pipelineStage === 'closed-won' ? 'bg-emerald-500/10 text-emerald-400' :
                          proj.pipelineStage === 'closed-lost' ? 'bg-red-500/10 text-red-400' :
                          'bg-white/5 text-white/40'
                        }`}>
                          {proj.pipelineStage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Table: History */}
          <section className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-sm font-black text-white/90 uppercase tracking-[0.2em]">Proposal & Invoice History</h2>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">3 Items Total</span>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
               <table className="w-full text-left min-w-[800px]">
                 <thead>
                    <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Document Name</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Reference</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Value</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {[
                      { name: "Initial Quote", ref: "QT-2024-089", date: "Oct 15, 2024", val: "$280,000.00", st: "SENT", type: "QUOTE" },
                      { name: "Master Services Agreement", ref: "MSA-NEB-24", date: "Oct 16, 2024", val: "--", st: "DRAFT", type: "CONTRACT" },
                      { name: "Invoice #SN-102", ref: "INV-SN-102", date: "Oct 10, 2024", val: "$45,000.00", st: "PAID", type: "INVOICE" },
                    ].map((doc, i) => (
                      <tr key={i} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                             <div className={`p-2.5 rounded-xl border transition-all ${doc.type === 'INVOICE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-white/40'}`}>
                               <FiFilePlus className="w-5 h-5 flex-shrink-0" />
                             </div>
                             <span 
                               onClick={() => navigate('/ai-tools/sales/proposals')}
                               className="text-sm font-black text-white uppercase tracking-tight hover:text-red-500 transition-colors cursor-pointer"
                             >
                               {doc.name}
                             </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30 uppercase tracking-tight">{doc.ref}</td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30">{doc.date}</td>
                        <td className="px-8 py-6 text-sm font-black text-white tracking-tight">{doc.val}</td>
                        <td className="px-8 py-6">
                           <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest ${doc.st === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : doc.st === 'SENT' ? 'bg-white/5 text-white/40' : 'bg-red-500/10 text-red-500'}`}>
                             {doc.st}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="text-white/20 hover:text-white transition-colors">
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

      <NewTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onTaskCreate={handleAddTask}
      />

      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTask(null)}>
          <div className="w-full max-w-lg bg-[#121212] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">Task Details</h3>
              <button onClick={() => setSelectedTask(null)} className="text-white/30 hover:text-white transition-colors text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Title</p>
                <p className="text-base font-bold text-white">{selectedTask.title}</p>
              </div>
              {selectedTask.description && (
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Description</p>
                  <p className="text-sm font-medium text-white/50 leading-relaxed whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Due Date</p>
                  <p className="text-sm font-bold text-white/70">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "No due date"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Priority</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${selectedTask.priority === 'high' ? 'bg-red-500/10 text-red-500' : selectedTask.priority === 'low' ? 'bg-white/5 text-white/30' : 'bg-orange-500/10 text-orange-500'}`}>{selectedTask.priority || "Medium"}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${selectedTask.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-400'}`}>{selectedTask.completed ? "Completed" : "Pending"}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Created</p>
                  <p className="text-sm font-bold text-white/50">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNotesOpen && lead?.notes && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsNotesOpen(false)}>
          <div className="w-full max-w-lg bg-[#121212] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">Lead Notes</h3>
              <button onClick={() => setIsNotesOpen(false)} className="text-white/30 hover:text-white transition-colors text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm font-medium text-white/60 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeadDetailsPage;
