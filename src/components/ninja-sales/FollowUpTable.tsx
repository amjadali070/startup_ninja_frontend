import { type FC } from "react";
import { Link } from "react-router-dom";

interface FollowUpLead {
  id: string;
  name: string;
  company: string;
  value: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  aiConfidence: number;
  lastContact: string;
  tabType: string;
}

const followUps: FollowUpLead[] = [
  // Today items
  { id: "1", name: "Alex Mercer", company: "Cognitive Flow AI", value: "$450,000", urgency: "HIGH", aiConfidence: 94, lastContact: "3 hours ago", tabType: "Today" },
  { id: "2", name: "Sarah Lansing", company: "Nexus Logistics", value: "$225,000", urgency: "MEDIUM", aiConfidence: 82, lastContact: "12 hours ago", tabType: "Today" },
  
  // Overdue
  { id: "3", name: "Robert Kagawa", company: "Skyline Ventures", value: "$1,100,000", urgency: "HIGH", aiConfidence: 91, lastContact: "6 days ago", tabType: "Overdue" },
  { id: "4", name: "Elena Moretti", company: "Veridian Health", value: "$85,000", urgency: "LOW", aiConfidence: 65, lastContact: "1 week ago", tabType: "Overdue" },
  
  // No Response
  { id: "5", name: "Michael Chen", company: "Stellar Cloud", value: "$320,000", urgency: "MEDIUM", aiConfidence: 75, lastContact: "4 days ago", tabType: "No Response" },
  { id: "6", name: "Jessica Jones", company: "Alias Investigations", value: "$120,000", urgency: "LOW", aiConfidence: 60, lastContact: "5 days ago", tabType: "No Response" },
  
  // High Value
  { id: "7", name: "Diana Prince", company: "Themyscira Systems", value: "$2,500,000", urgency: "HIGH", aiConfidence: 98, lastContact: "2 days ago", tabType: "High Value" },
  { id: "8", name: "Bruce Wayne", company: "Wayne Enterprises", value: "$5,000,000", urgency: "MEDIUM", aiConfidence: 85, lastContact: "1 day ago", tabType: "High Value" },
  { id: "9", name: "Tony Stark", company: "Stark Industries", value: "$4,200,000", urgency: "HIGH", aiConfidence: 95, lastContact: "3 hours ago", tabType: "High Value" },
  
  // Proposal Sent
  { id: "10", name: "Peter Parker", company: "Daily Bugle Web", value: "$15,000", urgency: "LOW", aiConfidence: 45, lastContact: "5 hours ago", tabType: "Proposal Sent" },
  { id: "11", name: "Clark Kent", company: "Daily Planet", value: "$25,000", urgency: "MEDIUM", aiConfidence: 72, lastContact: "2 days ago", tabType: "Proposal Sent" },
];

interface FollowUpTableProps {
  filter: string;
}

const FollowUpTable: FC<FollowUpTableProps> = ({ filter }) => {
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "HIGH": return "text-[#EF4444] bg-[#EF444410]";
      case "MEDIUM": return "text-orange-500 bg-orange-500/10";
      case "LOW": return "text-gray-500 bg-white/5";
      default: return "";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Today": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Overdue": return "text-[#EF4444] bg-[#EF444410] border-red-500/20";
      case "No Response": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "High Value": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "Proposal Sent": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-white/60 bg-white/5 border-white/10";
    }
  };

  const filteredLeads = filter === "All" ? followUps : followUps.filter((lead) => lead.tabType === filter);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">Active Follow-ups: {filter}</h2>
        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest border border-white/5">
          {filteredLeads.length} Leads Found
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-white/[0.03] bg-white/[0.01]">
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Lead Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Company</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Value</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Urgency</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">AI Confidence</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all cursor-pointer">
                <td className="px-6 py-5">
                  <Link to={`/ai-tools/sales/leads/${lead.id}`} className="flex flex-col cursor-pointer group/link">
                    <span className="text-sm font-black text-white group-hover/link:text-red-500 transition-colors uppercase tracking-tight">{lead.name}</span>
                    <span className="text-[10px] text-white/20 mt-1 uppercase font-bold tracking-wide group-hover/link:text-red-500/50 transition-colors">Last contact: {lead.lastContact}</span>
                  </Link>
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
                  <span className={`inline-block w-[110px] text-center px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border uppercase whitespace-nowrap ${getStatusStyles(lead.tabType)}`}>
                    {lead.tabType}
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
