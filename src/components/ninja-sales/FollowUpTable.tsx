import { type FC } from "react";

interface FollowUpLead {
  id: string;
  name: string;
  company: string;
  value: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  aiConfidence: number;
  lastContact: string;
}

const followUps: FollowUpLead[] = [
  { id: "1", name: "Alex Mercer", company: "Cognitive Flow AI", value: "$450,000", urgency: "HIGH", aiConfidence: 94, lastContact: "3 days ago" },
  { id: "2", name: "Sarah Lansing", company: "Nexus Logistics", value: "$225,000", urgency: "MEDIUM", aiConfidence: 82, lastContact: "12 hours ago" },
  { id: "3", name: "Robert Kagawa", company: "Skyline Ventures", value: "$1,100,000", urgency: "HIGH", aiConfidence: 91, lastContact: "6 days ago" },
  { id: "4", name: "Elena Moretti", company: "Veridian Health", value: "$85,000", urgency: "LOW", aiConfidence: 65, lastContact: "1 week ago" },
];

const FollowUpTable: FC = () => {
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "HIGH": return "text-[#EF4444] bg-[#EF444410]";
      case "MEDIUM": return "text-orange-500 bg-orange-500/10";
      case "LOW": return "text-gray-500 bg-white/5";
      default: return "";
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">Active Follow-ups</h2>
        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest border border-white/5">
          14 Leads Found
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.03] bg-white/[0.01]">
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Lead Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Company</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Value</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Urgency</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">AI Confidence</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((lead) => (
              <tr key={lead.id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all cursor-pointer">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{lead.name}</span>
                    <span className="text-[10px] text-white/20 mt-1 uppercase font-bold tracking-wide">Last contact: {lead.lastContact}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-gray-400">{lead.company}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-white tracking-tight">{lead.value}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest ${getUrgencyStyles(lead.urgency)}`}>
                    {lead.urgency}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${lead.aiConfidence > 90 ? 'bg-red-500' : 'bg-red-500/40'}`} 
                        style={{ width: `${lead.aiConfidence}%` }} 
                      />
                    </div>
                    <span className="text-xs font-black text-white tracking-widest">{lead.aiConfidence}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUpTable;
