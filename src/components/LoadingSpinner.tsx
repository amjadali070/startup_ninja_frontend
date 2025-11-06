import { useId } from "react";
import type { FC } from "react";

type LoadingSpinnerVariant = "dark" | "light";
type LoadingSpinnerSize = "small" | "medium" | "large";

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  variant?: LoadingSpinnerVariant;
  size?: LoadingSpinnerSize; // optional size, defaults to current (medium)
  className?: string;
}

const variantStyles: Record<
  LoadingSpinnerVariant,
  {
    container: string;
    icon: string;
    message: string;
  }
> = {
  dark: {
    container: "",
    icon: "text-[#FF4D4D] drop-shadow-[0_0_14px_rgba(255,77,77,0.28)]",
    message:
      "bg-gradient-to-r from-[#FF9E9E] via-[#FF4D4D] to-[#D60000] bg-clip-text font-semibold uppercase tracking-[0.3em] text-transparent",
  },
  light: {
    container: "",
    icon: "text-[#E50000] drop-shadow-[0_0_10px_rgba(229,0,0,0.21)]",
    message:
      "bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] bg-clip-text font-semibold uppercase tracking-[0.3em] text-transparent",
  },
};

const sizeStyles: Record<
  LoadingSpinnerSize,
  {
    icon: string;
    message: string;
    gap: string;
    padding: string;
  }
> = {
  small: {
    icon: "h-8 w-8",
    message: "text-sm",
    gap: "gap-2",
    padding: "px-4 py-3",
  },
  medium: {
    icon: "h-12 w-12",
    message: "text-lg",
    gap: "gap-4",
    padding: "px-6 py-4",
  },
  large: {
    icon: "h-16 w-16",
    message: "text-xl",
    gap: "gap-5",
    padding: "px-8 py-6",
  },
};

const NinjaStarIcon: FC<{ className?: string }> = ({ className = "" }) => {
  const gradientId = useId();

  return (
    <svg
      className={className}
      viewBox="0 0 156 161"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0 16)">
        <path
          d="M116.814 82.4508C114.552 72.2751 108.064 63.5229 99.501 57.8035C99.3242 57.6881 99.3255 57.5262 99.3004 57.3418C99.1381 56.1425 99.3453 53.8473 99.4403 52.5604C99.906 46.2493 101.384 40.0338 105.005 34.8052C107.982 30.5081 111.611 28.9214 115.333 25.6895C117.694 23.6398 119.216 20.9718 120.153 18L116.811 20.2766C112.344 22.8438 107.115 22.93 102.162 23.722C90.1361 25.6444 80.0734 31.2988 72.6045 40.9638C72.2337 41.444 70.7706 43.7405 70.4513 43.84C70.0673 43.8042 69.6346 43.9979 69.2916 44.0019C62.4322 44.0696 54.3221 41.3631 49.17 36.7727C43.601 31.8109 41.3845 23.604 34 20.9174C34.5475 22.2003 35.318 23.393 35.8695 24.6746C38.0254 29.6988 37.904 34.7654 38.6349 40.0696C40.2683 51.9117 44.4427 61.8181 53.1281 70.0728C53.5938 70.5159 54.9079 71.3477 54.9831 71.9222C55.1243 73.0035 54.9316 75.0147 54.8433 76.1729C54.1862 84.8548 51.7111 91.2561 45.7449 97.5367C43.2434 100.17 40.1311 102.394 38.4159 105.691C37.5544 107.348 37.1097 109.168 36.7707 111C37.9027 109.944 39.0149 108.853 40.3145 107.998C44.9969 104.91 50.843 104.83 56.189 103.662C67.6991 101.147 78.1379 95.3569 85.3904 85.9268C94.2169 85.0737 103.306 87.5931 109.403 94.281C113.412 98.6803 115.923 105.05 122 107.019C117.799 99.5586 118.634 90.6458 116.814 82.4508ZM69.8312 70.1259C65.7715 64.4768 69.1055 55.9727 76.0572 55.182C82.8322 54.4125 88.1083 60.5591 86.2796 67.1872C84.2228 74.6406 74.3368 76.3945 69.8312 70.1259Z"
          fill={`url(#${gradientId})`}
        />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="34"
          y1="64.5"
          x2="122"
          y2="64.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DC2626" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  fullscreen = false,
  variant = "dark",
  size = "medium",
  className = "",
}) => {
  const styles = variantStyles[variant];
  const sz = sizeStyles[size];
  const containerBase = fullscreen
    ? "flex min-h-screen items-center justify-center"
    : "flex items-center justify-center w-full h-full";

  return (
    <div
      className={`${containerBase} ${styles.container} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`flex items-center ${sz.gap} ${sz.padding}`}>
        <NinjaStarIcon className={`${sz.icon} ninja-spinner ${styles.icon}`} />
        <span className={`${styles.message} ${sz.message}`}>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
