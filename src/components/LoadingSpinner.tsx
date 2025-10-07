import type { FC } from 'react';
import { GiNinjaStar } from 'react-icons/gi';

type LoadingSpinnerVariant = 'dark' | 'light';

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  variant?: LoadingSpinnerVariant;
  className?: string;
}

const variantStyles: Record<LoadingSpinnerVariant, {
  container: string;
  icon: string;
  message: string;
}> = {
  dark: {
    container: 'bg-[#07070C]',
    icon: 'text-[#FF4D4D] drop-shadow-[0_0_14px_rgba(255,77,77,0.28)]',
    message: 'bg-gradient-to-r from-[#FF9E9E] via-[#FF4D4D] to-[#D60000] bg-clip-text text-lg font-semibold uppercase tracking-[0.3em] text-transparent',
  },
  light: {
    container: 'bg-white',
    icon: 'text-[#E50000] drop-shadow-[0_0_10px_rgba(229,0,0,0.21)]',
    message: 'bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] bg-clip-text text-lg font-semibold uppercase tracking-[0.3em] text-transparent',
  },
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  fullscreen = false,
  variant = 'dark',
  className = '',
}) => {
  const styles = variantStyles[variant];
  const containerBase = fullscreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center';

  return (
    <div
      className={`${containerBase} ${styles.container} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-4 px-6 py-4">
        <GiNinjaStar
          className={`h-9 w-9 animate-spin ${styles.icon}`}
          aria-hidden="true"
        />
        <span className={styles.message}>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
