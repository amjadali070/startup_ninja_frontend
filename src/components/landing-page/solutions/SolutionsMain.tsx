import React from 'react';

const SolutionsMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Solutions
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-3xl">
          Tailored AI solutions for every industry and use case.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {['Enterprise', 'Small Business', 'Creators', 'Agencies'].map((item) => (
            <div key={item} className="group relative overflow-hidden p-8 rounded-3xl bg-[#1a1a1a] border border-white/10 hover:border-[#ED351C]/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ED351C]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
              <h2 className="text-3xl font-bold mb-4 text-white relative z-10">{item}</h2>
              <p className="text-white/70 relative z-10 mb-6">
                Comprehensive solutions designed specifically for {item.toLowerCase()} needs, scaling with your growth.
              </p>
              <button className="text-[#ED351C] font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                Learn more <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionsMain;
