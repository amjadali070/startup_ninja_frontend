import { type FC, useState, useEffect, useCallback } from "react";
import { FiX, FiLoader, FiRotateCcw, FiUser, FiFolder, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaSalesService, Lead, Project } from "../../services/ninjaSales";

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestored?: () => void;
}

const getRelativeTime = (dateStr?: string) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const TrashModal: FC<TrashModalProps> = ({ isOpen, onClose, onRestored }) => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    const [leadsRes, projectsRes] = await Promise.all([
      ninjaSalesService.getDeletedLeads(),
      ninjaSalesService.getDeletedProjects(),
    ]);
    setLeads(leadsRes.success ? leadsRes.data : []);
    setProjects(projectsRes.success ? projectsRes.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) fetchTrash();
  }, [isOpen, fetchTrash]);

  const handleRestoreLead = async (lead: Lead) => {
    setRestoringId(lead._id);
    const res = await ninjaSalesService.restoreLead(lead._id);
    setRestoringId(null);
    if (res.success) {
      toast.success(`"${lead.name}" restored`);
      fetchTrash();
      onRestored?.();
    } else {
      toast.error(res.message || "Could not restore lead");
    }
  };

  const handleRestoreProject = async (project: Project) => {
    setRestoringId(project._id);
    const res = await ninjaSalesService.restoreProject(project._id);
    setRestoringId(null);
    if (res.success) {
      toast.success(`"${project.name}" restored`);
      fetchTrash();
      onRestored?.();
    } else {
      toast.error(res.message || "Could not restore project — its lead may need restoring first");
    }
  };

  if (!isOpen) return null;

  const isEmpty = !loading && leads.length === 0 && projects.length === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Trash</h2>
            <p className="text-gray-400 text-sm mt-1">Deleted leads and projects — restore anything you didn't mean to remove</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"><FiX className="w-6 h-6" /></button>
        </div>
        <div className="border-t border-[#1C1C1F] mx-6" />

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiLoader className="w-6 h-6 text-red-500 animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiTrash2 className="w-8 h-8 text-white/10 mb-3" />
              <p className="text-sm font-bold text-white/25">Trash is empty</p>
            </div>
          ) : (
            <>
              {leads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><FiUser className="w-4 h-4 text-white/40" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{lead.name}</p>
                      <p className="text-[11px] text-white/30">Lead · {lead.company || "No company"} · deleted {getRelativeTime((lead as any).deletedAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestoreLead(lead)}
                    disabled={restoringId === lead._id}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {restoringId === lead._id ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiRotateCcw className="w-3.5 h-3.5" />} Restore
                  </button>
                </div>
              ))}
              {projects.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><FiFolder className="w-4 h-4 text-white/40" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{project.name}</p>
                      <p className="text-[11px] text-white/30">Project · deleted {getRelativeTime((project as any).deletedAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestoreProject(project)}
                    disabled={restoringId === project._id}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {restoringId === project._id ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiRotateCcw className="w-3.5 h-3.5" />} Restore
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashModal;
