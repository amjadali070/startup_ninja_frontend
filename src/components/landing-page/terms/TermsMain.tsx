import React from 'react';

const TermsMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Terms & <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Conditions</span>
          </h1>
          <p className="text-gray-400 mb-12">Last updated: November 26, 2024</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Startup Ninja, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Use License</h2>
              <p className="leading-relaxed mb-4">
                Permission is granted to temporarily use Startup Ninja for personal or commercial purposes. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to AI Chat, Image Generation, Web Builder, and Social Media Pro</li>
                <li>Creation and publication of content generated through our platform</li>
                <li>Commercial use of generated images and content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Subscription and Payment</h2>
              <p className="leading-relaxed mb-4">
                Startup Ninja offers multiple subscription tiers. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pay all fees associated with your chosen plan</li>
                <li>Automatic renewal unless cancelled before the billing cycle</li>
                <li>No refunds for partial months of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Cancellation Policy</h2>
              <p className="leading-relaxed">
                You may cancel your subscription at any time from your Account Settings. 
                Cancellation takes effect at the end of the current billing period. 
                Your content remains accessible but inactive until reactivation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Intellectual Property</h2>
              <p className="leading-relaxed">
                All content you create using Startup Ninja (text, images, websites) belongs to you. 
                You retain full ownership and commercial rights to your generated content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Privacy</h2>
              <p className="leading-relaxed">
                Your privacy is important to us. We collect and use your data as described in our Privacy Policy. 
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Limitation of Liability</h2>
              <p className="leading-relaxed">
                Startup Ninja shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">8. Contact Information</h2>
              <p className="leading-relaxed">
                For questions about these Terms, please contact us at:
                <br />
                <a href="mailto:legal@startupninja.com" className="text-red-500 hover:text-red-400">
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
