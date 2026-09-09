import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { FaFacebook, FaRegComment, FaShare, FaThumbsUp } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

export interface FacebookPreviewProps {
  facebookStatus: any | null;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const FacebookPreview: React.FC<FacebookPreviewProps> = ({ facebookStatus, postData }) => {
  const facebookPages = facebookStatus?.pages;
  const primaryPage = facebookPages && facebookPages.length > 0 ? facebookPages[0] : null;
  const displayName = primaryPage?.name || 'Startup Ninja Page';
  const displayAvatar = primaryPage?.picture || null;
  const displayCategory = primaryPage?.category || 'Business';

  return (
    <div className="w-full max-w-lg mx-auto bg-[#242526] border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center overflow-hidden w-10 h-10">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : facebookStatus?.connected ? (
              <FaFacebook className="text-white w-5 h-5" />
            ) : (
              <span className="text-white font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="text-white text-sm font-semibold">
              {facebookStatus?.connected ? displayName : 'Startup Ninja Page'}
            </div>
            <div className="text-gray-400 text-xs">
              {facebookStatus?.connected ?
                `just now • ${displayCategory} Page` :
                '⚠️ Not Connected'
              }
            </div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className="text-gray-400 w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="text-white leading-relaxed mb-3 text-base whitespace-pre-wrap break-words">
          {postData.content ? (
            <span>{renderRichText(postData.content, 'fb')}</span>
          ) : (
            <span className="text-gray-400">What's on your mind?</span>
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
      ) : (
        <div className="w-full bg-gray-800 h-64"></div>
      )}

      <div className="border-t border-gray-700 p-3">
        <div className="flex items-center justify-between text-gray-300">
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FaThumbsUp className="w-5 h-5" />
            <span className="text-base">Like</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FaRegComment className="w-5 h-5" />
            <span className="text-base">Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 rounded transition-colors px-3 py-2">
            <FaShare className="w-5 h-5" />
            <span className="text-base">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacebookPreview;
