import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaImage, FaCode, FaShareAlt, FaCheck } from 'react-icons/fa';

const ProductsMain: React.FC = () => {
  const products = [
    {
      icon: <FaRocket className="w-12 h-12" />,
      name: 'Ninja Chat',
      tagline: 'Your 24/7 Strategic Partner',
      description: 'Your AI Co-Founder that conducts deep research, creates content, and helps you build winning strategies. From market analysis to blog posts, it handles everything.',
      features: [
        'Deep General Research',
        'Business Strategy & Analysis',
        'Content Creation',
        'Planning & Operations'
      ],
      color: 'from-red-600 to-orange-600'
    },
    {
      icon: <FaImage className="w-12 h-12" />,
      name: 'Imaginative Ninja',
      tagline: 'Your In-House Creative Director',
      description: 'Turn text into stunning visuals in seconds. Generate logos, brand assets, and marketing materials without expensive designers or stock photos.',
      features: [
        'Complete Brand Identity',
        'Marketing & Ad Creative',
        'Unlimited Revisions',
        'Content Library'
      ],
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: <FaCode className="w-12 h-12" />,
      name: 'Web Builder',
      tagline: 'Your Expert No-Code Developer',
      description: 'Launch your professional website in minutes with our drag-and-drop builder. No coding required, SEO-optimized from day one.',
      features: [
        'Drag-and-Drop Editor',
        'SEO-Optimized',
        'Free Hosting & SSL',
        'Integrated Blog'
      ],
      color: 'from-red-600 to-pink-600'
    },
    {
      icon: <FaShareAlt className="w-12 h-12" />,
      name: 'Social Media Pro',
      tagline: 'Your Tireless Marketing Manager',
      description: 'Automate your social media presence. Plan, create, and schedule content for all platforms from one unified dashboard.',
      features: [
        'Unified Content Calendar',
        'AI-Powered Content',
        'Automated Scheduling',
        'Multi-Platform Support'
      ],
      color: 'from-pink-600 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-transparent bg-clip-text">
            Your Complete AI Co-Founder Toolkit
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Four powerful tools, one integrated platform. Everything you need to build, design, and market your startup—faster than ever.
          </p>
          <Link 
            to="/pricing" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            START FOR FREE
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
              >
                {/* Icon */}
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${product.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {product.icon}
                </div>

                {/* Content */}
                <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
                <p className="text-red-400 text-lg mb-4">{product.tagline}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

                {/* Features */}
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-400">
                      <FaCheck className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            One Platform, <span className="text-red-500">Infinite Possibilities</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Stop juggling a dozen subscriptions. Our tools work together seamlessly—generate content in Ninja Chat, create visuals in Imaginative Ninja, build your site, and schedule it all on social media.
          </p>

          {/* Integration Flow */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {['Research & Plan', 'Design & Create', 'Build & Launch', 'Market & Grow'].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                    {index + 1}
                  </div>
                  <p className="font-semibold">{step}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-red-600 to-orange-600"></div>
                )}
              </div>
            ))}
          </div>

          <Link 
            to="/solutions" 
            className="inline-block px-8 py-4 border-2 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 transition-all duration-300"
          >
            SEE HOW IT WORKS
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Dream?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of founders who've replaced their fragmented stack with one powerful platform.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-black rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-300"
          >
            START BUILDING TODAY
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsMain;
