import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiDownload,
  FiX,
  FiCopy,
  FiImage,
  FiLoader,
} from "react-icons/fi";
import {
  imageGenService,
  GeneratedImage,
} from "../../services/imageGenService";
import { toast } from "react-hot-toast";
import AlertModal from "../AlertModal";
import LoadingSpinner from "../LoadingSpinner";

type RecentImagesProps = {
  shouldRefresh?: boolean;
};

type PreparedImageItem = {
  id: string;
  src: string;
  alt: string;
  prompt: string;
  createdAt: string;
};

// Modal Component
const ImageDetailModal: React.FC<{
  image: PreparedImageItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDownload: (imageId: string, filename: string) => void;
  isDownloading: boolean;
}> = ({ image, onClose, onDelete, onDownload, isDownloading }) => {
  if (!image) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success("Prompt copied to clipboard");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[85vh] md:h-auto md:max-h-[90vh] bg-[#151515] border border-[#242424] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white/80 hover:text-white rounded-full transition-colors backdrop-blur-md"
          title="Close"
          aria-label="Close image details"
        >
          <FiX size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/3 h-[40%] md:h-auto bg-black/50 flex items-center justify-center p-4 md:p-8 checkered-bg shrink-0">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/3 h-[60%] md:h-auto p-5 md:p-6 flex flex-col bg-[#151515] border-t md:border-t-0 md:border-l border-[#242424] overflow-hidden">
          <div className="mb-4 shrink-0">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 font-plus-jakarta">
              Image Details
            </h3>
            <p className="text-xs text-gray-500 font-plus-jakarta">
              {image.createdAt}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar min-h-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-300 font-plus-jakarta">
                Prompt
              </h4>
              <button
                onClick={copyPrompt}
                className="flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-red-400 transition-colors font-medium px-2 py-1 rounded-md hover:bg-[#DC2626]/10"
              >
                <FiCopy size={12} /> Copy
              </button>
            </div>
            <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#242424] hover:border-[#333] transition-colors group">
              <p className="text-sm text-gray-300 leading-relaxed font-plus-jakarta selection:bg-red-900/30 selection:text-red-200 break-words">
                {image.prompt}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-[#242424] shrink-0">
            <button
              onClick={() =>
                onDownload(image.id, `generated-image-${image.id}.png`)
              }
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-xl transition-all font-medium text-sm border border-transparent hover:border-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <FiLoader size={16} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FiDownload size={16} /> Download
                </>
              )}
            </button>
            <button
              onClick={() => onDelete(image.id)}
              className="flex items-center justify-center p-2.5 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-xl transition-all"
              title="Delete Image"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentImages: React.FC<RecentImagesProps> = ({ shouldRefresh }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<PreparedImageItem | null>(
    null
  );
  
  const [pageSize, setPageSize] = useState(window.innerWidth >= 1024 ? 10 : 8);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth >= 1024 ? 10 : 8);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [paginationInfo, setPaginationInfo] = useState<{
    currentPage: number;
    totalPages: number;
    totalCount: number;
  }>({ currentPage: 1, totalPages: 1, totalCount: 0 });

  const fetchImages = useCallback(async (pageNum: number) => {
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
      setPaginationInfo({
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalCount: paginationData.totalCount
      });
      
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchImages(page);
  }, [fetchImages, page, shouldRefresh]);

  
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingImages, setDownloadingImages] = useState<Set<string>>(new Set());

  const handleDeleteClick = (imageId: string) => {
    setImageToDelete(imageId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      setIsDeleting(true);
      await imageGenService.deleteImage(imageToDelete);
      toast.success("Image deleted");
      if (selectedImage && selectedImage.id === imageToDelete) {
        setSelectedImage(null);
      }
      fetchImages(page); // Refresh list
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const handleDownload = async (imageId: string, filename: string) => {
    // Prevent multiple simultaneous downloads of the same image
    if (downloadingImages.has(imageId)) {
      return;
    }

    try {
      // Mark as downloading
      setDownloadingImages(prev => new Set(prev).add(imageId));
      
      // Use backend proxy to bypass CORS
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const downloadUrl = `${apiBase}/imaginative/download/${imageId}`;
      
      const token = localStorage.getItem('token');
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download complete");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    } finally {
      // Remove from downloading set
      setDownloadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const preparedImages: PreparedImageItem[] = useMemo(() => {
    return images.map((img) => {
      // Construct URL using service URL to avoid backend absolute path issues
      const filename = img.localPath ? img.localPath.split("/").pop() : "";

      let serviceUrl = import.meta.env.VITE_IMAGINATIVE_SERVICE_URL;
      if (!serviceUrl) {
        // Fallback to API Gateway URL if service URL is not explicitly set
        const apiBase =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        serviceUrl = apiBase.replace(/\/api\/?$/, "");
      }

      const src = filename
        ? `${serviceUrl}/api/imaginative/image/${filename}`
        : img.imageUrl;

      return {
        id: img._id,
        src,
        alt: img.prompt,
        prompt: img.prompt,
        createdAt: new Date(img.createdAt).toLocaleDateString(),
      };
    });
  }, [images]);

  // Use pagination info from server
  const total = paginationInfo.totalCount;
  const totalPages = paginationInfo.totalPages;
  
  // Directly use preparedImages as they are already the page items
  const pageItems = preparedImages;

  const ImageCard = ({ image }: { image: PreparedImageItem }) => (
    <article
      className="group relative overflow-hidden rounded-2xl bg-[#121212] border border-[#242424] hover:border-gray-700 cursor-pointer"
      onClick={() => setSelectedImage(image)}
    >
        <div className="relative h-full w-full rounded-2xl bg-[#121212] overflow-hidden">
            <div className="relative w-full aspect-square overflow-hidden">
                <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                />

                {/* Overlay only on hover for text legibility */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.id, `generated-image-${image.id}.png`);
                    }}
                    disabled={downloadingImages.has(image.id)}
                    className="p-2 bg-black/60 hover:bg-[#333] text-white rounded-xl backdrop-blur-md border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={downloadingImages.has(image.id) ? "Downloading..." : "Download"}
                >
                    {downloadingImages.has(image.id) ? (
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FiDownload className="w-3.5 h-3.5" />
                    )}
                </button>

                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(image.id);
                    }}
                    className="p-2 bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 rounded-xl backdrop-blur-md border border-white/10 hover:border-red-500/30"
                    title="Delete"
                >
                    <FiTrash2 className="w-3.5 h-3.5" />
                </button>
                </div>

                {/* Prompt Preview on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-xs text-gray-200 line-clamp-2 font-medium drop-shadow-md">
                        {image.prompt}
                    </p>
                </div>
            </div>
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (!loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-[#242424] rounded-2xl bg-[#121212] border-dashed">
        <div className="p-4 bg-[#1E1E1E] rounded-full mb-4">
            <FiImage className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No images yet</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Your creative journey starts here. Use the generator above to create your first masterpiece!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-6 border-b border-[#242424] pb-4">
        <div>
            <h2 className="text-xl font-bold text-white mb-1 font-plus-jakarta tracking-tight">
             Library
            </h2>
            <p className="text-sm text-gray-400 font-medium">
            {total} {total === 1 ? 'masterpiece' : 'masterpieces'} created
            </p>
        </div>
        
        {/* Simple Pagination Indicator */}
        {total > 0 && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Page {page} of {totalPages}
            </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {pageItems.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>

      {total > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-10">
          <div className="flex items-center gap-2 bg-[#121212] border border-[#242424] p-1.5 rounded-xl shadow-xl">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="px-4 text-sm font-bold text-white">
                  {page} <span className="text-gray-600 font-normal mx-1">/</span> {totalPages}
              </div>

              <button
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDeleteClick}
          onDownload={handleDownload}
          isDownloading={downloadingImages.has(selectedImage.id)}
        />
      )}

      {/* Alert Modal for Deletion UI is handled by parent/state */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Artwork"
        message="Are you sure you want to delete this artwork? This action cannot be undone and the image will be lost forever."
        type="danger"
        action="delete"
        confirmText="Delete Forever"
        cancelText="Keep it"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default RecentImages;
