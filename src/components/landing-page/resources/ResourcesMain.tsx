import React from 'react';

const ResourcesMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Resources
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {['Blog', 'Case Studies', 'Community', 'Help Center', 'Tutorials', 'Webinars'].map((item) => (
            <div key={item} className="group p-8 rounded-3xl bg-[#1a1a1a] border border-white/10 hover:border-[#ED351C]/50 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[#ED351C] transition-colors">{item}</h2>
              <p className="text-white/70 mb-6">
                Explore our collection of {item.toLowerCase()} to help you get the most out of our platform.
              </p>
              <div className="w-full h-40 bg-black/30 rounded-xl mb-4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesMain;
