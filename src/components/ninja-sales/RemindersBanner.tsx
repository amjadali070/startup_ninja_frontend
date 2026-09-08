import { type FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBell, FiLoader, FiSend, FiCheckCircle } from "react-icons/fi";
import { ninjaSalesService } from "../../services/ninjaSales";
import type { ReminderItem } from "../../services/ninjaSales";

/**
 * Surfaces the automatic reminders sweep (hourly, in-app notification + once-daily
 * digest email via the platform's own SMTP — see reminderService.js) inside Follow-ups,
 * and lets the owner/manager trigger today's check-in on demand instead of waiting
 * for the next automatic pass.
 */
const RemindersBanner: FC = () => {
  const [items, setItems] = useState<ReminderItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await ninjaSalesService.getReminderPreview();
    if (res.success) setItems(res.data.items);
    else setForbidden(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRunNow = async () => {
    setSending(true);
    const res = await ninjaSalesService.runReminderNow();
    setSending(false);
    if (res.success && res.data.notified) {
      toast.success(res.message || `Sent — ${res.data.itemCount} lead(s) flagged`);
      if (res.data.items) setItems(res.data.items);
    } else if (res.success) {
      toast(res.message || "Nothing needs attention right now");
    } else {
      toast.error(res.message || "Failed to run reminders");
    }
  };

  if (forbidden) return null;

  if (loading) {
    return (
      <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-5 flex items-center gap-3 text-white/40">
        <FiLoader className="w-4 h-4 animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest">Checking reminders...</span>
      </div>
    );
  }

  const count = items?.length || 0;

  return (
    <div
      className={`rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border ${
        count > 0
          ? "bg-gradient-to-br from-red-600/10 to-transparent border-red-600/20"
          : "bg-[#121212] border-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-2.5 rounded-xl shrink-0 ${count > 0 ? "bg-red-500/20" : "bg-white/5"}`}>
          {count > 0 ? (
            <FiBell className="w-5 h-5 text-red-500" />
          ) : (
            <FiCheckCircle className="w-5 h-5 text-white/40" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-white uppercase tracking-tight">
            {count > 0 ? `${count} lead${count === 1 ? "" : "s"} need attention today` : "All caught up"}
          </p>
          <p className="text-xs text-white/40 truncate">
            {count > 0
              ? items!.slice(0, 3).map((it) => it.name).join(", ") + (count > 3 ? ` +${count - 3} more` : "")
              : "Reminders run automatically every hour and email your account once a day when something's due."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleRunNow}
        disabled={sending}
        className="h-11 px-5 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 font-black transition-all disabled:opacity-50 text-white/70"
        title="Send this account's reminder digest (in-app + email) right now"
      >
        {sending ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSend className="w-4 h-4" />}
        <span className="text-[10px] uppercase tracking-widest">{sending ? "Sending..." : "Check In Now"}</span>
      </button>
    </div>
  );
};

export default RemindersBanner;
