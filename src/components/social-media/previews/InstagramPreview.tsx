import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { FaInstagram, FaRegHeart, FaRegComment, FaRegPaperPlane, FaRegBookmark } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

export interface InstagramPreviewProps {
  instagramStatus: any | null;
  isLoadingInstagram: boolean;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ instagramStatus, isLoadingInstagram, postData }) => {
  const instagramUser = instagramStatus?.profile;
  const displayName = instagramUser?.username || 'startup_ninja';
  const displayAccountType = instagramUser?.account_type || 'Personal';
  const displayAvatar = instagramUser?.profilePicture;

  return (
    <div className="w-full max-w-md mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="rounded-full object-cover border border-gray-600 flex-shrink-0 w-10 h-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center flex-shrink-0 w-10 h-10 ${displayAvatar ? 'hidden' : ''}`}>
            {instagramStatus?.connected ? (
              <span className="text-white font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-white font-bold text-sm">#</span>
            )}
          </div>
          <div>
            <div className={`text-white font-semibold text-sm ${instagramStatus?.connected ? '' : 'text-gray-400'}`}>
              {isLoadingInstagram ? 'Loading...' : displayName}
            </div>
            <div className="text-gray-400 text-xs">
              {isLoadingInstagram ? 'Checking...' :
                instagramStatus?.connected ? `${displayAccountType} Account` : 'Karachi, Pakistan'}
            </div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className="text-white w-5 h-5" />
        </button>
      </div>

      {postData.files.length > 0 ? (
        <div className="relative w-full bg-black flex items-center justify-center">
          {postData.files[0].type === 'video' ? (
            <video
              src={postData.files[0].url}
              controls
              className="w-full h-auto object-cover max-h-[600px]"
            />
          ) : (
            <img
              src={postData.files[0].url}
              alt="Post media"
              className="w-full h-auto object-cover max-h-[600px]"
            />
          )}
          {postData.files.length > 1 && (
            <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              1/{postData.files.length}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full aspect-square bg-gray-900 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <FaInstagram className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Add an image or video to see preview</p>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6">
            <button aria-label="Like post" title="Like post">
              <FaRegHeart className="text-white hover:text-red-500 w-7 h-7" />
            </button>
            <button aria-label="Comment on post" title="Comment on post">
              <FaRegComment className="text-white transform scale-x-[-1] w-7 h-7" />
            </button>
            <button aria-label="Share post" title="Share post">
              <FaRegPaperPlane className="text-white w-7 h-7" />
            </button>
          </div>
          <button aria-label="Save post" title="Save post">
            <FaRegBookmark className="text-white w-7 h-7" />
          </button>
        </div>

        <div className="text-white text-sm font-semibold mb-1">
          0 likes
        </div>
        <div className="text-white leading-relaxed text-base whitespace-pre-wrap break-words">
          <span className="font-semibold">{displayName}</span>{' '}
          {postData.content ? (
            <span>{renderRichText(postData.content, 'ig')}</span>
          ) : (
            <span className="text-gray-400">Write your post content...</span>
          )}
        </div>
        <div className="text-gray-400 text-sm mt-1">
          {instagramStatus?.connected ? '2 hours ago' : 'Connect your account to publish this post'}
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;
