import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import linkedinService, { LinkedInConnectionStatus } from '../../services/social-media/oauth/linkedin';
import twitterService, { TwitterConnectionStatus} from '../../services/social-media/oauth/twitter';
import instagramService, { InstagramConnectionStatus } from '../../services/social-media/oauth/instagram';
import facebookService, { FacebookConnectionStatus } from '../../services/social-media/oauth/facebook';
import { PLATFORM_BY_ID } from '../../constants/platforms';

const AccountsCard: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([
    {
      id: 'facebook',
      name: PLATFORM_BY_ID.facebook?.name || 'Facebook',
      username: 'Not Connected',
      icon: FaFacebook,
      iconColor: 'text-[#1877F2]',
      status: 'Not Connected',
      isConnected: false,
      isPlaceholder: false,
      pages: [] as any[],
    },
    {
      id: 'instagram',
      name: PLATFORM_BY_ID.instagram?.name || 'Instagram',
      username: 'Not Connected',
      icon: FaInstagram,
      iconColor: 'text-[#E4405F]',
      status: 'Not Connected',
      isConnected: false,
      isPlaceholder: false,
    },
    {
      id: 'twitter',
      name: PLATFORM_BY_ID.x?.name || 'X (Twitter)',
      username: 'Not Connected',
      icon: FaTwitter,
      iconColor: 'text-white',
      status: 'Not Connected',
      isConnected: false,
      isPlaceholder: false,
    },
    {
      id: 'linkedin',
      name: PLATFORM_BY_ID.linkedin?.name || 'LinkedIn',
      username: 'Not Connected',
      icon: FaLinkedin,
      iconColor: 'text-[#0A66C2]',
      status: 'Not Connected',
      isConnected: false,
      isPlaceholder: false,
    },
  ]);

  const [linkedinStatus, setLinkedinStatus] = useState<LinkedInConnectionStatus | null>(null);
  const [twitterStatus, setTwitterStatus] = useState<TwitterConnectionStatus | null>(null);
  const [instagramStatus, setInstagramStatus] = useState<InstagramConnectionStatus | null>(null);
  const [facebookStatus, setFacebookStatus] = useState<FacebookConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check connection status on component mount
  useEffect(() => {
    checkLinkedInStatus(false); // Always check on mount
    checkTwitterStatus(false); // Always check on mount
    checkInstagramStatus(false); // Always check on mount
    checkFacebookStatus(false); // Always check on mount
    
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // LinkedIn callback handling
    if (urlParams.get('linkedin_connected') === 'true') {
      const name = urlParams.get('name');
      toast.success(`LinkedIn account connected successfully! Welcome ${decodeURIComponent(name || 'LinkedIn User')}`);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh connection status
      setTimeout(() => {
        checkLinkedInStatus();
        // Emit event to notify other components
        window.dispatchEvent(new CustomEvent('linkedinStatusChanged'));
      }, 1000);
    } else if (urlParams.get('linkedin_error') === 'true') {
      const message = urlParams.get('message');
      toast.error(message || 'Failed to connect LinkedIn account');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Twitter callback handling
    if (urlParams.get('twitter_connected') === 'true') {
      const name = urlParams.get('name');
      const screenName = urlParams.get('screen_name');
      toast.success(`Twitter account connected successfully! Welcome @${decodeURIComponent(screenName || name || 'TwitterUser')}`);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh connection status
      setTimeout(() => {
        checkTwitterStatus();
        // Emit event to notify other components
        window.dispatchEvent(new CustomEvent('twitterStatusChanged'));
      }, 1000);
    } else if (urlParams.get('twitter_error') === 'true') {
      const message = urlParams.get('message');
      toast.error(message || 'Failed to connect Twitter account');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Instagram callback handling
    if (urlParams.get('instagram_connected') === 'true') {
      const username = urlParams.get('username');
      const accountType = urlParams.get('account_type');
      toast.success(`Instagram account connected successfully! Welcome @${decodeURIComponent(username || 'InstagramUser')} (${decodeURIComponent(accountType || 'Personal')})`);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh connection status
      setTimeout(() => {
        checkInstagramStatus();
        // Emit event to notify other components
        window.dispatchEvent(new CustomEvent('instagramStatusChanged'));
      }, 1000);
    } else if (urlParams.get('instagram_error') === 'true') {
      const message = urlParams.get('message');
      toast.error(message || 'Failed to connect Instagram account');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Facebook callback handling
    if (urlParams.get('facebook_connected') === 'true') {
      const name = urlParams.get('name');
      const pages = urlParams.get('pages');
      toast.success(`Facebook account connected successfully! Welcome ${decodeURIComponent(name || 'Facebook User')} (${pages || '0'} pages)`);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh connection status
      setTimeout(() => {
        checkFacebookStatus();
        // Emit event to notify other components
        window.dispatchEvent(new CustomEvent('facebookStatusChanged'));
      }, 1000);
    } else if (urlParams.get('facebook_error') === 'true') {
      const message = urlParams.get('message');
      toast.error(message || 'Failed to connect Facebook account');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkLinkedInStatus = async (skipIfAlreadyConnected = false) => {
    // Only check status if user is authenticated
    if (!user?.id) {
      return;
    }

    // Skip check if already connected (to avoid overriding successful popup connections)
    if (skipIfAlreadyConnected && linkedinStatus?.connected) {
      return;
    }

    try {
      setIsLoading(true);
      const status = await linkedinService.getConnectionStatus(user.id);
      
      // Only update state if the status actually changed
      if (linkedinStatus?.connected !== status.connected) {
        setLinkedinStatus(status);
        
        // Update LinkedIn account in the accounts array
        setAccounts(prevAccounts => {
          const updatedAccounts = prevAccounts.map(account =>
            account.id === 'linkedin'
              ? {
                  ...account,
                  isConnected: status.connected,
                  status: status.connected ? 'Connected' : 'Not Connected',
                  username: status.connected && status.profile 
                    ? status.profile.name 
                    : 'Not Connected'
                }
              : account
          );
          return updatedAccounts;
        });
      }
    } catch (error) {
      // Status check failed - user will see current state
    } finally {
      setIsLoading(false);
    }
  };

  const checkTwitterStatus = async (skipIfAlreadyConnected = false) => {
    // Only check status if user is authenticated
    if (!user?.id) {
      return;
    }

    // Skip check if already connected (to avoid overriding successful popup connections)
    if (skipIfAlreadyConnected && twitterStatus?.connected) {
      return;
    }

    try {
      setIsLoading(true);
      const status = await twitterService.getConnectionStatus(user.id);
      
      // Only update state if the status actually changed
      if (twitterStatus?.connected !== status.connected) {
        setTwitterStatus(status);
        
        // Update Twitter account in the accounts array
        setAccounts(prevAccounts => {
          const updatedAccounts = prevAccounts.map(account =>
            account.id === 'twitter'
              ? {
                  ...account,
                  isConnected: status.connected,
                  status: status.connected ? 'Connected' : 'Not Connected',
                  username: status.connected && status.profile 
                    ? `@${status.profile.screen_name}` 
                    : 'Not Connected'
                }
              : account
          );
          return updatedAccounts;
        });
      }
    } catch (error) {
      // Status check failed - user will see current state
    } finally {
      setIsLoading(false);
    }
  };

  const checkInstagramStatus = async (skipIfAlreadyConnected = false) => {
    // Only check status if user is authenticated
    if (!user?.id) {
      return;
    }

    // Skip check if already connected (to avoid overriding successful popup connections)
    if (skipIfAlreadyConnected && instagramStatus?.connected) {
      return;
    }

    try {
      setIsLoading(true);
      const status = await instagramService.getConnectionStatus(user.id);
      
      // Only update state if the status actually changed
      if (instagramStatus?.connected !== status.connected) {
        setInstagramStatus(status);
        
        // Update Instagram account in the accounts array
        setAccounts(prevAccounts => {
          const updatedAccounts = prevAccounts.map(account =>
            account.id === 'instagram'
              ? {
                  ...account,
                  isConnected: status.connected,
                  status: status.connected ? 'Connected' : 'Not Connected',
                  username: status.connected && status.profile 
                    ? `@${status.profile.username}` 
                    : 'Not Connected'
                }
              : account
          );
          return updatedAccounts;
        });
      }
    } catch (error) {
      // Status check failed - user will see current state
    } finally {
      setIsLoading(false);
    }
  };

  const checkFacebookStatus = async (skipIfAlreadyConnected = false) => {
    // Only check status if user is authenticated
    if (!user?.id) {
      return;
    }

    // Skip check if already connected (to avoid overriding successful popup connections)
    if (skipIfAlreadyConnected && facebookStatus?.connected) {
      return;
    }

    try {
      setIsLoading(true);
      const status = await facebookService.getConnectionStatus(user.id);
      
      // Only update state if the status actually changed
      if (facebookStatus?.connected !== status.connected) {
        setFacebookStatus(status);
        
        // Update Facebook account in the accounts array
        setAccounts(prevAccounts => {
          const updatedAccounts = prevAccounts.map(account =>
            account.id === 'facebook'
              ? {
                  ...account,
                  isConnected: status.connected,
                  status: status.connected ? 'Connected' : 'Not Connected',
                  username: status.connected && status.profile 
                    ? `${status.profile.name} (${status.pages?.length || 0} Pages)`
                    : 'Not Connected',
                  pages: status.pages || []
                }
              : account
          );
          return updatedAccounts;
        });
      }
    } catch (error) {
      // Status check failed - user will see current state
    } finally {
      setIsLoading(false);
    }
  };


  const handleToggleConnection = async (accountId: string) => {
    if (accountId === 'linkedin') {
      await handleLinkedInConnection();
    } else if (accountId === 'twitter') {
      await handleTwitterConnection();
    } else if (accountId === 'instagram') {
      await handleInstagramConnection();
    } else if (accountId === 'facebook') {
      await handleFacebookConnection();
    } else {
      // For other platforms, show coming soon message
      toast.error(`${accounts.find(a => a.id === accountId)?.name} integration is coming soon!`);
    }
  };

  const handleLinkedInConnection = async () => {
    if (!user?.id) {
      toast.error('Please log into your Startup Ninja account first, then try connecting LinkedIn again.');
      return;
    }

    try {
      setIsLoading(true);
      
      if (linkedinStatus?.connected) {
        // Disconnect LinkedIn
        const result = await linkedinService.disconnectAccount();
        if (result.success) {
          toast.success('LinkedIn account disconnected successfully');
          
          // Update UI immediately
          setLinkedinStatus({
            connected: false,
            profile: undefined,
            message: 'Disconnected'
          });
          
          // Update accounts array immediately
          setAccounts(prevAccounts => {
            const updatedAccounts = prevAccounts.map(account =>
              account.id === 'linkedin'
                ? {
                    ...account,
                    isConnected: false,
                    status: 'Not Connected',
                    username: 'Not Connected'
                  }
                : account
            );
            return updatedAccounts;
          });

          // Emit event to notify other components
          window.dispatchEvent(new CustomEvent('linkedinStatusChanged'));
          
          // Confirm with backend status check
          setTimeout(async () => {
            await checkLinkedInStatus();
          }, 500);
        } else {
          toast.error(result.message);
        }
      } else {
        // Connect LinkedIn using popup approach
        try {
          const result = await linkedinService.initiateConnectionPopup(user.id);
          
          if (result) {
            // Connection successful via popup
            const userName = result.user?.name || result.user?.given_name || 'LinkedIn User';
            toast.success(`LinkedIn account connected successfully! Welcome ${userName}`);
            
            // Force immediate UI update with connected status
            const newLinkedInStatus = {
              connected: true,
              profile: result.user,
              message: 'Connected successfully'
            };
            setLinkedinStatus(newLinkedInStatus);
            
            // Update accounts array immediately
            setAccounts(prevAccounts => {
              const updatedAccounts = prevAccounts.map(account =>
                account.id === 'linkedin'
                  ? {
                      ...account,
                      isConnected: true,
                      status: 'Connected',
                      username: userName
                    }
                  : account
              );
              return updatedAccounts;
            });

            // Emit event to notify other components
            window.dispatchEvent(new CustomEvent('linkedinStatusChanged'));
          }
        } catch (popupError) {
          // Fallback to redirect method if popup fails
          await linkedinService.initiateConnection(user.id);
          // Note: After successful auth, user will be redirected back with success params
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect LinkedIn account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterConnection = async () => {
    if (!user?.id) {
      toast.error('Please log into your Startup Ninja account first, then try connecting Twitter again.');
      return;
    }

    try {
      setIsLoading(true);
      
      if (twitterStatus?.connected) {
        // Disconnect Twitter
        const result = await twitterService.disconnectAccount();
        if (result.success) {
          toast.success('Twitter account disconnected successfully');
          
          // Update UI immediately
          setTwitterStatus({
            connected: false,
            profile: undefined,
            message: 'Disconnected'
          });
          
          // Update accounts array immediately
          setAccounts(prevAccounts => {
            const updatedAccounts = prevAccounts.map(account =>
              account.id === 'twitter'
                ? {
                    ...account,
                    isConnected: false,
                    status: 'Not Connected',
                    username: 'Not Connected'
                  }
                : account
            );
            return updatedAccounts;
          });

          // Emit event to notify other components
          window.dispatchEvent(new CustomEvent('twitterStatusChanged'));
          
          // Confirm with backend status check
          setTimeout(async () => {
            await checkTwitterStatus();
          }, 500);
        } else {
          toast.error(result.message);
        }
      } else {
        // Connect Twitter using popup approach
        try {
          const result = await twitterService.initiateConnectionPopup(user.id);
          
          if (result) {
            // Connection successful via popup
            const userName = result.user?.name || 'Twitter User';
            const screenName = result.user?.screen_name || '';
            toast.success(`Twitter account connected successfully! Welcome @${screenName || userName}`);
            
            // Force immediate UI update with connected status
            const newTwitterStatus = {
              connected: true,
              profile: result.user,
              message: 'Connected successfully'
            };
            setTwitterStatus(newTwitterStatus);
            
            // Update accounts array immediately
            setAccounts(prevAccounts => {
              const updatedAccounts = prevAccounts.map(account =>
                account.id === 'twitter'
          ? {
              ...account,
                      isConnected: true,
                      status: 'Connected',
                      username: `@${screenName || userName}`
            }
          : account
              );
              return updatedAccounts;
            });

            // Emit event to notify other components
            window.dispatchEvent(new CustomEvent('twitterStatusChanged'));
          }
        } catch (popupError) {
          // Fallback to redirect method if popup fails
          await twitterService.initiateConnection(user.id);
          // Note: After successful auth, user will be redirected back with success params
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Twitter account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstagramConnection = async () => {
    if (!user?.id) {
      toast.error('Please log into your Startup Ninja account first, then try connecting Instagram again.');
      return;
    }

    try {
      setIsLoading(true);
      
      if (instagramStatus?.connected) {
        // Disconnect Instagram
        const result = await instagramService.disconnectAccount();
        if (result.success) {
          toast.success('Instagram account disconnected successfully');
          
          // Update UI immediately
          setInstagramStatus({
            connected: false,
            profile: undefined,
            message: 'Disconnected'
          });
          
          // Update accounts array immediately
          setAccounts(prevAccounts => {
            const updatedAccounts = prevAccounts.map(account =>
              account.id === 'instagram'
                ? {
                    ...account,
                    isConnected: false,
                    status: 'Not Connected',
                    username: 'Not Connected'
                  }
                : account
            );
            return updatedAccounts;
          });

          // Emit event to notify other components
          window.dispatchEvent(new CustomEvent('instagramStatusChanged'));
          
          // Confirm with backend status check
          setTimeout(async () => {
            await checkInstagramStatus();
          }, 500);
        } else {
          toast.error(result.message);
        }
      } else {
        // Connect Instagram using popup approach
        try {
          const result = await instagramService.initiateConnectionPopup(user.id);
          
          if (result) {
            // Connection successful via popup
            const userName = result.user?.username || 'InstagramUser';
            const accountType = result.user?.account_type || 'Personal';
            toast.success(`Instagram account connected successfully! Welcome @${userName} (${accountType})`);
            
            // Force immediate UI update with connected status
            const newInstagramStatus = {
              connected: true,
              profile: result.user,
              message: 'Connected successfully'
            };
            setInstagramStatus(newInstagramStatus);
            
            // Update accounts array immediately
            setAccounts(prevAccounts => {
              const updatedAccounts = prevAccounts.map(account =>
                account.id === 'instagram'
          ? {
              ...account,
                      isConnected: true,
                      status: 'Connected',
                      username: `@${userName}`
            }
          : account
              );
              return updatedAccounts;
            });

            // Emit event to notify other components
            window.dispatchEvent(new CustomEvent('instagramStatusChanged'));
          }
        } catch (popupError) {
          // Fallback to redirect method if popup fails
          await instagramService.initiateConnection();
          // Note: After successful auth, user will be redirected back with success params
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Instagram account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookConnection = async () => {
    if (!user?.id) {
      toast.error('Please log into your Startup Ninja account first, then try connecting Facebook again.');
      return;
    }

    try {
      setIsLoading(true);
      
      if (facebookStatus?.connected) {
        // Disconnect Facebook
        const result = await facebookService.disconnectAccount();
        if (result.success) {
          toast.success('Facebook account disconnected successfully');
          
          // Update UI immediately
          setFacebookStatus({
            connected: false,
            profile: undefined,
            pages: undefined,
            message: 'Disconnected'
          });
          
          // Update accounts array immediately
          setAccounts(prevAccounts => {
            const updatedAccounts = prevAccounts.map(account =>
              account.id === 'facebook'
                ? {
                    ...account,
                    isConnected: false,
                    status: 'Not Connected',
                    username: 'Not Connected'
                  }
                : account
            );
            return updatedAccounts;
          });

          // Emit event to notify other components
          window.dispatchEvent(new CustomEvent('facebookStatusChanged'));
          
          // Confirm with backend status check
          setTimeout(async () => {
            await checkFacebookStatus();
          }, 500);
        } else {
          toast.error(result.message);
        }
      } else {
        // Connect Facebook using popup approach
        try {
          const result = await facebookService.initiateConnectionPopup(user.id);
          
          if (result) {
            // Connection successful via popup
            const userName = result.user?.name || 'Facebook User';
            const pageCount = result.pages?.length || 0;
            toast.success(`Facebook account connected successfully! Welcome ${userName} (${pageCount} pages)`);
            
            // Force immediate UI update with connected status
            const newFacebookStatus = {
              connected: true,
              profile: result.user,
              pages: result.pages,
              message: 'Connected successfully'
            };
            setFacebookStatus(newFacebookStatus);
            
            // Update accounts array immediately
            setAccounts(prevAccounts => {
              const updatedAccounts = prevAccounts.map(account =>
                account.id === 'facebook'
          ? {
              ...account,
                      isConnected: true,
                      status: 'Connected',
                      username: `${userName} (${pageCount} Pages)`,
                      pages: result.pages || []
            }
          : account
              );
              return updatedAccounts;
            });

            // Emit event to notify other components
            window.dispatchEvent(new CustomEvent('facebookStatusChanged'));
          }
        } catch (popupError: any) {
          // If error is due to Plan Limits (403), show toast and DO NOT redirect
          if (popupError?.message && (popupError.message.toLowerCase().includes('limit') || popupError.message.includes('403'))) {
              toast.error(popupError.message);
          } else {
              // Fallback to redirect method if popup fails (e.g. Popups blocked)
              await facebookService.initiateConnection();
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Facebook account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFacebookPages = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      // Force connection flow (Update existing token)
      const result = await facebookService.initiateConnectionPopup(user.id);
          
      if (result) {
        const userName = result.user?.name || 'Facebook User';
        const pageCount = result.pages?.length || 0;
        toast.success(`Facebook pages synced successfully! Found ${pageCount} pages.`);
        
        const newFacebookStatus = {
          connected: true,
          profile: result.user,
          pages: result.pages,
          message: 'Synced successfully'
        };
        setFacebookStatus(newFacebookStatus);
        
        setAccounts(prevAccounts => {
          const updatedAccounts = prevAccounts.map(account =>
            account.id === 'facebook'
              ? {
                  ...account,
                  isConnected: true,
                  status: 'Connected',
                  username: `${userName} (${pageCount} Pages)`,
                  pages: result.pages || []
                }
              : account
          );
          return updatedAccounts;
        });

        window.dispatchEvent(new CustomEvent('facebookStatusChanged'));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync Facebook pages');
    } finally {
      setIsLoading(false);
    }
  };



  const handleRemovePage = async (pageId: string) => {
    try {
        const result = await facebookService.removePage(pageId);
        toast.success(result.message || 'Page removed');
        
        const newPages = result.pages || [];
        const userName = facebookStatus?.profile?.name || 'Facebook User';
        
        setFacebookStatus(prev => prev ? ({ ...prev, pages: newPages }) : null);
        
        setAccounts(prevAccounts => {
          return prevAccounts.map(account =>
            account.id === 'facebook'
              ? {
                  ...account,
                  pages: newPages,
                  username: `${userName} (${newPages.length} Pages)`
                }
              : account
          );
        });
        
        setTimeout(() => {
             checkFacebookStatus();
             window.dispatchEvent(new CustomEvent('facebookStatusChanged'));
        }, 500);
    } catch (error: any) {
        toast.error(error.message || 'Failed to remove page');
    }
  };

  return (
    <>
    <div className="w-full rounded-xl p-3 sm:p-4 border border-gray-800">
      <h2 className="text-white text-base md:text-lg font-bold font-plus-jakarta mb-3 md:mb-4">
        Connected Accounts
      </h2>


      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
              className={`border border-gray-700 rounded-xl p-3 sm:p-4 transition-colors duration-200 ${
                !account.isPlaceholder ? 'hover:bg-[#252525]' : 'opacity-60'
              }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left side - Platform info */}
              <div className="flex items-center gap-3">
                <account.icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${account.iconColor}`} 
                />
                <div className="flex flex-col">
                  <span className="text-white text-sm sm:text-base font-semibold font-plus-jakarta">
                    {account.name}
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    {account.username}
                  </span>
                </div>
              </div>

              {/* Right side - Status and button */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                      account.isConnected ? 'bg-green-500' : 
                      account.isPlaceholder ? 'bg-gray-500' : 'bg-[#DE0500]'
                  }`} />
                  <span 
                    className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                      account.isConnected 
                        ? 'text-green-500' 
                          : account.isPlaceholder 
                          ? 'text-gray-500'
                        : 'text-[#DE0500]'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                    {account.id === 'facebook' && account.isConnected && (
                        <button
                            onClick={handleSyncFacebookPages}
                            disabled={isLoading}
                            className="px-2 py-1.5 rounded-md text-[10px] sm:text-xs font-medium bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-colors flex items-center gap-1"
                        >
                            <FaPlus className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Add Page
                        </button>
                    )}
                    <button
                      onClick={() => handleToggleConnection(account.id)}
                        disabled={isLoading || (account.isPlaceholder && account.id !== 'linkedin' && account.id !== 'twitter' && account.id !== 'instagram' && account.id !== 'facebook')}
                        className={`px-2 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        account.isConnected
                          ? 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent'
                            : account.isPlaceholder && account.id !== 'linkedin' && account.id !== 'twitter' && account.id !== 'instagram' && account.id !== 'facebook'
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                        {account.isConnected ? 'Disconnect' : 
                         account.isPlaceholder && account.id !== 'linkedin' && account.id !== 'twitter' && account.id !== 'instagram' && account.id !== 'facebook' ? 'Soon' : 'Connect'}
                    </button>
                </div>
              </div>
            </div>
            
            {/* Facebook Pages List */}
            {account.id === 'facebook' && account.pages && account.pages.length > 0 && (
                <div className="mt-3 pl-2 sm:pl-9 space-y-2 border-t border-gray-800 pt-3">
                   <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Connected Pages</div>
                   {account.pages.map((page: any) => (
                        <div key={page.id} className="flex items-center gap-3 bg-[#1e1e1e] p-2 rounded-lg border border-gray-800/50 hover:border-gray-700 transition-colors">
                           <img 
                             src={page.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.name)}&background=random`} 
                             alt={page.name}
                             className="w-8 h-8 rounded-full border border-gray-700 object-cover"
                             onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(page.name)}&background=random`;
                                 if (target.src !== fallback) {
                                     target.src = fallback;
                                 }
                             }}
                           />
                          <div className="flex flex-col overflow-hidden">
                              <span className="text-sm text-gray-200 font-medium truncate">{page.name}</span>
                              <span className="text-[10px] text-gray-500 truncate">{page.category || 'Page'}</span>
                          </div>
                          {/* Status Indicator for Page */}
                          <div className="ml-auto flex items-center gap-1">
                              <button
                                onClick={() => handleRemovePage(page.id)}
                                className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Remove Page"
                              >
                                  <FaTrash className="w-3 h-3" />
                              </button>
                          </div>
                       </div>
                   ))}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AccountsCard;