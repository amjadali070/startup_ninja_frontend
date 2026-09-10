import React, { useRef } from 'react';
import HeroSection from '../../components/landing-page/home-page/HeroSection';
import ChatFeatureSection from '../../components/landing-page/home-page/ChatFeatureSection';
import ImageWebFeatureSection from '../../components/landing-page/home-page/ImageWebFeatureSection';
import SocialMediaFeature from '../../components/landing-page/home-page/SocialMediaFeature';
import NinjaSalesFeatureSection from '../../components/landing-page/home-page/NinjaSalesFeatureSection';
import NinjaLegalFeatureSection from '../../components/landing-page/home-page/NinjaLegalFeatureSection';
import PricingSection from '../../components/landing-page/home-page/PricingSection';
import LatestNewsSection from '../../components/landing-page/home-page/LatestNewsSection';
import BusinessSection from '../../components/landing-page/home-page/BusinessSection';

const HomePage: React.FC = () => {
  const chatBubbles = [
    { text: 'Is there anything I can help?', style: 'left-[5%] top-[30%]' },
    { text: 'Generate image relation to AI...', style: 'left-[5%] top-[60%]' },
    { text: 'Make a tatto about time and clock.', style: 'right-[5%] top-[40%]' },
    { text: 'are there any other results?', style: 'right-[5%] bottom-[10%]' },
  ];
  const bannerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-white overflow-hidden">
        <HeroSection />
      </section>
      <section
        ref={bannerRef}
        className="relative w-full min-h-[500px] md:min-h-[700px] flex items-center justify-center bg-gradient-to-b from-[#2a0a0a] via-[#1a0a0a] to-[#0a0a0a] overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, #FF7C6A 0%, #ED351C 60%, #EA381F 100%)',
              filter: 'blur(120px)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center py-16 px-4">
          <h3 className="text-xs md:text-sm text-white/80 text-center mb-2 tracking-widest">
            EXPLORE THE POWER OF AI TECHNOLOGY
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-white drop-shadow-lg leading-tight md:leading-[4rem]">
            Design the Future with AI<br /> Image Generation
          </h2>

          <p className="text-base md:text-lg text-center text-white/70 mb-8 max-w-2xl mx-auto">
            Explore the power of AI technology to create stunning images and illustrations. Bring your ideas to life with intuitive AI.
          </p>

          <div className="relative w-full flex items-center justify-center">
            <img
              src="/images/dashboard-banner.png"
              alt="Dashboard Mockup"
              className="rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl mx-auto object-top"
            />
            {chatBubbles.map((bubble, idx) => (
              <span
                key={idx}
                className={`hidden md:block absolute ${bubble.style} bg-[#ac898938] text-white text-sm px-5 py-3 rounded-2xl shadow-[0_4px_24px_0_rgba(255,59,59,0.25)] border border-white/10 backdrop-blur-md`}
                style={{ pointerEvents: 'none' }}
              >
                {bubble.text}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="relative w-full min-h-full bg-black mt-10 mb-10 flex flex-col gap-6 md:gap-10">
        <ChatFeatureSection />
        <ImageWebFeatureSection />
        <SocialMediaFeature />
        <NinjaSalesFeatureSection />
        <NinjaLegalFeatureSection />
        <section className="relative w-full flex flex-col md:flex-row gap-8 items-center justify-center py-10 px-4 mt-4 md:mt-10 overflow-hidden">
          <div className="z-10 rounded-3xl p-4 md:p-8 max-w-xl w-full text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Built for Creating</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-[#ED351C] mb-6">Marketing Success</h3>
            <p className="text-base md:text-lg text-white/80 mb-2 text-justify">
              Don't let your brilliant ideas get buried just because of time constraints or design skills. With our AI
              technology, you can transform simple concepts into stunning visuals in just seconds. Enjoy unlimited creative
              freedom, where you can create, customize, and inspire with high-quality visuals.
            </p>
          </div>
          <div className="relative flex-1 flex items-center justify-center min-w-[300px] md:min-w-[340px] max-w-lg w-full z-10">
            <div className="relative drop-shadow-[30px_20px_100px_rgba(237,53,28,0.3)]">
              <img src="/images/mockup-banner.png" alt="App Mockup" className="w-full max-w-[300px] md:w-[442px] h-auto md:h-[795px] object-contain" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(237,53,28,0.25)_0%,transparent_80%)] blur-2xl rounded-full -z-10"></div>
            </div>
          </div>
        </section>
        <section className="relative w-full flex flex-col md:flex-row gap-8 items-center justify-center py-10 px-4 mt-4 md:mt-10 overflow-hidden bg-[#0f0503]">
          <img src="/images/banner-info.gif" alt="Banner Mockup" className="object-cover w-full max-w-6xl" />
        </section>
      </section>
      <div id="pricing">
        <PricingSection />
      </div>
      <LatestNewsSection />
      <BusinessSection />
    </>
  );
};
export default HomePage;