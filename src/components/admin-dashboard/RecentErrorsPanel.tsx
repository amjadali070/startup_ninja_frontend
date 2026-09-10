import { useEffect, useState, type FC } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { adminService } from "../../services/admin";
import type { RecentErrors } from "../../types/admin";

const formatTime = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleTimeString();
};

const RecentErrorsPanel: FC = () => {
  const [data, setData] = useState<RecentErrors | null>(null);

  useEffect(() => {
    adminService.getRecentErrors(24).then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131313] via-[#101010] to-[#0B0B0B] p-4 lg:p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/50 uppercase">System Observability</p>
          <h3 className="text-sm font-semibold text-white mt-1">Recent Errors</h3>
        </div>
        {data && (
          <span
            className={`rounded-full px-3 py-1 text-[10px] tracking-widest uppercase border ${
              data.total === 0
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-amber-400/30 bg-amber-500/10 text-amber-200"
            }`}
          >
            {data.total} in last {data.hours}h
          </span>
        )}
      </div>

      {!data ? (
        <p className="text-xs text-gray-500">Loading…</p>
      ) : data.total === 0 ? (
        <p className="text-xs text-gray-500">No errors in the last {data.hours} hours — all clear.</p>
      ) : (
        <>
          {data.byService.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {data.byService.map((s) => (
                <span
                  key={s.service}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70"
                >
                  {s.service}: {s.count}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {data.recent.map((e) => (
              <div
                key={e._id}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
              >
                <FiAlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white font-medium">{e.service}</span>
                    <span className="text-white/40">{e.method}</span>
                    <span className="text-white/40 truncate">{e.route}</span>
                    {e.statusCode && (
                      <span className="text-red-400 flex-shrink-0">{e.statusCode}</span>
                    )}
                  </div>
                  {e.message && <p className="text-white/50 text-[11px] mt-1 truncate">{e.message}</p>}
                </div>
                <span className="text-white/30 text-[10px] flex-shrink-0">
                  {formatTime(e.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentErrorsPanel;
