import React, { useState, useEffect } from 'react';
import { 
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaChevronDown,
  FaDesktop,
  FaMobile,
} from 'react-icons/fa';
import { usePost } from './PostContext';
import { useAuth } from '../../hooks/useAuth';
import linkedinService, { LinkedInConnectionStatus } from '../../services/social-media/oauth/linkedin';
import twitterService, { TwitterConnectionStatus } from '../../services/social-media/oauth/twitter';
import instagramService, { InstagramConnectionStatus } from '../../services/social-media/oauth/instagram';
import facebookService, { FacebookConnectionStatus } from '../../services/social-media/oauth/facebook';
import InstagramPreview from './previews/InstagramPreview';
import FacebookPreview from './previews/FacebookPreview';
import TwitterPreview from './previews/TwitterPreview';
import LinkedInPreview from './previews/LinkedInPreview';

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'x';
type DeviceType = 'desktop' | 'mobile';

const PostPreview: React.FC = (): React.ReactElement => {
  const { postData } = usePost();
  const { user } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('mobile');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [linkedinStatus, setLinkedinStatus] = useState<LinkedInConnectionStatus | null>(null);
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false);
  const [twitterStatus, setTwitterStatus] = useState<TwitterConnectionStatus | null>(null);
  const [isLoadingTwitter, setIsLoadingTwitter] = useState(false);
  const [instagramStatus, setInstagramStatus] = useState<InstagramConnectionStatus | null>(null);
  const [isLoadingInstagram, setIsLoadingInstagram] = useState(false);
  const [facebookStatus, setFacebookStatus] = useState<FacebookConnectionStatus | null>(null);
  const [, setIsLoadingFacebook] = useState(false);

  // rich text rendering moved to shared util

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

  // Fetch connection status when component mounts or user changes
  useEffect(() => {
    const fetchLinkedInStatus = async () => {
      if (!user?.id) {
        setLinkedinStatus(null);
        return;
      }

      setIsLoadingLinkedIn(true);
      try {
        const status = await linkedinService.getConnectionStatus(user.id);
        setLinkedinStatus(status);
      } catch (error) {
        setLinkedinStatus(null);
      } finally {
        setIsLoadingLinkedIn(false);
      }
    };

    const fetchTwitterStatus = async () => {
      if (!user?.id) {
        setTwitterStatus(null);
        return;
      }

      setIsLoadingTwitter(true);
      try {
        const status = await twitterService.getConnectionStatus(user.id);
        setTwitterStatus(status);
      } catch (error) {
        setTwitterStatus(null);
      } finally {
        setIsLoadingTwitter(false);
      }
    };

    const fetchInstagramStatus = async () => {
      if (!user?.id) {
        setInstagramStatus(null);
        return;
      }

      setIsLoadingInstagram(true);
      try {
        const status = await instagramService.getConnectionStatus(user.id);
        setInstagramStatus(status);
      } catch (error) {
        setInstagramStatus(null);
      } finally {
        setIsLoadingInstagram(false);
      }
    };

    const fetchFacebookStatus = async () => {
      if (!user?.id) {
        setFacebookStatus(null);
        return;
      }

      setIsLoadingFacebook(true);
      try {
        const status = await facebookService.getConnectionStatus(user.id);
        setFacebookStatus(status);
      } catch (error) {
        setFacebookStatus(null);
      } finally {
        setIsLoadingFacebook(false);
      }
    };

    fetchLinkedInStatus();
    fetchTwitterStatus();
    fetchInstagramStatus();
    fetchFacebookStatus();

    // Listen for connection changes (custom events)
    const handleLinkedInChange = () => {
      fetchLinkedInStatus();
    };

    const handleTwitterChange = () => {
      fetchTwitterStatus();
    };

    const handleInstagramChange = () => {
      fetchInstagramStatus();
    };

    const handleFacebookChange = () => {
      fetchFacebookStatus();
    };

    window.addEventListener('linkedinStatusChanged', handleLinkedInChange);
    window.addEventListener('twitterStatusChanged', handleTwitterChange);
    window.addEventListener('instagramStatusChanged', handleInstagramChange);
    window.addEventListener('facebookStatusChanged', handleFacebookChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('linkedinStatusChanged', handleLinkedInChange);
      window.removeEventListener('twitterStatusChanged', handleTwitterChange);
      window.removeEventListener('instagramStatusChanged', handleInstagramChange);
      window.removeEventListener('facebookStatusChanged', handleFacebookChange);
    };
  }, [user?.id]);

  const currentPlatform = allPlatforms.find(p => p.id === selectedPlatform);

  const InstagramPreviewWrapper = () => {
    return (
      <InstagramPreview selectedDevice={selectedDevice} instagramStatus={instagramStatus} isLoadingInstagram={isLoadingInstagram} postData={postData} />
    );
  };

  const FacebookPreviewWrapper = () => {
    // Get Facebook pages from connection status (posts are published to pages, not personal profiles)
    return (
      <FacebookPreview selectedDevice={selectedDevice} facebookStatus={facebookStatus} postData={postData} />
    );
  };

  const TwitterPreviewWrapper = () => {

    return (
      <TwitterPreview selectedDevice={selectedDevice} twitterStatus={twitterStatus} isLoadingTwitter={isLoadingTwitter} postData={postData} />
    );
  };

  const LinkedInPreviewWrapper = () => {
    // Get LinkedIn user profile info if connected    
    return (
      <LinkedInPreview selectedDevice={selectedDevice} linkedinStatus={linkedinStatus} isLoadingLinkedIn={isLoadingLinkedIn} postData={postData} />
  );
  };

  const renderPreview = () => {
    switch (selectedPlatform) {
      case 'instagram':
        return <InstagramPreviewWrapper />;
      case 'facebook':
        return <FacebookPreviewWrapper />;
      case 'x':
        return <TwitterPreviewWrapper />;
      case 'linkedin':
        return <LinkedInPreviewWrapper />;
      default:
        return <InstagramPreviewWrapper />;
    }
  };

  return (
    <div className="w-full bg-[#121212] rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 bg-[#1E1E1E] border border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-white text-xs sm:text-sm font-medium hover:bg-[#2A2A2A] transition-colors"
          >
            {currentPlatform && <currentPlatform.icon className="w-4 h-4" />}
            <span>{currentPlatform?.name || 'Select Platform'}</span>
            <FaChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && availablePlatforms.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-[#1E1E1E] border border-gray-600 rounded-lg shadow-lg z-10">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    setSelectedPlatform(platform.id);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2 sm:gap-3 w-full px-3 py-2.5 sm:px-4 sm:py-3 text-white text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors first:rounded-t-lg last:rounded-b-lg ${
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
            className={`p-2 rounded-lg border transition-colors ${
              selectedDevice === 'desktop'
                ? 'bg-gray-700 border-gray-500 text-white'
                : 'bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <FaDesktop className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDevice('mobile')}
            className={`p-2 rounded-lg border transition-colors ${
              selectedDevice === 'mobile'
                ? 'bg-gray-700 border-gray-500 text-white'
                : 'bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <FaMobile className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center min-h-[320px] sm:min-h-[400px] bg-[#0A0A0A] rounded-xl p-4 sm:p-6">
        {availablePlatforms.length > 0 ? (
          renderPreview()
        ) : (
          <div className="text-center">
            <div className="text-gray-400 text-base sm:text-lg mb-2">No platforms selected</div>
            <div className="text-gray-500 text-xs sm:text-sm">Select one or more platforms to see the preview</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPreview;