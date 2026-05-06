import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { ContractSection, ninjaLegalService } from "../../services/ninja-legal";
import LoadingSpinner from "../LoadingSpinner";
import { FiDownload, FiEdit2, FiX, FiRefreshCw } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface GeneratedContractPreviewProps {
  generatedContract: {
    generatedContractId: string;
    sections: ContractSection[];
    startDate: string;
    headerLogo?: string | null;
    footerText?: string | null;
  };
  onGenerateNew: () => void;
}

export const GeneratedContractPreview = ({
  generatedContract,
  onGenerateNew,
}: GeneratedContractPreviewProps) => {
  const [sections, setSections] = useState<ContractSection[]>(
    generatedContract.sections
  );
  const [selectedSection, setSelectedSection] = useState<ContractSection | null>(null);
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleEditSection = (section: ContractSection) => {
    setSelectedSection(section);
    setUserFeedback("");
    setShowFeedbackForm(true);
  };

  const handleUpdateSection = async () => {
    if (!selectedSection || !userFeedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await ninjaLegalService.updateContractSection(
        generatedContract.generatedContractId,
        selectedSection.id,
        { userFeedback }
      );

      if (response.success && response.data) {
        const updatedSections = sections.map((s) =>
          s.id === selectedSection.id
            ? {
                ...s,
                content: response.data!.content,
                updatedAt: response.data!.updatedAt,
              }
            : s
        );
        setSections(updatedSections);
        toast.success("Section updated successfully!");
        setShowFeedbackForm(false);
        setSelectedSection(null);
      } else {
        toast.error(response.message || "Failed to update section");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating section");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) {
      toast.error("PDF reference not found");
      return;
    }

    try {
      setIsDownloading(true);
      const element = pdfRef.current;
      const containerElement = element.parentElement;

      // Store original styles
      const originalStyles = {
        elementAspectRatio: element.style.aspectRatio,
        elementMaxHeight: element.style.maxHeight,
        elementHeight: element.style.height,
        elementOverflow: element.style.overflow,
        elementMaxWidth: element.style.maxWidth,
        containerOverflow: containerElement?.style.overflow,
        containerHeight: containerElement?.style.height,
      };

      // Get the inner scrollable content div
      const contentDiv = element.querySelector(
        ".flex-1.overflow-y-auto"
      ) as HTMLElement;
      const contentOriginalScroll = contentDiv?.style.overflow;

      // Temporarily remove all constraints
      if (element) {
        element.style.aspectRatio = "auto";
        element.style.maxHeight = "none";
        element.style.height = "auto";
        element.style.overflow = "visible";
        element.style.maxWidth = "none";
      }

      if (containerElement) {
        containerElement.style.overflow = "visible";
        containerElement.style.height = "auto";
      }

      if (contentDiv) {
        contentDiv.style.overflow = "visible";
      }

      // Force a reflow to ensure all content is rendered
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Generate canvas with full content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
      });

      // Restore original styles
      if (element) {
        element.style.aspectRatio = originalStyles.elementAspectRatio;
        element.style.maxHeight = originalStyles.elementMaxHeight;
        element.style.height = originalStyles.elementHeight;
        element.style.overflow = originalStyles.elementOverflow;
        element.style.maxWidth = originalStyles.elementMaxWidth;
      }

      if (containerElement) {
        containerElement.style.overflow = originalStyles.containerOverflow || "";
        containerElement.style.height = originalStyles.containerHeight || "";
      }

      if (contentDiv) {
        contentDiv.style.overflow = contentOriginalScroll || "";
      }

      // Create PDF from canvas
      // const imgData = canvas.toDataURL("image/png");
      
      // Calculate PDF dimensions (letter size)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const leftMargin = 2;
      const topMargin = 5;
      const bottomMargin = 5;
      
      // Calculate image dimensions based on page width
      const imgWidth = pageWidth - leftMargin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Available height per page accounting for margins
      const availableHeight = pageHeight - topMargin - bottomMargin;
      
      // Calculate how many pages we need
      const totalPages = Math.ceil(imgHeight / availableHeight);
      
      // Add each page
      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }
        
        // Calculate the vertical offset for this page
        const yOffset = pageNum * availableHeight;
        const remainingHeight = imgHeight - yOffset;
        const heightToPrint = Math.min(availableHeight, remainingHeight);
        
        // Calculate the corresponding section in the original canvas
        const sourceY = (yOffset / imgHeight) * canvas.height;
        const sourceHeight = (heightToPrint / imgHeight) * canvas.height;
        
        // Create a temporary canvas for this section
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, sourceY,
            canvas.width, sourceHeight,
            0, 0,
            canvas.width, sourceHeight
          );
        }
        
        // Add this section to the PDF with proper margins
        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", leftMargin, topMargin, imgWidth, heightToPrint);
      }

      // Save the PDF
      const fileName = `contract_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success("Contract downloaded successfully!");
    } catch (error: any) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF: " + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Action Bar with Enhanced Design */}
      <div className="flex gap-2 justify-between items-center px-2">
        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
          {sections.length} Sections • {new Date(generatedContract.startDate).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </button>
          <button
            onClick={onGenerateNew}
            className="h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-widest transition-all active:scale-95"
          >
            <FiRefreshCw className="w-4 h-4" />
            New Version
          </button>
        </div>
      </div>

      {/* PDF Document Preview with Enhanced Styling */}
      <div className="flex-1 flex justify-center overflow-auto px-4 py-3 bg-gradient-to-br from-black/20 to-black/10 rounded-3xl">
        <div
          ref={pdfRef}
          className="w-full max-w-2xl aspect-[1/1.4] bg-white rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] transition-all duration-300"
        >
          {/* Document Header */}
          <div className="p-8 pb-6 border-b-2 border-gray-200 flex flex-col justify-between flex-shrink-0 bg-gradient-to-b from-gray-50 to-white relative">
            {/* Subtle watermark */}
            <div className="absolute top-2 right-4 text-gray-100 font-black text-xs opacity-50">DRAFT</div>
            
            <div className="flex items-start justify-between">
              {/* Company Branding / Logo */}
              <div className="flex-1">
                {generatedContract.headerLogo ? (
                  <img
                    src={generatedContract.headerLogo}
                    alt="Company Logo"
                    className="h-14 object-contain drop-shadow-sm"
                  />
                ) : (
                  <div className="space-y-1">
                    <p className="font-black text-lg tracking-widest text-gray-900">CONTRACT</p>
                    <p className="text-[10px] text-gray-400 font-bold spacing-widest">AGREEMENT</p>
                  </div>
                )}
              </div>
              {/* Effective Date Badge */}
              <div className="text-right bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl px-6 py-4 border border-red-200 shadow-sm">
                <p className="text-[8px] font-black text-red-700 uppercase tracking-[0.2em]">Effective Date</p>
                <p className="text-base font-black text-gray-900 mt-1">
                  {new Date(generatedContract.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Document Content - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-1.5 p-8 bg-white text-gray-900">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">CONTRACT AGREEMENT</h1>
              <div className="flex gap-2">
                <div className="w-16 h-1.5 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                <div className="w-2 h-1.5 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, idx) => (
              <div key={section.id} className="group/section relative py-1.5">
                {/* Section Header */}
                <div className="flex items-start gap-4 mb-3.5">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-xl font-black text-sm shadow-lg">
                      {section.order}
                    </div>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-[0.05em]">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="ml-14 space-y-2.5">
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                    {section.content.split("\n").slice(0, 12).join("\n")}
                    {section.content.split("\n").length > 12 && "\n..."}
                  </p>
                </div>

                {/* Edit Button - Hover State */}
                <button
                  onClick={() => handleEditSection(section)}
                  className="absolute -right-8 top-4 p-1.5 text-red-600 hover:bg-red-600/10 rounded-lg transition-all opacity-0 group-hover/section:opacity-100"
                  title="Edit section"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>

                {/* Divider */}
                {idx < sections.length - 1 && (
                  <div className="mt-6 mb-4 h-px bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
                )}
              </div>
            ))}

            {/* Footer Section */}
            <div className="mt-10 pt-6 space-y-6">
              {generatedContract.footerText && (
                <div className="space-y-3 text-center">
                  <p className="text-[13px] text-gray-700 leading-7 whitespace-pre-wrap">
                    {generatedContract.footerText}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 pt-3">
                <div>
                  <div className="h-8 border-b border-gray-400" />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">Authorized Signature</p>
                  <p className="text-[11px] text-gray-400 mt-1">Name and title</p>
                </div>
                <div className="text-right">
                  <div className="h-8 border-b border-gray-400" />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">Date</p>
                  <p className="text-[11px] text-gray-700 mt-1">
                    {new Date(generatedContract.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* Section Update Form Modal */}
      {showFeedbackForm && selectedSection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/[0.03] rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/[0.03] sticky top-0 bg-[#121212]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiRefreshCw className="w-5 h-5 text-red-500" />
                Refine Section
              </h2>
              <button
                onClick={() => setShowFeedbackForm(false)}
                disabled={isUpdating}
                className="p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Current Content */}
              <div className="bg-white/[0.03] border border-white/[0.03] rounded-2xl p-4 space-y-2">
                <h3 className="text-white font-bold text-sm">Current Content:</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedSection.content}
                </p>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">
                  How would you like to refine this section?
                </label>
                <textarea
                  value={userFeedback}
                  onChange={(e) => setUserFeedback(e.target.value)}
                  placeholder="e.g., 'Make this more concise', 'Add liability clause', 'Simplify language'..."
                  rows={5}
                  disabled={isUpdating}
                  className="w-full bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-2xl p-6 text-sm font-medium text-white placeholder-gray-500 outline-none transition resize-none"
                />
              </div>

              {/* Tip Box */}
              <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4">
                <p className="text-red-300 text-sm">
                  💡 <strong>Tip:</strong> Be specific about desired changes for best results.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 md:p-8 border-t border-white/[0.03] bg-[#121212]/50 sticky bottom-0">
              <button
                onClick={() => setShowFeedbackForm(false)}
                disabled={isUpdating}
                className="flex-1 h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-black text-sm text-white disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSection}
                disabled={isUpdating || !userFeedback.trim()}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 rounded-2xl font-black text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    Updating...
                  </span>
                ) : (
                  "Update Section"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedContractPreview;
