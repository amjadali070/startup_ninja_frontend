import React, { useState } from "react";
import { FaDownload, FaMagic, FaImage } from "react-icons/fa";
import type { GeneratedImage } from "../../../types/admin";

interface GeneratedImagesListViewProps {
  images: GeneratedImage[];
}

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const formatDateTime = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

const GeneratedImagesListView: React.FC<GeneratedImagesListViewProps> = ({
  images,
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());

  const markBroken = (id: string) =>
    setBrokenImageIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  if (!images || images.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No generated images found
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className="group relative bg-[#1A1A1A] rounded-xl border border-[#242424] overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer aspect-square"
            onClick={() => setSelectedImage(image)}
          >
            {brokenImageIds.has(image._id) ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#141414] text-gray-500">
                <FaImage className="text-2xl" />
                <span className="text-[10px] uppercase tracking-wide">Unavailable</span>
              </div>
            ) : (
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={() => markBroken(image._id)}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-sm line-clamp-2 mb-2 font-medium">
                {image.prompt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-300">
                {/* <span className="flex items-center gap-1">
                  <FaRobot className="text-purple-400" />
                  {image.modelUsed.split("/").pop() || "AI"}
                </span> */}
                <span>{formatDate(image.createdAt)}</span>
              </div>
            </div>

            {/* Top Right Badges */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {image.parameters?.aspectRatio && (
                <span className="px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white border border-white/10">
                  {image.parameters.aspectRatio}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div 
            className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-[#333] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-[300px] relative">
              {brokenImageIds.has(selectedImage._id) ? (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                  <FaImage className="text-4xl" />
                  <span className="text-sm">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="max-w-full max-h-[80vh] object-contain"
                  onError={() => markBroken(selectedImage._id)}
                />
              )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-96 p-6 border-l border-[#333] flex flex-col overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                  <FaMagic className="text-purple-500" /> Image Details
                </h3>
                <span className="text-gray-400 text-sm">
                  Created on {formatDateTime(selectedImage.createdAt)}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Prompt</h4>
                  <p className="text-white bg-[#222] p-3 rounded-lg border border-[#333] text-sm leading-relaxed">
                    {selectedImage.prompt}
                  </p>
                </div>

                {selectedImage.parameters?.negativePrompt && (
                  <div>
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Negative Prompt</h4>
                    <p className="text-gray-300 bg-[#222] p-3 rounded-lg border border-[#333] text-sm">
                      {selectedImage.parameters.negativePrompt}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Model</h4>
                    <p className="text-white text-sm">{selectedImage.modelUsed || "Imaginative Ninja"}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Dimensions</h4>
                    <p className="text-white text-sm">{selectedImage.parameters?.aspectRatio || "1:1"}</p>
                  </div>
                  {selectedImage.parameters?.style && (
                    <div>
                      <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Style</h4>
                      <p className="text-white text-sm capitalize">{selectedImage.parameters.style}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Cost</h4>
                    <p className="text-green-400 text-sm font-mono">${selectedImage.cost?.toFixed(4) || "0.0000"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#333] flex gap-3">
                {brokenImageIds.has(selectedImage._id) ? (
                  <button
                    disabled
                    title="Image file is unavailable"
                    className="flex-1 bg-[#2A2A2A] text-gray-500 py-2.5 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Unavailable
                  </button>
                ) : (
                  <a
                    href={selectedImage.imageUrl}
                    download={`image-${selectedImage._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Download
                  </a>
                )}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2.5 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeneratedImagesListView;
