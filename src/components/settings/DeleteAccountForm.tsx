import { useState, type FC } from 'react';
import AlertModal from '../AlertModal';

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
    setShowConfirmation(true);
  };

  const handleClose = () => {
    if (!isDeleting) setShowConfirmation(false);
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
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="px-4 xs:px-5 py-4 xs:py-4 bg-red-900/20 border border-[#DE0500] text-[#DE0500] text-xs xs:text-sm font-medium rounded-lg hover:bg-red-900/30 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          Delete Account
        </button>
      </div>

      <AlertModal
        isOpen={showConfirmation}
        onClose={handleClose}
        onConfirm={onDeleteAccount}
        type="danger"
        action="delete"
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmText="Yes, Delete Account"
        isLoading={isDeleting}
      />
    </section>
  );
};

export default DeleteAccountForm;
