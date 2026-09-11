import React, { useState } from "react";
import { FaDatabase } from "react-icons/fa";
import toast from "react-hot-toast";
import { adminService } from "../../services/admin";

const DatabaseBackupCard: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    at: string;
    success: boolean;
    method: string | null;
    filesUploaded: number;
    prunedCount: number;
    error: string | null;
  } | null>(null);

  const handleRunBackup = async () => {
    setRunning(true);
    const loadingId = toast.loading("Running database backup...");
    try {
      const res = await adminService.triggerDatabaseBackup();
      const data = res.data;
      if (res.success && data?.success) {
        toast.success(
          `Backup succeeded via ${data.method} — ${data.filesUploaded} file(s) uploaded, ${data.prunedCount} old backup(s) pruned.`,
          { id: loadingId, duration: 6000 }
        );
        setLastResult({
          at: new Date().toISOString(),
          success: true,
          method: data.method,
          filesUploaded: data.filesUploaded,
          prunedCount: data.prunedCount,
          error: null,
        });
      } else {
        const errMsg = data?.error || res.message || "Backup failed.";
        toast.error(`Backup failed: ${errMsg}`, { id: loadingId, duration: 8000 });
        setLastResult({
          at: new Date().toISOString(),
          success: false,
          method: data?.method || null,
          filesUploaded: data?.filesUploaded || 0,
          prunedCount: data?.prunedCount || 0,
          error: errMsg,
        });
      }
    } catch (err: any) {
      const errMsg = err.message || "Backup failed.";
      toast.error(`Backup failed: ${errMsg}`, { id: loadingId });
      setLastResult({
        at: new Date().toISOString(),
        success: false,
        method: null,
        filesUploaded: 0,
        prunedCount: 0,
        error: errMsg,
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131313] via-[#101010] to-[#0B0B0B] p-4 lg:p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <FaDatabase />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] text-white/50 uppercase">Data Protection</p>
            <h3 className="text-sm font-semibold text-white mt-0.5">Database Backups</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Runs automatically every 24h — trigger an on-demand backup any time.
            </p>
          </div>
        </div>
        <button
          onClick={handleRunBackup}
          disabled={running}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 transition-colors flex-shrink-0"
        >
          {running ? "Running..." : "Run Backup Now"}
        </button>
      </div>

      {lastResult && (
        <div
          className={`mt-4 rounded-xl border px-3.5 py-2.5 text-xs ${
            lastResult.success
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {lastResult.success ? (
            <span>
              Last manual run succeeded via <strong>{lastResult.method}</strong> —{" "}
              {lastResult.filesUploaded} file(s) uploaded, {lastResult.prunedCount} old
              backup(s) pruned.
            </span>
          ) : (
            <span>Last manual run failed: {lastResult.error}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseBackupCard;
