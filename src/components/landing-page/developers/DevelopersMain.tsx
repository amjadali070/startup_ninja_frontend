import React from 'react';

const DevelopersMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Developers
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-3xl">
          Build the future with our powerful API and developer tools.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-[#1a1a1a] border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-[#ED351C]">API Reference</h3>
              <p className="text-white/70 mb-4">Complete documentation for our REST and GraphQL APIs.</p>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-sm text-gray-400">
                GET /api/v1/generate/image
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-[#1a1a1a] border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-[#ED351C]">SDKs & Libraries</h3>
              <p className="text-white/70">Official client libraries for Python, Node.js, Go, and more.</p>
            </div>
          </div>
          
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Start Building Today</h2>
            <p className="text-white/70 mb-8">
              Get your API key and start integrating AI capabilities into your applications in minutes.
            </p>
            <button className="w-fit px-8 py-4 rounded-full bg-[#ED351C] text-white font-bold hover:bg-[#ff4d33] transition-colors shadow-[0_0_20px_rgba(237,53,28,0.3)]">
              Get API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopersMain;
