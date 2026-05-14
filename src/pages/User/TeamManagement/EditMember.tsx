import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { FiArrowLeft, FiUser, FiBriefcase, FiShield, FiCheck, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { teamService } from "../../../services/team";

const EditMember: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isManager = !!user?.addedBy && user?.teamRole === "Manager";

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Member",
    status: "Active",
    department: "Sales",
    permissions: {
      sales: false,
      ops: false,
      finance: false,
      legal: false,
    },
  });

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

  // Fetch real data from API
  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await teamService.getMembers();
        if (res.success && res.data) {
          const member = res.data.find(m => m._id === memberId);
          if (member) {
            setFormData({
              name: member.fullname || "",
              email: member.email || "",
              role: member.teamRole || "Member",
              status: member.status === 1 ? "Active" : "Inactive",
              department: member.department || "Operations",
              permissions: {
                sales: member.permissions?.sales || false,
                ops: member.permissions?.ops || false,
                finance: member.permissions?.finance || false,
                legal: member.permissions?.legal || false,
              }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: !prev.permissions[module as keyof typeof prev.permissions],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    
    // Disable form and show toast loading maybe, or just await
    const loadToast = toast.loading("Updating member...");
    try {
      const res = await teamService.updateMember(memberId, formData);
      if (res.success) {
        toast.success("Member profile updated successfully!", { id: loadToast });
        navigate("/manage-team");
      } else {
        toast.error(res.message || "Failed to update member", { id: loadToast });
      }
    } catch (err) {
      toast.error("An error occurred during update", { id: loadToast });
    }
  };

  return (
    <DashboardLayout
      activePath="/manage-team"
      title="Edit Member"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6 text-white font-plus-jakarta max-w-full mx-auto">

          {/* Back Button */}
          <button
            onClick={() => navigate("/manage-team")}
            className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-all group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Team Management
          </button>

          <div className="bg-[#0B0B0F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] -mr-48 -mt-48 pointer-events-none" />

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/5 relative z-10">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Edit Member</h1>
              <p className="text-white/40 text-sm">Update organizational details and access levels.</p>
            </div>

            {/* Form */}
            {loading ? (
              <div className="flex justify-center items-center p-20 relative z-10 min-h-[400px]">
                <FiLoader className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="p-6 sm:p-8 space-y-8">

                {/* Basic Info */}
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                    <FiUser className="text-red-500" />
                    Basic Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 ml-1">Email Address</label>
                      <input
                        disabled
                        type="email"
                        name="email"
                        value={formData.email}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white/50 focus:outline-none transition-all text-sm cursor-not-allowed"
                        title="Email cannot be changed"
                      />
                    </div>
                  </div>
                </div>

                {/* Organizational */}
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                    <FiShield className="text-red-500" />
                    Organization
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 ml-1">Role</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white focus:outline-none focus:border-red-500/40 appearance-none transition-all cursor-pointer text-sm"
                      >
                        <option className="bg-[#0B0B0F]" value="Manager">Manager</option>
                        <option className="bg-[#0B0B0F]" value="Member">Member</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 ml-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white focus:outline-none focus:border-red-500/40 appearance-none transition-all cursor-pointer text-sm"
                      >
                        <option className="bg-[#0B0B0F]" value="Active">Active</option>
                        <option className="bg-[#0B0B0F]" value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 ml-1">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white focus:outline-none focus:border-red-500/40 appearance-none transition-all cursor-pointer text-sm"
                      >
                        <option className="bg-[#0B0B0F]" value="Sales">Sales</option>
                        <option className="bg-[#0B0B0F]" value="Ops">Ops</option>
                        <option className="bg-[#0B0B0F]" value="Finance">Finance</option>
                        <option className="bg-[#0B0B0F]" value="Legal">Legal</option>
                        <option className="bg-[#0B0B0F]" value="Tech">Tech</option>
                        <option className="bg-[#0B0B0F]" value="HR">HR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Module Access */}
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                    <FiBriefcase className="text-red-500" />
                    Access Permissions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'sales', label: 'Ninja Sales' },
                      { id: 'legal', label: 'Ninja Legal' }
                    ].map((module) => {
                      const isAllowed = !isManager || user?.permissions?.[module.id as keyof typeof user.permissions];
                      
                      return (
                        <div
                          key={module.id}
                          onClick={() => isAllowed ? handlePermissionChange(module.id) : null}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAllowed ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} ${formData.permissions[module.id as keyof typeof formData.permissions]
                            ? "bg-red-600/10 border-red-600/30"
                            : "bg-white/[0.02] border-white/5 " + (isAllowed ? "hover:bg-white/[0.05]" : "")
                            }`}
                        >
                          <span className={`text-xs font-semibold tracking-wide ${formData.permissions[module.id as keyof typeof formData.permissions] ? "text-white" : "text-white/20"
                            }`}>
                            {module.label}
                            {!isAllowed && <span className="ml-2 text-[10px] text-red-500/70">(Locked)</span>}
                          </span>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.permissions[module.id as keyof typeof formData.permissions]
                            ? "bg-red-600 text-white"
                            : "bg-white/5 text-white/5"
                            }`}>
                            <FiCheck className={`w-3.5 h-3.5 transition-transform ${formData.permissions[module.id as keyof typeof formData.permissions] ? "scale-100" : "scale-0"}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 sm:p-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/manage-team")}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white text-sm font-bold transition-all shadow-lg shadow-red-900/10 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default EditMember;
