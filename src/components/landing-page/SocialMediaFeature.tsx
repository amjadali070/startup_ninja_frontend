import React from 'react';

const SocialMediaFeature: React.FC = () => (
    <section className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-10 px-4 feature-bg">
        <div className="rounded-3xl shadow-xl p-8 md:p-8 max-w-xl w-full text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Social Media Pro</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-[#ED351C] mb-6">Your Digital Head</h3>
            <p className="text-base md:text-lg text-white/80 mb-2 text-justify">
                This is where the magic of "all-in-one" comes to life. Plan your entire content strategy, generate all the necessary text and visuals, and fill your calendar in a single, highly efficient session. Manage all digital platforms here.
            </p>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center min-w-[340px] max-w-lg w-full mt-12 md:mt-0 md:ml-10 group/chat">
            <img src="/images/socialchat-banner.png" alt="Social Chat Feature" />
        </div>
    </section>
);
export default SocialMediaFeature;
