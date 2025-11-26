import React from 'react';

const ContactMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Contact Us
          </h1>
          <p className="text-xl text-white/70 mb-12">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-[#ED351C]/20 flex items-center justify-center text-[#ED351C]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-white/70">support@startupninja.com</p>
                <p className="text-white/70">sales@startupninja.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-[#ED351C]/20 flex items-center justify-center text-[#ED351C]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Office</h3>
                <p className="text-white/70">123 Innovation Drive</p>
                <p className="text-white/70">Tech City, TC 90210</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
              <textarea className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ED351C] focus:outline-none transition-colors h-40" placeholder="How can we help?" />
            </div>
            <button type="button" className="w-full bg-[#ED351C] text-white font-bold py-4 rounded-xl hover:bg-[#ff4d33] transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactMain;
