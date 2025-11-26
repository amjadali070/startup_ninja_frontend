import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaImage, FaCode, FaShareAlt, FaSearch } from 'react-icons/fa';

const DocumentationMain: React.FC = () => {
  const sections = [
    {
      icon: <FaRocket className="w-10 h-10" />,
      title: 'Ninja Chat',
      description: 'Learn how to use your AI Co-Founder for research, strategy, and content creation.',
      articles: ['Getting Started', 'Writing Prompts', 'Content Generation', 'Business Planning']
    },
    {
      icon: <FaImage className="w-10 h-10" />,
      title: 'Imaginative Ninja',
      description: 'Master image generation for logos, brand assets, and marketing materials.',
      articles: ['Creating Images', 'Brand Library', 'Image Styles', 'Best Practices']
    },
    {
      icon: <FaCode className="w-10 h-10" />,
      title: 'Web Builder',
      description: 'Build professional websites with our no-code drag-and-drop editor.',
      articles: ['Quick Start', 'Adding Elements', 'SEO Settings', 'Publishing Sites']
    },
    {
      icon: <FaShareAlt className="w-10 h-10" />,
      title: 'Social Media Pro',
      description: 'Automate your social media presence across all platforms.',
      articles: ['Connecting Accounts', 'Scheduling Posts', 'Content Calendar', 'Analytics']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Documentation</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Everything you need to master Startup Ninja
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300">
                <div className="text-red-500 mb-4">{section.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                <p className="text-gray-400 mb-6">{section.description}</p>
                
                <ul className="space-y-3">
                  {section.articles.map((article, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-gray-300 hover:text-red-500 transition-colors flex items-center">
                        <span className="mr-2">→</span>
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Need More Help?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            CONTACT SUPPORT
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DocumentationMain;
