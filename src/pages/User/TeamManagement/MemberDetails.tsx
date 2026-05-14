import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { FiArrowLeft, FiMail, FiShield, FiBriefcase, FiCalendar, FiCheckCircle, FiUser, FiActivity, FiX, FiLoader } from "react-icons/fi";
import { teamService } from "../../../services/team";
import toast from "react-hot-toast";
import AlertModal from "../../../components/AlertModal";

const MemberDetails: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await teamService.getMembers();
        if (res.success && res.data) {
          const found = res.data.find(m => m._id === memberId);
          if (found) {
            setMember({
              id: found._id,
              name: found.fullname,
              email: found.email,
              role: found.teamRole || "Member",
              status: found.status === 1 ? "Active" : "Inactive",
              department: found.department || "Operations",
              joinedDate: "Recently", // You can format found.createdAt if available
              avatar: found.fullname ? found.fullname.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : "U",
              permissions: [
                { name: "Ninja Sales", active: found.permissions?.sales || false },
                { name: "Ninja Legal", active: found.permissions?.legal || false }
              ],
              lastActive: "Active recently",
              activeProjects: 0,
              addedByName: found.createdBy?.fullname || "Root Owner"
            });
          } else {
            toast.error("Member not found");
            navigate("/manage-team");
          }
        }
      } catch (err) {
        toast.error("Failed to fetch member details");
      } finally {
        setLoading(false);
      }
    };
    if (memberId) fetchMember();
  }, [memberId, navigate]);

  const handleResetPassword = async () => {
    if (!memberId) return;
    const newPassword = window.prompt("Enter a new password for this member (min 6 chars):");
    if (!newPassword) return; // cancelled or empty

    const loadToast = toast.loading("Resetting password...");
    try {
      const res = await teamService.resetMemberPassword(memberId, newPassword);
      if (res.success) {
        toast.success(res.message || "Password reset successfully!", { id: loadToast });
      } else {
        toast.error(res.message || "Failed to reset password", { id: loadToast });
      }
    } catch (err) {
      toast.error("Error connecting to server", { id: loadToast });
    }
  };

  const handleDeleteMember = async () => {
    if (!memberId) return;

    setIsDeleting(true);
    const loadToast = toast.loading("Deleting member...");
    try {
      const res = await teamService.deleteMember(memberId);
      if (res.success) {
        toast.success(res.message || "Member deleted successfully!", { id: loadToast });
        navigate("/manage-team");
      } else {
        toast.error(res.message || "Failed to delete member", { id: loadToast });
      }
    } catch (err) {
      toast.error("Error connecting to server", { id: loadToast });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <DashboardLayout
      activePath="/manage-team"
      title="Member Profile"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-8 text-white font-plus-jakarta max-w-full mx-auto">

          <button
            onClick={() => navigate("/manage-team")}
            className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-all group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Team Management
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-20 min-h-[500px]">
              <FiLoader className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : member ? (
            <>
              {/* Profile Header Card */}
              <div className="bg-[#0B0B0F] border border-white/10 rounded-[32px] p-8 mb-8 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                  {/* Avatar */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] bg-gradient-to-br from-red-600/20 to-red-950/20 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl font-bold text-red-500 shadow-2xl">
                    {member.avatar}
                  </div>

                  {/* Identity */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{member.name}</h1>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${member.status === "Active" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${member.status === "Active" ? "bg-green-400" : "bg-red-400"}`} />
                        {member.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-white/40">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-red-500/70" />
                        <span className="text-sm sm:text-base">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiActivity className="text-red-500/70" />
                        <span className="text-sm">Last active: {member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: "Role", value: member.role, icon: <FiShield />, color: "text-blue-400" },
                      { label: "Department", value: member.department, icon: <FiBriefcase />, color: "text-purple-400" },
                      { label: "Added By", value: member.addedByName, icon: <FiUser />, color: "text-amber-400" },
                      { label: "Joined Date", value: member.joinedDate, icon: <FiCalendar />, color: "text-emerald-400" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl ${item.color} group-hover:scale-110 transition-transform`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-0.5">{item.label}</p>
                            <p className="text-lg font-bold text-white transition-colors">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Module Permissions Card */}
                  <div className="bg-[#0B0B0F] border border-white/10 rounded-[32px] p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FiShield className="text-red-500" />
                      Module Access Permissions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {member.permissions.map((perm: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${perm.active
                            ? "bg-red-600/5 border-red-600/20"
                            : "bg-white/[0.02] border-white/5 opacity-50"
                            }`}
                        >
                          <span className={`font-semibold tracking-wide ${perm.active ? "text-white" : "text-white/40"}`}>
                            {perm.name}
                          </span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${perm.active ? "bg-red-600 text-white shadow-lg shadow-red-900/40" : "bg-white/5 text-white/20"
                            }`}>
                            {perm.active ? <FiCheckCircle className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions/Stats */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-red-600/10 to-red-950/10 border border-red-600/20 rounded-[32px] p-8">
                    <h4 className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-6">Quick Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/manage-team/${member.id}/edit`)}
                        className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left font-semibold transition-all hover:pl-8 active:scale-95"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleResetPassword}
                        className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left font-semibold transition-all hover:pl-8 active:scale-95"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="w-full py-4 px-6 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-2xl text-left font-semibold text-red-400 transition-all hover:pl-8 active:scale-95"
                      >
                        Delete Member
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>

      <AlertModal
        isOpen={deleteModalOpen}
        type="danger"
        action="delete"
        title="Delete Member"
        message={`Are you sure you want to permanently delete ${member?.name || 'this member'}?`}
        confirmText="Delete"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteMember}
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </DashboardLayout>
  );
};

export default MemberDetails;
