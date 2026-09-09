import React from 'react';
import { FiSend } from 'react-icons/fi';
import { FaRegComment, FaRegHeart, FaRetweet } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

export interface TwitterPreviewProps {
  twitterStatus: any | null;
  isLoadingTwitter: boolean;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const TwitterPreview: React.FC<TwitterPreviewProps> = ({ twitterStatus, isLoadingTwitter, postData }) => {
  const twitterUser = twitterStatus?.profile;
  const displayName = twitterUser?.name || 'Startup Ninja';
  const displayScreenName = twitterUser?.screen_name || 'StartupNinja';
  const displayAvatar = twitterUser?.profilePicture;

  return (
    <div className="w-full max-w-lg mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={displayName}
            className="rounded-full object-cover border border-gray-600 flex-shrink-0 w-12 h-12"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0 w-12 h-12 ${displayAvatar ? 'hidden' : ''}`}>
          {twitterStatus?.connected ? (
            <span className="text-white font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className="text-white font-bold text-sm">#</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-bold text-base ${twitterStatus?.connected ? 'text-white' : 'text-gray-400'}`}>
              {isLoadingTwitter ? 'Loading...' : displayName}
            </span>
            <span className={`text-sm ${twitterStatus?.connected ? 'text-gray-500' : 'text-gray-600'}`}>
              {isLoadingTwitter ? 'Checking...' : `@${displayScreenName}`}
            </span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">1m</span>
          </div>

          <div className="leading-relaxed mb-3 text-base whitespace-pre-wrap break-words text-white">
            {postData.content ? (
              <span>{renderRichText(postData.content, 'tw')}</span>
            ) : (
              <span className="text-gray-500">Write your post content...</span>
            )}
          </div>

          {postData.files.length > 0 ? (
            <div className="relative mb-3 rounded-2xl overflow-hidden border border-gray-700">
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

          {!twitterStatus?.connected && (
            <div className="text-gray-500 text-xs mb-2">Connect your account to publish this post</div>
          )}
          <div className="flex items-center justify-between text-gray-500 max-w-md">
            <button className="flex items-center gap-2 hover:text-blue-400 group">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <FaRegComment className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-400 group">
              <div className="p-2 rounded-full group-hover:bg-green-400/10">
                <FaRetweet className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-400 group">
              <div className="p-2 rounded-full group-hover:bg-red-400/10">
                <FaRegHeart className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="hover:text-blue-400 group" aria-label="Share tweet" title="Share tweet">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <FiSend className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview;
