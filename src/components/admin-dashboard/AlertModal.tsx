import React from "react";
import {
  FiX,
  FiAlertTriangle,
  FiTrash2,
  FiEdit3,
  FiToggleLeft,
  FiToggleRight,
  FiDollarSign,
} from "react-icons/fi";

type AlertType = "danger" | "warning" | "info" | "success";
type AlertAction = "delete" | "toggle" | "edit" | "add" | "custom";

interface AlertModalProps {
  isOpen: boolean;
  type?: AlertType;
  action?: AlertAction;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  loadingText?: string;
  customIcon?: React.ReactNode;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  type = "danger",
  action = "custom",
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onClose,
  onConfirm,
  isLoading = false,
  loadingText = "Processing...",
  customIcon,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (customIcon) return customIcon;

    switch (action) {
      case "delete":
        return <FiTrash2 className="h-5 w-5" />;
      case "toggle":
        return <FiToggleLeft className="h-5 w-5" />;
      case "edit":
        return <FiEdit3 className="h-5 w-5" />;
      case "add":
        return <FiDollarSign className="h-5 w-5" />;
      default:
        return <FiAlertTriangle className="h-5 w-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-red-500/10",
          iconColor: "text-red-400",
          buttonBg:
            "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30",
          buttonText: "text-red-400 hover:text-red-300",
          spinnerBorder: "border-red-400/30 border-t-red-400",
        };
      case "warning":
        return {
          iconBg: "bg-yellow-500/10",
          iconColor: "text-yellow-400",
          buttonBg:
            "bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30",
          buttonText: "text-yellow-400 hover:text-yellow-300",
          spinnerBorder: "border-yellow-400/30 border-t-yellow-400",
        };
      case "success":
        return {
          iconBg: "bg-green-500/10",
          iconColor: "text-green-400",
          buttonBg:
            "bg-green-500/10 hover:bg-green-500/20 border border-green-500/30",
          buttonText: "text-green-400 hover:text-green-300",
          spinnerBorder: "border-green-400/30 border-t-green-400",
        };
      case "info":
        return {
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-400",
          buttonBg:
            "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30",
          buttonText: "text-blue-400 hover:text-blue-300",
          spinnerBorder: "border-blue-400/30 border-t-blue-400",
        };
      default:
        return {
          iconBg: "bg-red-500/10",
          iconColor: "text-red-400",
          buttonBg:
            "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30",
          buttonText: "text-red-400 hover:text-red-300",
          spinnerBorder: "border-red-400/30 border-t-red-400",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0B0B0F]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full ${colors.iconBg} flex items-center justify-center`}
              >
                <div className={colors.iconColor}>{getIcon()}</div>
              </div>
              <h2 className="text-white text-lg font-semibold">{title}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {typeof message === "string" ? (
              <p className="text-white/80 text-sm leading-relaxed">{message}</p>
            ) : (
              message
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg ${colors.buttonBg} ${colors.buttonText} transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div
                    className={`h-4 w-4 border-2 ${colors.spinnerBorder} rounded-full animate-spin`}
                  />
                  {loadingText}
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertModal;
