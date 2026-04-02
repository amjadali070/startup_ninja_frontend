import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { FiArrowLeft, FiUser, FiBriefcase, FiShield, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const EditMember: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  // Mock data fetching - In a real app, this would be from an API
  useEffect(() => {
    // Simulating API fetch
    const mockMembers = [
      { id: "1", name: "Amjad Ali", email: "amjad@startupninja.com", role: "Owner", status: "Active", department: "Operations" },
      { id: "2", name: "Sarah Chen", email: "sarah.c@startupninja.com", role: "Manager", status: "Active", department: "Operations" },
      { id: "3", name: "Michael Ross", email: "m.ross@startupninja.com", role: "Member", status: "Active", department: "Legal" },
    ];

    const member = mockMembers.find(m => m.id === memberId);
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role as any,
        status: member.status as any,
        department: member.department,
        permissions: {
          sales: true,
          ops: member.department === "Operations",
          finance: false,
          legal: member.department === "Legal",
        }
      });
    }
  }, [memberId]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating member data:", formData);
    toast.success("Member profile updated successfully!");
    navigate("/manage-team");
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
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 transition-all text-sm"
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
                        <option className="bg-[#0B0B0F]" value="Admin">Admin</option>
                        <option className="bg-[#0B0B0F]" value="Manager">Manager</option>
                        <option className="bg-[#0B0B0F]" value="Member">Member</option>
                        <option className="bg-[#0B0B0F]" value="Owner">Owner</option>
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
                      { id: 'ops', label: 'Ninja Ops' },
                      { id: 'finance', label: 'Ninja Finance' },
                      { id: 'legal', label: 'Ninja Legal' }
                    ].map((module) => (
                      <div
                        key={module.id}
                        onClick={() => handlePermissionChange(module.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.permissions[module.id as keyof typeof formData.permissions]
                          ? "bg-red-600/10 border-red-600/30"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                          }`}
                      >
                        <span className={`text-xs font-semibold tracking-wide ${formData.permissions[module.id as keyof typeof formData.permissions] ? "text-white" : "text-white/20"
                          }`}>
                          {module.label}
                        </span>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.permissions[module.id as keyof typeof formData.permissions]
                          ? "bg-red-600 text-white"
                          : "bg-white/5 text-white/5"
                          }`}>
                          <FiCheck className={`w-3.5 h-3.5 transition-transform ${formData.permissions[module.id as keyof typeof formData.permissions] ? "scale-100" : "scale-0"}`} />
                        </div>
                      </div>
                    ))}
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
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default EditMember;
