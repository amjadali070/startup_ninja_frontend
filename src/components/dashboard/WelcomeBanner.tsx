import type { FC } from 'react';

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner: FC<WelcomeBannerProps> = ({ name }) => {

  return (
    <section
      className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-8 md:px-8 md:py-10 xl:px-10 xl:py-12">
        <div className="flex-1 min-w-0">
          <h2 className="font-plus-jakarta w-full text-2xl font-bold leading-8 text-white sm:text-3xl sm:leading-[44px] md:text-[34px] md:leading-[48px]">
            {`Welcome back${name ? `, ${name}` : ''}`}
          </h2>
          <p className="font-plus-jakarta mt-2 text-sm leading-6 text-gray-300 sm:mt-3 sm:text-base sm:leading-7 md:text-[21px] md:leading-[34px]">
            What do you want to create today?
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            className="font-plus-jakarta inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
          >
            <span className="text-base font-bold sm:text-lg">+</span>
            <span className="hidden xs:inline">Start New Project</span>
            <span className="xs:hidden">New Project</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
