import { type FC } from "react";
import { FiFileText, FiClock, FiMoreVertical } from "react-icons/fi";

interface RecentDoc {
  name: string;
  client: string;
  status: "PAID" | "SENT" | "DRAFT";
  value: string;
}

const recentDocs: RecentDoc[] = [
  { name: "Q3 Marketing Ops", client: "Solaris Labs", status: "PAID", value: "$18,200" },
  { name: "Design Audit Retainer", client: "Vortex Tech", status: "SENT", value: "$4,000" },
  { name: "Mobile App Concept", client: "IndieGames Inc", status: "DRAFT", value: "$12,000" },
];

const RecentProposals: FC = () => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PAID": return "text-emerald-500 bg-emerald-500/10";
      case "SENT": return "text-red-500 bg-red-500/10";
      case "DRAFT": return "text-white/40 bg-white/5";
      default: return "";
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-black text-white/90 uppercase tracking-widest">Recent Documents</h2>
        </div>
        <button className="text-xs text-white/40 hover:text-white transition-colors underline uppercase tracking-widest font-black">View All Activity</button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.03] bg-white/[0.01]">
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Document Name</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Client</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Value</th>
              <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentDocs.map((doc, i) => (
              <tr key={i} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-white/20" />
                    <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-400">{doc.client}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${getStatusStyle(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-white tracking-tight">{doc.value}</span>
                </td>
                <td className="px-6 py-5">
                  <button className="text-white/20 hover:text-white transition-colors">
                    <FiMoreVertical />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProposals;
