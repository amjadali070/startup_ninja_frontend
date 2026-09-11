import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiFilter,
  FiCircle, FiMessageCircle, FiUserCheck, FiSend, FiTrendingUp,
  FiPauseCircle, FiUnlock, FiCheckCircle, FiLock,
  FiFlag, FiAlertTriangle, FiArrowRight, FiClock, FiZap, FiBriefcase
} from "react-icons/fi";
import toast from "react-hot-toast";
import IconSelect from "../IconSelect";
import LoadingSpinner from "../LoadingSpinner";
import AlertModal from "../AlertModal";
import { useAuth } from "../../hooks/useAuth";
import { ninjaSalesService, Project } from "../../services/ninjaSales";

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const stageColor: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-purple-500/10 text-purple-400",
  qualified: "bg-emerald-500/10 text-emerald-400",
  proposal: "bg-yellow-500/10 text-yellow-400",
  negotiation: "bg-orange-500/10 text-orange-400",
  hold: "bg-white/10 text-white/40",
  converted: "bg-cyan-500/10 text-cyan-400",
  "closed-won": "bg-emerald-500/10 text-emerald-500",
  "closed-lost": "bg-red-500/10 text-red-400",
};

const priorityColor: Record<string, string> = {
  urgent: "bg-red-500/10 text-red-500",
  high: "bg-orange-500/10 text-orange-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toLocaleString()}`;
};

interface ProjectsTableProps {
  refreshKey?: number;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ refreshKey }) => {
  const { user } = useAuth();
  /** Same rule the backend enforces for delete: only the account owner or a manager */
  const canDelete = Boolean(user && (!user.addedBy || user.teamRole === "Manager"));
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const res = await ninjaSalesService.getProjects({
      page: currentPage,
      limit: itemsPerPage,
    });
    if (res.success) {
      let filtered = res.data;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (typeof p.leadId === "object" && (p.leadId.name?.toLowerCase().includes(q) || p.leadId.company?.toLowerCase().includes(q))));
      }
      if (stageFilter !== "All") {
        filtered = filtered.filter(p => p.pipelineStage === stageFilter);
      }
      if (priorityFilter !== "All") {
        filtered = filtered.filter(p => p.priority === priorityFilter);
      }
      if (urgencyFilter !== "All") {
        filtered = filtered.filter(p => p.urgency === urgencyFilter);
      }
      setProjects(filtered);
      setTotalProjects(res.pagination?.total || filtered.length);
    }
    setLoading(false);
  }, [currentPage, search, stageFilter, priorityFilter, urgencyFilter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects, refreshKey]);

  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => { setCurrentPage(1); }, [search, stageFilter, priorityFilter, urgencyFilter]);

  const getLeadName = (leadId: Project["leadId"]): string => {
    if (!leadId) return "N/A";
    if (typeof leadId === "object") return leadId.name || "N/A";
    return "N/A";
  };

  const getLeadCompany = (leadId: Project["leadId"]): string => {
    if (!leadId || typeof leadId !== "object") return "";
    return leadId.company || "";
  };

  const getLeadId = (leadId: Project["leadId"]): string | null => {
    if (!leadId || typeof leadId !== "object") return null;
    return leadId._id;
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await ninjaSalesService.deleteProject(deleteTarget._id);
    setDeleting(false);
    if (res.success) {
      toast.success("Project moved to trash");
      setDeleteTarget(null);
      fetchProjects();
    } else {
      toast.error(res.message || "Could not delete project");
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Actions */}
      <div className="p-4 sm:p-6 border-b border-white/[0.03] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          <div className="relative group w-full md:w-[320px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects, leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <IconSelect
              value={stageFilter}
              onChange={setStageFilter}
              options={[
                { value: "All", label: "All Stages", icon: <FiFilter className="w-4 h-4" /> },
                { value: "new", label: "New", icon: <FiCircle className="w-4 h-4" /> },
                { value: "contacted", label: "Contacted", icon: <FiMessageCircle className="w-4 h-4" /> },
                { value: "qualified", label: "Qualified", icon: <FiUserCheck className="w-4 h-4" /> },
                { value: "proposal", label: "Proposal", icon: <FiSend className="w-4 h-4" /> },
                { value: "negotiation", label: "Negotiation", icon: <FiTrendingUp className="w-4 h-4" /> },
                { value: "hold", label: "Hold", icon: <FiPauseCircle className="w-4 h-4" /> },
                { value: "converted", label: "Converted", icon: <FiUnlock className="w-4 h-4" /> },
                { value: "closed-won", label: "Closed Won", icon: <FiCheckCircle className="w-4 h-4" /> },
                { value: "closed-lost", label: "Closed Lost", icon: <FiLock className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[170px] h-[46px] text-sm"
            />
            <IconSelect
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: "All", label: "All Priority", icon: <FiFlag className="w-4 h-4" /> },
                { value: "low", label: "Low", icon: <FiArrowRight className="w-4 h-4 -rotate-45" /> },
                { value: "medium", label: "Medium", icon: <FiArrowRight className="w-4 h-4" /> },
                { value: "high", label: "High", icon: <FiAlertTriangle className="w-4 h-4" /> },
                { value: "urgent", label: "Urgent", icon: <FiZap className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />
            <IconSelect
              value={urgencyFilter}
              onChange={setUrgencyFilter}
              options={[
                { value: "All", label: "All Urgency", icon: <FiClock className="w-4 h-4" /> },
                { value: "immediate", label: "Immediate", icon: <FiZap className="w-4 h-4" /> },
                { value: "1-3", label: "1-3 Months", icon: <FiClock className="w-4 h-4" /> },
                { value: "3-6", label: "3-6 Months", icon: <FiClock className="w-4 h-4" /> },
                { value: "long-term", label: "6+ Months", icon: <FiClock className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="small" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
            <FiBriefcase className="w-6 h-6 text-white/15" />
          </div>
          <p className="text-sm font-bold text-white/40">No projects yet</p>
          <p className="text-xs text-white/20 max-w-xs">Click "New Deal" above to create your first project.</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Project</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Lead</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Value</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Stage</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Priority</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Created</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const leadName = getLeadName(project.leadId);
              const leadCompany = getLeadCompany(project.leadId);
              const leadIdStr = getLeadId(project.leadId);

              return (
                <tr key={project._id} className="group hover:bg-white/[0.02] transition-all duration-300 border-b border-white/[0.03]">
                  <td className="px-6 py-5">
                    <Link to={`/ai-tools/sales/projects/${project._id}`} className="flex items-center gap-4 group/name">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-white/10 flex items-center justify-center text-red-500 font-bold shadow-inner text-sm">
                        {project.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover/name:text-red-500 transition-colors flex items-center gap-2 capitalize">
                          {project.name}
                          <FiExternalLink className="w-3 h-3 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                        </div>
                        {project.description && <div className="text-white/30 text-xs mt-0.5 truncate max-w-[200px]">{project.description}</div>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    {leadIdStr ? (
                      <Link to={`/ai-tools/sales/leads/${leadIdStr}`} className="group/lead">
                        <div className="font-medium text-white/70 group-hover/lead:text-red-500 transition-colors text-sm">{leadName}</div>
                        {leadCompany && <div className="text-white/30 text-xs mt-0.5">{leadCompany}</div>}
                      </Link>
                    ) : (
                      <span className="text-white/30 text-sm italic">No lead</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-white text-sm">{formatCurrency(project.value || 0)}</div>
                    <div className="text-[10px] text-white/20 mt-0.5">{project.currency || "USD"}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${stageColor[project.pipelineStage] || "bg-white/5 text-white/40"}`}>
                      {project.pipelineStage}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${priorityColor[project.priority] || "bg-white/5 text-white/40"}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-white/50 text-sm">{formatDate(project.createdAt)}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/ai-tools/sales/projects/${project._id}/edit`}
                        className="p-2 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Edit project"
                        aria-label="Edit project"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(project)}
                          className="p-2 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete project"
                          aria-label="Delete project"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination */}
      <div className="p-4 sm:p-6 bg-white/[0.02] border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-white/30 font-medium order-2 md:order-1">
          Showing <span className="text-white/60">{totalProjects > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalProjects)}</span> of <span className="text-white/60">{totalProjects}</span> projects
        </p>
        <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.03] transition-all flex-1 md:flex-none ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:bg-white/5 active:scale-95'}`}
          >
            Prev
          </button>
          <div className="flex items-center gap-6 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl mx-1 md:mx-2">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap">
              Page <span className="text-white text-xs font-black">{currentPage}</span>
              <span className="text-white/10 mx-1">/</span>
              {totalPages || 1}
            </span>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all flex-1 md:flex-none ${currentPage === totalPages || totalPages === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 bg-white/5 hover:bg-white/10 active:scale-95'}`}
          >
            Next
          </button>
        </div>
      </div>

      <AlertModal
        isOpen={!!deleteTarget}
        type="danger"
        action="delete"
        title="Delete this project?"
        message={`"${deleteTarget?.name}" will be moved to trash, along with any linked follow-ups — recoverable from Trash. Proposals and invoices already generated for it are not affected.`}
        confirmText="Delete Project"
        loadingText="Deleting..."
        isLoading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectsTable;
