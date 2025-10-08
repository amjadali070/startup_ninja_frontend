import React, { useState } from 'react';
import { 
  FaHeart, 
  FaRegHeart, 
  FaRegComment, 
  FaRegBookmark, 
  FaRegPaperPlane,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaChevronDown,
  FaDesktop,
  FaMobile
} from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';
type DeviceType = 'desktop' | 'mobile';

const PostPreview: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('mobile');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const platforms = [
    { id: 'instagram' as Platform, name: 'Instagram Feed Preview', icon: FaInstagram },
    { id: 'facebook' as Platform, name: 'Facebook Post Preview', icon: FaFacebook },
    { id: 'twitter' as Platform, name: 'X Post Preview', icon: FaTwitter },
    { id: 'linkedin' as Platform, name: 'LinkedIn Post Preview', icon: FaLinkedin },
  ];

  const currentPlatform = platforms.find(p => p.id === selectedPlatform);

  const InstagramPreview = () => (
    <div className="w-full max-w-sm mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">#</span>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Startup Ninja</div>
            <div className="text-gray-400 text-xs">Karachi, Pakistan</div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="w-full aspect-square bg-black"></div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button aria-label="Like post" title="Like post">
              <FaHeart className="w-6 h-6 text-red-500" />
            </button>
            <button aria-label="Comment on post" title="Comment on post">
              <FaRegComment className="w-6 h-6 text-white" />
            </button>
            <button aria-label="Share post" title="Share post">
              <FaRegPaperPlane className="w-6 h-6 text-white" />
            </button>
          </div>
          <button aria-label="Save post" title="Save post">
            <FaRegBookmark className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const FacebookPreview = () => (
    <div className="w-full max-w-lg mx-auto bg-[#242526] border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">#</span>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Startup Ninja</div>
            <div className="text-gray-400 text-xs">just now • 🌐</div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className="text-gray-400 w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="text-white text-sm leading-relaxed mb-3">
          <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="w-full h-64 bg-gray-800"></div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-gray-300">
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegHeart className="w-5 h-5" />
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegComment className="w-5 h-5" />
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegPaperPlane className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  const TwitterPreview = () => (
    <div className="w-full max-w-lg mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <div className="w-12 h-12 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">#</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-sm">Startup Ninja</span>
            <span className="text-gray-500 text-sm">@StartupNinja</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">1m</span>
          </div>
          
          <div className="text-white text-sm leading-relaxed mb-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-500 max-w-md">
            <button className="flex items-center gap-2 hover:text-blue-400 group">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <FaRegComment className="w-4 h-4" />
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-400 group">
              <div className="p-2 rounded-full group-hover:bg-green-400/10">
                <FaRegPaperPlane className="w-4 h-4" />
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-400 group">
              <div className="p-2 rounded-full group-hover:bg-red-400/10">
                <FaRegHeart className="w-4 h-4" />
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="hover:text-blue-400 group" aria-label="Share tweet" title="Share tweet">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <FaRegPaperPlane className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const LinkedInPreview = () => (
    <div className="w-full max-w-lg mx-auto bg-[#1B1F23] border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">#</span>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Startup Ninja</div>
            <div className="text-gray-400 text-xs">Founder at Startup Ninja</div>
            <div className="text-gray-500 text-xs">1h • 🌐</div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className="text-gray-400 w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="text-white text-sm leading-relaxed mb-3">
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-4/5"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>

      <div className="w-full h-48 bg-gray-800"></div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-gray-300">
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegHeart className="w-5 h-5" />
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegComment className="w-5 h-5" />
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegPaperPlane className="w-5 h-5" />
            <span className="text-sm">Repost</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded">
            <FaRegPaperPlane className="w-5 h-5" />
            <span className="text-sm">Send</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (selectedPlatform) {
      case 'instagram':
        return <InstagramPreview />;
      case 'facebook':
        return <FacebookPreview />;
      case 'twitter':
        return <TwitterPreview />;
      case 'linkedin':
        return <LinkedInPreview />;
      default:
        return <InstagramPreview />;
    }
  };

  return (
    <div className="w-full bg-[#121212] rounded-2xl p-4 lg:p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-[#1E1E1E] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm font-medium hover:bg-[#2A2A2A] transition-colors"
          >
            {currentPlatform && <currentPlatform.icon className="w-4 h-4" />}
            <span>{currentPlatform?.name}</span>
            <FaChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1E1E1E] border border-gray-600 rounded-lg shadow-lg z-10">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    setSelectedPlatform(platform.id);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-[#2A2A2A] transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <platform.icon className="w-4 h-4" />
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDevice('desktop')}
            className={`p-2.5 rounded-lg border transition-colors ${
              selectedDevice === 'desktop'
                ? 'bg-gray-700 border-gray-500 text-white'
                : 'bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <FaDesktop className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDevice('mobile')}
            className={`p-2.5 rounded-lg border transition-colors ${
              selectedDevice === 'mobile'
                ? 'bg-gray-700 border-gray-500 text-white'
                : 'bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <FaMobile className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center min-h-[400px] bg-[#0A0A0A] rounded-xl p-6">
        {renderPreview()}
      </div>
    </div>
  );
};

export default PostPreview;