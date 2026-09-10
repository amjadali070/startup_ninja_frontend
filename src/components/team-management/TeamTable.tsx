import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiCheckCircle, FiEdit, FiTrash2, FiDownload, FiUsers, FiShield, FiXCircle, FiFilter, FiMail, FiClock, FiUserPlus } from "react-icons/fi";
import { TeamMember, teamService } from "../../services/team";
import toast from "react-hot-toast";
import IconSelect from "../IconSelect";
import AlertModal from "../AlertModal";

interface TeamTableProps {
  members: TeamMember[];
  onRefresh: () => void;
  onAddMember?: () => void;
}

const PAGE_SIZE = 10;

const TeamTable: React.FC<TeamTableProps> = ({ members, onRefresh, onAddMember }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredTeam = members.filter((member: TeamMember) => {
    const matchesSearch = member.fullname?.toLowerCase().includes(search.toLowerCase()) || member.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || member.teamRole?.toLowerCase() === roleFilter.toLowerCase();

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = member.status === 1;
    if (statusFilter === "inactive") matchesStatus = member.status === 0;

    return matchesSearch && matchesRole && matchesStatus;
  });

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTeam.length / PAGE_SIZE));
  const pagedTeam = filteredTeam.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleResendInvitation = async (member: TeamMember) => {
    setResendingId(member._id);
    const res = await teamService.resendInvitation(member._id);
    setResendingId(null);
    if (res.success) {
      // A present message on a successful resend means the email itself failed to send even
      // though the token was regenerated — surface that as a warning, not a plain success.
      if (res.message) {
        toast.error(res.message);
      } else {
        toast.success(`Invitation resent to ${member.email}`);
      }
    } else {
      toast.error(res.message || "Failed to resend invitation");
    }
  };

  const handleExportCSV = () => {
    if (filteredTeam.length === 0) {
      toast.error("No team members to export");
      return;
    }

    const headers = ["Name,Email,Role,Department,Status,Added By"];
    const csvData = filteredTeam.map(m => 
      `"${m.fullname}","${m.email}","${m.teamRole}","${m.department}","${m.status === 1 ? 'Active' : 'Inactive'}","${m.createdBy?.fullname || 'Root Owner'}"`
    );

    const csvContent = headers.concat(csvData).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `team_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    setIsDeleting(true);
    const res = await teamService.deleteMember(memberToDelete);
    setIsDeleting(false);
    
    if (res.success) {
      toast.success("Member removed");
      onRefresh();
    } else {
      toast.error(res.message || "Failed to remove member");
    }
    
    setDeleteModalOpen(false);
    setMemberToDelete(null);
  };

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 0:
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="bg-[#0D0D0D] border border-white/5 rounded-[32px] overflow-hidden">
      {/* Table Header/Actions */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full md:w-[320px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <IconSelect 
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "all", label: "All Roles", icon: <FiUsers className="w-4 h-4" /> },
              { value: "manager", label: "Manager", icon: <FiShield className="w-4 h-4" /> },
              { value: "member", label: "Member", icon: <FiUser className="w-4 h-4" /> }
            ]}
            className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
          />
          <IconSelect 
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All Status", icon: <FiFilter className="w-4 h-4" /> },
              { value: "active", label: "Active", icon: <FiCheckCircle className="w-4 h-4" /> },
              { value: "inactive", label: "Inactive", icon: <FiXCircle className="w-4 h-4" /> }
            ]}
            className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
          />

          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 rounded-xl py-3 px-4 text-sm font-medium transition-all"
            title="Export to CSV"
          >
            <FiDownload className="w-4 h-4 text-red-500/70" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Member</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Role</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Department</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Added By</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                      <FiUserPlus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No team members yet</h3>
                    <p className="text-white/40 text-sm max-w-md text-center mb-5">
                      Invite your first teammate to start collaborating — they'll get an email to set up their own access.
                    </p>
                    {onAddMember && (
                      <button
                        onClick={onAddMember}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-xl py-2.5 px-5 text-sm font-semibold transition-all"
                      >
                        <FiUserPlus className="w-4 h-4" />
                        Add your first member
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filteredTeam.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                      <FiUsers className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
                    <p className="text-white/40 text-sm max-w-md text-center">
                      We couldn't find any team members matching your current filters. Try adjusting your search query or clear the filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedTeam.map((member) => (
                <tr key={member._id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-950/20 border border-white/10 flex items-center justify-center text-red-500 font-plus-jakarta font-bold">
                        {member.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </div>
                      <div>
                        <Link to={`/manage-team/${member._id}`} className="block hover:text-red-500 transition-colors">
                          <div className="font-medium">{member.fullname}</div>
                          <div className="text-white/40 text-sm">{member.email}</div>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      {member.teamRole === 'Manager' ? <FiShield className="text-white/30 w-4 h-4" /> : <FiUser className="text-white/30 w-4 h-4" />}
                      <span className="text-white/70 text-sm">{member.teamRole}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5 text-white/50 text-sm">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-white/20" />
                      <span className="text-white/70 text-sm">{member.createdBy?.fullname || 'Root Owner'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5">
                    {member.invitePending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <FiClock className="text-xs" />
                        Pending invite
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(member.status)}`}>
                        {member.status === 1 ? <FiCheckCircle className="text-xs" /> : <FiXCircle className="text-xs" />}
                        {member.status === 1 ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-white/5 text-right">
                    {member.invitePending && (
                      <button
                        onClick={() => handleResendInvitation(member)}
                        disabled={resendingId === member._id}
                        className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                        title="Resend Invitation"
                      >
                        <FiMail className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/manage-team/${member._id}/edit`)}
                      className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Edit Member"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setMemberToDelete(member._id);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Remove Member"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 flex items-center justify-between text-sm text-white/40">
        <div>
          {filteredTeam.length === 0
            ? "Showing 0 members"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, filteredTeam.length)} of ${filteredTeam.length} members`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <AlertModal
        isOpen={deleteModalOpen}
        type="danger"
        action="delete"
        title="Delete Member"
        message={`Are you sure you want to permanently delete ${filteredTeam.find(m => m._id === memberToDelete)?.fullname || 'this member'}?`}
        confirmText="Delete"
        onClose={() => {
          setDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default TeamTable;
