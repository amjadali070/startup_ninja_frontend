import { type FC, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { 
  FiEdit3, FiFilePlus, FiSend, FiMoreVertical, 
  FiCheckCircle, FiClock, FiInfo, FiPlus
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const LeadDetailsPage: FC = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [timelineFilter, setTimelineFilter] = useState("ALL");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Sales logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/leads"
      title="Lead Details - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 space-y-8 md:space-y-12 max-w-auto mx-auto text-white pb-20">
          
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-3 w-full xl:w-auto">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <Link to="/ai-tools/sales/leads" className="hover:text-red-500 transition-colors">Leads</Link> 
                <span>/</span> 
                <span className="text-red-500">Detail View</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase">Nebula Labs</h1>
                <span className="px-3 py-1 bg-red-600 text-[10px] font-black text-white rounded-md uppercase tracking-widest shadow-lg shadow-red-600/20">
                  Priority High
                </span>
              </div>
              <p className="text-base md:text-lg font-medium text-white/50">Strategic AI Integration Project</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex items-center gap-3 w-full xl:w-auto">
              <button className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <FiEdit3 className="w-4 h-4" />
                <span>Update Stage</span>
              </button>
              <button className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <FiFilePlus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
              <button className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
                <FiSend className="w-4 h-4" />
                <span>Generate Proposal</span>
              </button>
            </div>
          </div>

          {/* Core Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Lead Overview */}
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Lead Overview</h2>
                 <FiInfo className="w-4 h-4 text-white/20" />
               </div>
               
               <div className="grid grid-cols-2 gap-y-6 md:gap-y-8">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Company</p>
                   <p className="text-sm font-black text-white uppercase">Nebula Labs</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Contact</p>
                   <p className="text-sm font-black text-white uppercase">Alex Rivera</p>
                 </div>
                 <div className="col-span-2 space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Email</p>
                   <p className="text-sm font-black text-red-500 uppercase truncate">alex@nebulalabs.io</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Deal Value</p>
                   <p className="text-2xl font-black text-white tracking-tighter">$280k</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Probability</p>
                   <p className="text-2xl font-black text-red-500 tracking-tighter">85%</p>
                 </div>
               </div>

               <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Stage: Qualified</p>
                    <div className="flex gap-1.5 mt-2">
                       <div className="w-6 h-1.5 bg-red-600 rounded-full" />
                       <div className="w-6 h-1.5 bg-red-600 rounded-full" />
                       <div className="w-6 h-1.5 bg-red-600 rounded-full" />
                       <div className="w-6 h-1.5 bg-white/5 rounded-full" />
                    </div>
                 </div>
               </div>
            </div>

            {/* Opportunity Health */}
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute top-8 left-8">
                 <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Opportunity Health</h2>
               </div>
               
               <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center mt-6">
                 <svg className="w-full h-full -rotate-90">
                   <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                   <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.92" strokeDashoffset="66.35" className="text-red-600 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">88</span>
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Score</span>
                 </div>
               </div>

               <button className="mt-8 md:mt-10 h-10 px-6 bg-red-600/10 border border-red-600/30 rounded-full text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                 High Engagement Detected
               </button>
            </div>

            {/* Tasks & Reminders */}
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 md:col-span-2 lg:col-span-1">
               <div className="flex items-center justify-between mb-2">
                 <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Tasks & Reminders</h2>
                 <button className="text-red-500 hover:text-red-400 transition-all"><FiPlus className="w-5 h-5" /></button>
               </div>
               
               <div className="space-y-4">
                 {[
                   { t: "Send follow-up deck", d: "Due Today, 5:00 PM", c: true },
                   { t: "Schedule technical deep dive", d: "Due Tomorrow", c: false },
                   { t: "Verify GPU availability with Ops", d: "Due Friday", c: false },
                 ].map((task, i) => (
                   <div key={i} className={`p-4 rounded-2xl border transition-all ${task.c ? 'bg-white/[0.03] border-white/5' : 'bg-transparent border-white/5 hover:bg-white/[0.01]'}`}>
                     <div className="flex items-start gap-4">
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.c ? 'bg-red-600 border-red-600' : 'border-white/20'}`}>
                           {task.c && <FiCheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-sm font-black uppercase tracking-tight ${task.c ? 'text-white/40' : 'text-white'}`}>{task.t}</p>
                          <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{task.d}</p>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Middle Row: Timeline & AI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Activity Timeline */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl relative">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                 <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Activity Timeline</h2>
                 <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1 gap-1 w-full sm:w-auto">
                    {["ALL", "CALLS", "EMAILS"].map(f => (
                      <button key={f} onClick={() => setTimelineFilter(f)} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timelineFilter === f ? 'bg-red-600 text-white shadow-lg' : 'text-white/20 hover:text-white/40'}`}>
                        {f}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-10 md:space-y-12 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                 {[
                   { t: "Proposal Drafted", desc: "System automatically generated preliminary quote based on requirements list.", time: "2H AGO", active: true },
                   { t: "Meeting Note: Needs scalable GPU infrastructure", desc: "Alex emphasized the need for elastic scaling during peak training cycles.", time: "YESTERDAY", active: false },
                   { t: "Discovery Call Completed", desc: "Conducted 45min initial screening. Identified budget holder and technical blockers.", time: "OCT 14", active: false },
                   { t: "Email Sent", desc: "Initial outreach sent via LinkedIn connection.", time: "OCT 12", active: false },
                 ].map((act, i) => (
                   <div key={i} className="relative pl-10 group">
                      <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-4 border-[#121212] z-10 transition-all ${act.active ? 'bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10 group-hover:bg-white/20'}`} />
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                        <div className="space-y-2 max-w-md">
                          <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{act.t}</h4>
                          <p className="text-xs text-white/40 leading-relaxed font-medium">{act.desc}</p>
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap pt-1">{act.time}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Ninja AI Suggestions */}
            <div className="lg:col-span-5 bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[400px]">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />
               
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                    <HiSparkles className="w-6 h-6" />
                 </div>
                 <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Ninja AI Suggestions</h2>
               </div>

               <div className="space-y-8 flex-1">
                 <div>
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Next Action</p>
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-xl flex-shrink-0">
                        <FiFilePlus className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-base font-black text-white uppercase tracking-tight">Send case study on GPU scaling</p>
                   </div>
                 </div>

                 <div>
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Drafting Assistant</p>
                   <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 relative group">
                      <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <p className="text-sm text-gray-400 leading-relaxed font-medium relative z-10">
                        "Hi Alex, following our talk on your infrastructure needs, I wanted to share how we handled similar scaling for Nebula's peers..."
                      </p>
                   </div>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-2 text-white/40">
                   <FiClock className="w-4 h-4 flex-shrink-0" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Best sent <span className="text-red-500">Tuesday at 9:00 AM</span></span>
                 </div>
                 <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-all">Copy Draft</button>
               </div>
            </div>
          </div>

          {/* Bottom Table: History */}
          <section className="bg-[#121212] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-sm font-black text-white/90 uppercase tracking-[0.2em]">Proposal & Invoice History</h2>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">3 Items Total</span>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
               <table className="w-full text-left min-w-[800px]">
                 <thead>
                    <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Document Name</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Reference</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Value</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {[
                      { name: "Initial Quote", ref: "QT-2024-089", date: "Oct 15, 2024", val: "$280,000.00", st: "SENT", type: "QUOTE" },
                      { name: "Master Services Agreement", ref: "MSA-NEB-24", date: "Oct 16, 2024", val: "--", st: "DRAFT", type: "CONTRACT" },
                      { name: "Invoice #SN-102", ref: "INV-SN-102", date: "Oct 10, 2024", val: "$45,000.00", st: "PAID", type: "INVOICE" },
                    ].map((doc, i) => (
                      <tr key={i} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                             <div className={`p-2.5 rounded-xl border transition-all ${doc.type === 'INVOICE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-white/40'}`}>
                               <FiFilePlus className="w-5 h-5 flex-shrink-0" />
                             </div>
                             <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{doc.name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30 uppercase tracking-tight">{doc.ref}</td>
                        <td className="px-8 py-6 text-sm font-medium text-white/30">{doc.date}</td>
                        <td className="px-8 py-6 text-sm font-black text-white tracking-tight">{doc.val}</td>
                        <td className="px-8 py-6">
                           <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest ${doc.st === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : doc.st === 'SENT' ? 'bg-white/5 text-white/40' : 'bg-red-500/10 text-red-500'}`}>
                             {doc.st}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="text-white/20 hover:text-white transition-colors">
                             <FiMoreVertical className="w-5 h-5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </section>

        </div>
      </main>
    </DashboardLayout>
  );
};

export default LeadDetailsPage;
