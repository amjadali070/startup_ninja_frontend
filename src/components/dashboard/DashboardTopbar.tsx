import { useEffect, useId, useRef, useState, type FC } from "react";
import { FiSearch, FiSettings } from "react-icons/fi";
import { HiMiniBellAlert } from "react-icons/hi2";
import { TbLogout2 } from "react-icons/tb";
import NotificationModal from "../NotificationModal";
import { useNavigate } from "react-router-dom";
import notificationsService, {
  type NotificationItem,
} from "../../services/notifications";

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
  title = "Dashboard",
}) => {
  const displayName = userName && userName.trim() ? userName : "Ninja";
  const initials = displayName
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const userEmail = email?.trim() ?? "";
  const userHandle = username?.trim() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const menuId = useId();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsService.list(1, 50);
        if (response.success && isMountedRef.current) {
          setNotifications(response.data);
          setUnread(response.data.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
    
    // Set up polling every minute to capture background jobs like subscription reminders
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
    } catch (_) {}
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnread((prev) => Math.max(0, prev - 1));
  };

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
    <div className="px-3 bg-[#0B0B0F] sm:px-4 md:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 border-b border-white/10">
      <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0 pl-16 lg:pl-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-[26px] font-semibold tracking-tight text-white truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center rounded-md bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 sm:py-2 w-[180px] sm:w-[220px] lg:w-[280px]">
            <FiSearch className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search tools, templates..."
              className="ml-2 bg-transparent text-[10px] sm:text-xs text-white placeholder:text-white/40 focus:outline-none w-full"
            />
          </div>

          <button
            type="button"
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-md bg-white/5 border border-white/10"
            aria-label="Search"
          >
            <FiSearch className="w-3.5 h-3.5 text-white/40" />
          </button>

          <button
            type="button"
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center"
            aria-label="Notifications"
          >
            <HiMiniBellAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FF3B3B]" />
            )}
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2" ref={menuRef}>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] sm:text-xs font-semibold text-white truncate max-w-[80px] sm:max-w-[120px]">
                {displayName}
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-controls={menuId}
                className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070C]"
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
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 text-[10px] sm:text-xs font-semibold text-white">
                    {initials || "SN"}
                  </span>
                )}
              </button>

              {isMenuOpen && (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(14,14,24,0.95)] shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  <div
                    role="none"
                    className="border-b border-white/10 bg-white/5 px-3 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 text-left">
                        {userHandle && (
                          <p className="truncate text-[10px] font-medium text-white/60">
                            @{userHandle}
                          </p>
                        )}
                        {userEmail && (
                          <p className="mt-0.5 truncate text-[10px] text-white/45">
                            {userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div role="none" className="py-1">
                    <button
                      type="button"
                      onClick={handleSettingsClick}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-white/85 transition-colors hover:bg-white/10 focus:outline-none"
                      role="menuitem"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white">
                        <FiSettings className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>Settings</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-white/85 transition-colors hover:bg-[#FF3B3B]/10 disabled:cursor-not-allowed disabled:text-white/40"
                      role="menuitem"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full text-[#FF8080]">
                        <TbLogout2 className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {isLoggingOut ? "Logging out…" : "Sign out"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications.map((n) => ({
          id: n._id,
          type: (n.type as any) || "info",
          title: n.title,
          message: n.message,
          timestamp: new Date(n.createdAt).toLocaleString(),
          read: n.read,
        }))}
        onMarkAsRead={handleMarkAsRead}
        onOpenItem={(id) => {
          const item = notifications.find((n) => n._id === id);
          if (item?.type === "warning" || item?.type === "error") {
            // Subscription payment/expire related
            setIsNotificationModalOpen(false);
            navigate(`/settings?tab=billing`);
            return;
          }
          
          const scheduledPostId = (item?.metadata as any)?.scheduledPostId;
          if (scheduledPostId) {
            setIsNotificationModalOpen(false);
            navigate(`/ai-tools/social-pro/post/${scheduledPostId}`);
          }
        }}
      />
    </div>
  );
};

export default DashboardTopbar;
