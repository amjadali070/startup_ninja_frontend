import { FC, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiArrowRight, FiCheck, FiEye, FiX, FiUpload } from "react-icons/fi";
import { GiNinjaStar } from "react-icons/gi";
import WebBuilderService from "../../services/web-builder/WebBuilderService";
import TemplateService from "../../services/web-builder/TemplateService";
import GalleryService from "../../services/web-builder/GalleryService";
import { useAuth } from "../../hooks/useAuth";
import { useDraftPersistence } from "../../hooks/useDraftPersistence";
import {
  VIBE_OPTIONS,
  Vibe,
  TemplateLike,
  pickTemplateForVibe,
  fillTemplateDraft,
} from "./config/vibeTemplates";

interface CreateWebsiteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

// Matches the industries feedback.md asks for template coverage across —
// reused here as the optional Step 1 industry list so it stays in sync with
// the "Let Ninja choose" heuristic in vibeTemplates.ts.
const INDUSTRIES = [
  "SaaS", "Agency", "Restaurant / Coffee", "Real Estate", "E-commerce",
  "Portfolio", "Personal Brand", "Consulting", "Construction", "Law",
  "Gym", "Beauty", "Automotive", "Hotel", "Startup", "Local Business",
];

interface BusinessInfo {
  businessName: string;
  description: string;
  industry: string;
  goal: string;
  logoUrl: string;
  brandColor: string;
}

const EMPTY_INFO: BusinessInfo = {
  businessName: "",
  description: "",
  industry: "",
  goal: "",
  logoUrl: "",
  brandColor: "",
};

type Step = 1 | 2 | 3;

const CreateWebsiteWizard: FC<CreateWebsiteWizardProps> = ({ isOpen, onClose, onCreated }) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState<"" | "keep" | "edit" | "publish">("");
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  const [infoDraft, setInfoDraft, clearInfoDraft] = useDraftPersistence(
    `web-builder-wizard-info:${user?.id || "guest"}`
  );
  const info: BusinessInfo = useMemo(() => {
    try {
      return infoDraft ? { ...EMPTY_INFO, ...JSON.parse(infoDraft) } : EMPTY_INFO;
    } catch {
      return EMPTY_INFO;
    }
  }, [infoDraft]);

  const updateInfo = (patch: Partial<BusinessInfo>) => {
    setInfoDraft(JSON.stringify({ ...info, ...patch }));
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await GalleryService.uploadAsset(file);
      if (res.success && res.data?.src) {
        updateInfo({ logoUrl: res.data.src });
      } else {
        toast.error(res.message || "Failed to upload logo");
      }
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const [vibe, setVibe] = useState<Vibe | null>(null);

  // Templates are now DB-backed (see plan.md 3.2) instead of a static
  // bundled file — fetch the full list once whenever the wizard opens, and
  // let pickTemplateForVibe/fillTemplateDraft (now pure functions of
  // whatever list is passed in) operate on it locally from here on.
  const [templates, setTemplates] = useState<TemplateLike[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setTemplatesLoading(true);
    TemplateService.getTemplates().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setTemplates(res.data);
      } else {
        toast.error(res.message || "Failed to load templates");
      }
      setTemplatesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        setStep(1);
        setVibe(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const selectedTemplate = useMemo(() => {
    if (!vibe || !templates.length) return null;
    return pickTemplateForVibe(templates, vibe, info.industry);
  }, [vibe, info.industry, templates]);

  const filledDraft = useMemo(() => {
    if (!selectedTemplate) return null;
    return fillTemplateDraft(selectedTemplate, info.businessName, info.description, info.logoUrl || undefined);
  }, [selectedTemplate, info.businessName, info.description, info.logoUrl]);

  const draftPreviewHtml = useMemo(() => {
    const rawHtml = filledDraft?.data.pages[0]?.component || "<div />";
    return `<!doctype html><html><head><meta charset="utf-8"/><style>html,body{margin:0;padding:0;background:#0b0b0f}</style></head><body>${rawHtml}</body></html>`;
  }, [filledDraft]);

  const canGoToStep2 = info.businessName.trim().length > 0 && info.description.trim().length > 0;

  const handleReset = () => {
    setStep(1);
    setVibe(null);
  };

  const closeAndReset = () => {
    onClose();
    handleReset();
  };

  // Creates the website record, stages the personalized draft for the editor
  // to pick up on load, then opens the editor. Reused by Keep This / Edit /
  // Publish — see plan.md 3.1 for why those three converge on the same
  // underlying action rather than three genuinely distinct code paths (the
  // safe way to seed a real GrapesJS project is to let the editor's own
  // storage.onLoad do it, not to fabricate `websiteData` ourselves).
  const createAndOpenEditor = async (mode: "keep" | "edit" | "publish") => {
    if (!filledDraft || !user?.id) return;

    setSubmitting(mode);
    try {
      const formData = new FormData();
      formData.append("title", info.businessName.trim());
      formData.append("description", info.description.trim());
      formData.append("userId", user.id);
      if (info.logoUrl) formData.append("logoUrl", info.logoUrl);
      if (info.brandColor) formData.append("brandColor", info.brandColor);

      const response = await WebBuilderService.createWebsiteProject(formData);

      if (!response.success || !response.data?.projectId) {
        toast.error(response.message || "Failed to create website");
        return;
      }

      try {
        sessionStorage.setItem("pending-website-draft", JSON.stringify(filledDraft.data));
      } catch {
        // sessionStorage unavailable — editor falls back to the raw stock
        // template via ?template=, still functional, just not personalized.
      }

      const messages: Record<typeof mode, string> = {
        keep: "Draft saved — opening editor...",
        edit: "Opening editor...",
        publish: "Opening editor to confirm publish...",
      };
      toast.success(messages[mode]);

      const autopublish = mode === "publish" ? "&autopublish=1" : "";
      window.open(
        `/ai-tools/web-builder/new-website?id=${response.data.projectId}&template=${encodeURIComponent(
          selectedTemplate?.templateId || ""
        )}&draft=wizard${autopublish}`,
        "_blank"
      );

      clearInfoDraft();
      closeAndReset();
      onCreated();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create website");
    } finally {
      setSubmitting("");
    }
  };

  const handleTellNinja = () => {
    toast("Ask Ninja for changes is coming soon — for now, use Change Style or Edit.", {
      icon: "🥷",
    });
  };

  if (!isOpen && !visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${visible ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        onClick={closeAndReset}
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? "opacity-50" : "opacity-0"}`}
      />
      <div
        className={`relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-xl bg-[#1c1c1c] p-6 text-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold">Build Your Website</h2>
            <p className="text-xs text-gray-400 mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={closeAndReset} className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step >= s ? "bg-[#DC2626] text-white" : "bg-[#2a2a2a] text-gray-500"
                }`}
              >
                {step > s ? <FiCheck className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-[#DC2626]" : "bg-[#2a2a2a]"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Tell Ninja about your business */}
        {step === 1 && (
          <div>
            <h3 className="text-base font-semibold mb-1">Tell Ninja about your business</h3>
            <p className="text-xs text-gray-400 mb-4">Just the basics — you can refine everything later.</p>

            <div className="mb-4">
              <label className="block text-sm mb-2">Business name *</label>
              <input
                type="text"
                placeholder="e.g. Sunrise Coffee Co."
                value={info.businessName}
                onChange={(e) => updateInfo({ businessName: e.target.value })}
                className="w-full rounded-md bg-[#131313] border h-11 border-gray-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">One-line description *</label>
              <input
                type="text"
                placeholder="e.g. Specialty coffee roasted in small batches"
                value={info.description}
                onChange={(e) => updateInfo({ description: e.target.value })}
                className="w-full rounded-md bg-[#131313] border h-11 border-gray-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-sm mb-2">Industry <span className="text-gray-500">(optional)</span></label>
                <select
                  value={info.industry}
                  onChange={(e) => updateInfo({ industry: e.target.value })}
                  className="w-full rounded-md bg-[#131313] border h-11 border-gray-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Goal <span className="text-gray-500">(optional)</span></label>
                <select
                  value={info.goal}
                  onChange={(e) => updateInfo({ goal: e.target.value })}
                  className="w-full rounded-md bg-[#131313] border h-11 border-gray-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Select a goal</option>
                  <option value="get-customers">Get customers</option>
                  <option value="showcase-work">Showcase my work</option>
                  <option value="sell-products">Sell products</option>
                  <option value="build-credibility">Build credibility</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-sm mb-2">Logo <span className="text-gray-500">(optional)</span></label>
                <label
                  className={`flex items-center gap-2 w-full h-11 rounded-md bg-[#131313] border border-gray-700 px-3 text-sm cursor-pointer hover:border-gray-500 transition-colors ${
                    uploadingLogo ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {info.logoUrl ? (
                    <img src={info.logoUrl} alt="Logo preview" className="h-6 w-6 object-contain rounded" />
                  ) : (
                    <FiUpload className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-gray-400 truncate">
                    {uploadingLogo ? "Uploading…" : info.logoUrl ? "Logo uploaded — click to replace" : "Upload a logo"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
              <div>
                <label className="block text-sm mb-2">Brand color <span className="text-gray-500">(optional)</span></label>
                <div className="flex items-center gap-2 w-full h-11 rounded-md bg-[#131313] border border-gray-700 px-3">
                  <input
                    type="color"
                    value={info.brandColor || "#DC2626"}
                    onChange={(e) => updateInfo({ brandColor: e.target.value })}
                    className="h-7 w-7 rounded cursor-pointer bg-transparent border-none p-0"
                  />
                  <span className="text-sm text-gray-400">{info.brandColor || "Pick a color"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => canGoToStep2 && setStep(2)}
                disabled={!canGoToStep2}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold transition-colors ${
                  canGoToStep2 ? "bg-[#ec2222] text-white hover:bg-red-600" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Choose a vibe */}
        {step === 2 && (
          <div>
            <h3 className="text-base font-semibold mb-1">Choose a vibe</h3>
            <p className="text-xs text-gray-400 mb-4">We'll pick a matching starting point — you can change this later.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {VIBE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVibe(v.id)}
                  className={`text-left rounded-lg border p-3 transition-colors ${
                    vibe === v.id
                      ? "border-red-600 ring-1 ring-red-600/40 bg-[#241010]"
                      : "border-gray-700 bg-[#131313] hover:border-gray-600"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{v.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{v.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                <FiArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => vibe && setStep(3)}
                disabled={!vibe}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold transition-colors ${
                  vibe ? "bg-[#ec2222] text-white hover:bg-red-600" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review and publish */}
        {step === 3 && !filledDraft && templatesLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
            <GiNinjaStar className="w-6 h-6 animate-spin mb-3" />
            Loading templates…
          </div>
        )}

        {step === 3 && filledDraft && (
          <div>
            <h3 className="text-base font-semibold mb-1">Review your draft</h3>
            <p className="text-xs text-gray-400 mb-4">A starting point based on what you told Ninja — edit anything after this.</p>

            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700 bg-black mb-3">
              <iframe title="draft-preview" className="w-full h-full border-none pointer-events-none" srcDoc={draftPreviewHtml} scrolling="no" />
              <button
                type="button"
                onClick={() => setFullPreviewOpen(true)}
                className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-black/70 border border-gray-700 text-white hover:bg-black/90"
              >
                <FiEye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setStep(2)}
                className="px-3 py-2 text-sm rounded-md border border-gray-700 text-gray-200 hover:bg-white/5"
              >
                Change Style
              </button>
              <button
                onClick={handleTellNinja}
                className="px-3 py-2 text-sm rounded-md border border-gray-700 text-gray-200 hover:bg-white/5"
              >
                Tell Ninja What to Change
              </button>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                <FiArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => createAndOpenEditor("keep")}
                  disabled={!!submitting}
                  className="px-4 py-2.5 text-sm rounded-md border border-gray-700 text-gray-200 hover:bg-white/5 disabled:opacity-50"
                >
                  {submitting === "keep" ? <GiNinjaStar className="w-4 h-4 animate-spin inline" /> : "Keep This"}
                </button>
                <button
                  onClick={() => createAndOpenEditor("edit")}
                  disabled={!!submitting}
                  className="px-4 py-2.5 text-sm rounded-md bg-[#252525] border border-gray-700 text-white hover:bg-[#333] disabled:opacity-50"
                >
                  {submitting === "edit" ? <GiNinjaStar className="w-4 h-4 animate-spin inline" /> : "Edit"}
                </button>
                <button
                  onClick={() => createAndOpenEditor("publish")}
                  disabled={!!submitting}
                  className="px-4 py-2.5 text-sm rounded-md font-semibold bg-[#ec2222] text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {submitting === "publish" ? <GiNinjaStar className="w-4 h-4 animate-spin inline" /> : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {fullPreviewOpen && filledDraft && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div onClick={() => setFullPreviewOpen(false)} className="fixed inset-0 bg-black/70" />
          <div className="relative z-10 w-[95%] max-w-5xl rounded-xl bg-[#111111] border border-[#2a2a2a] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-[#2a2a2a]">
              <div className="text-white text-sm font-semibold">{filledDraft.name}</div>
              <button
                type="button"
                onClick={() => setFullPreviewOpen(false)}
                className="px-3 py-1.5 text-xs rounded-md border border-gray-700 text-gray-200 hover:bg-white/5"
              >
                Close
              </button>
            </div>
            <div className="w-full h-[70vh] bg-black">
              <iframe title="draft-full-preview" className="w-full h-full border-none" srcDoc={draftPreviewHtml} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWebsiteWizard;
