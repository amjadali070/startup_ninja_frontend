import { type FC } from "react";
import { 
  FiX, 
  FiHelpCircle, 
  FiCalendar, 
  FiChevronDown, 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiAward, 
  FiFlag, 
  FiTarget, 
  FiZap,
  FiPercent,
  FiArrowRight,
  FiShield,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProjectModal: FC<AddProjectModalProps> = ({ isOpen, onClose }) => {
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Add Project</h2>
            <p className="text-gray-400 text-sm mt-1">Create a new deal and link it to a client</p>
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
          
          {/* CLIENT INFORMATION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">CLIENT INFORMATION</h3>
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Full Name <span className="text-[#E11D48] ml-0.5">*</span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 focus:ring-1 focus:ring-[#E11D48]/20 transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Email</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Phone</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Company & Job Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Company</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiBriefcase className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Acme Corp"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Job Title</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiAward className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Product Manager"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Client Notes</label>
                <textarea 
                  placeholder="Write any specific notes or context about the client..."
                  rows={2}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* PROJECT INFORMATION */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">PROJECT DETAILS</h3>
            </div>

            <div className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Project Name <span className="text-[#E11D48] ml-0.5">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Website redesign for ABC Corp"
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pipeline Stage */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">
                    Pipeline Stage <span className="text-[#E11D48] ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select stage</option>
                      <option value="lead">New Lead</option>
                      <option value="qualified">Qualified</option>
                      <option value="discovery">Discovery</option>
                      <option value="proposal">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed-won">Closed Won</option>
                      <option value="closed-lost">Closed Lost</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Deal Value */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Estimated Deal Value</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <span className="text-sm font-medium">$</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="0.00"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-8 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Confidence Level */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Confidence Score</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiPercent className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue="50"
                    >
                      <option value="10">10% - Very Low</option>
                      <option value="25">25% - Low</option>
                      <option value="50">50% - Moderate</option>
                      <option value="75">75% - High</option>
                      <option value="90">90% - Very High</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Priority</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiFlag className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue="medium"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUALIFICATION & INSIGHTS */}
          <section className="space-y-6 pt-2 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">QUALIFICATION & INSIGHTS</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Next Step */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Immediate Next Step</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Schedule demo"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>

                {/* Primary Competitor */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Primary Competitor</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiShield className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Who else are they talking to?"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expected Close Date */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Forecasted Date</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Project Urgency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Project Urgency</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Timeline</option>
                      <option value="immediate">Immediate (Ready to sign)</option>
                      <option value="1-3">1-3 Months</option>
                      <option value="3-6">3-6 Months</option>
                      <option value="long-term">6+ Months / Planning</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Budget Confirmed */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 bg-[#161618] border border-[#27272A] rounded peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all" />
                    <FiCheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-all" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Budget has been confirmed</span>
                </label>

                {/* Decision Maker */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 bg-[#161618] border border-[#27272A] rounded peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all" />
                    <FiCheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-all" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Speaking with Decision Maker</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lead Source */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Inbound Channel</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiTarget className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Source</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="cold-outreach">Cold Outreach</option>
                      <option value="partner">Partner</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Campaign */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Campaign Attribution</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiZap className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Q2 Growth Campaign"
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-medium transition-colors">
            <FiHelpCircle className="w-4 h-4" />
            <span>How do projects work?</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1A0707] border border-[#450A0A] hover:bg-[#2D0A0A] rounded-lg transition-all">
              Save Draft
            </button>
            <button className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all">
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
