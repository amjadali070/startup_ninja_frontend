import { useState } from "react";
import toast from "react-hot-toast";
import { ContractSection, ninjaLegalService } from "../../services/ninja-legal";
import Button from "../Button";
import LoadingSpinner from "../LoadingSpinner";
import { FiZap, FiDownload, FiRefreshCw, FiEdit2, FiX } from "react-icons/fi";

interface SectionUpdateModalProps {
  section: ContractSection;
  generatedContractId: string;
  onUpdate: (updatedSection: ContractSection) => void;
  onClose: () => void;
}

// Inline SectionUpdateModal Component
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
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FiRefreshCw className="w-5 h-5 text-amber-500" />
            Update Section: {section.title}
          </h2>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
          >
            <FiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 space-y-2">
            <h3 className="text-white font-medium text-sm">Current Content:</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {section.content}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Describe the changes you'd like to make:
            </label>
            <textarea
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="E.g., 'Make this section more concise', 'Add clause about liability limits'..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                         placeholder-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
              disabled={isUpdating}
            />
          </div>
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
            <p className="text-amber-400 text-sm leading-relaxed">
              💡 <strong>Tip:</strong> Be specific about changes. For example: "Add clause about confidentiality" or "Simplify language".
            </p>
          </div>
        </div>
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
                <LoadingSpinner />
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

interface GeneratedContractModalProps {
  generatedContract: {
    generatedContractId: string;
    sections: ContractSection[];
    startDate: string;
    headerLogo?: string | null;
    footerText?: string | null;
  };
  onGenerateNew: () => void;
}

export const GeneratedContractModal = ({
  generatedContract,
  onGenerateNew,
}: GeneratedContractModalProps) => {
  const [sections, setSections] = useState<ContractSection[]>(
    generatedContract.sections
  );
  const [selectedSection, setSelectedSection] = useState<ContractSection | null>(
    null
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const handleSectionUpdate = (updatedSection: ContractSection) => {
    setSections(
      sections.map((s) =>
        s.id === updatedSection.id ? updatedSection : s
      )
    );
    setShowUpdateModal(false);
    setSelectedSection(null);
  };

  const handleEditSection = (section: ContractSection) => {
    setSelectedSection(section);
    setShowUpdateModal(true);
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    toast.loading("PDF download coming soon!");
  };

  return (
    <div className="space-y-6">

      {/* Header with Actions */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FiZap className="w-5 h-5 text-amber-500" />
              Generated Contract
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Effective Date: {new Date(generatedContract.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={onGenerateNew}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              New Generation
            </Button>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            onMouseEnter={() => setHoveredSectionId(section.id)}
            onMouseLeave={() => setHoveredSectionId(null)}
            className="relative group bg-gray-800/50 border border-gray-700 rounded-lg p-6
                       hover:border-amber-500 transition-all duration-200"
          >
            {/* Section Number Badge */}
            <div className="absolute top-4 left-4 bg-amber-600/20 text-amber-400 rounded-full
                          w-8 h-8 flex items-center justify-center font-semibold text-sm">
              {section.order}
            </div>

            {/* Section Header */}
            <div className="pr-20 mb-4">
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              {section.updatedAt && (
                <p className="text-gray-500 text-xs mt-1">
                  Updated: {new Date(section.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Section Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm max-h-40 overflow-hidden">
                {section.content}
              </p>
            </div>

            {/* Hover Edit Button */}
            {hoveredSectionId === section.id && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEditSection(section)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg
                           flex items-center gap-2 transition-colors text-sm font-medium"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Update with AI
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section Update Modal */}
      {showUpdateModal && selectedSection && (
        <SectionUpdateModal
          section={selectedSection}
          generatedContractId={generatedContract.generatedContractId}
          onUpdate={handleSectionUpdate}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedSection(null);
          }}
        />
      )}
    </div>
  );
};

export default GeneratedContractModal;
