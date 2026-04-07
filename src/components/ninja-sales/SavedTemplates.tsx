import { type FC } from "react";
import { FiZap, FiPlus, FiPenTool } from "react-icons/fi";

const templates = [
  { id: "1", name: "Standard SaaS", updated: "Updated 2d ago", icon: <FiZap className="w-6 h-6 text-red-500" /> },
  { id: "2", name: "Creative Brief", updated: "Updated 1w ago", icon: <FiPenTool className="w-6 h-6 text-red-500" /> },
];

const SavedTemplates: FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FiZap className="w-4 h-4 text-red-500" />
        <h2 className="text-sm font-black text-white/90 uppercase tracking-widest leading-none">Saved Templates</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-xl hover:border-red-500/30 transition-all cursor-pointer group flex flex-col items-start gap-4">
            <div className="bg-red-500/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              {template.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{template.name}</h3>
              <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{template.updated}</p>
            </div>
          </div>
        ))}

        <button className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/40 group">
          <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Create New</span>
        </button>
      </div>
    </div>
  );
};

export default SavedTemplates;
