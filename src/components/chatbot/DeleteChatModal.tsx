import React from "react";

interface ChatbotDeleteChatModalProps {
  isOpen: boolean;
  chatTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const ChatbotDeleteChatModal: React.FC<ChatbotDeleteChatModalProps> = ({
  isOpen,
  chatTitle,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="absolute inset-0 z-[145] bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 z-[150] flex items-center justify-center px-4 sm:px-3">
        <div className="w-full max-w-[280px] sm:max-w-[220px] rounded-xl border border-white/10 bg-[#111116] p-5 sm:p-4 text-center shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
          <h3 className="text-base font-semibold text-white">Delete chat?</h3>
          <p className="mt-2 text-xs text-white/70">
            Remove{" "}
            <span className="font-semibold text-white">
              "{chatTitle || "Untitled chat"}"
            </span>
            ? This can't be undone.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              className="h-10 sm:h-9 rounded-lg bg-[#FF4D4D]/15 text-xs font-semibold text-[#FF7A7A] transition-colors hover:bg-[#FF4D4D]/25 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              className="h-10 sm:h-9 rounded-lg border border-white/10 text-xs font-semibold text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotDeleteChatModal;
