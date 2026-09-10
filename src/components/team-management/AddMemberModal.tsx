import React, { useState } from "react";
import { FiX, FiUser, FiMail, FiLock, FiBriefcase, FiShield, FiCheck, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
}

import { useAuth } from "../../hooks/useAuth";
import IconSelect from "../IconSelect";

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { user } = useAuth();
  const isManager = !!user?.addedBy && user?.teamRole === "Manager";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  // "invite" sends an email letting the member set their own password; "set" lets the
  // owner/manager type one directly (the old behavior, kept for cases where email isn't
  // practical — e.g. a teammate sitting right there).
  const [creationMode, setCreationMode] = useState<"invite" | "set">("invite");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "password" && creationMode === "set") {
      if (!value) {
        setPasswordError("Password is required.");
      } else if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
      } else {
        setPasswordError("");
      }
    }
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
    if (creationMode === "set") {
      const password = formData.password || "";
      if (!password) {
        setPasswordError("Password is required.");
        return;
      }
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
        return;
      }
      onConfirm(formData);
    } else {
      // Omit password entirely — the backend treats that as "send an invitation email".
      const { password, ...rest } = formData;
      onConfirm(rest);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-[#0B0B0F] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300">

          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Add New Member</h2>
              <p className="text-white/40 text-sm mt-1">Configure workspace access and permissions.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
            <div className="p-8 space-y-4">

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Full Name</label>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Email Address</label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Access setup */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Access</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { setCreationMode("invite"); setPasswordError(""); }}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                        creationMode === "invite"
                          ? "bg-red-600/10 border-red-600/50"
                          : "bg-white/5 border-white/5 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className={`text-sm font-medium ${creationMode === "invite" ? "text-white" : "text-white/60"}`}>Send email invite</div>
                      <div className="text-white/40 text-xs mt-0.5">They set their own password</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreationMode("set")}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                        creationMode === "set"
                          ? "bg-red-600/10 border-red-600/50"
                          : "bg-white/5 border-white/5 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className={`text-sm font-medium ${creationMode === "set" ? "text-white" : "text-white/60"}`}>Set password now</div>
                      <div className="text-white/40 text-xs mt-0.5">You choose it for them</div>
                    </button>
                  </div>

                  {creationMode === "set" && (
                    <div className="relative group mt-3">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 transition-all ${
                          passwordError
                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500/50"
                            : "border-white/10 focus:ring-red-500/20 focus:border-red-500/50"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}
                  {passwordError && (
                    <p className="text-[11px] text-red-400 ml-1 mt-1">{passwordError}</p>
                  )}
                </div>
              </div>

              {/* Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Role</label>
                  <IconSelect
                    value={formData.role}
                    onChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}
                    options={[
                      { value: "Manager", label: "Manager", icon: <FiShield className="w-5 h-5" /> },
                      { value: "Member", label: "Member", icon: <FiUser className="w-5 h-5" /> },
                    ]}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 text-white transition-all"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Status</label>
                  <IconSelect
                    value={formData.status}
                    onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                    options={[
                      { value: "Active", label: "Active", icon: <FiCheckCircle className="w-5 h-5" /> },
                      { value: "Inactive", label: "Inactive", icon: <FiXCircle className="w-5 h-5" /> },
                    ]}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 text-white transition-all"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Department</label>
                  <IconSelect
                    value={formData.department}
                    onChange={(val) => setFormData((prev) => ({ ...prev, department: val }))}
                    options={[
                      { value: "Sales", label: "Sales", icon: <FiBriefcase className="w-5 h-5" /> },
                      { value: "Ops", label: "Ops", icon: <FiBriefcase className="w-5 h-5" /> },
                      { value: "Finance", label: "Finance", icon: <FiBriefcase className="w-5 h-5" /> },
                      { value: "Legal", label: "Legal", icon: <FiBriefcase className="w-5 h-5" /> },
                      { value: "Tech", label: "Tech", icon: <FiBriefcase className="w-5 h-5" /> },
                      { value: "HR", label: "HR", icon: <FiBriefcase className="w-5 h-5" /> },
                    ]}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 text-white transition-all"
                  />
                </div>
              </div>

              {/* Module Permissions */}
              <div className="space-y-4 pt-4">
                <label className="text-sm font-semibold text-white/80 uppercase tracking-widest pl-1">Module Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'sales', label: 'Ninja Sales' },
                    { id: 'legal', label: 'Ninja Legal' }
                  ].map((module) => {
                    // Check if manager is allowed to delegate this module
                    const isAllowed = !isManager || user?.permissions?.[module.id as keyof typeof user.permissions];
                    
                    return (
                      <div
                        key={module.id}
                        onClick={() => isAllowed ? handlePermissionChange(module.id) : null}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isAllowed ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} ${formData.permissions[module.id as keyof typeof formData.permissions]
                          ? "bg-red-600/10 border-red-600/50"
                          : "bg-white/5 border-white/5 " + (isAllowed ? "hover:bg-white/[0.08]" : "")
                          }`}
                      >
                        <span className={`text-sm font-medium transition-colors ${formData.permissions[module.id as keyof typeof formData.permissions] ? "text-white" : "text-white/40"
                          }`}>
                          {module.label}
                          {!isAllowed && <span className="ml-2 text-xs text-red-500/70">(Locked)</span>}
                        </span>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.permissions[module.id as keyof typeof formData.permissions]
                          ? "bg-red-600 border-red-600"
                          : "border-white/10"
                          }`}>
                          {formData.permissions[module.id as keyof typeof formData.permissions] && <FiCheck className="text-white w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.01]">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                {creationMode === "invite" ? "Send Invitation" : "Create Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMemberModal;
