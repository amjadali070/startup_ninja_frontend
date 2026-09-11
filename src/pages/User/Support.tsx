import { FC, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiPlus, FiX, FiSend, FiClock, FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { supportService, SupportTicket } from "../../services/support";

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

const formatDateTime = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

const Support: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await supportService.listMyTickets();
    if (res.success && res.data) setTickets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const openTicket = async (id: string) => {
    const res = await supportService.getTicket(id);
    if (res.success && res.data) setSelectedTicket(res.data);
  };

  return (
    <DashboardLayout activePath="/support" title="Support" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold">Support</h1>
              <p className="text-white/40 text-sm mt-1">Submit a ticket and track replies from our team.</p>
            </div>
            <button
              onClick={() => setShowNewTicket(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-xl py-2.5 px-5 text-sm font-semibold transition-all"
            >
              <FiPlus className="w-4 h-4" />
              New Ticket
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#151515] p-12 text-center">
              <FiMessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">No tickets yet</h3>
              <p className="text-white/40 text-sm">Have an issue or question? Submit a ticket and we'll get back to you.</p>
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
                        {formatDateTime(t.updatedAt)} · {t.replies.length} {t.replies.length === 1 ? "reply" : "replies"}
                      </div>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[t.status]}`}>
                      {STATUS_LABELS[t.status]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {showNewTicket && (
        <NewTicketModal
          onClose={() => setShowNewTicket(false)}
          onCreated={() => {
            setShowNewTicket(false);
            fetchTickets();
          }}
        />
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onReplied={(updated) => {
            setSelectedTicket(updated);
            setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
          }}
        />
      )}
    </DashboardLayout>
  );
};

const NewTicketModal: FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    setSubmitting(true);
    const res = await supportService.createTicket(subject, message, priority);
    setSubmitting(false);
    if (res.success) {
      toast.success("Ticket submitted.");
      onCreated();
    } else {
      toast.error(res.message || "Failed to submit ticket.");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0B0F] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">New support ticket</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Briefly describe the issue"
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Give us the details..."
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1.5">Priority</label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border capitalize transition-colors ${
                    priority === p ? "bg-red-600/10 border-red-600/50 text-white" : "border-white/10 text-white/60 hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

const TicketDetailModal: FC<{ ticket: SupportTicket; onClose: () => void; onReplied: (t: SupportTicket) => void }> = ({
  ticket,
  onClose,
  onReplied,
}) => {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    const res = await supportService.replyToTicket(ticket._id, reply);
    setSubmitting(false);
    if (res.success && res.data) {
      setReply("");
      onReplied(res.data);
    } else {
      toast.error(res.message || "Failed to send reply.");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
            <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[ticket.status]}`}>
              {ticket.status === "resolved" ? <FiCheckCircle className="text-xs" /> : <FiClock className="text-xs" />}
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-white/40 text-xs mb-1.5">{formatDateTime(ticket.createdAt)}</p>
            <p className="text-white text-sm whitespace-pre-wrap">{ticket.message}</p>
          </div>
          {ticket.replies.map((r, i) => (
            <div
              key={i}
              className={`rounded-lg p-4 ${r.isAdmin ? "bg-red-600/10 border border-red-600/20" : "bg-white/5"}`}
            >
              <p className="text-white/40 text-xs mb-1.5">
                {r.isAdmin ? "Support team" : r.authorName} · {formatDateTime(r.createdAt)}
              </p>
              <p className="text-white text-sm whitespace-pre-wrap">{r.message}</p>
            </div>
          ))}
        </div>

        {ticket.status !== "closed" && (
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
        )}
      </div>
    </div>
  );
};

export default Support;
