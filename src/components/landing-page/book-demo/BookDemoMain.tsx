import React from 'react';

const BookDemoMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Book a Demo
          </h1>
          <p className="text-xl text-white/70">
            See how our AI platform can transform your business. Schedule a personalized walkthrough with our experts.
          </p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 md:p-12">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">First Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Last Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Work Email</label>
              <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors" placeholder="john@company.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Company Name</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors" placeholder="Acme Inc." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">How can we help?</label>
              <textarea className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors h-32" placeholder="Tell us about your needs..." />
            </div>
            
            <button type="button" className="w-full bg-[#ED351C] text-white font-bold py-4 rounded-xl hover:bg-[#ff4d33] transition-colors shadow-[0_0_20px_rgba(237,53,28,0.3)]">
              Schedule Demo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDemoMain;
