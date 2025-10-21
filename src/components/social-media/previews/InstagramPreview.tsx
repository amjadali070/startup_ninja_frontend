import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { FaInstagram, FaRegHeart, FaRegComment, FaRegPaperPlane, FaRegBookmark } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

type DeviceType = 'desktop' | 'mobile';

export interface InstagramPreviewProps {
  selectedDevice: DeviceType;
  instagramStatus: any | null;
  isLoadingInstagram: boolean;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ selectedDevice, instagramStatus, isLoadingInstagram, postData }) => {
  const instagramUser = instagramStatus?.profile;
  const displayName = instagramUser?.username || 'startup_ninja';
  const displayAccountType = instagramUser?.account_type || 'Personal';
  const displayAvatar = instagramUser?.profilePicture;

  return (
    <div className={`w-full mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-md'
    }`}>
      <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-3">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className={`rounded-full object-cover border border-gray-600 flex-shrink-0 ${
                selectedDevice === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center flex-shrink-0 ${
            selectedDevice === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'
          } ${displayAvatar ? 'hidden' : ''}`}>
            {instagramStatus?.connected ? (
              <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>#</span>
            )}
          </div>
          <div>
            <div className={`text-white font-semibold ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'} ${
              instagramStatus?.connected ? '' : 'text-gray-400'
            }`}>
              {isLoadingInstagram ? 'Loading...' : displayName}
            </div>
            <div className={`text-gray-400 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              {isLoadingInstagram ? 'Checking...' : 
                instagramStatus?.connected ? `${displayAccountType} Account` : 'Karachi, Pakistan'}
            </div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className={`text-white ${selectedDevice === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}`} />
        </button>
      </div>

      {instagramStatus?.connected ? (
        postData.files.length > 0 ? (
          <div className="w-full bg-black flex items-center justify-center">
            <img 
              src={postData.files[0].url} 
              alt="Post media" 
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        ) : (
          <div className="w-full aspect-square bg-gray-900 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <FaInstagram className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Add an image to see preview</p>
            </div>
          </div>
        )
      ) : (
        <div className="w-full aspect-square bg-gray-900 flex items-center justify-center">
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">Connect your Instagram account to see preview</div>
            <div className="text-gray-500 text-sm">Go to Connected Accounts to link your Instagram profile</div>
          </div>
        </div>
      )}

      <div className={selectedDevice === 'mobile' ? 'p-3' : 'p-4'}>
        <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'mb-2' : 'mb-3'}`}>
          <div className={`flex items-center ${selectedDevice === 'mobile' ? 'gap-4' : 'gap-6'}`}>
            <button aria-label="Like post" title="Like post">
              <FaRegHeart className={`text-white hover:text-red-500 ${selectedDevice === 'mobile' ? 'w-6 h-6' : 'w-7 h-7'}`} />
            </button>
            <button aria-label="Comment on post" title="Comment on post">
              <FaRegComment className={`text-white transform scale-x-[-1] ${selectedDevice === 'mobile' ? 'w-6 h-6' : 'w-7 h-7'}`} />
            </button>
            <button aria-label="Share post" title="Share post">
              <FaRegPaperPlane className={`text-white ${selectedDevice === 'mobile' ? 'w-6 h-6' : 'w-7 h-7'}`} />
            </button>
          </div>
          <button aria-label="Save post" title="Save post">
            <FaRegBookmark className={`text-white ${selectedDevice === 'mobile' ? 'w-6 h-6' : 'w-7 h-7'}`} />
          </button>
        </div>

        {instagramStatus?.connected && (
          <>
            <div className={`text-white ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'} font-semibold mb-1`}>
              234 likes
            </div>
            <div className={`text-white leading-relaxed ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
              <span className="font-semibold">{displayName}</span>{' '}
              {postData.content ? (
                <span>{renderRichText(postData.content, 'ig')}</span>
              ) : (
                <span className="text-gray-400">Write your post content...</span>
              )}
            </div>
            <div className={`text-gray-400 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'} mt-1`}>
              2 hours ago
            </div>
          </>
        )}

        {!instagramStatus?.connected && (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">Connect your Instagram account to see full preview</div>
            <div className="text-gray-500 text-sm">Your post will appear here once connected</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramPreview;


