import { type FC, useState, useMemo, useRef } from "react";
import { FiChevronDown, FiPlus, FiDownload, FiSearch, FiZap, FiTrash2, FiPercent } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PricingItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

const ProposalEditor: FC = () => {
  const [docType, setDocType] = useState<"PROPOSAL" | "INVOICE">("PROPOSAL");
  const [clientName, setClientName] = useState("Starlight Ventures");
  const [projectTitle, setProjectTitle] = useState("Q4 Strategic Brand Overhaul");
  const [paymentTerms, setPaymentTerms] = useState("50% Upfront, 50% Completion");
  const [notes, setNotes] = useState("Includes 3 rounds of revisions for the visual identity system. Final delivery scheduled for Dec 15th.");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  
  const [items, setItems] = useState<PricingItem[]>([
    { id: "1", description: "Brand Strategy Workshop", qty: 1, rate: 4500 },
    { id: "2", description: "Visual Identity System", qty: 1, rate: 8000 },
  ]);

  const previewRef = useRef<HTMLDivElement>(null);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (item.qty * item.rate), 0), [items]);
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const total = useMemo(() => (subtotal + taxAmount) - discount, [subtotal, taxAmount, discount]);

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), description: "New Service Item", qty: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PricingItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRefine = () => {
    setTimeout(() => {
      setNotes((prev) => prev + " AI Note: Optimized for high-value conversion.");
    }, 500);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${docType}_${clientName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
      
      {/* Left Panel: Controls */}
      <div className="xl:col-span-4 space-y-6">
        {/* Toggle Proposal/Invoice */}
        <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-1.5 flex gap-2 shadow-2xl">
          <button 
            onClick={() => setDocType("PROPOSAL")}
            className={`flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${docType === "PROPOSAL" ? "bg-white/10 border border-white/10 text-white shadow-xl shadow-red-600/5 scale-[1.02]" : "text-white/30 hover:text-white"}`}
          >
            Proposal
          </button>
          <button 
            onClick={() => setDocType("INVOICE")}
            className={`flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${docType === "INVOICE" ? "bg-white/10 border border-white/10 text-white shadow-xl shadow-red-600/5 scale-[1.02]" : "text-white/30 hover:text-white"}`}
          >
            Invoice
          </button>
        </div>

        {/* Client & Dynamic Title Form */}
        <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Customer / Client</label>
            <div className="relative group">
              <select 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl px-6 text-sm font-black text-white appearance-none transition-all outline-none cursor-pointer"
              >
                <option value="Starlight Ventures" className="bg-[#121212]">Starlight Ventures</option>
                <option value="Nebula Labs" className="bg-[#121212]">Nebula Labs</option>
                <option value="Vortex Tech" className="bg-[#121212]">Vortex Tech</option>
                <option value="Solaris Labs" className="bg-[#121212]">Solaris Labs</option>
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">
              {docType === "PROPOSAL" ? "Project Title" : "Invoice Reference"}
            </label>
            <input 
              type="text" 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full h-14 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl px-6 text-sm font-black text-white transition-all outline-none"
              placeholder={docType === "PROPOSAL" ? "Enter project name..." : "Enter unique reference #"}
            />
          </div>
        </div>

        {/* Dynamic Pricing Blocks */}
        <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              {docType === "PROPOSAL" ? "Pricing Blocks" : "Billable Items"}
            </h3>
            <button 
              onClick={handleAddItem}
              className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-all active:scale-95"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 group">
                <div className="col-span-12 md:col-span-6">
                  <input 
                    type="text" 
                    value={item.description} 
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-xs font-black text-white outline-none focus:border-red-500/30" 
                    placeholder="Description"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input 
                    type="number" 
                    value={item.qty} 
                    onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                    className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-2 text-center text-xs font-black text-white outline-none focus:border-red-500/30" 
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-6 md:col-span-3">
                  <input 
                    type="number" 
                    value={item.rate} 
                    onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                    className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-2 text-center text-xs font-black text-white outline-none focus:border-red-500/30" 
                    placeholder="Rate"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-white/10 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tax & Discount for Invoices */}
          {docType === "INVOICE" && (
            <div className="space-y-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-1">Tax Rate (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                      className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-8 text-xs font-black text-white" 
                    />
                    <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-3 h-3" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-1">Discount ($)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={discount}
                      onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                      className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-xs font-black text-white text-right" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Subtotal</span>
              <span className="text-sm font-black text-white tracking-tight">{formatCurrency(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between items-center opacity-40">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Tax ({taxRate}%)</span>
                <span className="text-sm font-black text-white tracking-tight">{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Grand Total</span>
              <span className="text-xl font-black text-red-500 tracking-tight">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Payment & Notes */}
        <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">
              {docType === "PROPOSAL" ? "Payment Terms" : "Payment Due"}
            </label>
            <div className="relative">
              <select 
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl px-6 text-sm font-black text-white appearance-none transition-all outline-none"
              >
                {docType === "PROPOSAL" ? (
                  <>
                    <option value="50% Upfront, 50% Completion" className="bg-[#121212]">50% Upfront, 50% Completion</option>
                    <option value="Custom Installments" className="bg-[#121212]">Custom Installments</option>
                  </>
                ) : (
                  <>
                    <option value="Net 30 Days" className="bg-[#121212]">Net 30 Days</option>
                    <option value="Due on Receipt" className="bg-[#121212]">Due on Receipt</option>
                    <option value="Net 15 Days" className="bg-[#121212]">Net 15 Days</option>
                  </>
                )}
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">
              {docType === "PROPOSAL" ? "Additional Notes" : "Message to Customer"}
            </label>
            <textarea 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl p-6 text-sm font-medium text-white/70 transition-all outline-none resize-none"
              placeholder={docType === "PROPOSAL" ? "Enter project details..." : "Thank you for the business..."}
            />
          </div>
        </div>

        {/* AI Action Button */}
        <button 
          onClick={handleRefine}
          className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-3xl flex items-center justify-center gap-3 font-black transition-all shadow-xl shadow-red-600/20 active:scale-95 group"
        >
          <HiSparkles className="w-6 h-6 animate-pulse" />
          <span className="uppercase tracking-[0.2em] text-sm">
            {docType === "PROPOSAL" ? "AI Refine with Ninja AI" : "AI Audit Invoice Data"}
          </span>
        </button>
      </div>

      {/* Right Panel: Preview Area */}
      <div className="xl:col-span-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-[700px] aspect-[1/1.4] bg-white rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden text-black animate-in fade-in zoom-in duration-700">
          
          {/* Preview Controls overlay */}
          <div className="absolute top-6 right-6 flex gap-2 z-20">
            <button 
              onClick={downloadPDF}
              disabled={isExporting}
              className={`p-3 bg-black/80 hover:bg-black text-white rounded-xl transition-all shadow-lg active:scale-90 flex items-center gap-2 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiDownload className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting && <span className="text-[10px] font-black uppercase">Exporting...</span>}
            </button>
            <button className="p-3 bg-black/80 hover:bg-black text-white rounded-xl transition-all shadow-lg active:scale-90">
              <FiSearch className="w-5 h-5" />
            </button>
          </div>

          {/* Paper Content */}
          <div ref={previewRef} className="p-16 flex flex-col h-full bg-white bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-16">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-black uppercase mb-1">NINJA <span className="text-red-500">SALES</span></h1>
                <p className="text-[9px] font-bold text-black/50 leading-relaxed uppercase w-32">
                  128 OPERATIONS BLVD, SUITE 400, AUSTIN, TX 78701
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-5xl font-black tracking-tight text-black opacity-80 leading-none uppercase">{docType}</h2>
                <span className="text-[10px] font-black text-black/30 tracking-widest">{docType === "PROPOSAL" ? "#PR-2023-084" : "#INV-2023-084"}</span>
              </div>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-2">Prepared For</p>
                  <p className="text-xl font-black text-black uppercase tracking-tight">{clientName}</p>
                  <div className="text-[10px] font-bold text-black/50 mt-1 uppercase">
                    Attn: Finance Department<br/>
                    contact@{clientName.toLowerCase().replace(/\s+/g, '')}.com
                  </div>
                </div>
              </div>
              <div className="space-y-6 text-right">
                <div>
                  <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1">Issued Date</p>
                  <p className="text-sm font-black text-black uppercase">October 24, 2023</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 font-black">{docType === "PROPOSAL" ? "Expiry Date" : "Due Date"}</p>
                  <p className="text-sm font-black text-black uppercase">November 07, 2023</p>
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            <div className="mb-10">
              <h3 className="text-xl font-black text-black uppercase tracking-tight mb-4 pb-2 border-b-4 border-black inline-block">
                {docType === "PROPOSAL" ? "Scope of Work" : "Service & Billing"}
              </h3>
              <p className="text-xs font-black text-black mb-2 uppercase tracking-wide">{projectTitle}</p>
              <p className="text-[11px] font-medium text-black/60 leading-relaxed max-w-lg">
                {notes}
              </p>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.1]">
                    <th className="py-4 text-left text-[9px] font-black text-black/30 uppercase tracking-widest">Item Description</th>
                    <th className="py-4 text-center text-[9px] font-black text-black/30 uppercase tracking-widest">Qty</th>
                    <th className="py-4 text-center text-[9px] font-black text-black/30 uppercase tracking-widest">Rate</th>
                    <th className="py-4 text-right text-[9px] font-black text-black/30 uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-5">
                        <p className="text-sm font-black text-black uppercase tracking-tight">{item.description}</p>
                      </td>
                      <td className="py-5 text-center">
                        <p className="text-sm font-medium text-black/50">{item.qty}</p>
                      </td>
                      <td className="py-5 text-center">
                        <p className="text-sm font-black text-black">{formatCurrency(item.rate)}</p>
                      </td>
                      <td className="py-5 text-right font-black">{formatCurrency(item.qty * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 border-t-2 border-black pt-6 flex flex-col items-end gap-2">
               <div className="flex justify-between w-48 opacity-60">
                 <span className="text-[10px] font-black text-black uppercase tracking-widest">Subtotal</span>
                 <span className="text-sm font-black text-black">{formatCurrency(subtotal)}</span>
               </div>
               {docType === "INVOICE" && taxRate > 0 && (
                 <div className="flex justify-between w-48 opacity-60">
                   <span className="text-[10px] font-black text-black uppercase tracking-widest">Tax ({taxRate}%)</span>
                   <span className="text-sm font-black text-black">{formatCurrency(taxAmount)}</span>
                 </div>
               )}
               {docType === "INVOICE" && discount > 0 && (
                 <div className="flex justify-between w-48 opacity-60">
                   <span className="text-[10px] font-black text-black uppercase tracking-widest">Discount</span>
                   <span className="text-sm font-black text-red-500">-{formatCurrency(discount)}</span>
                 </div>
               )}
               <div className="flex justify-between w-48">
                 <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Terms</span>
                 <span className="text-[10px] font-black text-black uppercase">{paymentTerms.split(',')[0]}</span>
               </div>
               <div className="flex justify-between w-48 mt-2 pt-2 border-t border-black/5">
                 <span className="text-xs font-black text-black uppercase tracking-widest">Grand Total</span>
                 <span className="text-xl font-black text-red-600 tracking-tighter">{formatCurrency(total)}</span>
               </div>
            </div>

            {/* Footer */}
            <div className="mt-12 flex justify-between items-end border-t border-black/5 pt-8 opacity-40">
              <p className="text-[8px] font-black uppercase tracking-[0.3em]">Ninja Sales AI &copy; 2024</p>
              <div className="flex gap-4">
                <FiZap className="w-4 h-4 text-red-500" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;
