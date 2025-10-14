import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const AccountsCard: React.FC = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 'facebook',
      name: 'Facebook',
      username: '@exampleuser',
      icon: FaFacebook,
      iconColor: 'text-[#1877F2]',
      status: 'Connected',
      isConnected: true,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      username: '@exampleuser',
      icon: FaInstagram,
      iconColor: 'text-[#E4405F]',
      status: 'Connected',
      isConnected: true,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      username: '@exampleuser',
      icon: FaTwitter,
      iconColor: 'text-white',
      status: 'Connected',
      isConnected: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      username: '@exampleuser',
      icon: FaLinkedin,
      iconColor: 'text-[#0A66C2]',
      status: 'Not Connected',
      isConnected: false,
    },
  ]);

  const handleToggleConnection = (accountId: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === accountId
          ? {
              ...account,
              isConnected: !account.isConnected,
              status: !account.isConnected ? 'Connected' : 'Not Connected'
            }
          : account
      )
    );
  };

  return (
    <div className="w-full rounded-xl p-3 md:p-4 border border-gray-800">
      <h2 className="text-white text-base md:text-lg font-bold font-plus-jakarta mb-3 md:mb-4">
        Connected Accounts
      </h2>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="border border-gray-700 rounded-xl p-4 hover:bg-[#252525] transition-colors duration-200"
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
                    account.isConnected ? 'bg-green-500' : 'bg-[#DE0500]'
                  }`} />
                  <span 
                    className={`text-sm font-medium ${
                      account.isConnected 
                        ? 'text-green-500' 
                        : 'text-[#DE0500]'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
                
                <button
                  onClick={() => handleToggleConnection(account.id)}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                    account.isConnected
                      ? 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {account.isConnected ? 'Remove' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsCard;