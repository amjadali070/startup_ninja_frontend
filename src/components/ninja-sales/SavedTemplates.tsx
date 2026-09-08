import { type FC, useEffect, useState } from "react";
import { FiZap, FiFileText, FiTrash2, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { ninjaSalesService, ProposalTemplate } from "../../services/ninjaSales";

const relativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Updated today";
  if (days === 1) return "Updated 1d ago";
  if (days < 7) return `Updated ${days}d ago`;
  return `Updated ${Math.floor(days / 7)}w ago`;
};

const SavedTemplates: FC = () => {
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await ninjaSalesService.getTemplates();
      if (!cancelled && res.success) setTemplates(res.data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await ninjaSalesService.deleteTemplate(id);
    setDeletingId(null);
    if (res.success) {
      toast.success("Template deleted");
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } else {
      toast.error(res.message || "Failed to delete template");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FiZap className="w-4 h-4 text-red-500" />
        <h2 className="text-sm font-black text-white/90 uppercase tracking-widest leading-none">Saved Templates</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-white/40">
          <FiLoader className="w-5 h-5 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-6 text-center">
          <FiFileText className="w-6 h-6 text-white/15 mx-auto mb-3" />
          <p className="text-xs font-bold text-white/30">No saved templates yet</p>
          <p className="text-[10px] text-white/20 mt-1">Open any proposal or invoice and use "Save as Template" to reuse its structure later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template._id} className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-xl hover:border-red-500/30 transition-all group flex flex-col items-start gap-4 relative">
              <button
                onClick={() => handleDelete(template._id)}
                disabled={deletingId === template._id}
                className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete template"
              >
                {deletingId === template._id ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiTrash2 className="w-4 h-4" />}
              </button>
              <div className="bg-red-500/10 p-3 rounded-2xl">
                <FiFileText className="w-6 h-6 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{template.name}</h3>
                <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{relativeTime(template.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTemplates;
