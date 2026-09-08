import type { FC } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Shared error-state block for failed data fetches (e.g. "Failed to fetch
 * profile"). Pairs with EmptyState/LoadingSpinner so every screen has a
 * consistent loading / empty / error trio instead of dead-ending on a
 * blank screen or a raw error string.
 */
const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We couldn't load this. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`.trim()}
      role="alert"
    >
      <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
        <FiAlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-white text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-white/50 text-sm mt-1.5 max-w-sm">{description}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors text-sm font-medium"
        >
          <FiRefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
