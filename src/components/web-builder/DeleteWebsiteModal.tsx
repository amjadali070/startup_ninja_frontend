import { type FC } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

interface DeleteWebsiteModalProps {
  isOpen: boolean;
  websiteTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteWebsiteModal: FC<DeleteWebsiteModalProps> = ({
  isOpen,
  websiteTitle,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0B0B0F]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <h2 className="text-white text-lg font-semibold">Delete Website</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-white/80 text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">"{websiteTitle}"</span>?
              This permanently removes the website, its published pages, and any uploaded documents. This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Website"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteWebsiteModal;
