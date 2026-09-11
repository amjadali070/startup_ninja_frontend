import React from "react";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";
import IconSelect, { SelectOption } from "../../IconSelect";

const editUserSelectClass =
  "w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 h-[50px] text-white";

const ROLE_OPTIONS: SelectOption[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
  { value: "2", label: "Suspended" },
];

interface EditForm {
  fullname: string;
  email: string;
  phoneNumber: string;
  country: string;
  role: string;
  status: number;
}

interface EditUserViewProps {
  user: ExtendedUserDetails;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  setViewingEditUser: (viewing: boolean) => void;
  handleUpdateUser: () => void;
}

const EditUserView: React.FC<EditUserViewProps> = ({
  editForm,
  setEditForm,
  setViewingEditUser,
  handleUpdateUser,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => setViewingEditUser(false)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <FaArrowLeft /> Back to User Details
        </button>

        <div className="flex items-center justify-between bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaUser className="text-red-500" /> Edit User Profile
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Update personal information and account status
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewingEditUser(false)}
              className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUser}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">
              Full Name
            </label>
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                value={editForm.fullname}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullname: e.target.value })
                }
                className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-3">
              <FaPhone className="text-gray-500" />
              <input
                type="text"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
                className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Location / Country
            </label>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-500" />
              <input
                type="text"
                value={editForm.country}
                onChange={(e) =>
                  setEditForm({ ...editForm, country: e.target.value })
                }
                className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="United States"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Account Role
            </label>
            <IconSelect
              value={editForm.role}
              onChange={(v) => setEditForm({ ...editForm, role: v })}
              options={ROLE_OPTIONS}
              className={editUserSelectClass}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Account Status
            </label>
            <IconSelect
              value={String(editForm.status)}
              onChange={(v) =>
                setEditForm({ ...editForm, status: Number(v) })
              }
              options={STATUS_OPTIONS}
              className={editUserSelectClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserView;
