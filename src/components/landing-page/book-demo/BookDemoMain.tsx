import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaBuilding, FaClock } from 'react-icons/fa';

const BookDemoMain: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo booking:', formData);
  };

  const demoFeatures = [
    'Personalized 30-minute walkthrough',
    'Live Q&A with product expert',
    'Custom setup assistance',
    'Exclusive onboarding resources'
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            See Startup Ninja <span style={{color: '#D23621'}}>in Action</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Book a personalized demo and discover how Startup Ninja can transform your business.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Book Your Demo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2 text-red-500" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-red-500" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-red-500" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  What would you like to learn about?
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your goals..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
                style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
              >
                BOOK DEMO
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">What to Expect</h2>
            
            <div className="space-y-6 mb-8">
              {demoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-lg">{feature}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-4">
                <FaClock className="text-red-500 mr-3 text-2xl" />
                <h3 className="text-xl font-bold">30-Minute Session</h3>
              </div>
              <p className="text-gray-400">
                Our product experts will walk you through the entire platform, answer your questions, and help you get started.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-gray-400">
                <li>• Founders evaluating tools</li>
                <li>• Agencies looking to scale</li>
                <li>• Teams considering migration</li>
                <li>• Anyone with specific questions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prefer to Start on Your Own?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No demo needed—start building for free today.
          </p>
          <a 
            href="/register" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            START FOR FREE
          </a>
        </div>
      </section>
    </div>
  );
};

export default BookDemoMain;
