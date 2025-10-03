import type { FC } from 'react';

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner: FC<WelcomeBannerProps> = ({ name }) => {

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#151515] border border-black px-8 py-10 xl:px-10 xl:py-12">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#151515]" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[32px] font-bold text-white">Welcome back, {name || 'Ninja'}</h2>
          <p className="text-sm mt-2 text-gray-400">
            What do you want to create today?
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg"
          style={{
            background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'
          }}
        >
          <span className="text-lg font-bold">+</span>
          Start New Project
        </button>
      </div>
    </section>
  );
};

export default WelcomeBanner;
