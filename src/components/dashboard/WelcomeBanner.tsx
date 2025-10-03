import type { FC } from 'react';

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner: FC<WelcomeBannerProps> = ({ name }) => {

  return (
    <section className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#151515] border border-black px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 xl:px-10 xl:py-12">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#151515]" />
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-white leading-tight">
            Welcome back, <span className="break-words">{name || 'Ninja'}</span>
          </h2>
          <p className="text-xs sm:text-sm mt-2 text-gray-400">
            What do you want to create today?
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
            style={{
              background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'
            }}
          >
            <span className="text-base sm:text-lg font-bold">+</span>
            <span className="hidden xs:inline">Start New Project</span>
            <span className="xs:hidden">New Project</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
