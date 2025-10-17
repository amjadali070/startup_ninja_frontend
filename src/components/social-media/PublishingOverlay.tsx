import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

type Props = {
  open: boolean;
  title?: string;
  subtitle?: string;
};

const PublishingOverlay: React.FC<Props> = ({ open, title = 'Your posts are being published', subtitle = 'Sit back and wait few moments...' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#121212] shadow-2xl">
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col items-center text-center gap-4">
            <LoadingSpinner variant="dark" size="medium" />
            <div className="space-y-1">
              <div className="text-white text-base sm:text-lg font-semibold">{title}</div>
              <div className="text-gray-400 text-xs sm:text-sm">{subtitle}</div>
            </div>
            <div className="w-full mt-2">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#D60000] animate-[progressSlide_1.2s_ease-in-out_infinite] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progressSlide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(40%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  );
};

export default PublishingOverlay;


