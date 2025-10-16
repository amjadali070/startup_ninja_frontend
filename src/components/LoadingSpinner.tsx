import type { FC } from 'react';
import { GiNinjaStar } from 'react-icons/gi';

type LoadingSpinnerVariant = 'dark' | 'light';
type LoadingSpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  variant?: LoadingSpinnerVariant;
  size?: LoadingSpinnerSize; // optional size, defaults to current (medium)
  className?: string;
}

const variantStyles: Record<LoadingSpinnerVariant, {
  container: string;
  icon: string;
  message: string;
}> = {
  dark: {
    container: '',
    icon: 'text-[#FF4D4D] drop-shadow-[0_0_14px_rgba(255,77,77,0.28)]',
    message: 'bg-gradient-to-r from-[#FF9E9E] via-[#FF4D4D] to-[#D60000] bg-clip-text font-semibold uppercase tracking-[0.3em] text-transparent',
  },
  light: {
    container: '',
    icon: 'text-[#E50000] drop-shadow-[0_0_10px_rgba(229,0,0,0.21)]',
    message: 'bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] bg-clip-text font-semibold uppercase tracking-[0.3em] text-transparent',
  },
};

const sizeStyles: Record<LoadingSpinnerSize, {
  icon: string;
  message: string;
  gap: string;
  padding: string;
}> = {
  small: {
    icon: 'h-5 w-5',
    message: 'text-sm',
    gap: 'gap-2',
    padding: 'px-4 py-3',
  },
  medium: {
    icon: 'h-9 w-9', // current default size
    message: 'text-lg',
    gap: 'gap-4',
    padding: 'px-6 py-4',
  },
  large: {
    icon: 'h-12 w-12',
    message: 'text-xl',
    gap: 'gap-5',
    padding: 'px-8 py-6',
  },
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  fullscreen = false,
  variant = 'dark',
  size = 'medium',
  className = '',
}) => {
  const styles = variantStyles[variant];
  const sz = sizeStyles[size];
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
      <div className={`flex items-center ${sz.gap} ${sz.padding}`}>
        <GiNinjaStar
          className={`${sz.icon} animate-spin ${styles.icon}`}
          aria-hidden="true"
        />
        <span className={`${styles.message} ${sz.message}`}>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
