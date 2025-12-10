import React, { useState, useEffect } from "react";
import { FiX, FiEdit3 } from "react-icons/fi";
import toast from "react-hot-toast";

interface EditCreditModalProps {
  isOpen: boolean;
  credit: any;
  onClose: () => void;
  onSubmit: (
    creditId: string,
    updates: { creditAmount: number; notes: string }
  ) => Promise<void>;
}

const EditCreditModal: React.FC<EditCreditModalProps> = ({
  isOpen,
  credit,
  onClose,
  onSubmit,
}) => {
  const [editAmount, setEditAmount] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (credit) {
      setEditAmount(credit.creditAmount.toString());
      setEditNotes(credit.notes || "");
    }
  }, [credit]);

  if (!isOpen || !credit) return null;

  const handleSubmit = async () => {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(credit._id, {
        creditAmount: parseFloat(editAmount),
        notes: editNotes,
      });
      onClose();
    } catch (error) {
      console.error("Error in EditCreditModal:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setEditAmount("");
      setEditNotes("");
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0B0B0F]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FiEdit3 className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-white text-lg font-semibold">Edit Credit</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={submitting}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close edit credit modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Credit Amount (USD)
              </label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Enter amount (e.g., 100.00)"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                min="0"
                step="0.01"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about this credit..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                rows={3}
                maxLength={500}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                submitting || !editAmount || parseFloat(editAmount) <= 0
              }
              className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Credit"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCreditModal;
