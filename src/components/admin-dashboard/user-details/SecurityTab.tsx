import React, { useState } from "react";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";
import { adminService } from "../../../services/admin";
import { toast } from "react-hot-toast";

interface SecurityTabProps {
  user: ExtendedUserDetails;
  formatDate: (dateString: string) => string;
  onUpdate?: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  user,
  formatDate,
  onUpdate,
}) => {
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsResetting(true);
    try {
      const response = await adminService.resetUserPassword(
        user._id,
        newPassword
      );
      if (response.success) {
        toast.success("Password reset successfully");
        setShowResetForm(false);
        setNewPassword("");
        setConfirmPassword("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        if (onUpdate) {
          onUpdate();
        }
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred while resetting password");
    } finally {
      setIsResetting(false);
    }
  };

  const getLastPasswordChangeText = () => {
    const passwordUpdateLog = user.activityLogs.find(
      (log) => log.action === "Password Update"
    );

    if (!passwordUpdateLog) {
      return "Never changed";
    }

    const date = new Date(passwordUpdateLog.timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      if (diffMinutes < 1) return "Changed just now";
      return `Changed ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }

    if (diffHours < 24) {
      return `Changed ${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }

    if (diffDays === 1) return "Changed yesterday";
    if (diffDays < 30) return `Changed ${diffDays} days ago`;
    if (diffDays < 365)
      return `Changed ${Math.floor(diffDays / 30)} months ago`;
    return `Changed ${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Security Settings</h3>
        <div className="space-y-4">
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaKey className="text-yellow-500" />
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-gray-400 text-xs">
                    {getLastPasswordChangeText()}
                  </p>
                </div>
              </div>
              {!showResetForm && (
                <button
                  onClick={() => setShowResetForm(true)}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Reset Password
                </button>
              )}
            </div>

            {showResetForm && (
              <div className="mt-4 space-y-4 border-t border-[#3A3A3A] pt-4">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded px-3 py-2 pr-10 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showNewPassword ? (
                        <FaEye className="w-3.5 h-3.5" />
                      ) : (
                        <FaEyeSlash className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded px-3 py-2 pr-10 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <FaEye className="w-3.5 h-3.5" />
                      ) : (
                        <FaEyeSlash className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowResetForm(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setShowNewPassword(false);
                      setShowConfirmPassword(false);
                    }}
                    className="px-3 py-1.5 text-gray-400 text-sm hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isResetting ? "Resetting..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Activity Logs</h3>
        <div className="space-y-4">
          {user.activityLogs.length > 0 ? (
            user.activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 pb-4 border-b border-[#242424] last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-500"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-white text-sm font-medium">{log.action}</p>
                    <span className="text-gray-500 text-xs">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    IP: {log.ip} • {log.userAgent}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{log.details}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4 text-sm">
              No Activity Logs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
