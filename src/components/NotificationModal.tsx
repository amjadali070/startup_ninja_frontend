import React from 'react';
import { FiX, FiBell, FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <FiAlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-4 right-4 z-50 w-96 max-w-sm animate-in slide-in-from-top-2 duration-300">
        <div className="bg-[#0B0B0F]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiBell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-[#FF3B3B] border border-[#0B0B0F]" />
                )}
              </div>
              <h2 className="text-white text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-[#FF3B3B] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Close notifications"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto notification-scroll">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FiBell className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-sm">No notifications yet</p>
                <p className="text-white/40 text-xs mt-1">We'll notify you when there's something new</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer group ${
                      !notification.read ? 'bg-[#FF3B3B]/5 border-l-2 border-[#FF3B3B]' : ''
                    }`}
                    onClick={() => onMarkAsRead?.(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-medium truncate group-hover:text-white/90">
                          {notification.title}
                        </h3>
                        <p className="text-white/70 text-xs mt-1 leading-relaxed line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-white/40 text-xs mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                          {notification.timestamp}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-[#FF3B3B] rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-white/5 bg-white/5">
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;