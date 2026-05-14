import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiEdit2,
  FiExternalLink, 
  FiFilter,
  FiFilePlus,
  FiMessageCircle,
  FiUserCheck,
  FiSend,
  FiActivity,
  FiAward,
  FiLoader,
} from "react-icons/fi";
import IconSelect from "../IconSelect";
import LeadAssigneePicker from "./LeadAssigneePicker";
import { ninjaSalesService, Lead, TeamAssigneeMember } from "../../services/ninjaSales";
import { useAuth } from "../../hooks/useAuth";

interface LeadsTableProps {
  refreshKey?: number;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ refreshKey }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  /** Account owner or Manager may assign (matches ninja-sales backend) */
  const canAssignLeads = Boolean(user && (!user.addedBy || user.teamRole === "Manager"));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamAssigneeMember[]>([]);
  const [assigneeLoading, setAssigneeLoading] = useState(true);
  const [savingAssignLeadId, setSavingAssignLeadId] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setAssigneeLoading(true);
      const res = await ninjaSalesService.getTeamAssignees();
      if (cancelled) return;
      if (!res.success || !res.data?.members?.length) {
        setTeamMembers([]);
        setAssigneeLoading(false);
        return;
      }
      setTeamMembers(res.data.members);
      setAssigneeLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAssigneeChange = async (lead: Lead, userId: string | null) => {
    const nextId = userId === null || userId === "" ? null : userId;
    const prev = lead.assignedToUserId ? String(lead.assignedToUserId) : "";
    if ((nextId || "") === (prev || "")) return;
    setSavingAssignLeadId(lead._id);
    const res = await ninjaSalesService.updateLead(lead._id, { assignedToUserId: nextId });
    setSavingAssignLeadId(null);
    if (res.success && res.data) {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l._id === lead._id ? { ...l, ...res.data } : l))
      );
    } else {
      window.alert(res.message || "Could not update assignee");
    }
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await ninjaSalesService.getLeads({
      page: currentPage,
      limit: itemsPerPage,
      search: search || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    });
    if (res.success) {
      setLeads(res.data);
      setTotalLeads(res.pagination?.total || res.data.length);
    }
    setLoading(false);
  }, [currentPage, search, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads, refreshKey]);

  const totalPages = Math.ceil(totalLeads / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };


  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Actions */}
      <div className="p-4 sm:p-6 border-b border-white/[0.03] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          <div className="relative group w-full md:w-[320px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search leads, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <IconSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "All", label: "All Status", icon: <FiFilter className="w-4 h-4" /> },
                { value: "New", label: "New", icon: <FiFilePlus className="w-4 h-4" /> },
                { value: "Contacted", label: "Contacted", icon: <FiMessageCircle className="w-4 h-4" /> },
                { value: "Qualified", label: "Qualified", icon: <FiUserCheck className="w-4 h-4" /> },
                { value: "Proposal Sent", label: "Proposal Sent", icon: <FiSend className="w-4 h-4" /> },
                { value: "Negotiation", label: "Negotiation", icon: <FiActivity className="w-4 h-4" /> },
                { value: "Closed", label: "Closed", icon: <FiAward className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[180px] h-[46px] text-sm"
            />
          </div>
        </div>

        {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-5 text-sm font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95 w-full sm:w-auto">
            <FiUserPlus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
          <button className="p-3 bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white/70 rounded-xl transition-all flex items-center justify-center" title="Export CSV">
            <FiDownload className="w-5 h-5" />
          </button>
        </div> */}
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-6 h-6 text-red-500 animate-spin" />
          <span className="ml-3 text-white/40 text-sm">Loading leads...</span>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Lead Information</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Source</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Lead Status</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Company</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Assigned To</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Last Touch</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-16 text-center text-white/30 text-sm">No leads found. Create your first lead to get started.</td></tr>
            ) : leads.map((lead) => (
              <tr
                key={lead._id}
                className="group hover:bg-white/[0.02] transition-all duration-300 border-b border-white/[0.03]"
              >
                <td className="px-6 py-5">
                  <Link to={`/ai-tools/sales/leads/${lead._id}`} className="flex items-center gap-4 group/name">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-white/10 flex items-center justify-center text-red-500 font-bold shadow-inner">
                      {lead.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover/name:text-red-500 transition-colors flex items-center gap-2">
                        {lead.name}
                        <FiExternalLink className="w-3 h-3 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">{lead.company}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-white/70">{lead.source || "N/A"}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase ${
                    lead.leadStatus === "new" ? "bg-blue-500/10 text-blue-400" :
                    lead.leadStatus === "contacted" ? "bg-purple-500/10 text-purple-400" :
                    lead.leadStatus === "engaged" ? "bg-cyan-500/10 text-cyan-400" :
                    lead.leadStatus === "qualified" ? "bg-emerald-500/10 text-emerald-400" :
                    lead.leadStatus === "unqualified" ? "bg-orange-500/10 text-orange-400" :
                    lead.leadStatus === "nurturing" ? "bg-yellow-500/10 text-yellow-400" :
                    lead.leadStatus === "converted" ? "bg-emerald-500/10 text-emerald-500" :
                    lead.leadStatus === "lost" ? "bg-red-500/10 text-red-400" :
                    lead.leadStatus === "inactive" ? "bg-white/10 text-white/40" :
                    lead.leadStatus === "do-not-contact" ? "bg-red-600/20 text-red-500" :
                    "bg-white/5 text-white/40"
                  }`}>
                    {lead.leadStatus || "New"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-white/70">{lead.company || "N/A"}</span>
                </td>
                <td className="px-6 py-5 align-middle" onClick={(e) => e.stopPropagation()}>
                  {canAssignLeads && assigneeLoading ? (
                    <FiLoader className="w-4 h-4 text-violet-400/90 animate-spin" />
                  ) : (
                    <LeadAssigneePicker
                      lead={lead}
                      teamMembers={teamMembers}
                      saving={savingAssignLeadId === lead._id}
                      disabled={!canAssignLeads}
                      onAssign={(userId) => handleAssigneeChange(lead, userId)}
                    />
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="text-white/50 text-sm italic">{getRelativeTime(lead.lastContactAt)}</div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => navigate(`/ai-tools/sales/leads/${lead._id}/edit`)}
                      className="p-2 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Edit lead"
                      aria-label="Edit lead"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination Container */}
      <div className="p-4 sm:p-6 bg-white/[0.02] border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-white/30 font-medium order-2 md:order-1">
          Showing <span className="text-white/60">{totalLeads > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of <span className="text-white/60">{totalLeads}</span> leads
        </p>
        <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.03] transition-all flex-1 md:flex-none ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:bg-white/5 active:scale-95'}`}
          >
            Prev
          </button>

          <div className="flex items-center gap-6 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl mx-1 md:mx-2">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap">
              Page <span className="text-white text-xs font-black">{currentPage}</span>
              <span className="text-white/10 mx-1">/</span>
              {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all flex-1 md:flex-none ${currentPage === totalPages ? 'text-white/20 cursor-not-allowed' : 'text-white/60 bg-white/5 hover:bg-white/10 active:scale-95'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;
