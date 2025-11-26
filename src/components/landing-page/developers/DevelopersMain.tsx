import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaRocket, FaServer, FaLock, FaSearch, FaMobile } from 'react-icons/fa';

const DevelopersMain: React.FC = () => {
  const features = [
    {
      icon: <FaCode className="w-10 h-10" />,
      title: 'No-Code Drag-and-Drop',
      description: 'Build professional websites without writing a single line of code. Our intuitive editor makes web development accessible to everyone.'
    },
    {
      icon: <FaSearch className="w-10 h-10" />,
      title: 'SEO-Optimized',
      description: 'Every site is built with SEO best practices from the ground up. Mobile-responsive, fast-loading, and optimized for Google.'
    },
    {
      icon: <FaServer className="w-10 h-10" />,
      title: 'Free Hosting Included',
      description: 'No need for separate hosting providers. Your site is hosted securely on our infrastructure with 99.9% uptime.'
    },
    {
      icon: <FaLock className="w-10 h-10" />,
      title: 'SSL Certificate',
      description: 'Every website comes with a free SSL certificate for secure HTTPS connections right out of the box.'
    },
    {
      icon: <FaMobile className="w-10 h-10" />,
      title: 'Mobile-Responsive',
      description: 'All sites automatically adapt to any screen size. Your visitors get a perfect experience on desktop, tablet, and mobile.'
    },
    {
      icon: <FaRocket className="w-10 h-10" />,
      title: 'Lightning Fast',
      description: 'Optimized code and CDN delivery ensure your site loads at ninja-like speed, improving user experience and SEO.'
    }
  ];

  const buildSteps = [
    {
      step: '1',
      title: 'Choose Your Template',
      description: 'Start with a professional template or begin from scratch'
    },
    {
      step: '2',
      title: 'Drag & Drop Elements',
      description: 'Add text, images, buttons, forms, and more with simple drag-and-drop'
    },
    {
      step: '3',
      title: 'Customize Your Design',
      description: 'Change colors, fonts, and layouts to match your brand perfectly'
    },
    {
      step: '4',
      title: 'Publish Instantly',
      description: 'Click publish and your site goes live with free hosting and SSL'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Build <span style={{color: '#D23621'}}>Without Limits</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional websites in minutes, not months. No coding required, no technical barriers—just your brilliant idea brought to life.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
          >
            START BUILDING
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise Features, <span className="text-red-500">Zero Complexity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-red-500/50 transition-all duration-300 group">
                <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Idea to <span className="text-red-500">Live Site</span> in 4 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {buildSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-red-500/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-red-600 to-orange-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-center">Seamless Integration</h2>
            <p className="text-xl text-gray-300 text-center mb-8">
              Your Web Builder works perfectly with your other Startup Ninja tools
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
                <p className="text-3xl mb-3">💬</p>
                <h4 className="font-bold mb-2">Ninja Chat</h4>
                <p className="text-sm text-gray-400">Generate copy and paste directly into your site</p>
              </div>
              <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
                <p className="text-3xl mb-3">🎨</p>
                <h4 className="font-bold mb-2">Imaginative Ninja</h4>
                <p className="text-sm text-gray-400">Create images and upload to your Brand Library</p>
              </div>
              <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
                <p className="text-3xl mb-3">📱</p>
                <h4 className="font-bold mb-2">Social Media Pro</h4>
                <p className="text-sm text-gray-400">Drive traffic from social to your new site</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Launch Your Site?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            No credit card required. Start building your professional website today.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-black rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-300"
          >
            START FOR FREE
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DevelopersMain;
