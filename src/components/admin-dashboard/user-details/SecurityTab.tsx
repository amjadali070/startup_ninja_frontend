import React from "react";
import { FaKey } from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface SecurityTabProps {
  user: ExtendedUserDetails;
  formatDate: (dateString: string) => string;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ user, formatDate }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
            <div className="flex items-center gap-3">
              <FaKey className="text-yellow-500" />
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-gray-400 text-xs">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <button className="text-blue-400 text-sm hover:underline">
              Reset Password
            </button>
          </div>
          {/* <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-green-500" />
              <div>
                <p className="text-white font-medium">
                  Two-Factor Authentication
                </p>
                <p className="text-gray-400 text-xs">Currently disabled</p>
              </div>
            </div>
            <button className="text-blue-400 text-sm hover:underline">
              Enable
            </button>
          </div> */}
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Activity Logs</h3>
        <div className="space-y-4">
          {user.activityLogs.map((log) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
