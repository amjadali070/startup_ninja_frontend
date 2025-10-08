import React, { useState, useRef } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

interface FileUploadProps {
  onFileSelect?: (files: FileList) => void;
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect,
  maxSizeMB = 50 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* File Upload Drop Zone */}
      <div
        className={`
          relative w-full 
          bg-[#1E1E1E] 
          border-2 border-dashed 
          ${isDragOver ? 'border-white bg-[#2a2a2a]' : 'border-gray-400'} 
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
          <FiUploadCloud className="w-8 h-8 md:w-10 md:h-10 text-white mx-auto" />
        </div>

        <h3 className="text-white text-sm md:text-base font-bold mb-2 md:mb-3">
          Choose a file or drag & drop it here
        </h3>

        <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4">
          JPEG, PNG, PDG, and MP4 formats, up to {maxSizeMB}MB
        </p>

        <button
          type="button"
          onClick={handleBrowseClick}
          className="inline-flex items-center justify-center 
                     bg-[#1E1E1E] border border-gray-400 
                     hover:bg-[#2a2a2a] hover:border-white 
                     text-white 
                     px-3 py-2 md:px-4 md:py-2.5
                     rounded-lg 
                     text-xs md:text-sm
                     font-medium 
                     transition-all duration-200
                     min-h-[36px] md:min-h-[40px]"
        >
          Browse Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpeg,.jpg,.png,.pdf,.mp4"
          multiple
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default FileUpload;