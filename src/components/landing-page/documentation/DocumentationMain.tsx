import React from 'react';

const DocumentationMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Getting Started</h3>
              <ul className="space-y-3 text-white/60">
                <li className="text-[#ED351C] font-medium">Introduction</li>
                <li className="hover:text-white cursor-pointer">Quick Start</li>
                <li className="hover:text-white cursor-pointer">Installation</li>
                <li className="hover:text-white cursor-pointer">Authentication</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Core Concepts</h3>
              <ul className="space-y-3 text-white/60">
                <li className="hover:text-white cursor-pointer">Architecture</li>
                <li className="hover:text-white cursor-pointer">Data Models</li>
                <li className="hover:text-white cursor-pointer">Workflows</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">API Reference</h3>
              <ul className="space-y-3 text-white/60">
                <li className="hover:text-white cursor-pointer">Endpoints</li>
                <li className="hover:text-white cursor-pointer">Error Codes</li>
                <li className="hover:text-white cursor-pointer">Rate Limits</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Documentation</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-white/70 mb-8">
              Welcome to the Startup Ninja documentation. Here you'll find everything you need to integrate our AI tools into your workflow.
            </p>
            
            <div className="p-8 rounded-3xl bg-[#1a1a1a] border border-white/10 mb-12">
              <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
              <p className="text-white/70 mb-6">
                Get up and running with Startup Ninja in less than 5 minutes.
              </p>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-sm text-gray-400 mb-4">
                npm install @startup-ninja/sdk
              </div>
              <button className="text-[#ED351C] font-semibold hover:underline">Read full guide →</button>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 mt-12">Popular Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 hover:border-[#ED351C]/30 cursor-pointer transition-colors">
                  <h3 className="text-lg font-bold mb-2">Topic Title {i}</h3>
                  <p className="text-sm text-white/60">Learn how to implement feature {i} effectively.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationMain;
