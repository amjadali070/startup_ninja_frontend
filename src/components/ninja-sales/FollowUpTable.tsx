import { type FC, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiLoader, FiCheck, FiRotateCcw } from "react-icons/fi";
import { ninjaSalesService, FollowUp } from "../../services/ninjaSales";
import LoadingSpinner from "../LoadingSpinner";

interface FollowUpTableProps {
  filter: string;
  refreshKey?: number;
  projectId?: string;
}

const typeLabels: Record<string, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  "follow-up": "Follow-up",
  demo: "Demo",
  "proposal-review": "Proposal Review",
  other: "Other",
};

const typeBadgeStyles: Record<string, string> = {
  call: "text-sky-400 bg-sky-400/10",
  email: "text-violet-400 bg-violet-400/10",
  meeting: "text-amber-400 bg-amber-400/10",
  "follow-up": "text-emerald-400 bg-emerald-400/10",
  demo: "text-pink-400 bg-pink-400/10",
  "proposal-review": "text-orange-400 bg-orange-400/10",
  other: "text-gray-400 bg-gray-400/10",
};

const itemsPerPage = 10;

const FollowUpTable: FC<FollowUpTableProps> = ({ filter, refreshKey, projectId }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [totalFollowUps, setTotalFollowUps] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchFollowUps = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    const res = await ninjaSalesService.getFollowUps({
      tab: filter !== "All" ? filter : undefined,
      projectId,
      page: currentPage,
      limit: itemsPerPage,
    });
    if (res.success) {
      const total = res.pagination?.total ?? res.data.length;
      const pages = Math.max(1, Math.ceil(total / itemsPerPage));
      setTotalFollowUps(total);
      if (currentPage > pages) {
        setCurrentPage(pages);
      } else {
        setFollowUps(res.data);
      }
    }
    if (!opts?.silent) setLoading(false);
  }, [filter, projectId, currentPage]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps, refreshKey]);

  const totalPages = Math.ceil(totalFollowUps / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleComplete = async (f: FollowUp) => {
    setTogglingId(f._id);
    const res = await ninjaSalesService.updateFollowUp(f._id, {
      completed: !f.completed,
    });
    if (res.success) {
      await fetchFollowUps({ silent: true });
    }
    setTogglingId(null);
  };

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "HIGH":
        return "text-[#EF4444] bg-[#EF444410]";
      case "MEDIUM":
        return "text-orange-500 bg-orange-500/10";
      case "LOW":
        return "text-gray-500 bg-white/5";
      default:
        return "";
    }
  };

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isOverdue = (f: FollowUp) => !f.completed && new Date(f.dueDate) < new Date();

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">Follow-ups: {filter}</h2>
        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest border border-white/5">
          {totalFollowUps} Follow-ups
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="small" />
        </div>
      ) : followUps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30 text-sm">
          <p>No follow-ups found for this view.</p>
          <p className="text-xs mt-1 text-white/20">Create a new follow-up to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Follow-up</th>
                {!projectId && (
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Project</th>
                )}
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Lead</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Urgency</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {followUps.map((f) => (
                <tr
                  key={f._id}
                  className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all"
                >
                  {/* Follow-up: title + type badge */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold text-white">{f.title}</span>
                      <span
                        className={`inline-block w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                          typeBadgeStyles[f.type] || typeBadgeStyles.other
                        }`}
                      >
                        {typeLabels[f.type] || f.type}
                      </span>
                    </div>
                  </td>

                  {/* Project */}
                  {!projectId && (
                    <td className="px-6 py-5">
                      {f.projectIdStr ? (
                        <Link
                          to={`/ai-tools/sales/projects/${f.projectIdStr}`}
                          className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {f.projectName || "—"}
                        </Link>
                      ) : (
                        <span className="text-sm text-white/20">—</span>
                      )}
                    </td>
                  )}

                  {/* Lead */}
                  <td className="px-6 py-5">
                    {f.leadIdStr ? (
                      <Link
                        to={`/ai-tools/sales/leads/${f.leadIdStr}`}
                        className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                      >
                        {f.leadName || "—"}
                      </Link>
                    ) : (
                      <span className="text-sm text-white/20">—</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-400">{formatDueDate(f.dueDate)}</span>
                      {isOverdue(f) && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#EF4444]">Overdue</span>
                      )}
                    </div>
                  </td>

                  {/* Urgency */}
                  <td className="px-6 py-5">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest ${getUrgencyStyles(f.urgency)}`}
                    >
                      {f.urgency}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    {f.completed ? (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                        COMPLETED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20">
                        PENDING
                      </span>
                    )}
                  </td>

                  {/* Toggle */}
                  <td className="px-6 py-5">
                    <button
                      onClick={() => toggleComplete(f)}
                      disabled={togglingId === f._id}
                      title={f.completed ? "Mark as pending" : "Mark as completed"}
                      className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${
                        f.completed
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                          : "border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {togglingId === f._id ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      ) : f.completed ? (
                        <FiRotateCcw className="w-4 h-4" />
                      ) : (
                        <FiCheck className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalFollowUps > 0 && (
        <div className="p-4 sm:p-6 bg-white/[0.02] border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/30 font-medium order-2 md:order-1">
            Showing{" "}
            <span className="text-white/60">
              {totalFollowUps > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalFollowUps)}
            </span>{" "}
            of <span className="text-white/60">{totalFollowUps}</span> follow-ups
          </p>
          <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.03] transition-all flex-1 md:flex-none ${
                currentPage === 1 ? "text-white/20 cursor-not-allowed" : "text-white/60 hover:bg-white/5 active:scale-95"
              }`}
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
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all flex-1 md:flex-none ${
                currentPage === totalPages || totalPages === 0
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/60 bg-white/5 hover:bg-white/10 active:scale-95"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpTable;
