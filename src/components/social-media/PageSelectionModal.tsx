import React, { useEffect, useState } from 'react';
import { FaFacebook, FaCheck, FaTimes } from 'react-icons/fa';
import facebookService from '../../services/social-media/oauth/facebook';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-hot-toast';

interface PageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  initialSelection: string[];
  userId: string;
}

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture?: string;
}

const PageSelectionModal: React.FC<PageSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelection,
  userId,
}) => {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>(initialSelection);

  useEffect(() => {
    if (isOpen) {
      fetchPages();
      setSelection(initialSelection);
    }
  }, [isOpen]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const status = await facebookService.getConnectionStatus(userId);
      if (status.connected && status.pages) {
        setPages(status.pages);
        // If no existing selection, default to select All
        if (initialSelection.length === 0) {
            setSelection(status.pages.map((p: any) => p.id));
        }
      } else {
        toast.error('No Facebook pages found or not connected.');
        onClose();
      }
    } catch (error) {
      console.error('Failed to fetch pages', error);
      toast.error('Failed to load Facebook pages');
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (id: string) => {
    setSelection(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selection.length === pages.length) {
      setSelection([]);
    } else {
      setSelection(pages.map(p => p.id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1a1a1f]">
          <div className="flex items-center gap-3">
            <FaFacebook className="w-5 h-5 text-[#1877F2]" />
            <h3 className="text-white font-bold text-lg">Select Pages</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
          ) : (
            <div className="space-y-4">
               {/* Select All */}
               <div 
                onClick={toggleAll}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1E1E1E] border border-gray-700 cursor-pointer hover:border-gray-500 transition-colors"
               >
                 <span className="text-white font-medium">Select All Pages</span>
                 <div className={`w-5 h-5 rounded border flex items-center justify-center ${selection.length === pages.length && pages.length > 0 ? 'bg-[#1877F2] border-[#1877F2]' : 'border-gray-500'}`}>
                    {selection.length === pages.length && pages.length > 0 && <FaCheck className="w-3 h-3 text-white" />}
                 </div>
               </div>

               <div className="space-y-2">
                 {pages.map(page => (
                   <div 
                     key={page.id}
                     onClick={() => togglePage(page.id)}
                     className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                       selection.includes(page.id) 
                         ? 'bg-[#1877F2]/10 border-[#1877F2]/50' 
                         : 'bg-[#1E1E1E] border-gray-700 hover:border-gray-500'
                     }`}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                         {page.picture ? (
                           <img 
                            src={page.picture} 
                            alt={page.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(page.name)}&background=random`;
                                if (target.src !== fallback) {
                                  target.src = fallback;
                                }
                            }}
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                             {page.name.charAt(0)}
                           </div>
                         )}
                       </div>
                       <span className="text-gray-200 font-medium">{page.name}</span>
                     </div>
                     
                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                       selection.includes(page.id) ? 'bg-[#1877F2] border-[#1877F2]' : 'border-gray-500'
                     }`}>
                       {selection.includes(page.id) && <FaCheck className="w-2.5 h-2.5 text-white" />}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#1a1a1f] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
                if (selection.length === 0) {
                    toast.error('Please select at least one page');
                    return;
                }
                onConfirm(selection);
            }}
            className="px-6 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSelectionModal;
