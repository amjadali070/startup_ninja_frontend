import React, { useMemo, useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiEdit2 } from 'react-icons/fi';
import { usePost } from './PostContext';
import { IMAGE_SIZE_LIMIT_MB } from '../../constants/platforms';

interface FileUploadProps {
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  maxSizeMB = 50 
}) => {
  const { postData, addFiles, clearFiles } = usePost();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Platform image limits
  const imageLimits: Record<string, number> = useMemo(() => IMAGE_SIZE_LIMIT_MB, []);
  const requiredImage = useMemo(() => postData.selectedPlatforms.includes('instagram'), [postData.selectedPlatforms]);
  const effectiveMaxMB = useMemo(() => {
    const limits = postData.selectedPlatforms.map(p => imageLimits[p]).filter(Boolean) as number[];
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
      if (!first.type.startsWith('image/')) return;
      clearFiles();
      addFiles([first]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const first = files[0];
      if (!first.type.startsWith('image/')) { e.target.value=''; return; }
      // Enforce size
      if (first.size / (1024*1024) > effectiveMaxMB) { e.target.value=''; return; }
      clearFiles();
      addFiles([first]);
      // Clear the input value to allow selecting the same file again
      e.target.value = '';
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
          >
            <FiX className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* File Preview in center */}
          <div className="mb-3 md:mb-4">
            {uploadedFile.type === 'image' ? (
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
            {uploadedFile.file.type} • {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB (max {effectiveMaxMB} MB)
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
            ${isDragOver ? 'border-white bg-[#2a2a2a]' : 'border-[#454545]'} 
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
            Images only (JPG/PNG). Max size: {effectiveMaxMB}MB{requiredImage ? ' • Instagram requires an image' : ''}
          </p>

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
          >
            Browse Files
          </button>
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
    </div>
  );
};

export default FileUpload;