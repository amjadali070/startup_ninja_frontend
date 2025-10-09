import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PostFile {
  file: File;
  url: string;
  type: 'image' | 'video';
}

export interface PostData {
  content: string;
  selectedPlatforms: string[];
  files: PostFile[];
}

interface PostContextType {
  postData: PostData;
  updateContent: (content: string) => void;
  updateSelectedPlatforms: (platforms: string[]) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [postData, setPostData] = useState<PostData>({
    content: '',
    selectedPlatforms: [], // Start with no platforms selected
    files: [],
  });

  const updateContent = (content: string) => {
    setPostData(prev => ({ ...prev, content }));
  };

  const updateSelectedPlatforms = (platforms: string[]) => {
    setPostData(prev => ({ ...prev, selectedPlatforms: platforms }));
  };

  const addFiles = (files: File[]) => {
    const newFiles: PostFile[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
    }));
    
    setPostData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const removeFile = (index: number) => {
    setPostData(prev => {
      const newFiles = [...prev.files];
      // Clean up object URL to prevent memory leaks
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const clearFiles = () => {
    setPostData(prev => {
      // Clean up all object URLs
      prev.files.forEach(file => URL.revokeObjectURL(file.url));
      return { ...prev, files: [] };
    });
  };

  return (
    <PostContext.Provider
      value={{
        postData,
        updateContent,
        updateSelectedPlatforms,
        addFiles,
        removeFile,
        clearFiles,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};