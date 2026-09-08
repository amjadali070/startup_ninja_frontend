import type { FC, ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Shared empty-state block for lists/tables with no data yet (no leads,
 * no websites, no chat history match, etc). Keeps empty states visually
 * consistent instead of each page building its own ad hoc "No X found" text.
 */
const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`.trim()}
    >
      <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-4">
        {icon ?? <FiInbox className="h-6 w-6" />}
      </div>
      <h3 className="text-white text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-white/50 text-sm mt-1.5 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
