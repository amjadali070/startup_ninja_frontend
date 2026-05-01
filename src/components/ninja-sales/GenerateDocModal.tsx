import { type FC, useEffect, useMemo, useState } from "react";
import { FiX, FiFileText, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";
import type { Project } from "../../services/ninjaSales";

type DocType = "PROPOSAL" | "INVOICE";

interface GenerateDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  defaultType: DocType;
  onConfirm: (payload: {
    docType: DocType;
    clientName?: string;
    paymentTerms?: string;
    dueDate?: string;
    notes?: string;
    taxRate?: number;
    discount?: number;
  }) => void;
  isSubmitting?: boolean;
}

const GenerateDocModal: FC<GenerateDocModalProps> = ({
  isOpen,
  onClose,
  project,
  defaultType,
  onConfirm,
  isSubmitting,
}) => {
  const [docType, setDocType] = useState<DocType>(defaultType);
  const [clientName, setClientName] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(defaultType === "INVOICE" ? "Net 30 Days" : "50% Upfront, 50% Completion");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");

  const lead = project.leadId && typeof project.leadId === "object" ? project.leadId : null;

  const suggestedClient = useMemo(() => {
    return lead?.company || lead?.name || "";
  }, [lead?.company, lead?.name]);

  const suggestedNotes = useMemo(() => {
    const lines: string[] = [];
    if (project.description) lines.push(project.description);
    if (project.nextStep) lines.push(`Next step: ${project.nextStep}`);
    if (project.competitor) lines.push(`Competitor: ${project.competitor}`);
    if (project.urgency) lines.push(`Urgency: ${project.urgency}`);
    if (typeof project.budgetConfirmed === "boolean") lines.push(`Budget confirmed: ${project.budgetConfirmed ? "Yes" : "No"}`);
    if (project.forecastedCloseDate) lines.push(`Deadline: ${new Date(project.forecastedCloseDate).toLocaleDateString("en-US")}`);
    return lines.filter(Boolean).join("\n");
  }, [
    project.description,
    project.nextStep,
    project.competitor,
    project.urgency,
    project.budgetConfirmed,
    project.forecastedCloseDate,
  ]);

  const suggestedDueDate = useMemo(() => {
    if (!project.forecastedCloseDate) return "";
    const d = new Date(project.forecastedCloseDate);
    // yyyy-mm-dd
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [project.forecastedCloseDate]);

  // Autofill when opening modal (project/lead data)
  useEffect(() => {
    if (!isOpen) return;
    setDocType(defaultType);
    setClientName(suggestedClient);
    setNotes(suggestedNotes);
    setTaxRate(0);
    setDiscount(0);
    setPaymentTerms(defaultType === "INVOICE" ? "Net 30 Days" : "50% Upfront, 50% Completion");
    setDueDate(suggestedDueDate);
  }, [isOpen, defaultType, suggestedClient, suggestedNotes]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      docType,
      clientName: clientName || suggestedClient || undefined,
      paymentTerms,
      dueDate: dueDate || suggestedDueDate || undefined,
      notes: notes || undefined,
      taxRate: docType === "INVOICE" ? taxRate : 0,
      discount: docType === "INVOICE" ? discount : 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiFileText className="text-[#E11D48] w-5 h-5" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Generate {docType === "PROPOSAL" ? "Proposal" : "Invoice"}</h2>
            </div>
            <p className="text-gray-400 text-sm">Confirm project details before generation</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="border-t border-[#1C1C1F] mx-6" />

        <div className="p-6 space-y-6">
          <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-5 space-y-3">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Project Snapshot</p>
            <p className="text-white font-bold">{project.name}</p>
            {project.description && <p className="text-white/50 text-sm leading-relaxed">{project.description}</p>}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <FiDollarSign className="text-white/20" />
                <span>{project.currency || "USD"} {(project.value || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <FiClock className="text-white/20" />
                <span>{project.forecastedCloseDate ? new Date(project.forecastedCloseDate).toLocaleDateString() : "No deadline"}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-5 space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDocType("PROPOSAL")}
                className={`flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  docType === "PROPOSAL" ? "bg-white/10 border border-white/10 text-white" : "text-white/30 hover:text-white bg-white/[0.02]"
                }`}
              >
                Proposal
              </button>
              <button
                type="button"
                onClick={() => setDocType("INVOICE")}
                className={`flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  docType === "INVOICE" ? "bg-white/10 border border-white/10 text-white" : "text-white/30 hover:text-white bg-white/[0.02]"
                }`}
              >
                Invoice
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Client / Company</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={suggestedClient || "Client name"}
                className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Payment Terms</label>
                <input
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">{docType === "INVOICE" ? "Due Date" : "Expiry Date"}</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white [color-scheme:dark] focus:outline-none focus:border-[#E11D48]/50 transition-all"
                />
              </div>
            </div>

            {docType === "INVOICE" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Discount ($)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Notes (optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none"
                placeholder="Add any extra context for the generator..."
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!!isSubmitting}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FiCheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? "Generating..." : "Generate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocModal;

