import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaVideo, FaQuestionCircle, FaFileAlt, FaUsers, FaRocket } from 'react-icons/fa';

const ResourcesMain: React.FC = () => {
  const resourceCategories = [
    {
      icon: <FaBook className="w-10 h-10" />,
      title: 'Documentation',
      description: 'Complete guides for every feature',
      link: '/documentation',
      color: 'from-red-600 to-orange-600'
    },
    {
      icon: <FaVideo className="w-10 h-10" />,
      title: 'Video Tutorials',
      description: 'Step-by-step video walkthroughs',
      link: '#',
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: <FaFileAlt className="w-10 h-10" />,
      title: 'Templates',
      description: 'Ready-to-use templates and examples',
      link: '#',
      color: 'from-red-600 to-pink-600'
    },
    {
      icon: <FaQuestionCircle className="w-10 h-10" />,
      title: 'FAQs',
      description: 'Answers to common questions',
      link: '#',
      color: 'from-pink-600 to-red-600'
    }
  ];

  const popularResources = [
    {
      category: 'Getting Started',
      title: 'Quick Start Guide',
      description: 'Get up and running in 5 minutes',
      readTime: '5 min read'
    },
    {
      category: 'AI Chat',
      title: 'How to Write Effective Prompts',
      description: 'Master the art of AI communication',
      readTime: '8 min read'
    },
    {
      category: 'Image Generation',
      title: 'Creating Your Brand Identity',
      description: 'Generate logos and brand assets',
      readTime: '10 min read'
    },
    {
      category: 'Web Builder',
      title: 'Building Your First Website',
      description: 'From blank page to published site',
      readTime: '15 min read'
    },
    {
      category: 'Social Media',
      title: 'Automating Your Content Calendar',
      description: 'Schedule a month of posts in one hour',
      readTime: '12 min read'
    },
    {
      category: 'Best Practices',
      title: 'SEO Optimization Tips',
      description: 'Get found on Google faster',
      readTime: '10 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Master Your <span style={{color: '#D23621'}}>AI Co-Founder</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Everything you need to become a Startup Ninja—guides, tutorials, templates, and support.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                <p className="text-gray-400">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Popular <span style={{color: '#D23621'}}>Resources</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularResources.map((resource, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group cursor-pointer">
                <div className="text-red-500 text-sm font-semibold mb-2">{resource.category}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors">{resource.title}</h3>
                <p className="text-gray-400 mb-4">{resource.description}</p>
                <div className="text-sm text-gray-500">{resource.readTime}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-center">Need Help?</h2>
            <p className="text-xl text-gray-300 text-center mb-12">
              Our support team is here to help you succeed
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-block p-4 bg-red-600/20 rounded-full mb-4">
                  <FaRocket className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="font-bold mb-2">Ninja Assist</h4>
                <p className="text-sm text-gray-400 mb-4">Chat with our AI support guide 24/7</p>
                <button className="text-red-500 hover:text-red-400 transition-colors">
                  Open Chat →
                </button>
              </div>

              <div className="text-center">
                <div className="inline-block p-4 bg-red-600/20 rounded-full mb-4">
                  <FaUsers className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="font-bold mb-2">Community</h4>
                <p className="text-sm text-gray-400 mb-4">Join our founder community</p>
                <button className="text-red-500 hover:text-red-400 transition-colors">
                  Join Now →
                </button>
              </div>

              <div className="text-center">
                <div className="inline-block p-4 bg-red-600/20 rounded-full mb-4">
                  <FaQuestionCircle className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="font-bold mb-2">Email Support</h4>
                <p className="text-sm text-gray-400 mb-4">Get help from our team</p>
                <Link to="/contact" className="text-red-500 hover:text-red-400 transition-colors">
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Explore our resources and start building your dream today.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
          >
            START FOR FREE
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ResourcesMain;
