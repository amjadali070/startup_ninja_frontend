import { useState } from "react";
import toast from "react-hot-toast";
import { ninjaLegalService, ContractSection } from "../../services/ninja-legal";
import Button from "../Button";
import { FiX, FiRefreshCw } from "react-icons/fi";

interface SectionUpdateModalProps {
  section: ContractSection;
  generatedContractId: string;
  onUpdate: (updatedSection: ContractSection) => void;
  onClose: () => void;
}

const SectionUpdateModal = ({
  section,
  generatedContractId,
  onUpdate,
  onClose,
}: SectionUpdateModalProps) => {
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!userFeedback.trim()) {
      toast.error("Please provide feedback for the section update");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await ninjaLegalService.updateContractSection(
        generatedContractId,
        section.id,
        { userFeedback }
      );

      if (response.success && response.data) {
        const updatedSection: ContractSection = {
          ...section,
          content: response.data.content,
          updatedAt: response.data.updatedAt,
        };
        toast.success("Section updated successfully!");
        setTimeout(() => {
          onUpdate(updatedSection);
        }, 1000);
      } else {
        toast.error(response.message || "Failed to update section");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating section");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FiRefreshCw className="w-5 h-5 text-amber-500" />
              Update Section: {section.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
          >
            <FiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Current Section Content */}
          <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 space-y-2">
            <h3 className="text-white font-medium text-sm">Current Content:</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {section.content}
            </p>
          </div>

          {/* Feedback Input */}
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Describe the changes you'd like to make:
            </label>
            <textarea
              value={userFeedback}
              onChange={(e) => {
                setUserFeedback(e.target.value);
              }}
              placeholder="E.g., 'Make this section more concise', 'Add clause about liability limits', 'Simplify the legal language'..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                         placeholder-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
              disabled={isUpdating}
            />
          </div>

          {/* Info Box */}
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
            <p className="text-amber-400 text-sm leading-relaxed">
              💡 <strong>Tip:</strong> Be specific about the changes you want. For example:
              "Add a clause about confidentiality obligations" or "Make the language simpler and more concise".
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700 bg-gray-800/50 sticky bottom-0">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isUpdating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || !userFeedback.trim()}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                Updating...
              </span>
            ) : (
              "Update Section"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionUpdateModal;
