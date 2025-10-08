import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ConnectedAccounts: React.FC = () => {
  const accounts = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebook,
      iconColor: 'text-[#1877F2]',
      status: 'Connected',
      isConnected: true,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      iconColor: 'text-[#E4405F]',
      status: 'Connected',
      isConnected: true,
    },
    {
      id: 'twitter',
      name: 'X',
      icon: FaTwitter,
      iconColor: 'text-white',
      status: 'Connected',
      isConnected: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FaLinkedin,
      iconColor: 'text-white',
      status: 'Not Connected',
      isConnected: false,
    },
  ];

  return (
    <div className="w-full bg-black rounded-xl p-3 md:p-4 border border-gray-800">
      <h2 className="text-white text-base md:text-lg font-bold font-plus-jakarta mb-3 md:mb-4">
        Connected Accounts
      </h2>

      <div className="space-y-2 md:space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`flex items-center justify-between p-2.5 md:p-3 rounded-lg border transition-all duration-200 min-h-[36px] md:min-h-[40px] ${
              account.isConnected
                ? 'bg-[#1A1A1A] border-gray-700 hover:bg-[#222222]'
                : 'bg-red-600 border-red-500 hover:bg-red-700'
            }`}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <account.icon 
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  account.isConnected ? account.iconColor : 'text-white'
                }`} 
              />
              <span className="text-white text-sm md:text-base font-semibold font-plus-jakarta">
                {account.name}
              </span>
            </div>

            <div className="flex items-center">
              <span 
                className={`text-xs md:text-sm font-semibold ${
                  account.isConnected 
                    ? 'text-green-500' 
                    : 'text-red-200'
                }`}
              >
                {account.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedAccounts;