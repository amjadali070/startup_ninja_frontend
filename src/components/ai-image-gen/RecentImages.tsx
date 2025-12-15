import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrash2, FiDownload, FiX, FiCopy } from 'react-icons/fi';
import { imageGenService, GeneratedImage } from "../../services/imageGenService";
import { toast } from "react-hot-toast";

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
  onDownload: (url: string, filename: string) => void;
}> = ({ image, onClose, onDelete, onDownload }) => {
  if (!image) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success("Prompt copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#151515] border border-[#242424] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white/80 hover:text-white rounded-full transition-colors backdrop-blur-md"
        >
          <FiX size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/3 bg-black/50 flex items-center justify-center p-4 md:p-8 checkered-bg">
          <img 
            src={image.src} 
            alt={image.alt} 
            className="max-w-full max-h-[50vh] md:max-h-[80vh] object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/3 p-5 md:p-6 flex flex-col bg-[#151515] border-t md:border-t-0 md:border-l border-[#242424]">
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 font-plus-jakarta">Image Details</h3>
            <p className="text-xs text-gray-500 font-plus-jakarta">{image.createdAt}</p>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-300 font-plus-jakarta">Prompt</h4>
              <button 
                onClick={copyPrompt}
                className="flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-red-400 transition-colors font-medium px-2 py-1 rounded-md hover:bg-[#DC2626]/10"
              >
                <FiCopy size={12} /> Copy
              </button>
            </div>
            <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#242424] hover:border-[#333] transition-colors group">
              <p className="text-sm text-gray-300 leading-relaxed font-plus-jakarta selection:bg-red-900/30 selection:text-red-200">
                {image.prompt}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-[#242424]">
            <button
                onClick={() => onDownload(image.src, `generated-image-${image.id}.png`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-xl transition-all font-medium text-sm border border-transparent hover:border-[#333]"
            >
                <FiDownload size={16} /> Download
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
  const [selectedImage, setSelectedImage] = useState<PreparedImageItem | null>(null);
  const pageSize = 12;

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await imageGenService.getHistory();
      // Ensure we're setting an array, defaulting to empty if undefined
      const imageList = Array.isArray(data) ? data : (data as any).data || [];
      setImages(imageList);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      // Don't show toast on initial load error to avoid annoyance if it's just empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, shouldRefresh]);

  const handleDelete = async (imageId: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await imageGenService.deleteImage(imageId);
      toast.success("Image deleted");
      if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage(null);
      }
      fetchImages(); // Refresh list
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  const preparedImages: PreparedImageItem[] = useMemo(() => {
    return images.map((img) => {
      // Construct URL using service URL to avoid backend absolute path issues
      const filename = img.localPath ? img.localPath.split('/').pop() : '';
      const serviceUrl = import.meta.env.VITE_IMAGINATIVE_SERVICE_URL || 'http://localhost:3007';
      const src = filename 
        ? `${serviceUrl}/api/imaginative/image/${filename}` 
        : img.imageUrl;

      return {
        id: img._id,
        src,
        alt: img.prompt,
        prompt: img.prompt,
        createdAt: new Date(img.createdAt).toLocaleDateString()
      };
    });
  }, [images]);

  const total = preparedImages.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = preparedImages.slice((page - 1) * pageSize, page * pageSize);

  const ImageCard = ({ image }: { image: PreparedImageItem }) => (
    <article
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-[#242424] bg-[#151515] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-600/50 hover:shadow-xl cursor-pointer"
      onClick={() => setSelectedImage(image)}
    >
      <div className="relative w-full aspect-square">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Actions - Only buttons now, no text */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(image.src, `generated-image-${image.id}.png`);
            }}
            className="pointer-events-auto p-1.5 bg-black/50 hover:bg-black/80 text-white/70 hover:text-white rounded-full transition-colors backdrop-blur-sm"
            title="Download"
          >
            <FiDownload size={14} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(image.id);
            }}
            className="pointer-events-auto p-1.5 bg-black/50 hover:bg-black/80 text-white/70 hover:text-red-500 rounded-full transition-colors backdrop-blur-sm"
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );

  if (loading && images.length === 0) {
    return <div className="text-white/50 text-center py-10 animate-pulse">Loading your masterpieces...</div>;
  }

  if (!loading && images.length === 0) {
    return <div className="text-white/50 text-center py-10">No images generated yet. Create something amazing!</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4 lg:mb-5">
        <h2 className="text-white 
          text-base sm:text-lg md:text-xl lg:text-[20px] 
          font-bold 
          mb-1 sm:mb-2 
          leading-tight font-plus-jakarta">
          Your Recent Images
        </h2>
        <p className="text-[#9CA3AF] 
          text-xs sm:text-sm md:text-base lg:text-[14px] 
          font-normal 
          leading-relaxed font-plus-jakarta lg:leading-[21px]">
          Manage and track all your created images
        </p>
      </div>

      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {pageItems.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-end mt-4 text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span>
              {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:bg-[#FFFFFF0D] border border-[#FFFFFF1A]"
                style={page > 1 ? { background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0px 10.67px 22.22px 0px #7F1D1D80' } : {}}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:bg-[#FFFFFF0D] border border-[#FFFFFF1A]"
                style={page < totalPages ? { background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0px 10.67px 22.22px 0px #7F1D1D80' } : {}}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedImage && (
        <ImageDetailModal 
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default RecentImages;
