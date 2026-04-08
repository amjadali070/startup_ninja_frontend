import { type FC } from "react";
import { 
  FiX, 
  FiHelpCircle, 
  FiChevronDown, 
  FiUser, 
  FiBriefcase, 
  FiFlag, 
  FiMessageCircle,
  FiCpu,
  FiZap,
  FiClock,
  FiSmile
} from "react-icons/fi";

interface NewOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewOutreachModal: FC<NewOutreachModalProps> = ({ isOpen, onClose }) => {
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
            <h2 className="text-2xl font-bold text-white tracking-tight">New Outreach</h2>
            <p className="text-gray-400 text-sm mt-1">Schedule a follow-up or outreach task for your leads</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar whitespace-nowrap">
          
          {/* OUTREACH TARGET */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">OUTREACH TARGET</h3>
            </div>

            <div className="space-y-6">
              {/* Recipient Lead */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Recipient Lead <span className="text-[#E11D48] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <select 
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a lead or contact</option>
                    <option value="1">Alex Thompson (TechFlow Solutions)</option>
                    <option value="2">Sarah Chen (Chen Design Studio)</option>
                    <option value="3">Marcus Rodriguez (Global Logistics)</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company (Read-only reference) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Company</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiBriefcase className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Company auto-populates"
                      disabled
                      className="w-full bg-[#161618]/50 border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Priority Level</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiFlag className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue="medium"
                    >
                      <option value="urgent">Urgent Action</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* OUTREACH CONFIGURATION */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">OUTREACH CONFIGURATION</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Channel Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Outreach Channel</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiMessageCircle className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                      defaultValue="email"
                    >
                      <option value="linkedin">LinkedIn Message</option>
                      <option value="email">Direct Email</option>
                      <option value="call">Phone Call</option>
                      <option value="meeting">Video Meeting</option>
                      <option value="sms">SMS Text</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Scheduled Time */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Scheduled Date & Time</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Goal/Subject */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Goal / Subject Line</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiZap className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Following up on yesterday's proposal"
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* AI CONTENT ASSISTANT */}
          <section className="space-y-6 pt-2 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
                <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">OUTREACH CONTENT</h3>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#E11D48]/10 hover:bg-[#E11D48]/20 border border-[#E11D48]/20 rounded-lg text-[10px] font-bold text-[#E11D48] uppercase tracking-wider transition-all">
                <FiCpu className="w-3 h-3" />
                <span>AI Draft Assistant</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 py-2 bg-[#161618] border border-[#27272A] rounded-lg text-xs font-medium text-white/70 hover:text-white hover:border-[#E11D48]/30 transition-all">
                  <FiSmile className="w-3.5 h-3.5" />
                  <span>Professional</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 bg-[#161618] border border-[#27272A] rounded-lg text-xs font-medium text-white/70 hover:text-white hover:border-[#E11D48]/30 transition-all">
                  <FiZap className="w-3.5 h-3.5" />
                  <span>Persuasive</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 bg-[#161618] border border-[#27272A] rounded-lg text-xs font-medium text-white/70 hover:text-white hover:border-[#E11D48]/30 transition-all">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>Direct/Short</span>
                </button>
              </div>

              <textarea 
                placeholder="Write your outreach message here or use AI to generate a draft based on the lead's profile..."
                rows={4}
                className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-medium transition-colors">
            <FiHelpCircle className="w-4 h-4" />
            <span>How do outreaches work?</span>
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
              Create Outreach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOutreachModal;
