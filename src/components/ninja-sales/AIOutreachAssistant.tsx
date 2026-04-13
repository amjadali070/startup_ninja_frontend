import { type FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSend,
  FiEdit3,
  FiCopy,
  FiCheckCircle,
  FiLoader,
  FiRefreshCw,
  FiFolder,
  FiFilter,
  FiClock,
  FiCalendar,
  FiMail,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import AlertModal from "../AlertModal";
import IconSelect from "../IconSelect";
import { ninjaSalesService } from "../../services/ninjaSales";
import type { OutreachDraft, Project, FollowUp } from "../../services/ninjaSales";
import type { SelectOption } from "../IconSelect";

const fmtShort = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

/** Builds a mailto: URL for the OS default mail client (Outlook, Mail, etc.). */
function buildMailtoHref(to: string, subject: string, body: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  const q = params.toString();
  const addr = to.trim();
  return addr ? `mailto:${addr}?${q}` : `mailto:?${q}`;
}

const AIOutreachAssistant: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProjectId = searchParams.get("draftProject") || "";
  const urlFollowUpId = searchParams.get("draftFollowUp") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectFollowUps, setProjectFollowUps] = useState<FollowUp[]>([]);
  const [listsLoading, setListsLoading] = useState(true);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string>("");

  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mailClientModalOpen, setMailClientModalOpen] = useState(false);
  const pendingMailtoHrefRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListsLoading(true);
      const res = await ninjaSalesService.getProjects({ limit: 200 });
      if (cancelled) return;
      if (res.success && res.data) setProjects(res.data);
      setListsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSelectedProjectId(searchParams.get("draftProject") || "");
    setSelectedFollowUpId(searchParams.get("draftFollowUp") || "");
  }, [searchParams]);

  useEffect(() => {
    if (urlProjectId || !urlFollowUpId) return;
    let cancelled = false;
    (async () => {
      const res = await ninjaSalesService.getFollowUps({ limit: 300 });
      if (cancelled || !res.success || !res.data) return;
      const fu = res.data.find((f) => f._id === urlFollowUpId);
      if (!fu) return;
      const pid =
        typeof fu.projectId === "string" ? fu.projectId : (fu.projectId as { _id?: string })?._id;
      if (!pid) return;
      const idStr = String(pid);
      setSelectedProjectId(idStr);
      setSearchParams(
        (prev) => {
          const n = new URLSearchParams(prev);
          n.set("draftProject", idStr);
          n.set("draftFollowUp", urlFollowUpId);
          return n;
        },
        { replace: true }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [urlProjectId, urlFollowUpId, setSearchParams]);

  useEffect(() => {
    if (!selectedProjectId) {
      setProjectFollowUps([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await ninjaSalesService.getFollowUps({
        projectId: selectedProjectId,
        limit: 200,
      });
      if (cancelled || !res.success) return;
      setProjectFollowUps(res.data || []);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  const followUpOptions = useMemo(() => {
    const open = projectFollowUps.filter((f) => !f.completed);
    const rest = projectFollowUps.filter((f) => f.completed);
    const sortedOpen = [...open].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    const sortedRest = [...rest].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return [...sortedOpen, ...sortedRest].slice(0, 40);
  }, [projectFollowUps]);

  const projectSelectOptions: SelectOption[] = useMemo(() => {
    const base: SelectOption[] = [
      {
        value: "",
        label: "All projects (next open follow-up)",
        icon: <FiFilter className="w-4 h-4" />,
      },
    ];
    const rest = projects.map((p) => ({
      value: p._id,
      label: p.name,
      icon: <FiFolder className="w-4 h-4" />,
    }));
    return [...base, ...rest];
  }, [projects]);

  const followUpSelectOptions: SelectOption[] = useMemo(() => {
    if (!selectedProjectId) {
      return [
        {
          value: "",
          label: "Select a project first",
          icon: <FiFolder className="w-4 h-4" />,
        },
      ];
    }
    const base: SelectOption[] = [
      {
        value: "",
        label: "Auto — next due (uses history)",
        icon: <FiClock className="w-4 h-4" />,
      },
    ];
    const rest = followUpOptions.map((fu) => ({
      value: fu._id,
      label: `${fu.completed ? "✓ " : ""}${fu.title} · ${fmtShort(fu.dueDate)} (${fu.type})`,
      icon: <FiCalendar className="w-4 h-4" />,
    }));
    return [...base, ...rest];
  }, [selectedProjectId, followUpOptions]);

  /** Best-effort To: line for mailto — follow-up row, else populated project lead. */
  const recipientEmail = useMemo(() => {
    if (selectedFollowUpId) {
      const fu = projectFollowUps.find((f) => f._id === selectedFollowUpId);
      if (fu?.leadEmail?.trim()) return fu.leadEmail.trim();
    }
    if (selectedProjectId) {
      const p = projects.find((x) => x._id === selectedProjectId);
      if (p?.leadId && typeof p.leadId === "object" && p.leadId.email?.trim()) {
        return p.leadId.email.trim();
      }
    }
    return "";
  }, [selectedFollowUpId, selectedProjectId, projectFollowUps, projects]);

  const syncUrl = useCallback(
    (projectId: string, followUpId: string) => {
      const next = new URLSearchParams(searchParams);
      if (followUpId) next.set("draftFollowUp", followUpId);
      else next.delete("draftFollowUp");
      if (projectId) next.set("draftProject", projectId);
      else next.delete("draftProject");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const loadDraft = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    let res;
    if (selectedFollowUpId) {
      res = await ninjaSalesService.postOutreachDraft({
        followUpId: selectedFollowUpId,
        ...(selectedProjectId ? { projectId: selectedProjectId } : {}),
      });
    } else if (selectedProjectId) {
      res = await ninjaSalesService.postOutreachDraft({ projectId: selectedProjectId });
    } else {
      res = await ninjaSalesService.postOutreachDraft({});
    }

    if (res.success && res.data?.body) setDraft(res.data);
    else setError(res.message || "Could not generate draft");
    setLoading(false);
  }, [selectedProjectId, selectedFollowUpId]);

  useEffect(() => {
    if (listsLoading) return;
    loadDraft();
  }, [listsLoading, loadDraft]);

  const onProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setSelectedFollowUpId("");
    syncUrl(value, "");
  };

  const onFollowUpChange = (value: string) => {
    setSelectedFollowUpId(value);
    syncUrl(selectedProjectId, value);
  };

  const handleCopy = async () => {
    if (!draft?.body) return;
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleEditInClient = () => {
    if (!draft?.body) return;
    const subject = `Follow-up — ${draft.intentLabel || "Ninja Sales"}`;
    pendingMailtoHrefRef.current = buildMailtoHref(recipientEmail, subject, draft.body);
    setMailClientModalOpen(true);
  };

  const handleConfirmOpenMailClient = () => {
    const href = pendingMailtoHrefRef.current;
    pendingMailtoHrefRef.current = null;
    setMailClientModalOpen(false);
    if (href) window.location.href = href;
  };

  const handleCloseMailClientModal = () => {
    pendingMailtoHrefRef.current = null;
    setMailClientModalOpen(false);
  };

  const paragraphs = draft?.body
    ? draft.body
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <>
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 shadow-2xl h-full flex flex-col relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-xl">
            <HiSparkles className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Suggested Message</h2>
        </div>
        <button
          type="button"
          onClick={() => loadDraft()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/70 hover:bg-white/10 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Regenerate
        </button>
      </div>

      <div className="space-y-3 mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-2 text-[9px] font-black text-white/35 uppercase tracking-widest">
          <FiFolder className="w-3.5 h-3.5" />
          Context
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className={`flex flex-col gap-1.5 ${listsLoading ? "opacity-50 pointer-events-none" : ""}`}>
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Project</span>
            <IconSelect
              value={selectedProjectId}
              onChange={onProjectChange}
              options={projectSelectOptions}
              placeholder="All projects (next open follow-up)"
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 w-full h-[46px] text-sm"
            />
          </div>
          <div className={`flex flex-col gap-1.5 ${!selectedProjectId ? "opacity-40 pointer-events-none" : ""}`}>
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
              Anchor follow-up
            </span>
            <IconSelect
              value={
                selectedFollowUpId &&
                followUpSelectOptions.some((o) => o.value === selectedFollowUpId)
                  ? selectedFollowUpId
                  : ""
              }
              onChange={onFollowUpChange}
              options={followUpSelectOptions}
              placeholder={selectedProjectId ? "Auto — next due (uses history)" : "Select a project first"}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 w-full h-[46px] text-sm"
            />
          </div>
        </div>
        <p className="text-[10px] text-white/35 leading-relaxed">
          Pick a project to include its follow-up history in the draft. Optionally anchor on one follow-up; leave
          anchor on Auto to target the next open item.
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-white/40">
            <FiLoader className="w-8 h-8 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Drafting</span>
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-white/45 text-center py-10 px-2 leading-relaxed">{error}</p>
        )}

        {!loading && !error && draft && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                  Recipient
                </span>
                <span className="text-lg font-black text-white uppercase tracking-tight truncate">
                  {draft.recipientName}
                </span>
              </div>
              <span className="bg-red-600 text-[10px] font-black text-white px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-red-600/20 flex-shrink-0">
                {draft.intentLabel}
              </span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex-1 relative group hover:border-red-500/20 transition-all min-h-[200px]">
              <div className="absolute top-4 left-4">
                <span className="bg-red-600/20 border border-red-500/30 text-[9px] font-black text-red-500 px-2 py-0.5 rounded-md uppercase tracking-widest">
                  Draft
                </span>
              </div>

              <div className="mt-10 text-gray-400 text-sm leading-relaxed font-medium overflow-y-auto max-h-[300px] scrollbar-hide">
                {paragraphs.map((p, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <button
                type="button"
                className="w-full h-14 bg-red-600/40 text-white/50 rounded-2xl flex items-center justify-center gap-3 font-black cursor-not-allowed"
                disabled
                title="Connect your email provider to send from here"
              >
                <FiSend className="w-5 h-5" />
                <span className="uppercase tracking-widest">Send (coming soon)</span>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleEditInClient}
                  title={
                    recipientEmail
                      ? "Open your default email app with To, subject, and body filled in"
                      : "Open your default email app with subject and body filled in (add the address in To: if needed)"
                  }
                  className="h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black transition-all text-white/70"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Edit in client</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black transition-all text-white/70"
                >
                  <FiCopy className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {draft.reasons?.length > 0 && (
              <div className="mt-8 border-t border-white/5 pt-6">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                  Why this message?
                </h3>
                <div className="space-y-3">
                  {draft.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FiCheckCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-white/50 leading-relaxed font-medium">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>

    <AlertModal
      isOpen={mailClientModalOpen}
      onClose={handleCloseMailClientModal}
      onConfirm={handleConfirmOpenMailClient}
      title="Open in email app"
      type="info"
      action="edit"
      customIcon={<FiMail className="h-5 w-5" />}
      confirmText="Continue"
      cancelText="Cancel"
      message={
        <div className="space-y-3">
          <p className="text-white/80 text-sm leading-relaxed">
            Your default email application will open with the subject and message body filled in from this draft.
          </p>
          {recipientEmail ? (
            <p className="text-xs text-white/60">
              <span className="font-semibold text-white/80">To:</span> {recipientEmail}
            </p>
          ) : (
            <p className="text-xs text-amber-400/90">
              No lead email on file for this context — add the recipient in the To: field after it opens.
            </p>
          )}
          <p className="text-[11px] text-white/45 leading-relaxed">
            Your browser may ask again to allow opening Outlook or your mail app — that is normal for security.
          </p>
        </div>
      }
    />
    </>
  );
};

export default AIOutreachAssistant;
