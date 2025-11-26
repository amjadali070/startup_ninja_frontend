import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PricingMain: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      tagline: 'For beginners just starting out',
      price: { monthly: 0, annual: 0 },
      features: [
        { text: 'Limited AI Chat access', included: true },
        { text: '50 AI credits/month', included: true },
        { text: 'Basic Image Generation', included: true },
        { text: '1 Website project', included: true },
        { text: 'Startup Ninja subdomain', included: true },
        { text: 'Basic Social Media scheduling', included: true },
        { text: 'Custom domain', included: false },
        { text: 'Priority support', included: false },
        { text: 'Team collaboration', included: false }
      ],
      cta: 'START FREE',
      popular: false,
      color: 'from-gray-700 to-gray-800'
    },
    {
      name: 'Founder',
      tagline: 'For solopreneurs building their dream',
      price: { monthly: 29, annual: 24 },
      features: [
        { text: 'Unlimited AI Chat', included: true },
        { text: '500 AI credits/month', included: true },
        { text: 'Advanced Image Generation', included: true },
        { text: 'Unlimited website projects', included: true },
        { text: 'Custom domain support', included: true },
        { text: 'Full Social Media Pro access', included: true },
        { text: 'Priority email support', included: true },
        { text: 'SEO optimization tools', included: true },
        { text: 'Team collaboration', included: false }
      ],
      cta: 'GET STARTED',
      popular: true,
      color: 'from-red-600 to-orange-600'
    },
    {
      name: 'Agency',
      tagline: 'For agencies and growing teams',
      price: { monthly: 99, annual: 82 },
      features: [
        { text: 'Everything in Founder', included: true },
        { text: '2000 AI credits/month', included: true },
        { text: 'White-label options', included: true },
        { text: 'Team management (up to 10 users)', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority phone support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA guarantee', included: true }
      ],
      cta: 'CONTACT SALES',
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const faqs = [
    {
      question: 'What are AI credits?',
      answer: 'AI credits are used whenever you generate content, images, or research with your AI tools. Different tasks use different amounts of credits based on complexity.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time from your Account Settings. Changes take effect immediately.'
    },
    {
      question: 'Do unused credits roll over?',
      answer: 'No, credits reset each billing cycle. We recommend choosing a plan that matches your monthly usage.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Our Starter plan is completely free with limited access to all tools. Upgrade anytime to unlock full features.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards. Annual plans receive a 17% discount.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Plans Built for <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Every Stage</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900 border border-gray-800 rounded-lg p-1 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">Save 17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gray-900 border ${
                  plan.popular ? 'border-red-500 scale-105' : 'border-gray-800'
                } rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.tagline}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual}
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                  {billingCycle === 'annual' && plan.price.annual > 0 && (
                    <p className="text-sm text-green-500 mt-2">
                      Billed ${plan.price.annual * 12}/year
                    </p>
                  )}
                </div>

                <Link
                  to={plan.price.monthly === 0 ? '/register' : '/register'}
                  className={`block w-full py-4 rounded-lg font-bold text-center mb-8 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <FaCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FaTimes className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Math is <span className="text-red-500">Simple</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Replace $100-300/month in subscriptions with one affordable price
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-red-500">Typical Stack</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between">
                    <span>ChatGPT Plus</span>
                    <span>$20/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Midjourney</span>
                    <span>$30/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Webflow</span>
                    <span>$23/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Buffer</span>
                    <span>$12/mo</span>
                  </li>
                  <li className="flex justify-between border-t border-gray-700 pt-3 font-bold text-red-500">
                    <span>Total</span>
                    <span>$85+/mo</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-500">Startup Ninja</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between">
                    <span>AI Chat (Unlimited)</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Image Generation</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Web Builder + Hosting</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Social Media Pro</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between border-t border-gray-700 pt-3 font-bold text-green-500">
                    <span>Total</span>
                    <span>$29/mo</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-green-600/20 border border-green-600/50 rounded-lg">
              <p className="text-2xl font-bold text-green-400">
                Save $672+ per year
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Save Time and Money?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start free today. No credit card required.
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

export default PricingMain;
