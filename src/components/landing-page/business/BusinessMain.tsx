import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaChartLine, FaRocket, FaCheck } from 'react-icons/fa';

const BusinessMain: React.FC = () => {
  const agencyFeatures = [
    'Team Management (up to 10 users)',
    'White-label options',
    'Advanced analytics dashboard',
    'Priority phone support',
    'Dedicated account manager',
    'Custom integrations',
    'SLA guarantee',
    'Bulk content generation'
  ];

  const useCases = [
    {
      icon: <FaUsers className="w-10 h-10" />,
      title: 'Agencies',
      description: 'Manage multiple client projects from one dashboard. Scale your operations without scaling your team.'
    },
    {
      icon: <FaChartLine className="w-10 h-10" />,
      title: 'Freelancers',
      description: 'Deliver more value to clients with professional tools. Increase your output and profit margins.'
    },
    {
      icon: <FaRocket className="w-10 h-10" />,
      title: 'Growing Startups',
      description: 'Empower your team with collaborative tools. Build faster as you scale your business.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Scale Your <span style={{color: '#D23621'}}>Agency</span> with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Built for teams and agencies who need to deliver more, faster. Manage clients, collaborate with your team, and scale your operations.
          </p>
          <Link 
            to="/pricing" 
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
          >
            VIEW AGENCY PRICING
          </Link>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perfect For <span style={{color: '#D23621'}}>Growing Teams</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-red-500/50 transition-all duration-300">
                <div className="inline-block p-4 bg-red-600/20 rounded-full mb-4 text-red-500">
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agency Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Agency <span style={{color: '#D23621'}}>Features</span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to manage clients and scale your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {agencyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
                <FaCheck className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Placeholder */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
              <p className="text-xl text-gray-300">
                See how agencies are using Startup Ninja to scale their operations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-red-500 mb-2">10x</div>
                <p className="text-gray-400">Faster content creation</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-red-500 mb-2">5+</div>
                <p className="text-gray-400">More clients per team member</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-red-500 mb-2">$50k+</div>
                <p className="text-gray-400">Annual savings on tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Scale Your Agency?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book a demo to see how Startup Ninja can transform your operations.
          </p>
          <Link 
            to="/book-demo" 
            className="inline-block px-8 py-4 bg-black rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-300 mr-4"
          >
            BOOK A DEMO
          </Link>
          <Link 
            to="/pricing" 
            className="inline-block px-8 py-4 border-2 border-white rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
          >
            VIEW PRICING
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BusinessMain;
