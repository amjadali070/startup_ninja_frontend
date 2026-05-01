import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { ninjaSalesService } from "../../../services/ninjaSales";
import type { Proposal, Invoice, PricingItem } from "../../../services/ninjaSales";
import { FiArrowLeft, FiDownload, FiSave, FiSend } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";

type DocKind = "proposal" | "invoice";

const DocumentDetailsPage: FC = () => {
  const { kind, id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const docKind = (kind as DocKind) || "proposal";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState(false);
  const [doc, setDoc] = useState<Proposal | Invoice | null>(null);

  // editable fields
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [clauses, setClauses] = useState<Array<{ title: string; body: string }>>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<Array<PricingItem & { _id?: string }>>([]);

  const instructionRef = useRef<HTMLInputElement>(null);

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
          setProjectTitle(res.data.projectTitle || "");
          setPaymentTerms(res.data.paymentTerms || "");
          setIssuedDate(res.data.issuedDate ? new Date(res.data.issuedDate).toISOString().slice(0, 10) : "");
          setDueDate(res.data.dueDate ? new Date(res.data.dueDate).toISOString().slice(0, 10) : "");
          setNotes(res.data.notes || "");
          setTaxRate(res.data.taxRate || 0);
          setDiscount(res.data.discount || 0);
          setItems(res.data.items || []);
        }
      } else {
        const res = await ninjaSalesService.getProposalById(id);
        if (res.success) {
          setDoc(res.data);
          setClientName(res.data.clientName || "");
          setProjectTitle(res.data.projectTitle || "");
          setPaymentTerms(res.data.paymentTerms || "");
          setIssuedDate(res.data.issuedDate ? new Date(res.data.issuedDate).toISOString().slice(0, 10) : "");
          setDueDate(res.data.dueDate ? new Date(res.data.dueDate).toISOString().slice(0, 10) : "");
          setNotes(res.data.notes || "");
          const c = Array.isArray(res.data.clauses) ? res.data.clauses : [];
          setClauses(
            c
              .filter((x: any) => x && typeof x.title === "string" && typeof x.body === "string")
              .map((x: any) => ({ title: x.title, body: x.body }))
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
    if (!res.success || !res.blob) return;
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
          projectTitle,
          paymentTerms,
          issuedDate: issuedDate ? new Date(issuedDate).toISOString() : undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          notes,
          taxRate,
          discount,
          items,
        } as any);
        if (res.success) toast.success("Invoice saved");
        else toast.error(res.message || "Failed to save invoice");
      } else {
        const res = await ninjaSalesService.updateProposal(id, {
          clientName,
          projectTitle,
          paymentTerms,
          issuedDate: issuedDate ? new Date(issuedDate).toISOString() : undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          notes,
          clauses,
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
    if (docKind === "invoice") await ninjaSalesService.sendInvoice(id);
    else await ninjaSalesService.sendProposal(id);
    await load();
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
          if (c.length) setClauses(c.map((x: any) => ({ title: x.title, body: x.body })));
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
        if (c.length) setClauses(c.map((x: any) => ({ title: x.title, body: x.body })));
      }
      await load();
    } finally {
      setRefining(false);
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: "New Item", qty: 1, rate: 0 }]);
  };
  const handleRemoveItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const handleUpdateItem = (idx: number, field: keyof PricingItem, value: any) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const addClause = () => setClauses((prev) => [...prev, { title: `Clause ${prev.length + 1}`, body: "<p></p>" }]);
  const removeClause = (idx: number) => setClauses((prev) => prev.filter((_, i) => i !== idx));
  const updateClauseTitle = (idx: number, title: string) =>
    setClauses((prev) => prev.map((c, i) => (i === idx ? { ...c, title } : c)));
  const updateClauseBody = (idx: number, body: string) =>
    setClauses((prev) => prev.map((c, i) => (i === idx ? { ...c, body } : c)));

  const ClauseRichEditor: FC<{
    value: string;
    onChange: (html: string) => void;
  }> = ({ value, onChange }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      if (el.innerHTML !== value) el.innerHTML = value || "<p></p>";
    }, [value]);

    const exec = (cmd: string, arg?: string) => {
      if (!ref.current) return;
      ref.current.focus();
      document.execCommand(cmd, false, arg);
      onChange(ref.current.innerHTML);
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => exec("bold")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            B
          </button>
          <button type="button" onClick={() => exec("italic")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            I
          </button>
          <button type="button" onClick={() => exec("underline")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            U
          </button>
          <button type="button" onClick={() => exec("insertUnorderedList")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            • List
          </button>
          <button type="button" onClick={() => exec("insertOrderedList")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            1. List
          </button>
          <button type="button" onClick={() => exec("formatBlock", "p")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            P
          </button>
          <button type="button" onClick={() => exec("formatBlock", "h4")} className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
            H
          </button>
        </div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{docKind.toUpperCase()}</p>
                      <p className="text-sm font-black text-white/90 tracking-tight">{doc.reference}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={downloadPdf} className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2">
                        <FiDownload className="w-4 h-4" />
                        PDF
                      </button>
                      <button onClick={handleSend} className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2">
                        <FiSend className="w-4 h-4" />
                        Send
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
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Title</label>
                      <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30" />
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
                    <span className="text-lg font-black text-red-500">${Math.round(total).toLocaleString()}</span>
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
                          <div key={idx} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
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
                      <p className="text-4xl font-black uppercase">{docKind}</p>
                      <p className="text-xs font-black text-black/40">{doc.reference}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <p className="text-xs font-black text-black/40 uppercase">Prepared For</p>
                      <p className="text-lg font-black">{clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-black/40 uppercase">Issued</p>
                      <p className="text-sm font-bold">{issuedDate ? new Date(issuedDate).toLocaleDateString() : (doc.issuedDate ? new Date(doc.issuedDate).toLocaleDateString() : "—")}</p>
                      <p className="text-xs font-black text-black/40 uppercase mt-2">{docKind === "invoice" ? "Due" : "Expiry"}</p>
                      <p className="text-sm font-bold">{dueDate ? new Date(dueDate).toLocaleDateString() : (doc.dueDate ? new Date(doc.dueDate).toLocaleDateString() : "—")}</p>
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
                            <td className="py-3 text-right">${Number(it.rate || 0).toLocaleString()}</td>
                            <td className="py-3 text-right font-black">${(Number(it.qty || 0) * Number(it.rate || 0)).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                      <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between text-black/60 font-bold">
                          <span>Subtotal</span>
                          <span>${subtotal.toLocaleString()}</span>
                        </div>
                        {docKind === "invoice" && taxRate > 0 && (
                          <div className="flex justify-between text-black/60 font-bold">
                            <span>Tax ({taxRate}%)</span>
                            <span>${taxAmount.toLocaleString()}</span>
                          </div>
                        )}
                        {docKind === "invoice" && discount > 0 && (
                          <div className="flex justify-between text-black/60 font-bold">
                            <span>Discount</span>
                            <span>-${discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-black font-black text-lg border-t pt-2">
                          <span>Total</span>
                          <span className="text-red-600">${Math.round(total).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-black/50 font-bold uppercase pt-2">
                          Terms: <span className="text-black">{paymentTerms}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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

