import React from 'react';
import { Link } from 'react-router-dom';
import { FaDollarSign, FaClock, FaTools, FaRocket } from 'react-icons/fa';

const SolutionsMain: React.FC = () => {
  const problems = [
    {
      icon: <FaDollarSign className="w-8 h-8" />,
      title: 'Expensive',
      description: 'Paying for ChatGPT, Midjourney, Webflow, and Buffer adds up to $100-300/month'
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: 'Time-Consuming',
      description: 'Constantly switching between platforms wastes hours every week'
    },
    {
      icon: <FaTools className="w-8 h-8" />,
      title: 'Barrier to Entry',
      description: 'Brilliant ideas die because founders lack technical or design skills'
    }
  ];

  const solutions = [
    {
      title: 'Consolidated Workflow',
      description: 'All tools in one place. No more copy-pasting between platforms.',
      benefit: 'Save 20+ hours per week'
    },
    {
      title: 'Strategic Co-Founder',
      description: 'Not just a chatbot—a partner that understands your entire business.',
      benefit: 'Make better decisions faster'
    },
    {
      title: 'Unbeatable Value',
      description: 'Replace $100-300/month in subscriptions with one affordable price.',
      benefit: 'Save $1,000+ annually'
    },
    {
      title: 'Zero Technical Barriers',
      description: 'No coding, no design skills needed. Just your brilliant idea.',
      benefit: 'Launch in days, not months'
    }
  ];

  const useCases = [
    {
      title: 'Solopreneurs',
      description: 'You\'re the CEO, marketer, designer, and developer all in one. We give you the power of a full team.',
      icon: '🥷'
    },
    {
      title: 'Freelancers',
      description: 'Scale your operations and manage multiple clients from one dashboard with ninja-like efficiency.',
      icon: '⚡'
    },
    {
      title: 'Small Agencies',
      description: 'Increase your output and profit margins by delivering faster with our all-in-one platform.',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Stop Juggling <span style={{color: '#D23621'}}>A Dozen Tools</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The fragmented startup stack is killing your momentum. We consolidate everything you need into one intelligent platform.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-red-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span style={{color: '#D23621'}}>Fragmented Stack</span> Problem
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              When you have a brilliant idea, you're immediately forced to become four experts at once: a strategist, designer, developer, and marketer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {problems.map((problem, index) => (
              <div key={index} className="bg-gray-900 border border-red-900/30 rounded-xl p-8 text-center">
                <div className="inline-block p-4 bg-red-600/20 rounded-full mb-4 text-red-500">
                  {problem.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">{problem.title}</h3>
                <p className="text-gray-400">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-gray-900 border border-gray-800 rounded-xl p-8">
            <p className="text-xl text-gray-300">
              The result? <span className="text-red-500 font-bold">Brilliant ideas die</span> because founders waste time and money on a fragmented stack of disconnected tools.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span style={{color: '#D23621'}}>All-in-One</span> Solution
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Startup Ninja eliminates the fragmented stack by consolidating all four critical roles into one intelligent, integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 hover:border-red-500/50 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-red-500 transition-colors">{solution.title}</h3>
                <p className="text-gray-300 mb-4">{solution.description}</p>
                <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 font-semibold">
                  <FaRocket className="inline mr-2" />
                  {solution.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built For <span style={{color: '#D23621'}}>Every Founder</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-red-500/50 transition-all duration-300 text-center">
                <div className="text-6xl mb-4">{useCase.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-red-600/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-8 text-center">The Math is Simple</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Typical Fragmented Stack</p>
                <p className="text-5xl font-bold text-red-500 mb-2">$100-300</p>
                <p className="text-gray-400">per month</p>
                <ul className="text-left text-sm text-gray-500 mt-4 space-y-2">
                  <li>• ChatGPT Plus: $20/mo</li>
                  <li>• Midjourney: $30/mo</li>
                  <li>• Webflow: $23/mo</li>
                  <li>• Buffer: $12/mo</li>
                  <li>• + More tools...</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-2">Startup Ninja</p>
                <p className="text-5xl font-bold text-green-500 mb-2">One Price</p>
                <p className="text-gray-400">all-inclusive</p>
                <div className="mt-4 p-4 bg-green-600/20 border border-green-600/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">Save $1,000+</p>
                  <p className="text-gray-400">annually</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/pricing" 
                className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
              style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
              >
                SEE PRICING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Consolidate Your Stack?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of founders who've replaced complexity with clarity.
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

export default SolutionsMain;
