import React, { useState } from "react";
import { FiSearch, FiDownload, FiMoreVertical, FiMail, FiPhone, FiExternalLink, FiUserPlus, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Negotiation" | "Closed";
  value: number;
  source: string;
  assignedTo: string;
  lastContact: string;
}

const dummyLeads: Lead[] = [
  { id: "1", name: "Alex Thompson", company: "TechFlow Solutions", email: "alex@techflow.io", phone: "+1 (555) 012-3456", status: "Qualified", value: 12500, source: "LinkedIn", assignedTo: "Sarah Miller", lastContact: "2 hours ago" },
  { id: "2", name: "Sarah Chen", company: "Chen Design Studio", email: "sarah.c@chendesign.com", phone: "+1 (555) 012-7890", status: "New", value: 5000, source: "Website", assignedTo: "Mike Ross", lastContact: "Just now" },
  { id: "3", name: "Marcus Rodriguez", company: "Global Logistics Ltd", email: "m.rodriguez@globallog.com", phone: "+1 (555) 012-1111", status: "Proposal Sent", value: 45000, source: "Referral", assignedTo: "Sarah Miller", lastContact: "1 day ago" },
  { id: "4", name: "Elena Petrova", company: "Smart Capital", email: "epetrova@smartcap.ru", phone: "+1 (555) 012-2222", status: "Negotiation", value: 82000, source: "Cold Outreach", assignedTo: "David Kim", lastContact: "3 hours ago" },
  { id: "5", name: "James Wilson", company: "Apex Innovations", email: "j.wilson@apexinnov.com", phone: "+1 (555) 012-3333", status: "Contacted", value: 15000, source: "Google Ads", assignedTo: "Mike Ross", lastContact: "5 hours ago" },
  { id: "6", name: "Linda Gray", company: "Quantum Systems", email: "linda.g@quantumsys.com", phone: "+1 (555) 012-4444", status: "New", value: 32000, source: "LinkedIn", assignedTo: "David Kim", lastContact: "1 hour ago" },
  { id: "7", name: "Robert Fox", company: "Silverline Media", email: "robert@silverline.com", phone: "+1 (555) 012-5555", status: "Closed", value: 25000, source: "Referral", assignedTo: "Sarah Miller", lastContact: "2 days ago" },
  { id: "8", name: "Sophia Wagner", company: "Wagner Logistics", email: "sophia@wagnerlog.de", phone: "+1 (555) 012-6666", status: "Proposal Sent", value: 18500, source: "Website", assignedTo: "Mike Ross", lastContact: "1 hour ago" },
  { id: "9", name: "Thomas Miller", company: "Miller Tech", email: "thomas@millertech.com", phone: "+1 (555) 012-7777", status: "Qualified", value: 12000, source: "Cold Outreach", assignedTo: "David Kim", lastContact: "4 hours ago" },
  { id: "10", name: "Christopher Davis", company: "Davis & Co", email: "chris@davis.com", phone: "+1 (555) 012-8888", status: "Contacted", value: 55000, source: "Google Ads", assignedTo: "Sarah Miller", lastContact: "6 hours ago" },
  { id: "11", name: "Emily Blunt", company: "Creative Edge", email: "emily@creative.com", phone: "+1 (555) 012-9999", status: "New", value: 9500, source: "Instagram", assignedTo: "Mike Ross", lastContact: "10 mins ago" },
  { id: "12", name: "Jack Wilson", company: "Wilson Brothers", email: "jack@wilsonbros.io", phone: "+1 (555) 013-1111", status: "Negotiation", value: 75000, source: "Partner", assignedTo: "David Kim", lastContact: "12 hours ago" },
];

const LeadsTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLeads = dummyLeads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const getStatusStyle = (status: Lead["status"]) => {
    switch (status) {
      case "New": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Contacted": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Qualified": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Proposal Sent": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Negotiation": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Closed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#121212] border border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header Actions */}
      <div className="p-6 border-b border-white/[0.03] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="relative group w-full sm:w-[320px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search leads, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-red-500/50 transition-all cursor-pointer flex-1 sm:w-[160px]"
            >
              <option value="All" className="bg-[#1A1A1A] text-white">All Status</option>
              <option value="New" className="bg-[#1A1A1A] text-white">New</option>
              <option value="Contacted" className="bg-[#1A1A1A] text-white">Contacted</option>
              <option value="Qualified" className="bg-[#1A1A1A] text-white">Qualified</option>
              <option value="Proposal Sent" className="bg-[#1A1A1A] text-white">Proposal Sent</option>
              <option value="Negotiation" className="bg-[#1A1A1A] text-white">Negotiation</option>
              <option value="Closed" className="bg-[#1A1A1A] text-white">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-5 text-sm font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95">
            <FiUserPlus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
          <button className="p-3 bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white/70 rounded-xl transition-all" title="Export CSV">
            <FiDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Lead Information</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Status</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Deal Value</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Assigned To</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03]">Last Touch</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/[0.03] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead) => (
              <motion.tr
                key={lead.id}
                variants={itemVariants}
                className="group hover:bg-white/[0.02] transition-all duration-300 border-b border-white/[0.03]"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-white/10 flex items-center justify-center text-red-500 font-bold shadow-inner">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-red-500 transition-colors flex items-center gap-2">
                        {lead.name}
                        <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">{lead.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(lead.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-white text-sm">
                    ${lead.value.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                    <FiTrendingUp className="text-green-500/50" />
                    Via {lead.source}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[10px] text-white/60">
                      {lead.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-white/70 text-sm">{lead.assignedTo}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-white/50 text-sm italic">{lead.lastContact}</div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity duration-300">
                    <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <FiMail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <FiPhone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="p-6 bg-white/[0.02] border-t border-white/[0.03] flex items-center justify-between">
        <p className="text-xs text-white/30 font-medium">
          Showing <span className="text-white/60">{filteredLeads.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="text-white/60">{filteredLeads.length}</span> leads
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.03] transition-all ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:bg-white/5 active:scale-95'}`}
          >
            Previous
          </button>

          <div className="flex items-center gap-6 px-3 py-1 mx-2">
            <span className="text-xs font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap">
              Page <span className="text-white text-xs font-black">{currentPage}</span>
              <span className="text-white/10 mx-2">/</span>
              {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all ${currentPage === totalPages ? 'text-white/20 cursor-not-allowed' : 'text-white/60 bg-white/5 hover:bg-white/10 active:scale-95'}`}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadsTable;
