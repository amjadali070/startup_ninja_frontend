import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiFileText, FiTrash2, FiRefreshCw, FiDownload, FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../../../hooks/useAuth";
import DashboardLayout from "../../../layouts/DashboardLayout";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LegalDisclaimerBanner from "../../../components/ninja-legal/LegalDisclaimerBanner";
import LegalPageBanner from "../../../components/ninja-legal/LegalPageBanner";
import AlertModal from "../../../components/AlertModal";
import {
  ninjaLegalService,
  UploadedContractSummary,
  UploadedContractDetails,
} from "../../../services/ninja-legal";

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

export const ContractAnalysisPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [uploads, setUploads] = useState<UploadedContractSummary[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [selected, setSelected] = useState<UploadedContractDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUploads = useCallback(async () => {
    setLoadingUploads(true);
    const res = await ninjaLegalService.listUploadedContracts();
    if (res.success) setUploads(res.data);
    setLoadingUploads(false);
  }, []);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

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
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File exceeds the 15MB limit");
      return;
    }

    setIsUploading(true);
    try {
      const res = await ninjaLegalService.uploadAndAnalyzeContract(file);
      if (res.success && res.data) {
        setSelected(res.data);
        fetchUploads();
        if (res.data.analysisStatus === "completed") {
          toast.success("Contract analyzed successfully");
        } else {
          toast.error("Uploaded, but analysis failed — you can retry below");
        }
      } else {
        toast.error(res.message || res.error || "Failed to analyze contract");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectUpload = async (id: string) => {
    const res = await ninjaLegalService.getUploadedContract(id);
    if (res.success && res.data) {
      setSelected(res.data);
    } else {
      toast.error(res.message || "Failed to load contract details");
    }
  };

  const handleReanalyze = async () => {
    if (!selected) return;
    setIsUploading(true);
    try {
      const res = await ninjaLegalService.reanalyzeContract(selected._id);
      if (res.success && res.data) {
        setSelected(res.data);
        fetchUploads();
        toast.success(res.data.analysisStatus === "completed" ? "Analysis complete" : "Analysis failed again");
      } else {
        toast.error(res.message || "Failed to reanalyze");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    const res = await ninjaLegalService.deleteUploadedContract(toDelete);
    setIsDeleting(false);
    setToDelete(null);
    if (res.success) {
      toast.success("Deleted");
      if (selected?._id === toDelete) setSelected(null);
      fetchUploads();
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !selected) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const availableHeight = pageHeight - margin * 2;
      const totalPages = Math.ceil(imgHeight / availableHeight);

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) pdf.addPage();
        const yOffset = pageNum * availableHeight;
        const heightToPrint = Math.min(availableHeight, imgHeight - yOffset);
        const sourceY = (yOffset / imgHeight) * canvas.height;
        const sourceHeight = (heightToPrint / imgHeight) * canvas.height;

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext("2d");
        ctx?.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, imgWidth, heightToPrint);
      }

      pdf.save(`contract-analysis-${selected.originalFilename.replace(/\.[^.]+$/, "")}.pdf`);
      toast.success("Analysis downloaded");
    } catch (error: any) {
      toast.error("Failed to download: " + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const analysis = selected?.analysis;

  return (
    <DashboardLayout
      activePath="/ai-tools/legal/analyze"
      title="Analyze Contract"
      onLogout={handleLogout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-4">
          <div className="w-full max-w-auto mx-auto space-y-6 text-white pb-8">
          <LegalPageBanner
            title="Analyze Contract"
            subtitle="Upload a contract to get a plain-English breakdown of what you're agreeing to"
          />

          <LegalDisclaimerBanner />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Upload + list */}
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 space-y-4">
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileSelect} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full h-32 border-2 border-dashed border-white/10 hover:border-red-500/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <FiUpload className="w-6 h-6 text-red-500" />
                      <span className="text-sm font-bold text-white">Upload Contract</span>
                      <span className="text-[10px] text-gray-500">PDF, DOCX, or TXT — up to 15MB</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-4">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-2">Uploaded Contracts</p>
                {loadingUploads ? (
                  <div className="flex justify-center py-6"><LoadingSpinner /></div>
                ) : uploads.length === 0 ? (
                  <p className="text-white/30 text-xs px-2 py-4 text-center">No contracts uploaded yet.</p>
                ) : (
                  <div className="space-y-1">
                    {uploads.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => handleSelectUpload(u._id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
                          selected?._id === u._id ? "bg-red-600/10 border border-red-600/20" : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <FiFileText className="w-4 h-4 text-gray-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{u.originalFilename}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {u.analysisStatus === "completed" && <FiCheckCircle className="w-3 h-3 text-emerald-500" />}
                            {u.analysisStatus === "failed" && <FiAlertCircle className="w-3 h-3 text-red-500" />}
                            {u.analysisStatus === "pending" && <FiClock className="w-3 h-3 text-amber-500" />}
                            <span className="text-[10px] text-gray-500">{formatDate(u.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setToDelete(u._id); }}
                          className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                          aria-label="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Analysis results */}
            <div className="xl:col-span-8">
              {!selected ? (
                <div className="h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/0 border border-white/5 rounded-3xl">
                  <div className="text-center">
                    <HiSparkles className="w-10 h-10 text-red-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-white font-black text-lg">Upload or select a contract</p>
                    <p className="text-white/40 text-sm mt-2">We'll summarize it, flag risky clauses, and explain it plainly</p>
                  </div>
                </div>
              ) : selected.analysisStatus === "pending" ? (
                <div className="h-full min-h-[400px] flex items-center justify-center bg-[#121212] border border-white/[0.03] rounded-3xl">
                  <LoadingSpinner />
                </div>
              ) : selected.analysisStatus === "failed" ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#121212] border border-white/[0.03] rounded-3xl gap-4 p-8 text-center">
                  <FiAlertCircle className="w-10 h-10 text-red-500" />
                  <p className="text-white font-bold">Analysis failed</p>
                  <p className="text-white/40 text-sm max-w-sm">{selected.analysisError || "Something went wrong analyzing this document."}</p>
                  <button
                    onClick={handleReanalyze}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    <FiRefreshCw className={isUploading ? "animate-spin" : ""} /> Retry Analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white truncate flex items-center gap-2">
                      <FiFileText className="text-red-500 shrink-0" /> {selected.originalFilename}
                    </h2>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
                    >
                      <FiDownload className={isDownloading ? "animate-bounce" : ""} /> {isDownloading ? "Downloading..." : "Export PDF"}
                    </button>
                  </div>

                  <div ref={reportRef} className="bg-white text-gray-900 rounded-2xl p-8 space-y-6">
                    {selected.textTruncated && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        This document was long — analysis is based on the first portion of the text.
                      </p>
                    )}

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Summary</h3>
                      <p className="text-sm leading-relaxed">{analysis?.summary}</p>
                    </div>

                    {!!analysis?.obligations.length && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Obligations</h3>
                        <ul className="space-y-1.5 list-disc list-inside text-sm">
                          {analysis.obligations.map((o, i) => <li key={i}>{o}</li>)}
                        </ul>
                      </div>
                    )}

                    {!!analysis?.paymentTerms.length && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Payment Terms</h3>
                        <ul className="space-y-1.5 list-disc list-inside text-sm">
                          {analysis.paymentTerms.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    )}

                    {!!analysis?.terminationClauses.length && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Termination</h3>
                        <ul className="space-y-1.5 list-disc list-inside text-sm">
                          {analysis.terminationClauses.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    )}

                    {!!analysis?.riskyClauses.length && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Flagged Clauses</h3>
                        <div className="space-y-2.5">
                          {analysis.riskyClauses.map((r, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-3.5">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                  r.severity === "high" ? "bg-red-50 text-red-700 border-red-200" :
                                  r.severity === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  "bg-gray-50 text-gray-600 border-gray-200"
                                }`}>{r.severity}</span>
                                <span className="text-sm font-bold">{r.risk}</span>
                              </div>
                              <p className="text-xs text-gray-500 italic mb-1.5">"{r.clause}"</p>
                              <p className="text-sm text-gray-700">{r.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Plain-English Explanation</h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis?.plainEnglishExplanation}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <LegalDisclaimerBanner variant="inline" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </main>

      <AlertModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Uploaded Contract"
        message="This will permanently remove the uploaded file and its analysis. This cannot be undone."
        type="danger"
        action="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </DashboardLayout>
  );
};

export default ContractAnalysisPage;
