import React from 'react';

const TermsMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Terms & <span style={{color: '#D23621'}}>Conditions</span>
          </h1>
          <p className="mb-12" style={{color: '#CCCCCC'}}>Last updated: November 26, 2024</p>

          <div className="space-y-8">
            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed" style={{color: '#CCCCCC'}}>
                By accessing and using Startup Ninja, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="leading-relaxed mb-4" style={{color: '#CCCCCC'}}>
                Permission is granted to temporarily use Startup Ninja for personal or commercial purposes. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{color: '#CCCCCC'}}>
                <li>Access to AI Chat, Image Generation, Web Builder, and Social Media Pro</li>
                <li>Creation and publication of content generated through our platform</li>
                <li>Commercial use of generated images and content</li>
              </ul>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">3. Subscription and Payment</h2>
              <p className="leading-relaxed mb-4" style={{color: '#CCCCCC'}}>
                Startup Ninja offers multiple subscription tiers. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{color: '#CCCCCC'}}>
                <li>Pay all fees associated with your chosen plan</li>
                <li>Automatic renewal unless cancelled before the billing cycle</li>
                <li>No refunds for partial months of service</li>
              </ul>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">4. Cancellation Policy</h2>
              <p className="leading-relaxed" style={{color: '#CCCCCC'}}>
                You may cancel your subscription at any time from your Account Settings. 
                Cancellation takes effect at the end of the current billing period. 
                Your content remains accessible but inactive until reactivation.
              </p>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="leading-relaxed" style={{color: '#CCCCCC'}}>
                All content you create using Startup Ninja (text, images, websites) belongs to you. 
                You retain full ownership and commercial rights to your generated content.
              </p>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">6. Privacy</h2>
              <p className="leading-relaxed" style={{color: '#CCCCCC'}}>
                Your privacy is important to us. We collect and use your data as described in our Privacy Policy. 
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="leading-relaxed" style={{color: '#CCCCCC'}}>
                Startup Ninja shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section className="rounded-lg p-6 border" style={{
              background: 'linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)',
              border: '1px solid #8B0000'
            }}>
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <p className="leading-relaxed" style={{color: '#CCCCCC'}}>
                For questions about these Terms, please contact us at:
                <br />
                <a href="mailto:legal@startupninja.com" className="transition-colors" style={{color: '#D23621'}} onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'} onMouseLeave={(e) => e.currentTarget.style.color = '#D23621'}>
                  legal@startupninja.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsMain;
