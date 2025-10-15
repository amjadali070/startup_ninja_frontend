import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import linkedinService, { LinkedInConnectionStatus } from '../../services/linkedin';
import AlertModal from '../AlertModal';

const AccountsCard: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([
    {
      id: 'facebook',
      name: 'Facebook',
      username: '@exampleuser',
      icon: FaFacebook,
      iconColor: 'text-[#1877F2]',
      status: 'Coming Soon',
      isConnected: false,
      isPlaceholder: true,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      username: '@exampleuser',
      icon: FaInstagram,
      iconColor: 'text-[#E4405F]',
      status: 'Coming Soon',
      isConnected: false,
      isPlaceholder: true,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      username: '@exampleuser',
      icon: FaTwitter,
      iconColor: 'text-white',
      status: 'Coming Soon',
      isConnected: false,
      isPlaceholder: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      username: 'Not Connected',
      icon: FaLinkedin,
      iconColor: 'text-[#0A66C2]',
      status: 'Not Connected',
      isConnected: false,
      isPlaceholder: false,
    },
  ]);

  const [linkedinStatus, setLinkedinStatus] = useState<LinkedInConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  // Check LinkedIn connection status on component mount
  useEffect(() => {
    checkLinkedInStatus(false); // Always check on mount
    
    // Check for LinkedIn OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('linkedin_connected') === 'true') {
      const name = urlParams.get('name');
      showNotification(
        'Success!',
        `LinkedIn account connected successfully! Welcome ${decodeURIComponent(name || 'LinkedIn User')}`,
        'success'
      );
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
      showNotification(
        'Connection Failed',
        message || 'Failed to connect LinkedIn account',
        'error'
      );
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

  const showNotification = (title: string, message: string, type: 'success' | 'error') => {
    setNotification({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const handleToggleConnection = async (accountId: string) => {
    if (accountId === 'linkedin') {
      await handleLinkedInConnection();
    } else {
      // For other platforms, show coming soon message
      showNotification(
        'Coming Soon',
        `${accounts.find(a => a.id === accountId)?.name} integration is coming soon!`,
        'error'
      );
    }
  };

  const handleLinkedInConnection = async () => {
    if (!user?.id) {
      showNotification(
        'Authentication Required', 
        'Please log into your Startup Ninja account first, then try connecting LinkedIn again.', 
        'error'
      );
      return;
    }

    try {
      setIsLoading(true);
      
      if (linkedinStatus?.connected) {
        // Disconnect LinkedIn
        const result = await linkedinService.disconnectAccount();
        if (result.success) {
          showNotification('Success', 'LinkedIn account disconnected successfully', 'success');
          
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
          showNotification('Error', result.message, 'error');
        }
      } else {
        // Connect LinkedIn using popup approach
        try {
          const result = await linkedinService.initiateConnectionPopup(user.id);
          
          if (result) {
            // Connection successful via popup
            const userName = result.user?.name || result.user?.given_name || 'LinkedIn User';
            showNotification(
              'Success!', 
              `LinkedIn account connected successfully! Welcome ${userName}`,
              'success'
            );
            
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
      showNotification(
        'Error', 
        error.message || 'Failed to connect LinkedIn account', 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="w-full rounded-xl p-3 md:p-4 border border-gray-800">
      <h2 className="text-white text-base md:text-lg font-bold font-plus-jakarta mb-3 md:mb-4">
        Connected Accounts
      </h2>


      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
              className={`border border-gray-700 rounded-xl p-4 transition-colors duration-200 ${
                !account.isPlaceholder ? 'hover:bg-[#252525]' : 'opacity-60'
              }`}
          >
            <div className="flex items-start justify-between">
              {/* Left side - Platform info */}
              <div className="flex items-center gap-3">
                <account.icon 
                  className={`w-6 h-6 ${account.iconColor}`} 
                />
                <div className="flex flex-col">
                  <span className="text-white text-base font-semibold font-plus-jakarta">
                    {account.name}
                  </span>
                  <span className="text-gray-400 text-sm">
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
                    className={`text-sm font-medium ${
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
                
                <button
                  onClick={() => handleToggleConnection(account.id)}
                    disabled={isLoading || (account.isPlaceholder && account.id !== 'linkedin')}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    account.isConnected
                      ? 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent'
                        : account.isPlaceholder && account.id !== 'linkedin'
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                    {account.isConnected ? 'Remove' : 
                     account.isPlaceholder && account.id !== 'linkedin' ? 'Soon' : 'Connect'}
                </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      <AlertModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </>
  );
};

export default AccountsCard;