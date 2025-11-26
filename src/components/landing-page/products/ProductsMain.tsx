import React from 'react';

const ProductsMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Our Products
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-3xl">
          Discover our suite of AI-powered tools designed to revolutionize your creative workflow.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="p-8 rounded-3xl bg-[#1a1a1a] border border-white/10 hover:border-[#ED351C]/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[#ED351C]/20 flex items-center justify-center mb-6">
                <div className="w-6 h-6 rounded-full bg-[#ED351C]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Product Feature {item}</h2>
              <p className="text-white/70">
                Advanced AI capabilities that allow you to generate stunning visuals and content in seconds.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsMain;
