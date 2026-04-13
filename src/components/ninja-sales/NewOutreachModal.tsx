import { type FC, useState, useEffect } from "react";
import {
  FiX,
  FiChevronDown,
  FiClock,
  FiLoader,
  FiPhone,
  FiMail,
  FiUsers,
  FiRefreshCw,
  FiMonitor,
  FiFileText,
  FiMoreHorizontal,
  FiAlertTriangle,
  FiFlag,
  FiMinusCircle,
} from "react-icons/fi";
import { ninjaSalesService, Project } from "../../services/ninjaSales";
import IconSelect, { SelectOption } from "../IconSelect";

interface NewOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  preselectedProjectId?: string;
}

const typeOptions: SelectOption[] = [
  { value: "call", label: "Call", icon: <FiPhone className="w-4 h-4" /> },
  { value: "email", label: "Email", icon: <FiMail className="w-4 h-4" /> },
  { value: "meeting", label: "Meeting", icon: <FiUsers className="w-4 h-4" /> },
  { value: "follow-up", label: "Follow-up", icon: <FiRefreshCw className="w-4 h-4" /> },
  { value: "demo", label: "Demo", icon: <FiMonitor className="w-4 h-4" /> },
  { value: "proposal-review", label: "Proposal Review", icon: <FiFileText className="w-4 h-4" /> },
  { value: "other", label: "Other", icon: <FiMoreHorizontal className="w-4 h-4" /> },
];

const urgencyOptions: SelectOption[] = [
  { value: "HIGH", label: "High Priority", icon: <FiAlertTriangle className="w-4 h-4" /> },
  { value: "MEDIUM", label: "Medium Priority", icon: <FiFlag className="w-4 h-4" /> },
  { value: "LOW", label: "Low Priority", icon: <FiMinusCircle className="w-4 h-4" /> },
];

const NewOutreachModal: FC<NewOutreachModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  preselectedProjectId,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(preselectedProjectId || "");
  const [type, setType] = useState("call");
  const [title, setTitle] = useState("");
  const [urgency, setUrgency] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      ninjaSalesService.getProjects({ limit: 100 }).then((res) => {
        if (res.success) setProjects(res.data);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedProjectId) setProjectId(preselectedProjectId);
  }, [preselectedProjectId]);

  if (!isOpen) return null;

  const getLeadLabel = (p: Project) => {
    if (typeof p.leadId === "object" && p.leadId) {
      return p.leadId.name + (p.leadId.company ? ` (${p.leadId.company})` : "");
    }
    return "";
  };

  const handleSubmit = async () => {
    if (!projectId || !title || !dueDate) return;
    setSaving(true);
    const res = await ninjaSalesService.createFollowUp({
      projectId,
      type,
      title,
      dueDate,
      urgency,
      notes,
    });
    setSaving(false);
    if (res.success) {
      onCreated?.();
      onClose();
      setProjectId(preselectedProjectId || "");
      setType("call");
      setTitle("");
      setUrgency("MEDIUM");
      setDueDate("");
      setNotes("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-2xl bg-[#0A0A0B] border border-[#1C1C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">New Follow-up</h2>
            <p className="text-gray-400 text-sm mt-1">Schedule a follow-up action for a project</p>
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
          {/* PROJECT & TYPE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">TARGET</h3>
            </div>

            <div className="space-y-6">
              {/* Project Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Project <span className="text-[#E11D48] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 appearance-none transition-all cursor-pointer"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  >
                    <option value="" disabled>Select a project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} {getLeadLabel(p) ? `— ${getLeadLabel(p)}` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Type</label>
                  <IconSelect
                    value={type}
                    onChange={setType}
                    options={typeOptions}
                    placeholder="Select type"
                    className="bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm"
                  />
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white ml-0.5">Urgency</label>
                  <IconSelect
                    value={urgency}
                    onChange={(v) => setUrgency(v as "HIGH" | "MEDIUM" | "LOW")}
                    options={urgencyOptions}
                    placeholder="Select urgency"
                    className="bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E11D48] rounded-full" />
              <h3 className="text-[11px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">DETAILS</h3>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Title <span className="text-[#E11D48] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Follow up on proposal feedback"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white ml-0.5">
                  Due Date & Time <span className="text-[#E11D48] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#161618] border border-[#27272A] rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E11D48]/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 pb-6">
                <label className="text-xs font-semibold text-white ml-0.5">Notes</label>
                <textarea
                  placeholder="Additional context or instructions..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#161618] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E11D48]/50 transition-all resize-none"
                />
              </div>
            </div>
          </section>
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
              onClick={handleSubmit}
              disabled={saving || !projectId || !title || !dueDate}
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <FiLoader className="w-4 h-4 animate-spin" />}
              Create Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOutreachModal;
