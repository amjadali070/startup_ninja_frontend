import React from 'react';

const ImageWebFeatureSection: React.FC = () => (
    <section className="w-full flex flex-col md:flex-row gap-8 items-stretch justify-center py-10 px-4 bg-transparent">
        {/* Image Generation Feature */}
        <div className="flex-1 bg-[#18181b] rounded-3xl shadow-xl p-6 md:p-14 max-w-xl w-full text-left flex flex-col justify-between">
            <div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Image Generation</h2>
                <h3 className="text-xl md:text-3xl font-bold text-[#ED351C] mb-6">Your Creative Director</h3>
                <p className="text-base md:text-lg text-white/80 mb-8 text-justify">
                    Describe any image you can imagine, and our AI will create it in seconds. Generate unique logos, stunning blog headers, engaging social media posts, and professional ad creatives that are perfectly aligned with your brand. No design skills needed; just your vision.
                </p>
            </div>
            <div className="relative flex items-end gap-6 mt-8">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black w-full" style={{boxShadow: 'rgb(237 53 28 / 26%) 10px 2px 25px 0px, rgb(255 124 106 / 18%) 4px 11px 11px 0px'}}>
                    <img src="/images/image-banner.png" alt="Image Generation Banner" className="object-cover w-full h-auto" />
                </div>
                <img src="/images/chat-feature.png" alt="Ninja Mascot" className="w-48 h-48 md:w-72 md:h-72 object-contain drop-shadow-2xl scale-x-[-1] -ml-16 md:-ml-24 -mb-8 md:-mb-12" style={{ zIndex: 2}} />
            </div>
        </div>
        {/* Web Builder Feature */}
        <div className="flex-1 bg-[#18181b] rounded-3xl shadow-xl p-6 md:p-14 max-w-xl w-full text-left flex flex-col justify-between">
            <div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Web Builder</h2>
                <h3 className="text-xl md:text-3xl font-bold text-[#ED351C] mb-6">Your Development Team</h3>
                <p className="text-base md:text-lg text-white/80 mb-8 text-justify">
                    Simply describe your business and its goals. Your AI Co-Founder will instantly design and build a multi-page, professional website complete with compelling copy and stunning images. Customize anything you want with a simple drag-and-drop editor, and publish your site in minutes, not months.
                </p>
            </div>
            <div className="relative flex items-end gap-6 mt-8">
                <img src="/images/builder-mascot.png" alt="Builder Mascot" className="w-56 h-56 md:w-80 md:h-80 object-contain drop-shadow-2xl -mr-16 md:-mr-24 -mb-8 md:-mb-12" style={{ zIndex: 2, position: 'relative' }} />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black w-full" style={{boxShadow: 'rgb(237 53 28 / 26%) 10px 2px 25px 0px, rgb(255 124 106 / 18%) 4px 11px 11px 0px'}}>
                    <img src="/images/builder-banner.png" alt="Web Builder Banner" className="w-full h-auto" />
                </div>
            </div>
        </div>
    </section>
);

export default ImageWebFeatureSection;
