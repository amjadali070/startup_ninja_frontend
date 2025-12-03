import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaGlobe,
  FaBell,
  FaCog,
} from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface ProfileTabProps {
  user: ExtendedUserDetails;
  formatDate: (dateString: string) => string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, formatDate }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-500 text-sm mb-1">
              Full Name
            </label>
            <div className="text-white">{user.fullname || "N/A"}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">
              Email Address
            </label>
            <div className="text-white flex items-center gap-2">
              {user.email}
              {user.isEmailVerified ? (
                <FaCheckCircle
                  className="text-green-500 text-sm"
                  title="Verified"
                />
              ) : (
                <FaTimesCircle
                  className="text-red-500 text-sm"
                  title="Not Verified"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">
              Phone Number
            </label>
            <div className="text-white">{user.phoneNumber || "N/A"}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">Location</label>
            <div className="text-white">{user.country || "N/A"}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">
              Joined Date
            </label>
            <div className="text-white">{formatDate(user.createdAt)}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">
              Login Method
            </label>
            <div className="text-white">{user.loginType}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <FaGlobe className="text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Language</p>
              <p className="text-white text-sm">English (US)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaBell className="text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Notifications</p>
              <p className="text-white text-sm">Enabled</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaCog className="text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Theme</p>
              <p className="text-white text-sm">Dark Mode</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Login Sessions</h3>
          <div className="text-sm text-gray-400">
            {user.loginSessions?.length || 0} active session(s)
          </div>
        </div>
        {user.loginSessions && user.loginSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#242424]">
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Device & Browser
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">OS</th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Location
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    IP Address
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Last Active
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.loginSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-[#242424] last:border-0"
                  >
                    <td className="py-4 text-white text-sm">
                      <div>{session.device}</div>
                      {session.browser && (
                        <div className="text-gray-400 text-xs mt-0.5">
                          {session.browser}
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {(session as any).os || "Unknown"}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {session.location || "Unknown"}
                    </td>
                    <td className="py-4 text-gray-300 font-mono text-xs">
                      {session.ip}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {formatDate(session.lastActive)}
                    </td>
                    <td className="py-4">
                      {session.isCurrent ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-medium">
                          Current Session
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No active login sessions found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
