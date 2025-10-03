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
    <div className="px-10 xl:px-16 pt-10 pb-6">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-white">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center rounded-md bg-white/5 border border-white/10 px-4 py-2.5 w-[320px]">
            <FiSearch className="w-4 h-4 text-white/40" />
            <input
              type="search"
              placeholder="Search tools, templates, or ideas..."
              className="ml-3 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none w-full"
            />
          </div>

          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center"
            aria-label="Notifications"
          >
            <HiMiniBellAlert className="w-5 h-5" />
            <span className="absolute top-2 right-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#FF3B3B]" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-sm font-semibold text-white">{displayName}</span>
            </div>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={userName}
                className="h-11 w-11 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-sm font-semibold text-white">
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
