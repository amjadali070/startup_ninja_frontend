import { useEffect, useId, useRef, useState, type FC } from 'react';
import { FiSearch, FiSettings } from 'react-icons/fi';
import { HiMiniBellAlert } from 'react-icons/hi2';
import { TbLogout2 } from 'react-icons/tb';

interface DashboardTopbarProps {
  userName: string;
  profilePicture?: string | null;
  email?: string | null;
  username?: string | null;
  onLogout: () => Promise<void> | void;
  onSettings?: () => void;
  title?: string;
}

const DashboardTopbar: FC<DashboardTopbarProps> = ({
  userName,
  profilePicture,
  email,
  username,
  onLogout,
  onSettings,
  title = 'Dashboard'
}) => {
  const displayName = userName && userName.trim() ? userName : 'Ninja';
  const initials = displayName
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const userEmail = email?.trim() ?? '';
  const userHandle = username?.trim() ?? '';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const menuId = useId();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogoutClick = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsMenuOpen(false);
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      if (isMountedRef.current) {
        setIsLoggingOut(false);
      }
    }
  };

  const handleSettingsClick = () => {
    setIsMenuOpen(false);
    onSettings?.();
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6 border-b border-white/10">
      <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-semibold tracking-tight text-white truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center rounded-md bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 w-[200px] sm:w-[250px] lg:w-[320px]">
            <FiSearch className="w-4 h-4 text-white/40 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search tools, templates..."
              className="ml-2 sm:ml-3 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none w-full"
            />
          </div>

          <button
            type="button"
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-md bg-white/5 border border-white/10"
            aria-label="Search"
          >
            <FiSearch className="w-4 h-4 text-white/40" />
          </button>

          <button
            type="button"
            className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center"
            aria-label="Notifications"
          >
            <HiMiniBellAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#FF3B3B]" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3" ref={menuRef}>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[100px] sm:max-w-[150px]">
                {displayName}
              </span>
            </div>
            
            <div className="relative">
              <button
                type="button"
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-controls={menuId}
                className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070C]"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 text-xs sm:text-sm font-semibold text-white">
                    {initials || 'SN'}
                  </span>
                )}
              </button>

              {isMenuOpen && (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(14,14,24,0.95)] shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  <div role="none" className="border-b border-white/10 bg-white/5 px-4 py-4">
                    <div className="flex items-center gap-3">
                     
                      <div className="min-w-0 text-left">
                        {userHandle && (
                          <p className="truncate text-xs font-medium text-white/60">@{userHandle}</p>
                        )}
                        {userEmail && (
                          <p className="mt-1 truncate text-xs text-white/45">{userEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div role="none" className="py-1">
                    <button
                      type="button"
                      onClick={handleSettingsClick}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 focus:outline-none"
                      role="menuitem"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white">
                        <FiSettings className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span>Settings</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-white/85 transition-colors hover:bg-[#FF3B3B]/10 disabled:cursor-not-allowed disabled:text-white/40"
                      role="menuitem"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-[#FF8080]">
                        <TbLogout2 className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span>{isLoggingOut ? 'Logging out…' : 'Sign out'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
