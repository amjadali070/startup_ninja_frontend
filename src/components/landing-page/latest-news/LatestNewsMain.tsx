import React from 'react';

const LatestNewsMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Latest News
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-3xl">
          Stay updated with the latest announcements, product updates, and industry insights.
        </p>
        
        {/* Featured Post */}
        <div className="mb-16 rounded-3xl overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <img src="/images/dashboard-banner.png" alt="Featured" className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-4xl">
            <span className="inline-block px-4 py-1 rounded-full bg-[#ED351C] text-white text-sm font-bold mb-4">Featured</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Introducing the Next Generation of AI Tools</h2>
            <p className="text-lg text-white/80 mb-6 line-clamp-2">
              We're excited to announce our biggest update yet, featuring revolutionary new capabilities that will transform how you create content.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>Nov 26, 2025</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="rounded-2xl overflow-hidden mb-6 aspect-video relative">
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors z-10" />
                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-white/20">
                  Image Placeholder
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#ED351C] font-bold mb-3">
                <span>PRODUCT UPDATE</span>
                <span className="text-white/40 font-normal">•</span>
                <span className="text-white/40 font-normal">Nov {20 - item}, 2025</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#ED351C] transition-colors">
                New Feature Release: Advanced Image Generation {item}
              </h3>
              <p className="text-white/60 line-clamp-3 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <span className="text-sm font-semibold underline decoration-[#ED351C] underline-offset-4">Read Article</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestNewsMain;
