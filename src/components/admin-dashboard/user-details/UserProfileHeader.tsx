import React from "react";
import { FaEnvelope, FaUser, FaTools } from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface UserProfileHeaderProps {
  user: ExtendedUserDetails;
  onManageResources: () => void;
  onEditUser: () => void;
  onSuspend?: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  onManageResources,
  // onEditUser,
  onSuspend,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
      <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl text-white font-bold">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          user.username.charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white mb-1">
          {user.fullname || user.username}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <FaEnvelope /> {user.email}
          </span>
          <span className="flex items-center gap-1">
            <FaUser /> {user.role}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              user.status === 1
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {user.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onManageResources}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <FaTools /> Manage Resources
        </button>
        {/* <button
          onClick={onEditUser}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          Edit User
        </button> */}
        <button
          onClick={onSuspend}
          className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors font-medium"
        >
          Suspend
        </button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
