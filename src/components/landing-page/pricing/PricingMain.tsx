import React from 'react';

const PricingMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-white/70 mb-16 max-w-2xl mx-auto">
          Choose the plan that's right for you and start creating today.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
          {[
            { name: 'Starter', price: '$0', desc: 'Perfect for exploring' },
            { name: 'Pro', price: '$29', desc: 'For professional creators', highlight: true },
            { name: 'Business', price: '$99', desc: 'For scaling teams' }
          ].map((plan) => (
            <div 
              key={plan.name} 
              className={`relative p-8 rounded-3xl bg-[#1a1a1a] border ${plan.highlight ? 'border-[#ED351C] shadow-[0_0_30px_rgba(237,53,28,0.15)]' : 'border-white/10'} transition-transform hover:-translate-y-2 duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ED351C] text-white text-sm font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4">{plan.price}<span className="text-lg text-white/50 font-normal">/mo</span></div>
              <p className="text-white/70 mb-8">{plan.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-5 h-5 rounded-full bg-[#ED351C]/20 flex items-center justify-center text-[#ED351C] text-xs">✓</div>
                    Feature included {i}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold transition-colors ${plan.highlight ? 'bg-[#ED351C] hover:bg-[#ff4d33] text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingMain;
