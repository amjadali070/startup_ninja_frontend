import React from 'react';

const BusinessMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Startup Ninja for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ED351C] to-[#ff7c6a]">Business</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Scale your content production with enterprise-grade AI tools designed for teams. Security, collaboration, and control built-in.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full bg-[#ED351C] text-white font-bold hover:bg-[#ff4d33] transition-colors shadow-[0_0_20px_rgba(237,53,28,0.3)]">
                Contact Sales
              </button>
              <button className="px-8 py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-[#ED351C] blur-[100px] opacity-20 rounded-full" />
            <div className="relative z-10 bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <span className="text-white/20 text-2xl">Enterprise Dashboard Mockup</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { title: 'Enterprise Security', desc: 'SSO, audit logs, and role-based access control.' },
            { title: 'Team Collaboration', desc: 'Shared workspaces, asset libraries, and approval workflows.' },
            { title: 'Dedicated Support', desc: '24/7 priority support and dedicated success manager.' }
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-3xl bg-[#1a1a1a] border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
              <p className="text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center bg-gradient-to-b from-[#1a1a1a] to-black border border-white/10 rounded-3xl p-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to scale?</h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of forward-thinking companies using Startup Ninja to revolutionize their workflows.
          </p>
          <button className="px-10 py-5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessMain;
