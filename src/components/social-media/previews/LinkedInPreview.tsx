import React from 'react';
import { FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { FaLinkedin, FaRegComment, FaRetweet, FaThumbsUp } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

export interface LinkedInPreviewProps {
  linkedinStatus: any | null;
  isLoadingLinkedIn: boolean;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({ linkedinStatus, isLoadingLinkedIn, postData }) => {
  const linkedinUser = linkedinStatus?.connected ? linkedinStatus.profile : null;
  const displayName = linkedinUser?.name || 'Connect LinkedIn Account';
  const displayTitle = linkedinUser?.name ? 'Professional' : 'Connect your account to see preview';
  const displayAvatar = linkedinUser?.profilePicture || null;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#1B1F23] border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="rounded-full object-cover border border-gray-500 w-12 h-12"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center w-12 h-12 ${displayAvatar ? 'hidden' : ''}`}>
            {linkedinStatus?.connected ? (
              <span className="text-white font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FaLinkedin className="text-blue-500 w-6 h-6" />
            )}
          </div>
          <div>
            <div className={`font-semibold text-base ${linkedinStatus?.connected ? 'text-white' : 'text-gray-400'}`}>
              {isLoadingLinkedIn ? 'Loading...' : displayName}
            </div>
            <div className={`text-sm ${linkedinStatus?.connected ? 'text-gray-400' : 'text-gray-500'}`}>
              {isLoadingLinkedIn ? 'Checking connection...' : displayTitle}
            </div>
            {linkedinStatus?.connected && (
              <div className="text-gray-500 text-sm">1h • 🌐</div>
            )}
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className="text-gray-400 w-6 h-6" />
        </button>
      </div>

      <div className="pb-3 px-4">
        <div className="leading-relaxed mb-3 text-base whitespace-pre-wrap break-words text-white">
          {postData.content ? (
            <span>{renderRichText(postData.content, 'li')}</span>
          ) : (
            <span className="text-gray-500">Write your post content...</span>
          )}
        </div>
      </div>

      {postData.files.length > 0 ? (
        <div className="relative w-full bg-gray-800 flex items-center justify-center">
          {postData.files[0].type === 'video' ? (
            <video src={postData.files[0].url} controls className="w-full h-auto max-h-80 object-cover" />
          ) : (
            <img
              src={postData.files[0].url}
              alt="Post media"
              className="w-full h-auto max-h-80 object-cover"
            />
          )}
          {postData.files.length > 1 && (
            <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              1/{postData.files.length}
            </span>
          )}
        </div>
      ) : null}

      <div className="border-t border-gray-700 px-4 py-3">
        {!linkedinStatus?.connected && (
          <div className="text-center pb-2 text-gray-500 text-xs">Connect your account to publish this post</div>
        )}
        <div className="flex items-center justify-around text-gray-300">
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FaThumbsUp className="w-5 h-5" />
            <span className="text-base">Like</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FaRegComment className="w-5 h-5" />
            <span className="text-base">Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FaRetweet className="w-5 h-5" />
            <span className="text-base">Repost</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FiSend className="w-5 h-5" />
            <span className="text-base">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreview;
