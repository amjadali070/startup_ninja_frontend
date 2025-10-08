import React, { useState } from 'react';
import { 
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
  FaMobile,
  FaShare,
  FaThumbsUp,
  FaRetweet
} from 'react-icons/fa';
import { FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { usePost } from './PostContext';

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'x';
type DeviceType = 'desktop' | 'mobile';

const PostPreview: React.FC = () => {
  const { postData } = usePost();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('mobile');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const allPlatforms = [
    { id: 'instagram' as Platform, name: 'Instagram Feed Preview', icon: FaInstagram },
    { id: 'facebook' as Platform, name: 'Facebook Post Preview', icon: FaFacebook },
    { id: 'x' as Platform, name: 'X Post Preview', icon: FaTwitter },
    { id: 'linkedin' as Platform, name: 'LinkedIn Post Preview', icon: FaLinkedin },
  ];

  // Filter platforms to show only selected ones
  const availablePlatforms = allPlatforms.filter(platform => 
    postData.selectedPlatforms.includes(platform.id)
  );

  // Use the first available platform or fallback to instagram
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(() => {
    return availablePlatforms.length > 0 ? availablePlatforms[0].id : 'instagram';
  });

  // Update selected platform when available platforms change
  React.useEffect(() => {
    if (availablePlatforms.length > 0 && !availablePlatforms.find(p => p.id === selectedPlatform)) {
      setSelectedPlatform(availablePlatforms[0].id);
    }
  }, [postData.selectedPlatforms, availablePlatforms, selectedPlatform]);

  const currentPlatform = allPlatforms.find(p => p.id === selectedPlatform);

  const InstagramPreview = () => (
    <div className={`w-full mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-md'
    }`}>
      <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center ${
            selectedDevice === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>#</span>
          </div>
          <div>
            <div className={`text-white font-semibold ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>Startup Ninja</div>
            <div className={`text-gray-400 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>Karachi, Pakistan</div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className={`text-white ${selectedDevice === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}`} />
        </button>
      </div>

      {/* Instagram image - can be square (1080x1080), portrait (1080x1350), or landscape (1080x566) */}
      {postData.files.length > 0 ? (
        <div className="w-full bg-black flex items-center justify-center">
          <img 
            src={postData.files[0].url} 
            alt="Post media" 
            className="w-full h-auto object-cover max-h-[600px]"
          />
        </div>
      ) : (
        <div className="w-full aspect-square bg-black"></div>
      )}

      <div className={selectedDevice === 'mobile' ? 'p-3' : 'p-4'}>
        <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'mb-2' : 'mb-3'}`}>
          <div className={`flex items-center ${selectedDevice === 'mobile' ? 'gap-4' : 'gap-6'}`}>
            {/* Instagram-specific icons */}
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

        <div className={`text-white ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'} font-semibold mb-1`}>
          234 likes
        </div>
        
        <div className={`text-white leading-relaxed ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>
          <span className="font-semibold">startup_ninja</span>{' '}
          {postData.content || (
            <span className="text-gray-400">Write your post content...</span>
          )}
        </div>

        <div className={`text-gray-400 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'} mt-1`}>
          2 hours ago
        </div>
      </div>
    </div>
  );

  const FacebookPreview = () => (
    <div className={`w-full mx-auto bg-[#242526] border border-gray-700 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-lg'
    }`}>
      <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center ${
            selectedDevice === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>#</span>
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

      <div className={`${selectedDevice === 'mobile' ? 'px-3' : 'px-4'} pb-3`}>
        <div className={`text-white leading-relaxed mb-3 ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>
          {postData.content || (
            <span className="text-gray-400">What's on your mind?</span>
          )}
        </div>
      </div>

      {/* Facebook image - aspect ratio 1200x630 (1.9:1) */}
      {postData.files.length > 0 ? (
        <div className="w-full bg-gray-800 flex items-center justify-center">
          <img 
            src={postData.files[0].url} 
            alt="Post media" 
            className="w-full h-auto max-h-80 object-cover"
          />
        </div>
      ) : (
        <div className="w-full bg-gray-800 h-64"></div>
      )}

      {/* Facebook engagement bar */}
      <div className={`border-t border-gray-700 ${selectedDevice === 'mobile' ? 'p-2' : 'p-3'}`}>
        <div className="flex items-center justify-between text-gray-300">
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
            <FaShare className={`${selectedDevice === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}>Share</span>
          </button>
        </div>
      </div>

    </div>
  );

  const TwitterPreview = () => (
    <div className={`w-full mx-auto bg-black border border-gray-800 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-lg'
    }`}>
      <div className={`flex items-start gap-3 ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className={`rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0 ${
          selectedDevice === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
        }`}>
          <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>#</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 ${selectedDevice === 'mobile' ? 'mb-1' : 'mb-2'}`}>
            <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>Startup Ninja</span>
            <span className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>@StartupNinja</span>
            <span className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>·</span>
            <span className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>1m</span>
          </div>
          
          <div className={`text-white leading-relaxed mb-3 ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>
            {postData.content || (
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>
            )}
          </div>
          
          {/* X (Twitter) image - aspect ratio 1200x675 (16:9) */}
          {postData.files.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-700">
              <img 
                src={postData.files[0].url} 
                alt="Post media" 
                className="w-full h-auto max-h-80 object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-gray-500 max-w-md">
            {/* X (Twitter) specific icons */}
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
        </div>
      </div>
    </div>
  );

  const LinkedInPreview = () => (
    <div className={`w-full mx-auto bg-[#1B1F23] border border-gray-700 rounded-lg overflow-hidden ${
      selectedDevice === 'mobile' ? 'max-w-sm' : 'max-w-lg'
    }`}>
      <div className={`flex items-center justify-between ${selectedDevice === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center ${
            selectedDevice === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
          }`}>
            <span className={`text-white font-bold ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>#</span>
          </div>
          <div>
            <div className={`text-white font-semibold ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>Startup Ninja</div>
            <div className={`text-gray-400 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>Founder at Startup Ninja</div>
            <div className={`text-gray-500 ${selectedDevice === 'mobile' ? 'text-xs' : 'text-sm'}`}>1h • 🌐</div>
          </div>
        </div>
        <button aria-label="More options" title="More options">
          <FiMoreHorizontal className={`text-gray-400 ${selectedDevice === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}`} />
        </button>
      </div>

      <div className={`pb-3 ${selectedDevice === 'mobile' ? 'px-3' : 'px-4'}`}>
        <div className={`text-white leading-relaxed mb-3 ${selectedDevice === 'mobile' ? 'text-sm' : 'text-base'}`}>
          {postData.content || (
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-4/5"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>
          )}
        </div>
      </div>

      {/* LinkedIn image - aspect ratio 1200x627 (similar to Facebook) */}
      {postData.files.length > 0 ? (
        <div className="w-full bg-gray-800 flex items-center justify-center">
          <img 
            src={postData.files[0].url} 
            alt="Post media" 
            className="w-full h-auto max-h-80 object-cover"
          />
        </div>
      ) : (
        <div className="w-full bg-gray-800 h-64"></div>
      )}

      {/* LinkedIn engagement section */}
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
    </div>
  );

  const renderPreview = () => {
    switch (selectedPlatform) {
      case 'instagram':
        return <InstagramPreview />;
      case 'facebook':
        return <FacebookPreview />;
      case 'x':
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

          {dropdownOpen && availablePlatforms.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1E1E1E] border border-gray-600 rounded-lg shadow-lg z-10">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    setSelectedPlatform(platform.id);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-[#2A2A2A] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedPlatform === platform.id ? 'bg-[#2A2A2A]' : ''
                  }`}
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
        {availablePlatforms.length > 0 ? (
          renderPreview()
        ) : (
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">No platforms selected</div>
            <div className="text-gray-500 text-sm">Select one or more platforms to see the preview</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPreview;