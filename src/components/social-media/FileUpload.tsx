import React, { useMemo, useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiX, FiImage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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

                // Relative path, not an absolute http://localhost:5000 URL — an <img> tag
                // loading an absolute cross-origin (and cross-scheme, http vs. this page's
                // https) URL gets blocked by the browser before it ever reaches our code
                // (ERR_BLOCKED_BY_RESPONSE.NotSameOrigin), which is exactly why these
                // thumbnails rendered as broken images. A relative path is same-origin from
                // the browser's point of view — Vite's dev proxy (see vite.config.ts) and the
                // production reverse proxy both forward /api the same way apiClient's own
                // (successful) XHR calls already do.
                const proxySrc = filename ? `/api/imaginative/image/${filename}` : "";
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

const MAX_IMAGES = 4; // Twitter/X's real per-post limit — also the cap LinkedIn's carousel uses here.
const MAX_VIDEO_MB = 100; // Matches the backend Multer limit for Instagram Reels / Facebook video.
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'];

const FileUpload: React.FC<FileUploadProps> = ({ maxSizeMB = 50 }) => {
  const { postData, addFiles, removeFile, clearFiles } = usePost();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [showAddMoreMenu, setShowAddMoreMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!showAddMoreMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (addMoreMenuRef.current && !addMoreMenuRef.current.contains(e.target as Node)) {
        setShowAddMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddMoreMenu]);

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

  const hasVideo = postData.files.some((f) => f.type === 'video');
  const hasImages = postData.files.some((f) => f.type === 'image');

  const addValidatedFiles = (incoming: File[]) => {
    // A post is either up to 4 images or one video (Reel) — never both, matching what
    // Instagram/Facebook's real APIs accept as a single post.
    const video = incoming.find((f) => ACCEPTED_VIDEO_TYPES.includes(f.type));
    if (video) {
      if (hasImages) {
        toast.error('Remove your images first to attach a video');
        return;
      }
      if (video.size / (1024 * 1024) > MAX_VIDEO_MB) {
        toast.error(`${video.name} exceeds the ${MAX_VIDEO_MB}MB video limit`);
        return;
      }
      if (hasVideo) clearFiles();
      addFiles([video]);
      return;
    }

    if (hasVideo) {
      toast.error('Remove the video first to attach images');
      return;
    }

    const room = MAX_IMAGES - postData.files.length;
    if (room <= 0) {
      toast.error(`You can attach up to ${MAX_IMAGES} images per post`);
      return;
    }
    const valid: File[] = [];
    for (const f of incoming) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size / (1024 * 1024) > effectiveMaxMB) {
        toast.error(`${f.name} exceeds the ${effectiveMaxMB}MB limit for your selected platform(s)`);
        continue;
      }
      valid.push(f);
      if (valid.length >= room) break;
    }
    if (incoming.length > room) {
      toast(`Only added ${valid.length} of ${incoming.length} — max ${MAX_IMAGES} images per post`, { icon: 'ℹ️' });
    }
    if (valid.length > 0) addFiles(valid);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addValidatedFiles(Array.from(files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addValidatedFiles(Array.from(files));
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

  const handleGeminiSelect = async (imageUrl: string) => {
    setShowGeminiModal(false);
    if (postData.files.length >= MAX_IMAGES) {
      toast.error(`You can attach up to ${MAX_IMAGES} images per post`);
      return;
    }
    try {
      // Fetch the image and convert to File object
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = `gemini-image-${Date.now()}.png`;
      const file = new File([blob], filename, { type: blob.type });

      addFiles([file]);
      toast.success("Image added");
    } catch (error) {
      console.error("Failed to process image:", error);
      toast.error("Failed to process selected image");
    }
  };

  const canAddMore = !hasVideo && postData.files.length < MAX_IMAGES;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-white text-base md:text-lg font-bold font-plus-jakarta">
          Upload Media {hasImages && `(${postData.files.length}/${MAX_IMAGES})`}
        </h3>
        {postData.files.length > 0 && (
          <button
            type="button"
            onClick={clearFiles}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {postData.files.length > 0 ? (
        /* Thumbnail grid — up to MAX_IMAGES images, each individually removable (this is what makes a carousel post) */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          {postData.files.map((f, i) => (
            <div
              key={f.url}
              className="relative aspect-square bg-[#1E1E1E] border-2 border-dashed border-gray-400 rounded-lg overflow-hidden group"
            >
              {f.type === "image" ? (
                <img src={f.url} alt={f.file.name} className="w-full h-full object-cover" />
              ) : (
                <video src={f.url} className="w-full h-full object-cover" muted controls />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute top-1.5 right-1.5 text-gray-200 hover:text-red-400 transition-colors p-1 bg-black/60 rounded-full"
                title={f.type === "video" ? "Remove video" : "Remove image"}
                aria-label={`Remove ${f.file.name}`}
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
              {f.type === "video" && (
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider bg-[#DE0500] text-white px-1.5 py-0.5 rounded">
                  Reel / Video
                </span>
              )}
              {f.type === "image" && i === 0 && postData.files.length > 1 && (
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider bg-[#DE0500] text-white px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}

          {canAddMore && (
            <div className="relative" ref={addMoreMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddMoreMenu((prev) => !prev);
                }}
                className="w-full aspect-square bg-[#1E1E1E] border-2 border-dashed border-[#454545] hover:border-white hover:bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
                aria-label="Add another image"
              >
                <FiUploadCloud className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-400">Add more</span>
              </button>

              {showAddMoreMenu && (
                <div className="absolute z-20 top-full left-0 mt-1.5 w-40 bg-[#1E1E1E] border border-[#454545] rounded-lg shadow-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddMoreMenu(false);
                      handleButtonClick(e);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs text-white hover:bg-[#2a2a2a] transition-colors"
                  >
                    <FiUploadCloud className="w-4 h-4 text-gray-400" />
                    Browse Files
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddMoreMenu(false);
                      setShowGeminiModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs text-white hover:bg-[#2a2a2a] transition-colors border-t border-[#2a2a2a]"
                  >
                    <FiImage className="w-4 h-4 text-gray-400" />
                    Select AI Image
                  </button>
                </div>
              )}
            </div>
          )}
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
            Up to {MAX_IMAGES} images (JPG/PNG, max {effectiveMaxMB}MB each) — or one video/Reel (MP4/MOV, max {MAX_VIDEO_MB}MB)
            {requiredImage ? " • Instagram requires an image or video" : ""}
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
        accept="image/jpeg,image/png,video/mp4,video/quicktime,video/webm"
        multiple
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
