import React from 'react';
import { FiSend } from 'react-icons/fi';
import { FaRegComment, FaRegHeart, FaRetweet } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

type DeviceType = 'desktop' | 'mobile';

export interface TwitterPreviewProps {
  selectedDevice: DeviceType;
  twitterStatus: any | null;
  isLoadingTwitter: boolean;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const TwitterPreview: React.FC<TwitterPreviewProps> = ({ selectedDevice, twitterStatus, isLoadingTwitter, postData }) => {
  const twitterUser = twitterStatus?.profile;
  const displayName = twitterUser?.name || 'Startup Ninja';
  const displayScreenName = twitterUser?.screen_name || 'StartupNinja';
  const displayAvatar = twitterUser?.profilePicture;

  return (
    <div className={`w-full mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-lg'
    }`}>
      <div className={`flex items-start gap-3 ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={displayName}
            className={`rounded-full object-cover border border-gray-600 flex-shrink-0 ${
              selectedDevice === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0 ${
          selectedDevice === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
        } ${displayAvatar ? 'hidden' : ''}`}>
          {twitterStatus?.connected ? (
            <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>#</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 ${selectedDevice === 'mobile' ? 'mb-1' : 'mb-2'}`}>
            <span className={`font-bold ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'} ${
              twitterStatus?.connected ? 'text-white' : 'text-gray-400'
            }`}>
              {isLoadingTwitter ? 'Loading...' : displayName}
            </span>
            <span className={`${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'} ${
              twitterStatus?.connected ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {isLoadingTwitter ? 'Checking...' : `@${displayScreenName}`}
            </span>
            <span className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>·</span>
            <span className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>1m</span>
          </div>

          <div className={`leading-relaxed mb-3 ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words ${
            twitterStatus?.connected ? 'text-white' : 'text-gray-500'
          }`}>
            {twitterStatus?.connected ? (
              postData.content ? (
                <span>{renderRichText(postData.content, 'tw')}</span>
              ) : (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              )
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-2">Connect your Twitter account to see preview</div>
                <div className="text-gray-500 text-sm">Go to Connected Accounts to link your Twitter profile</div>
              </div>
            )}
          </div>

          {twitterStatus?.connected && postData.files.length > 0 ? (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-700">
              <img 
                src={postData.files[0].url} 
                alt="Post media" 
                className="w-full h-auto max-h-80 object-cover"
              />
            </div>
          ) : twitterStatus?.connected ? (
            <div className="mb-3 rounded-2xl bg-gray-800 h-48 border border-gray-700"></div>
          ) : null}

          {twitterStatus?.connected && (
            <div className="flex items-center justify-between text-gray-500 max-w-md">
              <button className="flex items-center gap-2 hover:text-blue-400 group">
                <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                  <FaRegComment className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
                <span className={selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}>0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-green-400 group">
                <div className="p-2 rounded-full group-hover:bg-green-400/10">
                  <FaRetweet className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
                <span className={selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}>0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-red-400 group">
                <div className="p-2 rounded-full group-hover:bg-red-400/10">
                  <FaRegHeart className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
                <span className={selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}>0</span>
              </button>
              <button className="hover:text-blue-400 group" aria-label="Share tweet" title="Share tweet">
                <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                  <FiSend className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview;


