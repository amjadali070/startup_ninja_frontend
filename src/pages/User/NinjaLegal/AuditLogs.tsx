import { type FC, useState, useEffect, useCallback, useRef } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FiShield, FiUpload, FiFileText, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiXCircle, FiMinusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LegalDisclaimerBanner from "../../../components/ninja-legal/LegalDisclaimerBanner";
import LegalPageBanner from "../../../components/ninja-legal/LegalPageBanner";
import {
  ninjaLegalService,
  UploadedContractSummary,
  ComplianceScanSummary,
  ComplianceScanDetails,
  ComplianceArea,
} from "../../../services/ninja-legal";

const READINESS_META: Record<string, { label: string; color: string }> = {
  strong: { label: "Strong", color: "text-[#10B981]" },
  needs_work: { label: "Needs Work", color: "text-amber-500" },
  significant_gaps: { label: "Significant Gaps", color: "text-[#EF4444]" },
};

const STATUS_META: Record<ComplianceArea["status"], { icon: JSX.Element; label: string; color: string }> = {
  covered: { icon: <FiCheckCircle />, label: "Covered", color: "text-[#10B981]" },
  partial: { icon: <FiAlertTriangle />, label: "Partial", color: "text-amber-500" },
  missing: { icon: <FiXCircle />, label: "Missing", color: "text-[#EF4444]" },
  not_applicable: { icon: <FiMinusCircle />, label: "N/A", color: "text-gray-500" },
};

const formatDateTime = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

const CATEGORY_LABEL: Record<ComplianceArea["category"], string> = {
  gdpr: "GDPR",
  security: "Security & Confidentiality",
  hipaa: "HIPAA",
};

const AuditLogs: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploads, setUploads] = useState<UploadedContractSummary[]>([]);
  const [scans, setScans] = useState<ComplianceScanSummary[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);
  const [selectedUploadId, setSelectedUploadId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeScan, setActiveScan] = useState<ComplianceScanDetails | null>(null);

  const fetchScans = useCallback(async () => {
    setLoadingScans(true);
    const res = await ninjaLegalService.listComplianceScans();
    if (res.success) setScans(res.data);
    setLoadingScans(false);
  }, []);

  const fetchUploads = useCallback(async () => {
    const res = await ninjaLegalService.listUploadedContracts();
    if (res.success) setUploads(res.data);
  }, []);

  useEffect(() => {
    fetchScans();
    fetchUploads();
  }, [fetchScans, fetchUploads]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext || "")) {
      toast.error("Only PDF, DOCX, and TXT files are supported");
      return;
    }

    setIsUploading(true);
    try {
      const res = await ninjaLegalService.uploadAndAnalyzeContract(file);
      if (res.success && res.data) {
        setSelectedUploadId(res.data._id);
        fetchUploads();
        toast.success("Document uploaded — ready to scan");
      } else {
        toast.error(res.message || res.error || "Failed to upload document");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunScan = async () => {
    if (!selectedUploadId) {
      toast.error("Pick or upload a document first");
      return;
    }
    setIsScanning(true);
    try {
      const res = await ninjaLegalService.runComplianceScan(selectedUploadId);
      if (res.success && res.data) {
        setActiveScan(res.data);
        fetchScans();
        toast.success(res.data.status === "completed" ? "Compliance scan complete" : "Scan failed — you can retry");
      } else {
        toast.error(res.message || res.error || "Failed to run compliance scan");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleViewScan = async (id: string) => {
    const res = await ninjaLegalService.getComplianceScan(id);
    if (res.success && res.data) {
      setActiveScan(res.data);
    } else {
      toast.error(res.message || "Failed to load scan");
    }
  };

  const handleRerun = async (id: string) => {
    setIsScanning(true);
    try {
      const res = await ninjaLegalService.rerunComplianceScan(id);
      if (res.success && res.data) {
        setActiveScan(res.data);
        fetchScans();
        toast.success("Scan re-run complete");
      } else {
        toast.error(res.message || "Failed to re-run scan");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const groupedAreas = activeScan?.results?.areas.reduce<Record<string, ComplianceArea[]>>((acc, area) => {
    (acc[area.category] ||= []).push(area);
    return acc;
  }, {}) || {};

  return (
    <DashboardLayout
      activePath="/ai-tools/legal/audit-logs"
      title="Compliance Scan"
      onLogout={handleLogout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-4">
          <div className="w-full max-w-auto mx-auto space-y-6 text-white pb-8">
          <LegalPageBanner
            title="Compliance Scan"
            subtitle="AI review of your documents' wording against GDPR, security, and HIPAA policy checklists"
          />

          <LegalDisclaimerBanner />
          <p className="text-[11px] text-gray-500 -mt-2">
            This reviews what your document's <strong className="text-gray-400">text</strong> says — it does not inspect your actual systems, cloud configuration, or access controls. It's a starting point for spotting gaps in your policy language, not a certified audit.
          </p>

          {/* Run a new scan */}
          <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 space-y-4">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Run a Scan</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedUploadId}
                onChange={(e) => setSelectedUploadId(e.target.value)}
                className="flex-1 bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EF4444]/50"
              >
                <option value="">-- Select an uploaded document --</option>
                {uploads.map((u) => (
                  <option key={u._id} value={u._id}>{u.originalFilename}</option>
                ))}
              </select>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileSelect} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-black uppercase tracking-widest text-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <LoadingSpinner /> : <FiUpload className="w-4 h-4" />}
                Upload New
              </button>
              <button
                onClick={handleRunScan}
                disabled={!selectedUploadId || isScanning}
                className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                {isScanning ? <LoadingSpinner /> : <FiShield className="w-4 h-4" />}
                {isScanning ? "Scanning..." : "Run Scan"}
              </button>
            </div>
          </div>

          {/* Active scan results */}
          {activeScan && (
            <div className="bg-white text-gray-900 rounded-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black flex items-center gap-2">
                  <FiFileText className="text-[#EF4444]" /> {activeScan.documentName}
                </h2>
                <button
                  onClick={() => handleRerun(activeScan._id)}
                  disabled={isScanning}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-gray-700 transition-all disabled:opacity-50"
                >
                  <FiRefreshCw className={isScanning ? "animate-spin" : ""} /> Re-run
                </button>
              </div>

              {activeScan.status === "failed" ? (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  Scan failed: {activeScan.error || "Unknown error"}
                </p>
              ) : activeScan.results ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black uppercase tracking-widest ${READINESS_META[activeScan.results.readinessLevel]?.color}`}>
                      {READINESS_META[activeScan.results.readinessLevel]?.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{activeScan.results.overallSummary}</p>

                  {Object.entries(groupedAreas).map(([category, areas]) => (
                    <div key={category}>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                        {CATEGORY_LABEL[category as ComplianceArea["category"]]}
                      </h3>
                      <div className="space-y-2">
                        {areas.map((a, i) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-3.5">
                            <div className={`flex items-center gap-2 mb-1.5 ${STATUS_META[a.status].color}`}>
                              {STATUS_META[a.status].icon}
                              <span className="text-[10px] font-black uppercase tracking-widest">{STATUS_META[a.status].label}</span>
                              <span className="text-sm font-bold text-gray-900">{a.area}</span>
                            </div>
                            {a.finding && <p className="text-sm text-gray-700 mb-1">{a.finding}</p>}
                            {a.recommendation && <p className="text-xs text-gray-500 italic">Suggestion: {a.recommendation}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <LegalDisclaimerBanner variant="inline" />
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Scan history */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Scan History</p>
            {loadingScans ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : scans.length === 0 ? (
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-10 text-center text-gray-500 text-sm">
                No scans yet — run one above.
              </div>
            ) : (
              scans.map((scan) => (
                <div
                  key={scan._id}
                  onClick={() => handleViewScan(scan._id)}
                  className="bg-[#121212] border border-white/[0.03] p-5 rounded-2xl flex items-center justify-between group hover:border-[#EF444420] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/[0.05]">
                      <FiShield className={scan.status === "failed" ? "text-red-500" : "text-gray-400"} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white group-hover:text-[#EF4444] transition-colors">{scan.documentName}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formatDateTime(scan.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    scan.status === "failed" ? "text-[#EF4444]" :
                    scan.status === "pending" ? "text-gray-500" :
                    READINESS_META[scan.results?.readinessLevel || "needs_work"]?.color
                  }`}>
                    {scan.status === "failed" ? "Failed" : scan.status === "pending" ? "Pending" : READINESS_META[scan.results?.readinessLevel || "needs_work"]?.label}
                  </span>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AuditLogs;
