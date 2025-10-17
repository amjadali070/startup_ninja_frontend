import { FC, useEffect, useState } from 'react';

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWebsiteModal: FC<CreateWebsiteModalProps> = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true); // Show modal container immediately
    } else {
      // Wait for close animation to finish, then hide
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        visible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-xl bg-[#1c1c1c] p-6 text-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Create a project</h2>

        <div className="mb-4">
          <label className="block text-sm mb-3">Project Name</label>
          <input
            type="text"
            placeholder="Template"
            className="w-full rounded-md bg-[#131313] border h-12 border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-3">Project Description</label>
          <textarea
            placeholder="Provide a brief description of the project"
            className="w-full rounded-md bg-[#131313] border border-gray-700 px-3 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[#ec2222] text-white font-semibold hover:shadow-lg"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWebsiteModal;
