import { type FC } from "react";
import { FiX, FiGlobe } from "react-icons/fi";

interface PublishWebsiteModalProps {
  isOpen: boolean;
  websiteTitle: string;
  isRepublish: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPublishing?: boolean;
}

const PublishWebsiteModal: FC<PublishWebsiteModalProps> = ({
  isOpen,
  websiteTitle,
  isRepublish,
  onClose,
  onConfirm,
  isPublishing = false,
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
              <div className="h-10 w-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
                <FiGlobe className="h-5 w-5 text-[#DC2626]" />
              </div>
              <h2 className="text-white text-lg font-semibold">
                {isRepublish ? "Republish Website" : "Publish Website"}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isPublishing}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-white/80 text-sm leading-relaxed">
              {isRepublish ? (
                <>
                  This publishes the latest saved changes to{" "}
                  <span className="font-semibold text-white">"{websiteTitle}"</span>, updating
                  what's already live.
                </>
              ) : (
                <>
                  We're about to host{" "}
                  <span className="font-semibold text-white">"{websiteTitle}"</span> securely on
                  our servers. Once published, it'll be live and accessible to visitors. You can
                  republish anytime after making changes.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPublishing}
              className="px-4 py-2 rounded-lg bg-[#DC2626]/10 hover:bg-[#DC2626]/20 border border-[#DC2626]/30 text-[#DC2626] hover:text-red-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPublishing ? (
                <>
                  <div className="h-4 w-4 border-2 border-[#DC2626]/30 border-t-[#DC2626] rounded-full animate-spin" />
                  Publishing...
                </>
              ) : isRepublish ? (
                "Republish"
              ) : (
                "Publish Website"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublishWebsiteModal;
