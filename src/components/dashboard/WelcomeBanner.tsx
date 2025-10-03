import type { FC } from 'react';

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner: FC<WelcomeBannerProps> = () => {

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_left,#FF4D4D_0%,rgba(8,7,12,0.6)_45%,rgba(8,7,12,0.95)_100%)] px-8 py-10 xl:px-10 xl:py-12 border border-white/10 shadow-[0_24px_60px_rgba(229,0,0,0.25)]">
      <div className="absolute inset-0">
        <img
          src="/images/login-bg.png"
          alt="Hero"
          className="h-full w-full object-cover opacity-40 mix-blend-lighten"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,0,0,0.25)_0%,rgba(8,7,12,0.92)_70%)]" />
      </div>
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-[32px] uppercase tracking-[0.2em] font-semibold text-white">Welcome back</h2>
        <p  className="text-sm mt-4 leading-snug tracking-[0.2em] text-white/70" >
          What do you want to create today?
        </p>
        
      </div>
    </section>
  );
};

export default WelcomeBanner;
