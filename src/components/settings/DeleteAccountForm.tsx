import { useState, type FC } from 'react';

interface DeleteAccountFormProps {
  onDeleteAccount: () => void;
  isDeleting?: boolean;
}

const DeleteAccountForm: FC<DeleteAccountFormProps> = ({
  onDeleteAccount,
  isDeleting = false,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    onDeleteAccount();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-2">Delete Account</h3>
        <p className="text-gray-400 text-xs xs:text-sm">
          Permanently delete your account and all associated data
        </p>
      </div>

      {/* Action Button */}
      <div>
        {!showConfirmation ? (
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="px-4 xs:px-5 py-2 xs:py-2.5 bg-red-900/20 border border-[#DE0500] text-[#DE0500] text-xs xs:text-sm font-medium rounded-lg hover:bg-red-900/30 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-2 xs:space-y-3">
            <p className="text-red-400 text-xs xs:text-sm font-medium">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="px-4 xs:px-5 py-2 xs:py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs xs:text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 xs:px-5 py-2 xs:py-2.5 border border-white/10 text-white text-xs xs:text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DeleteAccountForm;
