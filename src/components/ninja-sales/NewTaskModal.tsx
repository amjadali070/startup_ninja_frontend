import { type FC, useState } from "react";
import { 
  FiX, 
  FiCalendar, 
  FiChevronDown, 
  FiFlag, 
  FiCheckCircle,
  FiAlignLeft
} from "react-icons/fi";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate: (task: { id: number, t: string, d: string, c: boolean }) => void;
}

const NewTaskModal: FC<NewTaskModalProps> = ({ isOpen, onClose, onTaskCreate }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) return;

    const formattedDate = dueDate 
      ? `Due ${new Date(dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`
      : "No Date Set";

    onTaskCreate({
      id: Date.now(),
      t: title,
      d: formattedDate,
      c: false
    });

    setTitle("");
    setDueDate("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">New Task or Reminder</h2>
            <p className="text-gray-400 text-sm mt-1">Create a follow-up, meeting or reminder for this lead</p>
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
          
          <div className="space-y-6">
            {/* Task Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">
                Task Title <span className="text-[#E11D48] ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prepare Technical Deck"
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Due Date/Time */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">Due Date & Time</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiCalendar className="w-4 h-4" />
                  </div>
                  <input 
                    type="datetime-local" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all [color-scheme:dark]"
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

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white ml-0.5">Description / Notes</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-gray-500">
                  <FiAlignLeft className="w-4 h-4" />
                </div>
                <textarea 
                  placeholder="Optional context for this task..."
                  rows={4}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-end">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate}
              className={`px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-lg transition-all ${title.trim() ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-red-600/50 cursor-not-allowed text-white/50'}`}>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
