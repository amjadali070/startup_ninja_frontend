import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiFileText, FiRepeat, FiCheck } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import DashboardLayout from "../../../layouts/DashboardLayout";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LegalDisclaimerBanner from "../../../components/ninja-legal/LegalDisclaimerBanner";
import LegalPageBanner from "../../../components/ninja-legal/LegalPageBanner";
import {
  ninjaLegalService,
  UploadedContractSummary,
  ContractComparisonResult,
} from "../../../services/ninja-legal";

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const DocumentPicker = ({
  label,
  uploads,
  selectedId,
  onSelect,
  onUpload,
  uploading,
  disabledId,
}: {
  label: string;
  uploads: UploadedContractSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpload: (file: File) => void;
  uploading: boolean;
  disabledId: string | null;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = uploads.find((u) => u._id === selectedId);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 space-y-4">
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</p>

      {selected ? (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
          <FiFileText className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{selected.originalFilename}</p>
            <p className="text-[10px] text-gray-500">{formatDate(selected.createdAt)}</p>
          </div>
          <button onClick={() => onSelect("")} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest">
            Change
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onUpload(file);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full h-20 border-2 border-dashed border-white/10 hover:border-red-500/40 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {uploading ? <LoadingSpinner /> : (
              <>
                <FiUpload className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-white">Upload New</span>
              </>
            )}
          </button>

          {uploads.length > 0 && (
            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
              {uploads.map((u) => (
                <button
                  key={u._id}
                  disabled={u._id === disabledId}
                  onClick={() => onSelect(u._id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-left"
                >
                  <FiFileText className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="text-xs text-gray-300 truncate">{u.originalFilename}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const ContractComparisonPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [uploads, setUploads] = useState<UploadedContractSummary[]>([]);
  const [idA, setIdA] = useState<string | null>(null);
  const [idB, setIdB] = useState<string | null>(null);
  const [uploadingA, setUploadingA] = useState(false);
  const [uploadingB, setUploadingB] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<{ nameA: string; nameB: string; comparison: ContractComparisonResult } | null>(null);

  const fetchUploads = useCallback(async () => {
    const res = await ninjaLegalService.listUploadedContracts();
    if (res.success) setUploads(res.data);
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

  const uploadSlot = async (file: File, slot: "A" | "B") => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext || "")) {
      toast.error("Only PDF, DOCX, and TXT files are supported");
      return;
    }
    const setUploading = slot === "A" ? setUploadingA : setUploadingB;
    const setId = slot === "A" ? setIdA : setIdB;

    setUploading(true);
    try {
      const res = await ninjaLegalService.uploadAndAnalyzeContract(file);
      if (res.success && res.data) {
        setId(res.data._id);
        fetchUploads();
        toast.success(`Document ${slot} uploaded`);
      } else {
        toast.error(res.message || res.error || "Failed to upload");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCompare = async () => {
    if (!idA || !idB) return;
    setComparing(true);
    setResult(null);
    try {
      const res = await ninjaLegalService.compareContracts(idA, idB);
      if (res.success && res.data) {
        setResult({ nameA: res.data.documentA.name, nameB: res.data.documentB.name, comparison: res.data.comparison });
      } else {
        toast.error(res.message || res.error || "Failed to compare contracts");
      }
    } finally {
      setComparing(false);
    }
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/legal/compare"
      title="Compare Contracts"
      onLogout={handleLogout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-4">
          <div className="w-full max-w-auto mx-auto space-y-6 text-white pb-8">
          <LegalPageBanner
            title="Compare Contracts"
            subtitle="See exactly what's different between two versions or two offers"
          />

          <LegalDisclaimerBanner />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentPicker
              label="Document A"
              uploads={uploads}
              selectedId={idA}
              onSelect={(id) => setIdA(id || null)}
              onUpload={(f) => uploadSlot(f, "A")}
              uploading={uploadingA}
              disabledId={idB}
            />
            <DocumentPicker
              label="Document B"
              uploads={uploads}
              selectedId={idB}
              onSelect={(id) => setIdB(id || null)}
              onUpload={(f) => uploadSlot(f, "B")}
              uploading={uploadingB}
              disabledId={idA}
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={!idA || !idB || comparing}
            className="w-full h-14 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm transition-all active:scale-95"
          >
            {comparing ? <LoadingSpinner /> : <FiRepeat className="w-5 h-5" />}
            {comparing ? "Comparing..." : "Compare Documents"}
          </button>

          {result && (
            <div className="bg-white text-gray-900 rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Overview</h3>
                <p className="text-sm leading-relaxed">{result.comparison.overview}</p>
              </div>

              {!!result.comparison.keyDifferences.length && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Key Differences</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Aspect</th>
                          <th className="text-left py-2 pr-4 font-bold text-gray-700 text-xs uppercase tracking-wider truncate max-w-[200px]">{result.nameA}</th>
                          <th className="text-left py-2 font-bold text-gray-700 text-xs uppercase tracking-wider truncate max-w-[200px]">{result.nameB}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.comparison.keyDifferences.map((d, i) => (
                          <tr key={i} className="border-b border-gray-100 align-top">
                            <td className="py-3 pr-4 font-bold whitespace-nowrap">{d.aspect}</td>
                            <td className="py-3 pr-4 text-gray-700">{d.documentA}</td>
                            <td className="py-3 text-gray-700">{d.documentB}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Favorability</h3>
                <p className="text-sm leading-relaxed">{result.comparison.favorability}</p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-2.5">
                <FiCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{result.comparison.recommendation}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <LegalDisclaimerBanner variant="inline" />
              </div>
            </div>
          )}

          {!result && !comparing && (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <HiSparkles className="w-8 h-8 text-red-500 mx-auto mb-3 opacity-50" />
                <p className="text-white/40 text-sm">Pick or upload two documents above, then compare them.</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ContractComparisonPage;
