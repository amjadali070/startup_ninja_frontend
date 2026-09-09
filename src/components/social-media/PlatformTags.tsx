import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { usePost } from './PostContext';
import { useAuth } from '../../hooks/useAuth';
import { PLATFORM_LIST } from '../../constants/platforms';
import facebookService from '../../services/social-media/oauth/facebook';
import PageSelectionModal from './PageSelectionModal';

const PlatformTags: React.FC = () => {
  const { postData, updateSelectedPlatforms, updateTargetAccounts } = usePost();
  const { user } = useAuth();
  const [isFbModalOpen, setIsFbModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const platforms = PLATFORM_LIST;

  const handlePlatformClick = async (platformId: string) => {
    const isSelected = postData.selectedPlatforms.includes(platformId);

    // If unselecting, just remove it
    if (isSelected) {
      const newPlatforms = postData.selectedPlatforms.filter(id => id !== platformId);
      updateSelectedPlatforms(newPlatforms);
      return;
    }

    // Selecting Facebook: resolve which page(s) to post to before adding it as a selected platform
    if (platformId === 'facebook') {
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        const status = await facebookService.getConnectionStatus(user.id);

        if (!status.connected) {
          toast.error('Please connect your Facebook account first');
          return;
        }

        if (status.pages && status.pages.length > 0) {
          if (status.pages.length === 1) {
            // Auto-select the only page
            updateTargetAccounts('facebook', [status.pages[0].id]);
            updateSelectedPlatforms([...postData.selectedPlatforms, platformId]);
            toast.success(`Selected page: ${status.pages[0].name}`);
          } else {
            // Open modal for multiple pages
            setIsFbModalOpen(true);
            // We don't add to selectedPlatforms yet; wait for modal confirmation
          }
        } else {
          toast.error('No Facebook pages found');
        }
      } catch (error) {
        console.error('Facebook check failed', error);
        toast.error('Failed to check Facebook status');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Default for other platforms
    updateSelectedPlatforms([...postData.selectedPlatforms, platformId]);
  };

  const handleFbModalConfirm = (selectedIds: string[]) => {
    updateTargetAccounts('facebook', selectedIds);
    updateSelectedPlatforms([...postData.selectedPlatforms, 'facebook']);
    setIsFbModalOpen(false);
    toast.success(`${selectedIds.length} page(s) selected`);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {platforms.map((platform) => {
          const isSelected = postData.selectedPlatforms.includes(platform.id);
          const IconComponent = platform.icon;

          return (
            <button
              key={platform.id}
              onClick={() => !loading && handlePlatformClick(platform.id)}
              disabled={loading}
              className={`relative flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 rounded-xl border transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
                isSelected
                  ? `${platform.colors.selectedBg} ${platform.colors.selectedBorder} ${platform.colors.textColor}`
                  : `${platform.colors.unselectedBg} ${platform.colors.unselectedBorder} ${platform.colors.textColor}/70 hover:${platform.colors.textColor} hover:${platform.colors.selectedBorder}`
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Checkmark icon for selected platforms */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-green-600 rounded-full flex items-center justify-center">
                  <FaCheck className="w-2.5 h-2.5 text-white" />
                </div>
              )}

              <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${platform.colors.iconColor} ${isSelected ? 'opacity-100' : 'opacity-70'}`} />
              <span className="text-xs sm:text-sm md:text-base font-medium">{platform.name}</span>
            </button>
          );
        })}
      </div>

      <PageSelectionModal
        isOpen={isFbModalOpen}
        onClose={() => setIsFbModalOpen(false)}
        onConfirm={handleFbModalConfirm}
        initialSelection={postData.targetAccounts['facebook'] || []}
        userId={user?.id || ''}
      />
    </>
  );
};

export default PlatformTags;
