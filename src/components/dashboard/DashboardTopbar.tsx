import type { FC } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiMiniBellAlert } from 'react-icons/hi2';

interface DashboardTopbarProps {
  userName: string;
  profilePicture?: string | null;
}

const DashboardTopbar: FC<DashboardTopbarProps> = ({ userName, profilePicture }) => {
  const displayName = userName && userName.trim() ? userName : 'Ninja';
  const initials = displayName
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6">
      <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-semibold tracking-tight text-white truncate">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          {/* Search bar - responsive visibility */}
          <div className="hidden sm:flex items-center rounded-md bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 w-[200px] sm:w-[250px] lg:w-[320px]">
            <FiSearch className="w-4 h-4 text-white/40 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search tools, templates..."
              className="ml-2 sm:ml-3 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none w-full"
            />
          </div>

          {/* Mobile search button */}
          <button
            type="button"
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-md bg-white/5 border border-white/10"
            aria-label="Search"
          >
            <FiSearch className="w-4 h-4 text-white/40" />
          </button>

          {/* Notifications button */}
          <button
            type="button"
            className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center"
            aria-label="Notifications"
          >
            <HiMiniBellAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#FF3B3B]" />
          </button>

          {/* User profile section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User name - hidden on mobile, shown on larger screens */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[100px] sm:max-w-[150px]">
                {displayName}
              </span>
            </div>
            
            {/* Profile picture or initials */}
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={userName}
                className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-full border border-white/10 object-cover flex-shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-xs sm:text-sm font-semibold text-white flex-shrink-0">
                {initials || 'SN'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
