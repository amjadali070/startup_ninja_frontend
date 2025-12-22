import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export type ChangePasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

interface ChangePasswordProps {
  form: ChangePasswordFormState;
  isUpdating: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

const ChangePassword: FC<ChangePasswordProps> = ({
  form,
  isUpdating,
  onChange,
  onSubmit,
  onReset,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-2">
          Account & Security
        </h3>
        <p className="text-gray-400 text-xs xs:text-sm">
          Manage your password and security settings
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmit}>
        {/* Current Password Field */}
        <div className="mb-3 xs:mb-4">
          <label className="block text-white text-sm xs:text-base font-bold mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={onChange}
              placeholder="Enter current password"
              className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white placeholder:text-gray-400 focus:border-white/20 focus:outline-none text-sm xs:text-base"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showCurrentPassword ? (
                <FiEye className="w-4 h-4 xs:w-5 xs:h-5" />
              ) : (
                <FiEyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password Field */}
        <div className="mb-3 xs:mb-4">
          <label className="block text-white text-sm xs:text-base font-bold mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white placeholder:text-gray-400 focus:border-white/20 focus:outline-none text-sm xs:text-base"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showNewPassword ? (
                <FiEye className="w-4 h-4 xs:w-5 xs:h-5" />
              ) : (
                <FiEyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4 xs:mb-6">
          <label className="block text-white text-sm xs:text-base font-bold mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white placeholder:text-gray-400 focus:border-white/20 focus:outline-none text-sm xs:text-base"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <FiEye className="w-4 h-4 xs:w-5 xs:h-5" />
              ) : (
                <FiEyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 xs:px-5 py-2.5 xs:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-xs xs:text-sm font-bold rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
          >
            {isUpdating ? "Updating…" : "Update Password"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 xs:px-5 py-2.5 xs:py-3.5 bg-[#FFFFFF0D] border border-[#FFFFFF1A] hover:bg-[#4A4A4A] text-white text-xs xs:text-sm font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="mt-4 text-right">
          <Link 
            to="/forgot-password" 
            className="text-xs xs:text-sm text-gray-400 hover:text-white transition-colors"
          >
            Forgot your password? <span className="text-red-500 hover:underline">Reset here</span>
          </Link>
        </div>
      </form>
    </section>
  );
};

export default ChangePassword;
