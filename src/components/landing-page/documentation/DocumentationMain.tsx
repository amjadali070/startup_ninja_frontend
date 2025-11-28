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
            <span style={{color: '#D23621'}}>Documentation</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{color: '#CCCCCC'}}>
            Everything you need to master Startup Ninja
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{color: '#999'}} />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 bg-black rounded-lg focus:outline-none transition-colors border"
                style={{border: '1px solid #8B0000'}}
                onFocus={(e) => e.currentTarget.style.borderColor = '#D23621'}
                onBlur={(e) => e.currentTarget.style.borderColor = ''}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="rounded-lg p-8 border transition-all duration-300"
                style={{
                  background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
                  border: '1px solid #8B0000'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(143.82deg, rgba(129, 0, 0, 0.5) -18.07%, rgba(58, 0, 0, 0.5) 4.29%, rgba(29, 0, 0, 0.25) 56.47%, rgba(13, 12, 13, 0.5) 101.2%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)';
                }}
              >
                <div className="mb-4" style={{color: '#D23621'}}>{section.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                <p className="mb-6" style={{color: '#CCCCCC'}}>{section.description}</p>
                
                <ul className="space-y-3">
                  {section.articles.map((article, idx) => (
                    <li key={idx}>
                      <a href="#" className="transition-colors flex items-center" style={{color: '#CCCCCC'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D23621'} onMouseLeave={(e) => e.currentTarget.style.color = '#CCCCCC'}>
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
          <p className="text-xl mb-8" style={{color: '#CCCCCC'}}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
          >
            CONTACT SUPPORT
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DocumentationMain;
