import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiX, FiSend, FiMessageSquare } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/admin";
import type { SupportTicket } from "../../services/support";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  resolved: "bg-green-500/10 text-green-400 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};
const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};
const STATUS_FILTERS = ["all", "open", "in_progress", "resolved", "closed"];

const formatDateTime = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

const SupportTickets: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await adminService.listAllSupportTickets(statusFilter);
    if (res.success && res.data) setTickets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const openTicket = async (id: string) => {
    const res = await adminService.getSupportTicketAdmin(id);
    if (res.success && res.data) setSelected(res.data);
  };

  const userLabel = (t: SupportTicket) =>
    typeof t.userId === "object" ? t.userId.email : "Unknown user";

  return (
    <DashboardLayout activePath="/admin-dashboard/support" title="Support Tickets" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-white text-2xl font-bold">Support Tickets</h1>
              <p className="text-white/40 text-sm mt-1">Every ticket submitted across all users.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors capitalize ${
                    statusFilter === s ? "bg-red-600/10 border-red-600/50 text-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {s === "all" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#151515] p-12 text-center">
              <FiMessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">No tickets</h3>
              <p className="text-white/40 text-sm">Nothing matches this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <button
                  key={t._id}
                  onClick={() => openTicket(t._id)}
                  className="w-full text-left rounded-xl border border-white/10 bg-[#151515] p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{t.subject}</div>
                      <div className="text-white/40 text-xs mt-1">
                        {userLabel(t)} · {formatDateTime(t.updatedAt)} · {t.replies.length} {t.replies.length === 1 ? "reply" : "replies"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${t.priority === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-white/5 text-white/50 border-white/10"}`}>
                        {t.priority}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {selected && (
        <AdminTicketDetailModal
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setSelected(updated);
            setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
          }}
        />
      )}
    </DashboardLayout>
  );
};

const AdminTicketDetailModal: FC<{ ticket: SupportTicket; onClose: () => void; onUpdated: (t: SupportTicket) => void }> = ({
  ticket,
  onClose,
  onUpdated,
}) => {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const userLabel = typeof ticket.userId === "object" ? ticket.userId.email : "Unknown user";

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    const res = await adminService.replyToSupportTicketAsAdmin(ticket._id, reply);
    setSubmitting(false);
    if (res.success && res.data) {
      setReply("");
      onUpdated(res.data);
    } else {
      toast.error(res.message || "Failed to send reply.");
    }
  };

  const handleStatusChange = async (status: string) => {
    setUpdatingStatus(true);
    const res = await adminService.updateSupportTicketStatus(ticket._id, status);
    setUpdatingStatus(false);
    if (res.success && res.data) {
      toast.success(`Marked as ${STATUS_LABELS[status]}.`);
      onUpdated(res.data);
    } else {
      toast.error(res.message || "Failed to update status.");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
            <p className="text-white/40 text-xs mt-1">{userLabel}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-white/5 flex items-center gap-2 flex-wrap">
          {(["open", "in_progress", "resolved", "closed"] as const).map((s) => (
            <button
              key={s}
              disabled={updatingStatus}
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                ticket.status === s ? STATUS_STYLES[s] : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-white/40 text-xs mb-1.5">{formatDateTime(ticket.createdAt)}</p>
            <p className="text-white text-sm whitespace-pre-wrap">{ticket.message}</p>
          </div>
          {ticket.replies.map((r, i) => (
            <div key={i} className={`rounded-lg p-4 ${r.isAdmin ? "bg-red-600/10 border border-red-600/20" : "bg-white/5"}`}>
              <p className="text-white/40 text-xs mb-1.5">
                {r.isAdmin ? `${r.authorName} (Support)` : r.authorName} · {formatDateTime(r.createdAt)}
              </p>
              <p className="text-white text-sm whitespace-pre-wrap">{r.message}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 flex items-end gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
            placeholder="Write a reply…"
            className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none resize-none"
          />
          <button
            onClick={handleReply}
            disabled={submitting || !reply.trim()}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-60"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
