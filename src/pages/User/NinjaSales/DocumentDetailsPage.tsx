import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { ninjaSalesService } from "../../../services/ninjaSales";
import type { Proposal, Invoice, PricingItem } from "../../../services/ninjaSales";
import { FiArrowLeft, FiDownload, FiSave, FiSend, FiCheckCircle, FiBookmark, FiDollarSign } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import IconSelect from "../../../components/IconSelect";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

const statusStyle: Record<string, string> = {
  PAID: "text-emerald-500 bg-emerald-500/10",
  SENT: "text-red-500 bg-red-500/10",
  OVERDUE: "text-orange-400 bg-orange-500/10",
  CANCELLED: "text-white/30 bg-white/5",
  DRAFT: "text-white/40 bg-white/5",
};

const formatDocDate = (value?: string): string => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

const formatMoney = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", maximumFractionDigits: 0 }).format(value || 0);
  } catch {
    return `${currency || "USD"} ${(value || 0).toLocaleString()}`;
  }
};

type DocKind = "proposal" | "invoice";
type ClauseDraft = { id: string; title: string; body: string };

const makeClauseId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const createClauseDraft = (title: string, body: string): ClauseDraft => ({
  id: makeClauseId(),
  title,
  body,
});

const ClauseRichEditor: FC<{
  value: string;
  onChange: (html: string) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Prevent caret jump/focus loss while user is actively typing.
    if (document.activeElement === el) return;
    if (el.innerHTML !== value) el.innerHTML = value || "<p></p>";
  }, [value]);

  return (
    <div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || "")}
        className="min-h-[120px] bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white/80 outline-none focus:border-red-500/30"
      />
    </div>
  );
};

const DocumentDetailsPage: FC = () => {
  const { kind, id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const docKind = (kind as DocKind) || "proposal";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState(false);
  const [sending, setSending] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [doc, setDoc] = useState<Proposal | Invoice | null>(null);

  // editable fields
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [senderCompanyName, setSenderCompanyName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderTaxId, setSenderTaxId] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [clauses, setClauses] = useState<ClauseDraft[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<Array<PricingItem & { _id?: string }>>([]);

  const instructionRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0), [items]);
  const taxAmount = useMemo(() => (subtotal * (Number(taxRate) || 0)) / 100, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount - (Number(discount) || 0), [subtotal, taxAmount, discount]);

  const clausesForPreview = useMemo(() => (docKind === "proposal" ? clauses : []), [clauses, docKind]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      if (docKind === "invoice") {
        const res = await ninjaSalesService.getInvoiceById(id);
        if (res.success) {
          setDoc(res.data);
          setClientName(res.data.clientName || "");
          setClientEmail(res.data.clientEmail || "");
          setProjectTitle(res.data.projectTitle || "");
          setCurrency(res.data.currency || "USD");
          setPaymentTerms(res.data.paymentTerms || "");
          setIssuedDate(res.data.issuedDate ? new Date(res.data.issuedDate).toISOString().slice(0, 10) : "");
          setDueDate(res.data.dueDate ? new Date(res.data.dueDate).toISOString().slice(0, 10) : "");
          setNotes(res.data.notes || "");
          setCompanyLogoUrl(res.data.companyLogoUrl || "");
          setSignatureUrl(res.data.signatureUrl || "");
          setSenderCompanyName(res.data.senderCompanyName || "");
          setSenderAddress(res.data.senderAddress || "");
          setSenderTaxId(res.data.senderTaxId || "");
          setSenderEmail(res.data.senderEmail || "");
          setTaxRate(res.data.taxRate || 0);
          setDiscount(res.data.discount || 0);
          setItems(res.data.items || []);
        }
      } else {
        const res = await ninjaSalesService.getProposalById(id);
        if (res.success) {
          setDoc(res.data);
          setClientName(res.data.clientName || "");
          setClientEmail(res.data.clientEmail || "");
          setProjectTitle(res.data.projectTitle || "");
          setCurrency(res.data.currency || "USD");
          setPaymentTerms(res.data.paymentTerms || "");
          setIssuedDate(res.data.issuedDate ? new Date(res.data.issuedDate).toISOString().slice(0, 10) : "");
          setDueDate(res.data.dueDate ? new Date(res.data.dueDate).toISOString().slice(0, 10) : "");
          setNotes(res.data.notes || "");
          setCompanyLogoUrl(res.data.companyLogoUrl || "");
          setSignatureUrl(res.data.signatureUrl || "");
          setSenderCompanyName(res.data.senderCompanyName || "");
          setSenderAddress(res.data.senderAddress || "");
          setSenderTaxId(res.data.senderTaxId || "");
          setSenderEmail(res.data.senderEmail || "");
          const c = Array.isArray(res.data.clauses) ? res.data.clauses : [];
          setClauses(
            c
              .filter((x: any) => x && typeof x.title === "string" && typeof x.body === "string")
              .map((x: any) => createClauseDraft(x.title, x.body))
          );
          setTaxRate(res.data.taxRate || 0);
          setDiscount(res.data.discount || 0);
          setItems(res.data.items || []);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, docKind]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const downloadPdf = async () => {
    if (!id) return;
    const res = docKind === "invoice" ? await ninjaSalesService.downloadInvoicePdf(id) : await ninjaSalesService.downloadProposalPdf(id);
    if (!res.success || !res.blob) {
      toast.error(res.message || "Failed to generate PDF");
      return;
    }
    const url = URL.createObjectURL(res.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.filename || `${docKind}_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (docKind === "invoice") {
        const res = await ninjaSalesService.updateInvoice(id, {
          clientName,
          clientEmail,
          projectTitle,
          currency,
          paymentTerms,
          issuedDate: issuedDate ? new Date(issuedDate).toISOString() : undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          notes,
          companyLogoUrl,
          signatureUrl,
          senderCompanyName,
          senderAddress,
          senderTaxId,
          senderEmail,
          taxRate,
          discount,
          items,
        } as any);
        if (res.success) toast.success("Invoice saved");
        else toast.error(res.message || "Failed to save invoice");
      } else {
        const res = await ninjaSalesService.updateProposal(id, {
          clientName,
          clientEmail,
          projectTitle,
          currency,
          paymentTerms,
          issuedDate: issuedDate ? new Date(issuedDate).toISOString() : undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          notes,
          companyLogoUrl,
          signatureUrl,
          senderCompanyName,
          senderAddress,
          senderTaxId,
          senderEmail,
          clauses: clauses.map((c) => ({ title: c.title, body: c.body })),
          taxRate,
          discount,
          items,
        } as any);
        if (res.success) toast.success("Proposal saved");
        else toast.error(res.message || "Failed to save proposal");
      }
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!id) return;
    let email = clientEmail.trim();
    if (!email) {
      const entered = window.prompt("This client has no email on file. Enter an email address to send to:");
      if (!entered) return;
      email = entered.trim();
      setClientEmail(email);
    }
    setSending(true);
    try {
      const res = docKind === "invoice"
        ? await ninjaSalesService.sendInvoice(id, email)
        : await ninjaSalesService.sendProposal(id, email);
      if (res.success) {
        toast.success(res.message || "Sent");
        await load();
      } else if (res.code === "NO_SMTP_CONFIG") {
        toast.error(
          (t) => (
            <span>
              {res.message}{" "}
              <button
                onClick={() => { toast.dismiss(t.id); navigate("/settings"); }}
                className="underline font-bold"
              >
                Open Settings
              </button>
            </span>
          ),
          { duration: 8000 }
        );
      } else {
        toast.error(res.message || "Failed to send");
      }
    } finally {
      setSending(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!id || docKind !== "invoice") return;
    setMarkingPaid(true);
    try {
      const res = await ninjaSalesService.markInvoicePaid(id);
      if (res.success) {
        toast.success("Marked as paid");
        await load();
      } else {
        toast.error(res.message || "Failed to mark as paid");
      }
    } finally {
      setMarkingPaid(false);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!id) return;
    const name = window.prompt("Name this template:", projectTitle || "");
    if (!name || !name.trim()) return;
    setSavingTemplate(true);
    try {
      const res = await ninjaSalesService.createTemplateFromDocument({
        name: name.trim(),
        docType: docKind === "invoice" ? "INVOICE" : "PROPOSAL",
        documentId: id,
      });
      if (res.success) toast.success("Saved as template");
      else toast.error(res.message || "Failed to save template");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleRefine = async () => {
    if (!id) return;
    const instruction = instructionRef.current?.value || undefined;
    setRefining(true);
    try {
      if (docKind === "invoice") {
        const res = await ninjaSalesService.aiRefineInvoice(id, instruction);
        if (res.success) {
          setNotes(res.data.notes || "");
          setPaymentTerms(res.data.paymentTerms || "");
        }
      } else {
        const res = await ninjaSalesService.aiRefineProposal(id, instruction);
        if (res.success) {
          setNotes(res.data.notes || "");
          setPaymentTerms(res.data.paymentTerms || "");
          const c = Array.isArray(res.data.clauses) ? res.data.clauses : [];
          if (c.length) setClauses(c.map((x: any) => createClauseDraft(x.title, x.body)));
        }
      }
      await load();
    } finally {
      setRefining(false);
    }
  };

  const handleRefineClauses = async () => {
    if (!id) return;
    const instruction = instructionRef.current?.value || "Refine clauses to be realistic, clear, and client-friendly without changing facts.";
    setRefining(true);
    try {
      const res = await ninjaSalesService.aiRefineProposalClauses(id, instruction);
      if (res.success) {
        const c = Array.isArray(res.data.clauses) ? res.data.clauses : [];
        if (c.length) setClauses(c.map((x: any) => createClauseDraft(x.title, x.body)));
      }
      await load();
    } finally {
      setRefining(false);
    }
  };

  const handleAssetUpload = async (type: "companyLogo" | "signature", file?: File | null) => {
    if (!id || !file) return;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      const response =
        docKind === "invoice"
          ? await ninjaSalesService.uploadInvoiceAssets(id, {
              companyLogo: type === "companyLogo" ? file : undefined,
              signature: type === "signature" ? file : undefined,
            })
          : await ninjaSalesService.uploadProposalAssets(id, {
              companyLogo: type === "companyLogo" ? file : undefined,
              signature: type === "signature" ? file : undefined,
            });

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to upload image");
        return;
      }

      setCompanyLogoUrl(response.data.companyLogoUrl || "");
      setSignatureUrl(response.data.signatureUrl || "");
      toast.success(type === "companyLogo" ? "Company logo uploaded" : "Signature uploaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: "New Item", qty: 1, rate: 0 }]);
  };
  const handleRemoveItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const handleUpdateItem = (idx: number, field: keyof PricingItem, value: any) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const addClause = () =>
    setClauses((prev) => [
      ...prev,
      createClauseDraft(`Clause ${prev.length + 1}`, "<p></p>"),
    ]);
  const removeClause = (idx: number) => setClauses((prev) => prev.filter((_, i) => i !== idx));
  const updateClauseTitle = (idx: number, title: string) =>
    setClauses((prev) => prev.map((c, i) => (i === idx ? { ...c, title } : c)));
  const updateClauseBody = (idx: number, body: string) =>
    setClauses((prev) => prev.map((c, i) => (i === idx ? { ...c, body } : c)));

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/projects"
      title={`${docKind === "invoice" ? "Invoice" : "Proposal"} Details - Ninja Sales`}
      onLogout={handleLogout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen text-white">
        <div className="p-4 lg:p-8 space-y-8 max-w-auto mx-auto pb-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-red-500 transition-colors group"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {loading || !doc ? (
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-10 text-white/40">
              Loading document...
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left: Editor */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{docKind.toUpperCase()}</p>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${statusStyle[doc.status] || "text-white/40 bg-white/5"}`}>{doc.status}</span>
                      </div>
                      <p className="text-sm font-black text-white/90 tracking-tight">{doc.reference}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={handleSaveAsTemplate} disabled={savingTemplate} className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2 disabled:opacity-50">
                        <FiBookmark className="w-4 h-4" />
                        {savingTemplate ? "Saving..." : "Save as Template"}
                      </button>
                      <button onClick={downloadPdf} className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2">
                        <FiDownload className="w-4 h-4" />
                        PDF
                      </button>
                      {docKind === "invoice" && doc.status !== "PAID" && doc.status !== "CANCELLED" && (
                        <button onClick={handleMarkPaid} disabled={markingPaid} className="h-10 px-4 bg-emerald-600/10 border border-emerald-600/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600/20 flex items-center gap-2 disabled:opacity-50">
                          <FiCheckCircle className="w-4 h-4" />
                          {markingPaid ? "Marking..." : "Mark Paid"}
                        </button>
                      )}
                      <button onClick={handleSend} disabled={sending} className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2 disabled:opacity-50">
                        <FiSend className="w-4 h-4" />
                        {sending ? "Sending..." : "Email to Client"}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-10 px-4 bg-red-600 hover:bg-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                      >
                        <FiSave className="w-4 h-4" />
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Client</label>
                      <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Client Email</label>
                      <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@company.com" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Title</label>
                      <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Currency</label>
                      <IconSelect
                        value={currency}
                        onChange={setCurrency}
                        className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30"
                        options={CURRENCIES.map((c) => ({ value: c, label: c, icon: <FiDollarSign className="w-4 h-4" /> }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Payment Terms</label>
                    <input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Issued Date</label>
                      <input
                        type="date"
                        value={issuedDate}
                        onChange={(e) => setIssuedDate(e.target.value)}
                        className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{docKind === "invoice" ? "Due Date" : "Expiry Date"}</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {docKind === "invoice" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Tax Rate (%)</label>
                        <input type="number" value={taxRate} onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Discount ($)</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(parseInt(e.target.value) || 0)} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-4">
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    From (Your Company)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Company Name</label>
                      <input value={senderCompanyName} onChange={(e) => setSenderCompanyName(e.target.value)} placeholder="Your company name" className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Reply-To Email</label>
                      <input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="you@company.com" className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Address</label>
                      <input value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} placeholder="Street, City, Country" className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Tax ID (Optional)</label>
                      <input value={senderTaxId} onChange={(e) => setSenderTaxId(e.target.value)} placeholder="VAT / EIN / Tax ID" className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-4">
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Branding (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Company Logo
                      </label>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload("companyLogo", e.target.files?.[0])}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                        >
                          Upload Logo
                        </button>
                        {companyLogoUrl ? (
                          <img src={companyLogoUrl} alt="Company Logo" className="h-10 w-auto rounded bg-white p-1" />
                        ) : (
                          <span className="text-xs text-white/40">Not uploaded</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Signature
                      </label>
                      <input
                        ref={signatureInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload("signature", e.target.files?.[0])}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => signatureInputRef.current?.click()}
                          className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                        >
                          Upload Signature
                        </button>
                        {signatureUrl ? (
                          <img src={signatureUrl} alt="Signature" className="h-10 w-auto rounded bg-white p-1" />
                        ) : (
                          <span className="text-xs text-white/40">Not uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Line Items</h3>
                    <button onClick={handleAddItem} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400">
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {items.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-3">
                        <input className="col-span-12 md:col-span-6 h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-xs font-black text-white outline-none focus:border-red-500/30" value={it.description} onChange={(e) => handleUpdateItem(idx, "description", e.target.value)} />
                        <input className="col-span-4 md:col-span-2 h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-3 text-xs font-black text-white outline-none focus:border-red-500/30" type="number" value={it.qty} onChange={(e) => handleUpdateItem(idx, "qty", parseInt(e.target.value) || 0)} />
                        <input className="col-span-6 md:col-span-3 h-11 bg-white/[0.03] border border-white/5 rounded-2xl px-3 text-xs font-black text-white outline-none focus:border-red-500/30" type="number" value={it.rate} onChange={(e) => handleUpdateItem(idx, "rate", parseInt(e.target.value) || 0)} />
                        <button className="col-span-2 md:col-span-1 text-white/30 hover:text-red-500" onClick={() => handleRemoveItem(idx)}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total</span>
                    <span className="text-lg font-black text-red-500">{formatMoney(total, currency)}</span>
                  </div>
                </div>

                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Notes</h3>
                    <div className="flex items-center gap-2">
                      <input
                        ref={instructionRef}
                        placeholder="Refine instruction (optional)"
                        className="hidden md:block h-10 w-64 bg-white/[0.03] border border-white/5 rounded-xl px-3 text-xs text-white/80 outline-none focus:border-red-500/30"
                      />
                      <button
                        onClick={handleRefine}
                        disabled={refining}
                        className="h-10 px-4 bg-red-600/10 border border-red-600/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <HiSparkles className="w-4 h-4" />
                        {refining ? "Refining..." : "AI Refine"}
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white/80 outline-none focus:border-red-500/30 resize-none"
                  />
                </div>

                {docKind === "proposal" && (
                  <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Clauses</h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleRefineClauses}
                          disabled={refining}
                          className="h-9 px-3 bg-red-600/10 border border-red-600/30 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all disabled:opacity-50"
                        >
                          <span className="inline-flex items-center gap-2">
                            <HiSparkles className="w-4 h-4" />
                            Refine Clauses
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={addClause}
                          className="h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {clauses.length === 0 ? (
                        <div className="text-white/30 text-sm">No clauses yet. Click “+ Add” or use “Refine Clauses”.</div>
                      ) : (
                        clauses.map((c, idx) => (
                          <div key={c.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                            <div className="flex items-center gap-3">
                              <input
                                value={c.title}
                                onChange={(e) => updateClauseTitle(idx, e.target.value)}
                                className="flex-1 h-10 bg-white/[0.03] border border-white/5 rounded-xl px-3 text-xs font-black text-white outline-none focus:border-red-500/30"
                              />
                              <button
                                type="button"
                                onClick={() => removeClause(idx)}
                                className="h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-red-400 hover:border-red-500/30"
                              >
                                Remove
                              </button>
                            </div>
                            <ClauseRichEditor value={c.body} onChange={(html) => updateClauseBody(idx, html)} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Preview (simple) */}
              <div className="xl:col-span-7">
                <div className="bg-white rounded-2xl p-10 text-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h1 className="text-3xl font-black tracking-tighter uppercase">NINJA SALES</h1>
                      <p className="text-xs text-black/50 font-bold uppercase">Document Preview</p>
                    </div>
                    <div className="text-right">
                      {companyLogoUrl && (
                        <div className="mb-2 flex justify-end">
                          <img src={companyLogoUrl} alt="Company Logo" className="h-12 w-auto object-contain" />
                        </div>
                      )}
                      <p className="text-4xl font-black uppercase">{docKind}</p>
                      <p className="text-xs font-black text-black/40">{doc.reference}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                      {(senderCompanyName || senderAddress) && (
                        <div>
                          <p className="text-xs font-black text-black/40 uppercase">From</p>
                          {senderCompanyName && <p className="text-sm font-black">{senderCompanyName}</p>}
                          {senderAddress && <p className="text-xs text-black/60">{senderAddress}</p>}
                          {senderTaxId && <p className="text-xs text-black/40">Tax ID: {senderTaxId}</p>}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-black text-black/40 uppercase">Prepared For</p>
                        <p className="text-lg font-black">{clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-black/40 uppercase">Issued</p>
                      <p className="text-sm font-bold">{formatDocDate(issuedDate) || formatDocDate(doc.issuedDate) || "—"}</p>
                      <p className="text-xs font-black text-black/40 uppercase mt-2">{docKind === "invoice" ? "Due" : "Expiry"}</p>
                      <p className="text-sm font-bold">{formatDocDate(dueDate) || formatDocDate(doc.dueDate) || "—"}</p>
                    </div>
                  </div>

                  <p className="text-sm font-black uppercase mb-2">{projectTitle}</p>
                  <p className="text-sm text-black/70 whitespace-pre-wrap">{notes}</p>

                  {docKind === "proposal" && clausesForPreview.length > 0 && (
                    <div className="mt-8">
                      <p className="text-sm font-black uppercase mb-3">Clauses</p>
                      <div className="space-y-4">
                        {clausesForPreview.slice(0, 10).map((c, idx) => (
                          <div key={idx} className="border-t pt-3">
                            <p className="text-[12px] font-black text-black">{c.title}</p>
                            <div className="text-sm text-black/70 mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: c.body }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 border-t pt-6">
                    <table className="w-full text-sm">
                      <thead className="text-black/50 uppercase text-[11px]">
                        <tr>
                          <th className="text-left py-2">Item</th>
                          <th className="text-center py-2">Qty</th>
                          <th className="text-right py-2">Rate</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-3 font-bold">{it.description}</td>
                            <td className="py-3 text-center">{it.qty}</td>
                            <td className="py-3 text-right">{formatMoney(Number(it.rate || 0), currency)}</td>
                            <td className="py-3 text-right font-black">{formatMoney(Number(it.qty || 0) * Number(it.rate || 0), currency)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                      <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between text-black/60 font-bold">
                          <span>Subtotal</span>
                          <span>{formatMoney(subtotal, currency)}</span>
                        </div>
                        {docKind === "invoice" && taxRate > 0 && (
                          <div className="flex justify-between text-black/60 font-bold">
                            <span>Tax ({taxRate}%)</span>
                            <span>{formatMoney(taxAmount, currency)}</span>
                          </div>
                        )}
                        {docKind === "invoice" && discount > 0 && (
                          <div className="flex justify-between text-black/60 font-bold">
                            <span>Discount</span>
                            <span>-{formatMoney(discount, currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-black font-black text-lg border-t pt-2">
                          <span>Total</span>
                          <span className="text-red-600">{formatMoney(total, currency)}</span>
                        </div>
                        <div className="text-[11px] text-black/50 font-bold uppercase pt-2">
                          Terms: <span className="text-black">{paymentTerms}</span>
                        </div>
                        {signatureUrl && (
                          <div className="pt-3">
                            <p className="text-[10px] text-black/40 font-bold uppercase mb-1">Authorized Signature</p>
                            <img src={signatureUrl} alt="Signature" className="h-16 w-auto object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(docKind === "proposal" || docKind === "invoice") && (
                    <div className="mt-10 pt-4 border-t border-black/10 flex items-center gap-2 text-[11px] text-black/50 font-bold">
                      <img src="/favicon.svg" alt="Startup Ninja" className="w-4 h-4" />
                      <span>Made with Startup Ninja</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default DocumentDetailsPage;

