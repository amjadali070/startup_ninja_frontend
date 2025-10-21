import React from 'react';
import { FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { FaLinkedin, FaRegComment, FaRetweet, FaThumbsUp } from 'react-icons/fa';
import { renderRichText } from '../../../utils/text';

type DeviceType = 'desktop' | 'mobile';

export interface LinkedInPreviewProps {
  selectedDevice: DeviceType;
  linkedinStatus: any | null;
  isLoadingLinkedIn: boolean;
  postData: { content: string; files: Array<{ url: string; type: 'image'|'video' }>; };
}

const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({ selectedDevice, linkedinStatus, isLoadingLinkedIn, postData }) => {
  const linkedinUser = linkedinStatus?.connected ? linkedinStatus.profile : null;
  const displayName = linkedinUser?.name || 'Connect LinkedIn Account';
  const displayTitle = linkedinUser?.name ? 'Professional' : 'Connect your account to see preview';
  const displayAvatar = linkedinUser?.profilePicture || null;

  return (
    <div className={`w-full mx-auto bg-[#1B1F23] border border-gray-700 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-lg'
    }`}>
      <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-3">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className={`rounded-full object-cover border border-gray-500 ${
                selectedDevice === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center ${
            selectedDevice === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
          } ${displayAvatar ? 'hidden' : ''}`}>
            {linkedinStatus?.connected ? (
              <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FaLinkedin className={`text-blue-500 ${selectedDevice === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}`} />
            )}
          </div>
          <div>
            <div className={`font-semibold ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'} ${
              linkedinStatus?.connected ? 'text-white' : 'text-gray-400'
            }`}>
              {isLoadingLinkedIn ? 'Loading...' : displayName}
            </div>
            <div className={`${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'} ${
              linkedinStatus?.connected ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {isLoadingLinkedIn ? 'Checking connection...' : displayTitle}
            </div>
            {linkedinStatus?.connected && (
              <div className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>1h • 🌐</div>
            )}
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className={`text-gray-400 ${selectedDevice === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}`} />
        </button>
      </div>

      <div className={`pb-3 ${selectedDevice === 'mobile' ? 'px-3' : 'px-4'}`}>
        <div className={`leading-relaxed mb-3 ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words ${
          linkedinStatus?.connected ? 'text-white' : 'text-gray-500'
        }`}>
          {linkedinStatus?.connected ? (
            postData.content ? (
              <span>{renderRichText(postData.content, 'li')}</span>
            ) : (
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
              </div>
            )
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 mb-2">Connect your LinkedIn account to see preview</div>
              <div className="text-gray-500 text-sm">Go to Connected Accounts to link your LinkedIn profile</div>
            </div>
          )}
        </div>
      </div>

      {linkedinStatus?.connected && postData.files.length > 0 ? (
        <div className="w-full bg-gray-800 flex items-center justify-center">
          <img 
            src={postData.files[0].url} 
            alt="Post media" 
            className="w-full h-auto max-h-80 object-cover"
          />
        </div>
      ) : linkedinStatus?.connected ? (
        <div className="w-full bg-gray-800 h-64"></div>
      ) : null}

      {linkedinStatus?.connected && (
        <div className={`border-t border-gray-700 ${selectedDevice === 'mobile' ? 'px-2 py-2' : 'px-4 py-3'}`}>
          <div className="flex items-center justify-around text-gray-300">
            <button className={`flex items-center gap-2 hover:bg-gray-700 rounded transition-colors ${
              selectedDevice === 'mobile' ? 'px-2 py-1.5' : 'px-3 py-2'
            }`}>
              <FaThumbsUp className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}>Like</span>
            </button>
            <button className={`flex items-center gap-2 hover:bg-gray-700 rounded transition-colors ${
              selectedDevice === 'mobile' ? 'px-2 py-1.5' : 'px-3 py-2'
            }`}>
              <FaRegComment className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}>Comment</span>
            </button>
            <button className={`flex items-center gap-2 hover:bg-gray-700 rounded transition-colors ${
              selectedDevice === 'mobile' ? 'px-2 py-1.5' : 'px-3 py-2'
            }`}>
              <FaRetweet className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}>Repost</span>
            </button>
            <button className={`flex items-center gap-2 hover:bg-gray-700 rounded transition-colors ${
              selectedDevice === 'mobile' ? 'px-2 py-1.5' : 'px-3 py-2'
            }`}>
              <FiSend className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInPreview;


