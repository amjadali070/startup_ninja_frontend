import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaComment, FaRocket } from 'react-icons/fa';

const ContactMain: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            We're <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Here to Help</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Have a question? Need support? Our team responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2 text-red-500" />
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-red-500" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaComment className="mr-2 text-red-500" />
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Other Ways to Reach Us</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FaRocket className="text-red-500 mr-3 text-2xl" />
                  <h3 className="text-xl font-bold">Ninja Assist</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Get instant answers from our AI support guide, available 24/7.
                </p>
                <button className="text-red-500 hover:text-red-400 transition-colors">
                  Open Chat →
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Email Support</h3>
                <p className="text-gray-400 mb-2">support@startupninja.com</p>
                <p className="text-sm text-gray-500">We respond within 24 hours</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Documentation</h3>
                <p className="text-gray-400 mb-4">
                  Find answers in our comprehensive guides and tutorials.
                </p>
                <a href="/documentation" className="text-red-500 hover:text-red-400 transition-colors">
                  Browse Docs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactMain;
