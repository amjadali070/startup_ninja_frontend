import React, { useMemo, useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiX, FiEdit2, FiImage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePost } from "./PostContext";
import { IMAGE_SIZE_LIMIT_MB } from "../../constants/platforms";
import {
  imageGenService,
  GeneratedImage,
} from "../../services/imageGenService";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";

interface FileUploadProps {
  maxSizeMB?: number;
}

// Modal for selecting Gemini images
const SelectGeminiImageModal: React.FC<{
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}> = ({ onClose, onSelect }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const fetchImages = async (pageNum: number) => {
    try {
      setLoading(true);
      const data: any = await imageGenService.getHistory(pageNum, pageSize);
      
      const responseData = data.data || [];
      const paginationData = data.pagination || { 
        currentPage: 1, 
        totalPages: 1, 
        totalCount: responseData.length 
      };

      setImages(responseData);
      setTotalPages(paginationData.totalPages);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast.error("Failed to load Gemini images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#151515] border border-[#242424] rounded-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="p-4 border-b border-[#242424] flex justify-between items-center bg-[#1a1a1a] rounded-t-2xl">
          <div>
            <h3 className="text-white font-bold font-plus-jakarta text-lg">
              Select from Imaginative Ninja
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Click an image to select it</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner variant="dark" size="small" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
              <FiImage className="w-10 h-10 opacity-20" />
              <p>No generated images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => {
                let filename = "";
                if (img.localPath) {
                    filename = img.localPath.split(/[/\\]/).pop() || "";
                } else if (img.imageUrl) {
                    filename = img.imageUrl.split('/').pop() || "";
                }

                let serviceUrl = import.meta.env.VITE_IMAGINATIVE_SERVICE_URL;
                if (!serviceUrl) {
                  // Fallback to API Gateway URL if service URL is not explicitly set
                  const apiBase =
                    import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost:5000/api";
                  serviceUrl = apiBase.replace(/\/api\/?$/, "");
                }
                
                // My new logic: ALWAYS use proxy if we have a filename, because direct S3 fails CORS.
                const proxySrc = filename ? `${serviceUrl}/api/imaginative/image/${filename}` : "";
                const srcWithCorsHandling = proxySrc || img.imageUrl;
                
                return (
                  <div
                    key={img._id}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-[#242424] hover:border-red-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-red-900/10"
                    onClick={() => onSelect(srcWithCorsHandling)}
                  >
                    <img
                      src={srcWithCorsHandling}
                      alt={img.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-xs text-white line-clamp-2 font-medium">{img.prompt}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
            <div className="p-4 border-t border-[#242424] bg-[#1a1a1a] rounded-b-2xl flex justify-center">
             <div className="flex items-center gap-2 bg-[#121212] border border-[#242424] p-1.5 rounded-xl">
                 <button
                   disabled={page <= 1}
                   onClick={() => setPage((p) => Math.max(1, p - 1))}
                   className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                   aria-label="Previous page"
                   title="Previous page"
                 >
                   <FiChevronLeft className="w-5 h-5" />
                 </button>
                 
                 <div className="px-4 text-sm font-bold text-white">
                     {page} <span className="text-gray-600 font-normal mx-1">/</span> {totalPages}
                 </div>

                 <button
                   disabled={page >= totalPages}
                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                   className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                   aria-label="Next page"
                   title="Next page"
                 >
                   <FiChevronRight className="w-5 h-5" />
                 </button>
             </div>
            </div>
        )}
      </div>
    </div>
  );
};

const FileUpload: React.FC<FileUploadProps> = ({ maxSizeMB = 50 }) => {
  const { postData, addFiles, clearFiles } = usePost();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Platform image limits
  const imageLimits: Record<string, number> = useMemo(
    () => IMAGE_SIZE_LIMIT_MB,
    []
  );
  const requiredImage = useMemo(
    () => postData.selectedPlatforms.includes("instagram"),
    [postData.selectedPlatforms]
  );
  const effectiveMaxMB = useMemo(() => {
    const limits = postData.selectedPlatforms
      .map((p) => imageLimits[p])
      .filter(Boolean) as number[];
    return limits.length ? Math.min(...limits) : maxSizeMB;
  }, [postData.selectedPlatforms, imageLimits, maxSizeMB]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Only allow single image
      const first = files[0];
      if (!first.type.startsWith("image/")) return;
      clearFiles();
      addFiles([first]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const first = files[0];
      if (!first.type.startsWith("image/")) {
        e.target.value = "";
        return;
      }
      // Enforce size
      if (first.size / (1024 * 1024) > effectiveMaxMB) {
        e.target.value = "";
        return;
      }
      clearFiles();
      addFiles([first]);
      // Clear the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent container
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearFiles();
  };

  const handleChangeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleGeminiSelect = async (imageUrl: string) => {
    setShowGeminiModal(false);
    try {
      // Fetch the image and convert to File object
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = `gemini-image-${Date.now()}.png`;
      const file = new File([blob], filename, { type: blob.type });

      clearFiles();
      addFiles([file]);
      toast.success("Image selected");
    } catch (error) {
      console.error("Failed to process image:", error);
      toast.error("Failed to process selected image");
    }
  };

  const uploadedFile = postData.files[0];

  return (
    <div className="w-full">
      <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-plus-jakarta">
        Upload Media
      </h3>

      {uploadedFile ? (
        /* Show uploaded file with same design structure */
        <div
          className="relative w-full 
                     bg-[#1E1E1E] 
                     border-2 border-dashed border-gray-400
                     rounded-lg 
                     py-6 md:py-8 
                     px-3 md:px-4 
                     flex flex-col items-center justify-center 
                     text-center 
                     transition-all duration-200"
        >
          {/* Remove button in top right corner */}
          <button
            onClick={handleRemoveFile}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition-colors p-1 bg-[#2a2a2a] rounded-full"
            title="Remove file"
            aria-label="Remove uploaded file"
          >
            <FiX className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* File Preview in center */}
          <div className="mb-3 md:mb-4">
            {uploadedFile.type === "image" ? (
              <img
                src={uploadedFile.url}
                alt="Uploaded file"
                className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg border border-gray-600 mx-auto bg-black"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center mx-auto">
                <FiUploadCloud className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            )}
          </div>

          {/* File name */}
          <h3 className="text-white text-sm md:text-base font-bold mb-2 md:mb-3 truncate max-w-full px-4">
            {uploadedFile.file.name}
          </h3>

          {/* File details */}
          <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4">
            {uploadedFile.file.type} •{" "}
            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB (max{" "}
            {effectiveMaxMB} MB)
          </p>

          {/* Change file button */}
          <button
            type="button"
            onClick={handleChangeFile}
            className="inline-flex items-center justify-center gap-2
                       bg-[#1E1E1E] border border-gray-400 
                       hover:bg-[#2a2a2a] hover:border-white 
                       text-white 
                       px-3 py-2 md:px-4 md:py-2.5
                       rounded-lg 
                       text-xs md:text-sm
                       font-medium 
                       transition-all duration-200
                       min-h-[36px] md:min-h-[40px]"
            aria-label="Change uploaded file"
          >
            <FiEdit2 className="w-3 h-3 md:w-4 md:h-4" />
            Change File
          </button>
        </div>
      ) : (
        /* File Upload Drop Zone */
        <div
          className={`
            relative w-full 
            bg-[#1E1E1E] 
            border-2 border-dashed 
            ${isDragOver ? "border-white bg-[#2a2a2a]" : "border-[#454545]"} 
            rounded-lg 
            py-6 md:py-8 
            px-3 md:px-4 
            flex flex-col items-center justify-center 
            text-center 
            transition-all duration-200 
            cursor-pointer
            hover:bg-[#252525]
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="mb-3 md:mb-4">
            <FiUploadCloud className="w-7 h-7 md:w-10 md:h-10 text-white mx-auto" />
          </div>

          <h3 className="text-white text-sm md:text-base font-bold mb-2 md:mb-3">
            Choose a file or drag & drop it here
          </h3>

          <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm mb-3 md:mb-4">
            Images only (JPG/PNG). Max size: {effectiveMaxMB}MB
            {requiredImage ? " • Instagram requires an image" : ""}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleButtonClick}
              className="inline-flex items-center justify-center 
                        bg-[#1E1E1E] border border-[#5a5858] 
                        hover:bg-[#2a2a2a] hover:border-white 
                        text-white 
                        px-3 py-2 md:px-4 md:py-2.5
                        rounded-lg 
                        text-xs md:text-sm
                        font-medium 
                        transition-all duration-200
                        min-h-[36px] md:min-h-[40px]"
              aria-label="Browse local files"
            >
              Browse Files
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowGeminiModal(true);
              }}
              className="inline-flex items-center justify-center gap-2
                        bg-[#DE0500] hover:bg-[#b00400]
                        text-white 
                        px-3 py-2 md:px-4 md:py-2.5
                        rounded-lg 
                        text-xs md:text-sm
                        font-medium 
                        transition-all duration-200
                        min-h-[36px] md:min-h-[40px]"
              aria-label="Select from Imaginative Ninja"
            >
              <FiImage className="w-4 h-4" />
              Select AI Image
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png"
        multiple={false}
        onChange={handleFileSelect}
      />

      {showGeminiModal && (
        <SelectGeminiImageModal
          onClose={() => setShowGeminiModal(false)}
          onSelect={handleGeminiSelect}
        />
      )}
    </div>
  );
};

export default FileUpload;
