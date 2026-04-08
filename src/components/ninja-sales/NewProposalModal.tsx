import { type FC } from "react";
import { 
  FiX, 
  FiHelpCircle, 
  FiChevronDown, 
  FiBriefcase, 
  FiDollarSign,
  FiFileText,
  FiClock,
  FiType,
  FiCpu,
  FiZap,
  FiLayers,
  FiCheckCircle,
  FiArrowRight
} from "react-icons/fi";

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProposalModal: FC<NewProposalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <FiFileText className="text-[#E11D48] w-5 h-5" />
               <h2 className="text-2xl font-bold text-white tracking-tight">Generate New Proposal</h2>
            </div>
            <p className="text-gray-400 text-sm">Professional document configuration for your active deals</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="border-t border-[#1C1C1F] mx-6" />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* PROPOSAL CONTEXT */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">PROPOSAL CONTEXT</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Associated Project */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Associated Project / Deal</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiBriefcase className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select active project</option>
                      <option value="1">Mobile App Development - TechFlow</option>
                      <option value="2">Cloud Migration - Smart Cap</option>
                      <option value="3">SEO Audit - Global Logistics</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Pricing Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Pricing Model</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiLayers className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue="fixed"
                    >
                      <option value="fixed">Fixed Price Project</option>
                      <option value="monthly">Monthly Retainer</option>
                      <option value="hourly">Hourly Rate</option>
                      <option value="performance">Performance Based</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposal Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Proposal Title / Reference</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiType className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Q4 Growth Strategy & Technical Roadmap"
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FINANCIALS & TIMELINE */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">FINANCIALS & TIMELINE</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Value */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Total Quote Value</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiDollarSign className="w-4 h-4" />
                  </div>
                  <input 
                    type="number" 
                    placeholder="Estimated deal value"
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Proposal Expiration Date</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <input 
                    type="date" 
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SCOPE & DELIVERABLES */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">SCOPE & DELIVERABLES</h3>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#E11D48]/10 hover:bg-[#E11D48]/20 border border-[#E11D48]/20 rounded-lg text-[10px] font-bold text-[#E11D48] uppercase tracking-wider transition-all">
                <FiCpu className="w-3 h-3" />
                <span>AI Scope Generator</span>
              </button>
            </div>

            <div className="space-y-2">
              <textarea 
                placeholder="Detail the key milestones and deliverables for this proposal..."
                rows={4}
                className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none custom-scrollbar"
              />
              <div className="flex items-center gap-2 text-[10px] text-gray-500 italic mt-1">
                <FiZap className="w-3 h-3" />
                <span>Pro tip: Clearly defining scope reduces friction during the negotiation stage.</span>
              </div>
            </div>
          </section>

          {/* AI STRATEGY */}
          <section className="space-y-6 pt-2 pb-6">
            <div className="flex items-center gap-3">
               <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
               <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">AI DOCUMENT STRATEGY</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#161618] border border-[#27272A] rounded-xl space-y-4">
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Document Tone</p>
                 <div className="grid grid-cols-2 gap-2">
                   <button className="py-2.5 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-white/70 hover:border-[#E11D48]/50 transition-all">Corporate</button>
                   <button className="py-2.5 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-white/70 hover:border-[#E11D48]/50 transition-all">Concise</button>
                   <button className="py-2.5 bg-white/5 border border-[#E11D48]/30 rounded-lg text-xs font-bold text-[#E11D48]">Persuasive</button>
                   <button className="py-2.5 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-white/70 hover:border-[#E11D48]/50 transition-all">Technical</button>
                 </div>
              </div>

              <div className="p-4 bg-[#161618] border border-[#27272A] rounded-xl space-y-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Proposal Length</p>
                <div className="flex h-10 w-full bg-black/20 rounded-lg p-1">
                   <button className="flex-1 rounded-md text-[10px] font-bold uppercase text-white/40 hover:text-white transition-all">Micro</button>
                   <button className="flex-1 rounded-md text-[10px] font-bold uppercase bg-white/5 text-white shadow-sm transition-all border border-white/10 px-4">Standard</button>
                   <button className="flex-1 rounded-md text-[10px] font-bold uppercase text-white/40 hover:text-white transition-all">Full Story</button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                   <FiHelpCircle className="w-3 h-3" />
                   <span>Select 'Standard' for projects above $10k.</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white text-xs font-medium transition-colors cursor-help">
            <FiCheckCircle className="w-4 h-4 text-green-500/50" />
            <span>AI Ready for Generation</span>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-[#1A0707] border border-[#450A0A] hover:bg-[#2D0A0A] rounded-lg transition-all">
              Save Draft
            </button>
            <button className="flex-1 md:flex-none px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
              <span>Send Component</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProposalModal;
